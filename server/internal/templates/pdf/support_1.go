package pdf

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"server/internal/models"
	"server/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/jung-kurt/gofpdf/v2"
)

func CreateSupportPdf(filename string, data models.ExportedData) (string, error) {
	// currency := utils.GetCurrencySymbol(data.Currency)
	parseStartDate := time.UnixMilli(data.StartDateTs).Format("02/01/2006")
	parseEndDate := time.UnixMilli(data.EndDateTs).Format("02/01/2006")
	// generate a random number between 1000 and 9999
	uniqueID := strconv.Itoa(utils.GenerateRandomNumber(1000, 9999))

	filename = fmt.Sprintf("%s-%s", uniqueID, filename)
	fmt.Println(filename)
	zipFile, err := os.Create(filename)
	if err != nil {
		return "", err
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()
	for _, asset := range data.Relations {
		pdf := gofpdf.New("P", "mm", "A4", "")
		if strings.Contains(strings.ToLower(asset.Type), "local") {
			waterDevice := models.DeviceData{}
			energyDevice := models.DeviceData{}
			for _, device := range *asset.Relations {
				if strings.Contains(strings.ToLower(device.Type), "water meter") {
					waterDevice = device
				}
				if strings.Contains(strings.ToLower(device.Type), "energy meter") {
					energyDevice = device
				}
			}

			pdf.SetMargins(20, 20, 20)
			tr := pdf.UnicodeTranslatorFromDescriptor("")
			pdf.SetHeaderFuncMode(func() {

				AddHeaderSupport(pdf, data, asset.Label)

			}, true)

			pdf.SetFooterFunc(func() {
				AddFooter(pdf)
			})
			// auto page break
			pdf.SetAutoPageBreak(true, 40)
			pdf.AliasNbPages("")
			pdf.AddPage()
			pdf.SetFont("Arial", "", 10)
			topMargin := 30.0
			pdf.SetY(pdf.GetY() + topMargin)

			// font medium
			pdf.SetFont("Arial", "", 16)
			pdf.CellFormat(0, 10, "Factura de Servicios", "", 0, "C", false, 0, "")
			pdf.Ln(10)
			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(100, 100, 100)
			pdf.CellFormat(0, 10, tr("Periodo de Facturación"), "", 0, "C", false, 0, "")

			pdf.Ln(7)
			pdf.SetFont("Arial", "", 11)
			pdf.SetTextColor(80, 80, 80)
			pdf.CellFormat(0, 10, fmt.Sprintf("%s - %s", parseStartDate, parseEndDate), "", 0, "C", false, 0, "")
			pdf.Ln(15)
			pdf.SetXY(pdf.GetX(), 100)

			if energyDevice != (models.DeviceData{}) {
				pdf.Image("./assets/icon-power.png", 51.5, 81, 13, 0, false, "", 0, "")
				// total energy charges
				pdf.SetFont("Arial", "", 11)
				pdf.SetTextColor(100, 100, 100)
				pdf.SetXY(70, 80.5)
				pdf.CellFormat(0, 10, tr("Cargos por Energía"), "", 0, "L", false, 0, "")

				pdf.SetXY(140, 80.5)
				pdf.CellFormat(0, 10, fmt.Sprintf("%s %s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(*energyDevice.TotalToPay)), "", 0, "L", false, 0, "")
			}

			if waterDevice != (models.DeviceData{}) {
				// total WATER charges
				pdf.Image("./assets/icon-water.png", 52.5, 103, 13, 0, false, "", 0, "")
				pdf.SetFont("Arial", "", 11)
				// TEXT GRAY
				pdf.SetTextColor(100, 100, 100)
				pdf.SetXY(70, 103)
				pdf.CellFormat(0, 10, tr("Cargos por Agua"), "", 0, "L", false, 0, "")

				pdf.SetXY(140, 103)
				pdf.CellFormat(0, 10, fmt.Sprintf("%s %s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(*waterDevice.TotalToPay)), "", 0, "L", false, 0, "")
			}

			// TOTAL CHARGES
			pdf.SetFont("Arial", "", 13)
			pdf.SetTextColor(100, 100, 100)
			pdf.SetXY(51.5, 130)
			pdf.SetFillColor(240, 240, 240)
			pdf.Rect(50, 130, 120, 10, "F")
			pdf.CellFormat(0, 10, tr("Cargos Totales"), "", 0, "L", false, 0, "")
			pdf.SetXY(135, 130)
			totalToPay := 0.0
			if waterDevice != (models.DeviceData{}) {
				totalToPay += float64(*waterDevice.TotalToPay)
			}
			if energyDevice != (models.DeviceData{}) {
				totalToPay += float64(*energyDevice.TotalToPay)
			}
			pdf.CellFormat(0, 10, fmt.Sprintf("%s %s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(totalToPay)), "", 0, "L", false, 0, "")

			// Como pagar su factura

			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(100, 100, 100)
			pdf.Ln(15)
			pdf.SetXY(23, 160)
			pdf.CellFormat(0, 10, tr("Cómo Pagar Su Factura"), "", 0, "L", false, 0, "")
			pdf.SetLineWidth(0.5)
			pdf.Line(23, 170, 180, 170)
			// line width
			pdf.SetFont("Arial", "", 10)
			pdf.SetTextColor(80, 80, 80)
			pdf.SetXY(23, 175)
			pdf.MultiCell(0, 10, tr("Puede pagar su factura en línea o en persona o contacte a nuestro equipo de soporte para obtener ayuda."), "", "L", false)
			pdf.SetXY(23, 210)
			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(100, 100, 100)
			pdf.CellFormat(0, 10, tr("Soporte"), "", 0, "L", false, 0, "")
			pdf.SetLineWidth(0.5)
			pdf.Line(23, 220, 180, 220)
			pdf.SetFont("Arial", "", 10)
			pdf.SetTextColor(80, 80, 80)
			pdf.SetXY(23, 220)
			pdf.MultiCell(0, 10, tr("Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto con nuestro equipo de soporte."), "", "L", false)

			for _, device := range *asset.Relations {
				pdf.AddPage()
				unit := utils.GetUnitByDeviceType(device.Type, data.Units)
				rate := utils.GetRateByDeviceType(device.Type, data.Rate)
				DeviceTypePdf(pdf, device, data, rate, unit)
			}
		}

		pdfFileName := fmt.Sprintf("%s-%s.pdf", uniqueID, strings.Join(strings.Split(asset.Name, " "), "-"))
		err := pdf.OutputFileAndClose(pdfFileName)
		if err != nil {
			return "", err
		}

		zipFile, err := zipWriter.Create(filepath.Base(pdfFileName))
		if err != nil {
			return "", err
		}

		file, err := os.Open(pdfFileName)
		if err != nil {
			return "", err
		}

		_, err = io.Copy(zipFile, file)
		if err != nil {
			return "", err
		}

		file.Close()
		os.Remove(pdfFileName)

	}

	os.Remove("grafica.png")
	return filename, nil

}

func DeviceTypePdf(pdf *gofpdf.Fpdf, device models.DeviceData, data models.ExportedData, rate float64, unit string) {
	parseStartDate := time.UnixMilli(data.StartDateTs).Format("02/01/2006")
	parseEndDate := time.UnixMilli(data.EndDateTs).Format("02/01/2006")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	AddHeaderDue(pdf, data, tr(device.Type), *device.TotalToPay)
	pdf.SetXY(20, 50)
	pdf.SetFont("Arial", "", 12)
	pdf.SetTextColor(80, 80, 80)
	pdf.Cell(0, 10, tr("Detalles de Servicio"))
	pdf.SetXY(80, 50)
	pdf.Cell(0, 10, tr("Cargos de Factura Detallados"))
	pdf.SetXY(20, 60)
	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(160, 160, 160)
	pdf.Cell(0, 10, tr("Periodo de Facturación"))
	pdf.Ln(5)
	pdf.SetTextColor(80, 80, 80)
	pdf.Cell(0, 10, fmt.Sprintf("%s - %s", parseStartDate, parseEndDate))
	pdf.Ln(10)
	pdf.SetTextColor(160, 160, 160)
	pdf.Cell(0, 10, tr("Inicio de Lectura"))
	pdf.Ln(5)
	pdf.SetTextColor(80, 80, 80)
	deviceTelemetry := []models.Data{}
	firstReading := ""
	lastReading := ""
	if strings.Contains(strings.ToLower(device.Type), "water meter") {
		dataMap := *device.Telemetry
		waterData, ok := dataMap["pulseCount"]
		if ok {
			deviceTelemetry = waterData
			firstReading = time.UnixMilli(deviceTelemetry[0].Ts).Format("02/01/2006")
			lastReading = time.UnixMilli(deviceTelemetry[len(deviceTelemetry)-1].Ts).Format("02/01/2006")
		}
	} else if strings.Contains(strings.ToLower(device.Type), "energy meter") {
		dataMap := *device.Telemetry
		energyData, ok := dataMap["deltaEnergyCount"]
		if ok {
			deviceTelemetry = energyData
			firstReading = time.UnixMilli(deviceTelemetry[0].Ts).Format("02/01/2006")
			lastReading = time.UnixMilli(deviceTelemetry[len(deviceTelemetry)-1].Ts).Format("02/01/2006")
		}

	}
	pdf.Cell(0, 10, fmt.Sprintf("%s Total %s", utils.FormatNumber(*device.PreviousMonth), unit))
	pdf.Ln(5)
	pdf.SetFont("Arial", "", 8)
	pdf.Cell(0, 10, fmt.Sprintf("( %s )", firstReading))
	pdf.Ln(10)
	pdf.SetTextColor(160, 160, 160)
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 10, tr("Fin de Lectura"))
	pdf.Ln(5)
	pdf.SetTextColor(80, 80, 80)
	pdf.Cell(0, 10, fmt.Sprintf("%s Total %s", utils.FormatNumber(*device.CurrentMonth), unit))
	pdf.Ln(5)
	pdf.SetFont("Arial", "", 8)
	pdf.Cell(0, 10, fmt.Sprintf("( %s )", lastReading))
	pdf.SetXY(80, 60)
	pdf.SetTextColor(80, 80, 80)
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(0, 10, tr("Tarifa"))
	pdf.SetXY(80, 70)
	pdf.Cell(0, 10, "Costo de Uso Total")
	pdf.SetXY(120, 60)

	pdf.Cell(0, 10, fmt.Sprintf("@ %s%.3f / Total %s", utils.GetCurrencySymbol(data.Currency), rate, unit))
	pdf.SetXY(120, 70)
	pdf.MultiCell(0, 10, fmt.Sprintf("%s Total %s X", utils.FormatNumber(*device.TotalConsumed), unit), "", "L", false)
	pdf.SetXY(120, 75)
	pdf.Cell(0, 10, fmt.Sprintf("%s %.2f", utils.GetCurrencySymbol(data.Currency), rate))
	pdf.SetXY(170, 70)
	pdf.Cell(0, 10, fmt.Sprintf("%s%s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(*device.TotalToPay)))
	pdf.SetXY(80, 90)
	pdf.SetFillColor(245, 245, 245)
	pdf.Rect(80, 90, 117, 10, "F")
	pdf.SetXY(80, 90)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(0, 10, tr("Total a Pagar"))
	pdf.SetXY(170, 90)
	pdf.Cell(0, 10, fmt.Sprintf("%s %s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(*device.TotalToPay)))
	pdf.SetXY(20, 130)
	pdf.Cell(0, 10, tr("Información de Uso"))
	pdf.SetDrawColor(80, 80, 80)
	pdf.SetLineWidth(0.5)
	pdf.Line(20, 140, 190, 140)
	pdf.SetXY(20, 145)
	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(150, 150, 150)
	pdf.Cell(0, 10, tr("Uso Promedio"))
	pdf.SetXY(20, 143)
	if strings.Contains("Energía", "Energ") {
		pdf.SetFillColor(255, 247, 232) // R, G, B
		pdf.SetDrawColor(255, 196, 90)  // Color de borde igual al de fondo
	} else {
		pdf.SetFillColor(237, 250, 255) // R, G, B
		pdf.SetDrawColor(159, 230, 255) // Color de borde igual al de fondo
	}
	pdf.Rect(80, 145, 110, 20, "F")
	pdf.SetXY(20, 150)
	pdf.SetLineWidth(0.1)
	pdf.Line(80, 155, 190, 155)
	pdf.SetXY(90, 145)
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(150, 150, 150)
	pdf.Cell(0, 10, tr("Diario"))
	pdf.SetXY(120, 145)
	pdf.Cell(0, 10, tr("Semanal"))
	pdf.SetXY(150, 145)
	pdf.Cell(0, 10, tr("Mensual"))
	pdf.SetXY(20, 155)
	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(80, 80, 80)
	pdf.Cell(0, 10, fmt.Sprintf("Total %s", unit))
	pdf.SetTextColor(150, 150, 150)
	pdf.SetFont("Arial", "", 9)
	pdf.SetXY(90, 155)

	days := time.UnixMilli(deviceTelemetry[len(deviceTelemetry)-1].Ts).Sub(time.UnixMilli(deviceTelemetry[0].Ts).AddDate(0, 0, 0)).Hours() / 24
	weeks := days / 7
	months := days / 30
	if days < 7 {
		weeks = 1
	}
	if days < 30 {
		months = 1
	}

	pdf.Cell(0, 10, utils.FormatNumber(*device.TotalConsumed/days))
	pdf.SetXY(120, 155)
	pdf.Cell(0, 10, utils.FormatNumber(*device.TotalConsumed/weeks))
	pdf.SetXY(150, 155)
	pdf.Cell(0, 10, utils.FormatNumber(*device.TotalConsumed/months))
	// CONVERTIR deviceTelemetry A JSON
	deviceTelemetryJson, err := json.Marshal(deviceTelemetry)
	if err != nil {
		fmt.Println("Error marshalling device telemetry: ", err)
	}
	cmd := exec.Command("python", "./scripts/chart.py", "#ffc45a", unit, string(deviceTelemetryJson), parseStartDate, parseEndDate)
	_, err = cmd.Output()
	if err != nil {
		fmt.Println("Error running python script: ", err)
	}

	// pdf.Image(string(output), 20, 20, 170, 170, false, "", 0, "")
	if days < 30 {
		pdf.SetXY(20, 170)
		pdf.SetTextColor(120, 120, 120)
		// italic
		pdf.SetFont("Arial", "I", 10)
		pdf.MultiCell(0, 10, fmt.Sprintf(tr("Nota: No hay mediciones del periodo completo de facturación (%d días). Por favor, consulte con el administrador."), int(days)), "", "L", false)
		pdf.SetFont("Arial", "", 10)
	}

	pdf.Image("grafica.png", 20, 180, 170, 0, false, "", 0, "")
}
