package pdf

import (
	"fmt"
	"github.com/jung-kurt/gofpdf/v2"
	"os/exec"
	"runtime"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func CreatePDF(filename string, data models.DataDTO, exportedData []models.ExportedData) (string, error) {
	currency := utils.GetCurrencySymbol(data.Currency)
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetHeaderFuncMode(func() {
		AddHeader(pdf, data)
	}, true)
	pdf.SetFooterFunc(func() {
		AddFooter(pdf)
	})
	pdf.AliasNbPages("")
	pdf.AddPage()
	pdf.SetFont("Arial", "", 12)
	topMargin := 30.0
	pdf.SetY(pdf.GetY() + topMargin)
	pdf.SetFont("Arial", "", 10)
	// Header
	headers := []string{"Name", "Previous Month {unit}", "Current Month {unit}", "Total Consumed {unit}", "Rate", "Total to Pay"}
	for index, data := range exportedData {
		if data.EntityType == "ASSET" {
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 10, fmt.Sprintf("Sitio: %s", data.Site))
			pdf.Ln(10)

			// Tabla para Medidores de Agua
			if len(data.Relations.WaterMeter) > 0 {
				pdf.SetFont("Arial", "B", 10)
				pdf.Cell(0, 10, "Water Meters")
				pdf.Ln(10)
				water := data.Rate["water"].(map[string]interface{})
				rate := water["rate"].(float64)
				unit := water["unit"].(string)
				for _, header := range headers {
					pdf.SetFont("Arial", "B", 7)
					if header == "Name" {
						pdf.CellFormat(40, 10, header, "1", 0, "C", false, 0, "")
					} else {

						pdf.CellFormat(30, 10, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1), "1", 0, "C", false, 0, "")
					}
				}
				pdf.Ln(-1)

				// Data
				pdf.SetFont("Arial", "", 8)
				for _, device := range data.Relations.WaterMeter {
					pdf.CellFormat(40, 10, device.Name, "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.PreviousMonth), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.CurrentMonth), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", device.TotalConsumed), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s%.3f", currency, rate), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s%.2f", currency, device.TotalToPay), "1", 0, "C", false, 0, "")
					pdf.Ln(-1)
				}
				pdf.Ln(10)
			}

			// Tabla para Medidores de Energía
			if len(data.Relations.EnergyMeter) > 0 {
				pdf.SetFont("Arial", "B", 10)
				pdf.Cell(0, 10, "Energy Meters")
				pdf.Ln(10)
				energy := data.Rate["energy"].(map[string]interface{})
				rate := energy["rate"].(float64)
				unit := energy["unit"].(string)
				// Header
				for _, header := range headers {

					if header == "Name" {
						pdf.SetFont("Arial", "B", 7)
						pdf.CellFormat(40, 10, header, "1", 0, "C", false, 0, "")
					} else {
						pdf.CellFormat(30, 10, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1), "1", 0, "C", false, 0, "")
					}
				}
				pdf.Ln(-1)

				// Data
				pdf.SetFont("Arial", "", 8)
				for _, device := range data.Relations.EnergyMeter {
					pdf.CellFormat(40, 10, device.Name, "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.PreviousMonth), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.CurrentMonth), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", device.TotalConsumed), "1", 0, "C", false, 0, "")
					pdf.CellFormat(30, 10, fmt.Sprintf("%s%.3f", currency, rate), "1", 0, "C", false, 0, "") // Ejemplo de tarifa
					pdf.CellFormat(30, 10, fmt.Sprintf("%s%.2f", currency, device.TotalToPay), "1", 0, "C", false, 0, "")
					pdf.Ln(-1)
				}
				pdf.Ln(10)
			}
		}
		if index < len(exportedData)-1 {
			pdf.AddPage()
			pdf.SetY(pdf.GetY() + topMargin)
		}
	}

	err := pdf.OutputFileAndClose(filename)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	return filename, nil
}

func OpenPDF(filename string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "linux":
		cmd = "xdg-open"
	case "windows":
		cmd = "rundll32"
		args = append(args, "url.dll,FileProtocolHandler")
	case "darwin":
		cmd = "open"
	default:
		return fmt.Errorf("unsupported platform")
	}

	args = append(args, filename)
	return exec.Command(cmd, args...).Start()
}
