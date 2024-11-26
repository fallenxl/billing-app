package pdf

import (
	"fmt"
	"server/internal/models"
	"server/internal/utils"
	"strings"

	"github.com/jung-kurt/gofpdf/v2"
)

func CreatePDF(filename string, exportedData models.ExportedData) (string, error) {
	currency := utils.GetCurrencySymbol(exportedData.Currency)
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetHeaderFuncMode(func() {
		AddHeader(pdf, exportedData)
	}, true)
	pdf.SetFooterFunc(func() {
		AddFooter(pdf)
	})
	pdf.AliasNbPages("")
	pdf.AddPage()
	pdf.SetFont("Arial", "", 10) // Ajuste del tamaño de la fuente más pequeño
	topMargin := 30.0
	pdf.SetY(pdf.GetY() + topMargin)
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	// Definir anchos de las columnas
	colWidths := []float64{40, 32, 32, 32, 20, 30}
	// fmt.Println(exportedData)

	// Función para renderizar el header
	renderTableHeader := func(unit string, header []string) {
		pdf.SetFont("Arial", "B", 8) // Headers en bold
		headers := []string{
			"Name",
			fmt.Sprintf("Last Measure (%s)", tr(unit)),
			fmt.Sprintf("Current Measure (%s)", tr(unit)),
			fmt.Sprintf("Total Consumed (%s)", tr(unit)),
			"Rate",
			"Total to Pay",
		}
		if header != nil {
			headers = header
		}
		for i, header := range headers {
			if i != 0 && i != 4 && i != 5 {
				pdf.SetFont("Arial", "B", 7)
				pdf.CellFormat(colWidths[i], 10, header, "1", 0, "C", false, 0, "")
			} else {
				pdf.SetFont("Arial", "B", 8)
				pdf.CellFormat(colWidths[i], 10, header, "1", 0, "C", false, 0, "")
			}
		}
		pdf.Ln(-1)
		pdf.SetFont("Arial", "", 10) // Restablecer fuente a normal después del header
	}

	everyAssetLocal := true

	if everyAssetLocal {
		hasEnergyMeter := false
		hasWaterMeter := false

		for _, entity := range exportedData.Relations {
			for _, relation := range *entity.Relations {
				relationType := strings.ToLower(relation.Type)
				if strings.Contains(relationType, "energy meter") {
					hasEnergyMeter = true
				}
				if strings.Contains(relationType, "water meter") {
					hasWaterMeter = true
				}
			}
		}

		if hasEnergyMeter {
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 10, "Energy Meters")
			pdf.Ln(10)
			unit := utils.GetUnitByDeviceType("energy meter", exportedData.Units)
			renderTableHeader(unit, nil)
			pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header

			for _, entity := range exportedData.Relations {
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "energy meter") {

						// fmt.Println(*relation.Label, "relation.Label")
						pdf.CellFormat(colWidths[0], 10, tr(*entity.Label), "1", 0, "C", false, 0, "")

						pdf.CellFormat(colWidths[1], 10, utils.FormatNumber(*relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, utils.FormatNumber(*relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, utils.FormatNumber(*relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["energy"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[5], 10, fmt.Sprintf("%s%s", currency, utils.FormatNumber(*relation.TotalToPay)), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)
					}
				}
			}
		}

		if hasWaterMeter {
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 10, "Water Meters")
			pdf.Ln(10)
			unit := utils.GetUnitByDeviceType("water meter", exportedData.Units)
			renderTableHeader(unit, nil)
			pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header
			for _, entity := range exportedData.Relations {
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "water meter") {
						pdf.CellFormat(colWidths[0], 10, tr(*entity.Label), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["water"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[5], 10, fmt.Sprintf("%s%.2f", currency, *relation.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)
					}
				}
			}
		}

	}

	err := pdf.OutputFileAndClose(filename)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	return filename, nil
}
