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

	// Función para renderizar el header
	renderTableHeader := func(unit string, header []string) {
		pdf.SetFont("Arial", "B", 8) // Headers en bold
		headers := []string{
			"Name",
			fmt.Sprintf("Last Measure (%s)", unit),
			fmt.Sprintf("Current Measure (%s)", unit),
			fmt.Sprintf("Total Consumed (%s)", unit),
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
	for _, entity := range exportedData.Relations {
		if !strings.Contains(strings.ToLower(entity.Type), "local") {
			everyAssetLocal = false
			break
		}
	}

	for entityIndex, entity := range exportedData.Relations {

		if strings.Contains(strings.ToLower(entity.Type), "nivel") {
			// Título de cada relación principal en bold
			if entityIndex != 0 {
				pdf.Ln(30) // Salto de línea entre las relaciones principales
			}
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 10, entity.Name)
			pdf.Ln(15)                   // Salto más grande entre las relaciones principales
			pdf.SetFont("Arial", "", 10) // Volver a normal para el contenido

			// Verificar si existen energy meters
			hasEnergyMeter := false
			for _, relation := range *entity.Relations {
				relationType := strings.ToLower(relation.Type)
				if strings.Contains(relationType, "energy meter") {
					hasEnergyMeter = true
					break
				}
			}

			// Renderizar la tabla de Energy Meters solo si existen
			if hasEnergyMeter {
				pdf.SetFont("Arial", "B", 12)
				pdf.Cell(0, 10, "Energy Meters")
				pdf.Ln(10)
				unit := utils.GetUnitByDeviceType("energy meter", exportedData.Units)
				renderTableHeader(unit, nil)
				pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "energy meter") {
						if relation.Label == "" {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Name), "1", 0, "C", false, 0, "")
						} else {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Label), "1", 0, "C", false, 0, "")
						}
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%.2f %s", exportedData.Rate["energy"], currency), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[5], 10, fmt.Sprintf("%.2f %s", *relation.TotalToPay, currency), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)
					}
				}
				pdf.Ln(5) // Espacio entre tablas de diferentes tipos de medidores
			}

			// Verificar si existen water meters
			hasWaterMeter := false
			for _, relation := range *entity.Relations {
				relationType := strings.ToLower(relation.Type)
				if strings.Contains(relationType, "water meter") {
					hasWaterMeter = true
					break
				}
			}

			// Renderizar la tabla de Water Meters solo si existen
			if hasWaterMeter {
				pdf.SetFont("Arial", "B", 12)
				pdf.Cell(0, 10, "Water Meters")
				pdf.Ln(10)
				unit := utils.GetUnitByDeviceType("water meter", exportedData.Units)
				renderTableHeader(unit, nil)
				pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "water meter") {
						if relation.Label == "" {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Name), "1", 0, "C", false, 0, "")
						} else {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Label), "1", 0, "C", false, 0, "")
						}
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["water"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[5], 10, fmt.Sprintf("%s%.2f", currency, *relation.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)
					}
				}
			}
			if entityIndex != len(exportedData.Relations)-1 {
				pdf.AddPage()
			}
		} else if strings.Contains(strings.ToLower(entity.Type), "local") && !everyAssetLocal {
			// Título de cada relación principal en bold
			if entityIndex != 0 {
				pdf.Ln(30) // Salto de línea entre las relaciones principales
			}
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 10, entity.Name)
			pdf.Ln(15)                   // Salto más grande entre las relaciones principales
			pdf.SetFont("Arial", "", 10) // Volver a normal para el contenido

			// Verificar si existen energy meters
			hasEnergyMeter := false
			for _, relation := range *entity.Relations {
				relationType := strings.ToLower(relation.Type)
				if strings.Contains(relationType, "energy meter") {
					hasEnergyMeter = true
					break
				}
			}
			// Renderizar la tabla de Energy Meters solo si existen
			if hasEnergyMeter {
				pdf.SetFont("Arial", "B", 12)
				pdf.Cell(0, 10, "Energy Meters")
				pdf.Ln(10)
				unit := utils.GetUnitByDeviceType("energy meter", exportedData.Units)
				newHeader := []string{fmt.Sprintf("Previous Month (%s)", unit), fmt.Sprintf("Current Month (%s)", unit), fmt.Sprintf("Total Consumed (%s)", unit), "Rate", "Total to Pay"}
				renderTableHeader(unit, newHeader)
				pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "energy meter") {

						pdf.CellFormat(colWidths[0], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["energy"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, *relation.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)

					}
				}
			}

			// Verificar si existen water meters
			hasWaterMeter := false
			for _, relation := range *entity.Relations {
				relationType := strings.ToLower(relation.Type)
				if strings.Contains(relationType, "water meter") {
					hasWaterMeter = true
					break
				}
			}

			// Renderizar la tabla de Water Meters solo si existen
			if hasWaterMeter {
				pdf.SetFont("Arial", "B", 12)
				pdf.Cell(0, 10, "Water Meters")
				pdf.Ln(10)
				unit := utils.GetUnitByDeviceType("water meter", exportedData.Units)
				newHeader := []string{fmt.Sprintf("Previous Month (%s)", unit), fmt.Sprintf("Current Month (%s)", unit), fmt.Sprintf("Total Consumed (%s)", unit), "Rate", "Total to Pay"}
				renderTableHeader(unit, newHeader)
				pdf.SetFont("Arial", "", 8) // Restablecer fuente a normal después del header
				for _, relation := range *entity.Relations {
					relationType := strings.ToLower(relation.Type)
					if strings.Contains(relationType, "water meter") {

						pdf.CellFormat(colWidths[0], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["water"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, *relation.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)
					}
				}
			}
		}

	}

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
						if relation.Label == "" {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Name), "1", 0, "C", false, 0, "")
						} else {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Label), "1", 0, "C", false, 0, "")
						}
						pdf.CellFormat(colWidths[1], 10, fmt.Sprintf("%.2f", *relation.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[2], 10, fmt.Sprintf("%.2f", *relation.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[3], 10, fmt.Sprintf("%.2f", *relation.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[4], 10, fmt.Sprintf("%s%.2f", currency, exportedData.Rate["energy"]), "1", 0, "C", false, 0, "")
						pdf.CellFormat(colWidths[5], 10, fmt.Sprintf("%s%.2f", currency, *relation.TotalToPay), "1", 0, "C", false, 0, "")
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
						if relation.Label == "" {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Name), "1", 0, "C", false, 0, "")
						} else {
							pdf.CellFormat(colWidths[0], 10, tr(relation.Label), "1", 0, "C", false, 0, "")
						}
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
