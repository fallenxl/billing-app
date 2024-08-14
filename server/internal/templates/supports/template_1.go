package supports

import (
	"archive/zip"
	"fmt"
	"github.com/jung-kurt/gofpdf/v2"
	"io"
	"os"
	"path/filepath"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func CreateInvoicesAndZip(filename string, data models.DataDTO, exportedData []models.ExportedData) (string, error) {
	currency := utils.GetCurrencySymbol(data.Currency)
	tempDir := os.TempDir()
	zipFilename := filepath.Join(tempDir, filename)

	// Crear archivo ZIP
	zipFile, err := os.Create(zipFilename)
	if err != nil {
		return "", fmt.Errorf("could not create zip file: %v", err)
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Iterar sobre cada dispositivo en exportedData
	for _, exportedDatum := range exportedData {
		if exportedDatum.EntityType == "ASSET" {
			agroupedDataBySuffix := make(map[string][]models.DeviceData)

			for _, exportedDatum := range exportedData {
				if exportedDatum.EntityType == "ASSET" {
					allDevices := append(exportedDatum.Relations.WaterMeter, exportedDatum.Relations.EnergyMeter...)
					for _, device := range allDevices {
						suffix := strings.Split(device.Name, "-")[1]
						agroupedDataBySuffix[suffix] = append(agroupedDataBySuffix[suffix], device)
					}
				}
			}
			for suffix, devices := range agroupedDataBySuffix {
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
				for index, device := range devices {

					if strings.Contains(strings.ToLower(device.Type), "water meter") {
						if index != 0 {
							pdf.Ln(30)
						}
						pdf.Cell(0, 10, "Water Meters")
						pdf.Ln(10)
						// Encabezados
						headers := []string{"Name", "Previous Month {unit}", "Current Month {unit}", "Total Consumed {unit}", "Rate", "Total to Pay"}
						unit := exportedDatum.Rate["water"].(map[string]interface{})["unit"].(string)
						for _, header := range headers {
							pdf.SetFont("Arial", "B", 7)
							if header == "Name" {
								pdf.CellFormat(40, 10, header, "1", 0, "C", false, 0, "")
							} else {
								pdf.CellFormat(30, 10, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1), "1", 0, "C", false, 0, "")
							}
						}
						pdf.Ln(-1)
						pdf.SetFont("Arial", "", 8)
						pdf.CellFormat(40, 10, device.Name, "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", device.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s%.3f", currency, 0.3435), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s%.2f", currency, device.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)

						if index < len(devices)-1 {

							pdf.AddPage()
						}
					}

					if strings.Contains(strings.ToLower(device.Type), "energy meter") {
						if index != 0 {
							pdf.Ln(30)
						}
						pdf.Cell(0, 10, "Energy Meters")
						pdf.Ln(10)
						headers := []string{"Name", "Previous Month {unit}", "Current Month {unit}", "Total Consumed {unit}", "Rate", "Total to Pay"}
						unit := exportedDatum.Rate["energy"].(map[string]interface{})["unit"].(string)
						for _, header := range headers {
							pdf.SetFont("Arial", "B", 7)
							if header == "Name" {
								pdf.CellFormat(40, 10, header, "1", 0, "C", false, 0, "")
							} else {
								pdf.CellFormat(30, 10, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1), "1", 0, "C", false, 0, "")
							}
						}
						pdf.Ln(-1)
						pdf.SetFont("Arial", "", 8)
						pdf.CellFormat(40, 10, device.Name, "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.PreviousMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s", device.CurrentMonth), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", device.TotalConsumed), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s%.3f", currency, 0.3435), "1", 0, "C", false, 0, "")
						pdf.CellFormat(30, 10, fmt.Sprintf("%s%.2f", currency, device.TotalToPay), "1", 0, "C", false, 0, "")
						pdf.Ln(-1)

						if index < len(devices)-1 {
							pdf.AddPage()
						}
					}

				}
				// Guardar el PDF como archivo temporal
				tempPDFFile := filepath.Join(os.TempDir(), fmt.Sprintf("%s.pdf", suffix))
				err := pdf.OutputFileAndClose(tempPDFFile)
				if err != nil {
					fmt.Println("Error saving PDF: ", err)
					continue
				}

				// Agregar el PDF al archivo ZIP
				err = addToZip(zipWriter, tempPDFFile, fmt.Sprintf("%s.pdf", suffix))
				if err != nil {
					fmt.Println("Error adding PDF to zip: ", err)
					continue
				}
			}

		}
	}

	return zipFilename, nil
}

func addToZip(zipWriter *zip.Writer, filepath string, filenameInZip string) error {
	file, err := os.Open(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	zipFileWriter, err := zipWriter.Create(filenameInZip)
	if err != nil {
		return err
	}

	_, err = io.Copy(zipFileWriter, file)
	if err != nil {
		return err
	}

	return nil
}
