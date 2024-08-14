package excel

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func CreateExcel(filename string, data models.DataDTO, exportedData []models.ExportedData) (string, error) {
	f := excelize.NewFile()
	// Estilo de encabezado
	headers := []string{"Name", "Previous Month {unit}", "Current Month {unit}", "Total Consumed {unit}", "Rate", "Total to Pay"}
	headerStyle, err := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:  true,
			Size:  10,
			Color: "#000000",
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Pattern: 1,
			//gray color fill 40%
			Color: []string{"#e0eff1"},
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	if err != nil {
		return "", err
	}

	rowIndex := 1
	mainHeaderStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:  true,
			Size:  14,
			Color: "#000000",
		}, Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	secondHeaderStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Size:  10,
			Color: "#000000",
		}, Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	},
	)
	f.MergeCell("Sheet1", "A1", "F1")
	f.SetCellValue("Sheet1", "A1", fmt.Sprintf("%s", data.Customer))
	f.SetCellStyle("Sheet1", "A1", "F1", mainHeaderStyle)

	rowIndex++
	f.MergeCell("Sheet1", "A2", "F2")
	f.SetCellValue("Sheet1", "A2", fmt.Sprintf("%s", data.Branch))
	f.SetCellStyle("Sheet1", "A2", "F2", secondHeaderStyle)
	rowIndex++
	f.MergeCell("Sheet1", "A3", "F3")
	f.SetCellValue("Sheet1", "A3", fmt.Sprintf("Fecha de corte: %s - %s", utils.ParseDate(data.StartDateTs), utils.ParseDate(data.EndDateTs)))
	f.SetCellStyle("Sheet1", "A3", "F3", secondHeaderStyle)
	rowIndex += 2
	for _, data := range exportedData {
		if data.EntityType == "ASSET" {
			// Sitio
			startCell := fmt.Sprintf("A%d", rowIndex)
			endCell := fmt.Sprintf("F%d", rowIndex) // Suponiendo que la última columna es F
			f.MergeCell("Sheet1", startCell, endCell)
			f.SetCellValue("Sheet1", startCell, fmt.Sprintf("Sitio: %s", data.Site))
			f.SetCellStyle("Sheet1", startCell, endCell, headerStyle)
			rowIndex += 2

			// Tabla para Medidores de Agua
			if len(data.Relations.WaterMeter) > 0 {
				f.MergeCell("Sheet1", fmt.Sprintf("A%d", rowIndex), fmt.Sprintf("F%d", rowIndex))
				f.SetCellValue("Sheet1", fmt.Sprintf("A%d", rowIndex), "Water Meters")
				//f.SetCellStyle("Sheet1", fmt.Sprintf("A%d", rowIndex), fmt.Sprintf("A%d", rowIndex), headerStyle)
				rowIndex++

				water := data.Rate["water"].(map[string]interface{})
				rate := water["rate"].(float64)
				unit := water["unit"].(string)

				// Encabezados
				for colIndex, header := range headers {
					cell := ToAlphaString(colIndex) + fmt.Sprintf("%d", rowIndex)
					f.SetCellValue("Sheet1", cell, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1))
					f.SetCellStyle("Sheet1", cell, cell, headerStyle)
				}
				rowIndex++

				// Datos
				for _, device := range data.Relations.WaterMeter {
					f.MergeCell("Sheet1", fmt.Sprintf("A%d", rowIndex), fmt.Sprintf("A%d", rowIndex))
					f.SetCellValue("Sheet1", fmt.Sprintf("A%d", rowIndex), device.Name)
					f.SetCellValue("Sheet1", fmt.Sprintf("B%d", rowIndex), device.PreviousMonth)
					f.SetCellValue("Sheet1", fmt.Sprintf("C%d", rowIndex), device.CurrentMonth)
					f.SetCellValue("Sheet1", fmt.Sprintf("D%d", rowIndex), device.TotalConsumed)
					f.SetCellValue("Sheet1", fmt.Sprintf("E%d", rowIndex), fmt.Sprintf("%s%.3f", utils.GetCurrencySymbol(data.Currency), rate))
					f.SetCellValue("Sheet1", fmt.Sprintf("F%d", rowIndex), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(data.Currency), device.TotalToPay))
					rowIndex++
				}
				rowIndex++
			}

			// Tabla para Medidores de Energía
			if len(data.Relations.EnergyMeter) > 0 {
				f.MergeCell("Sheet1", fmt.Sprintf("A%d", rowIndex), fmt.Sprintf("F%d", rowIndex))
				f.SetCellValue("Sheet1", fmt.Sprintf("A%d", rowIndex), "Energy Meters")
				//f.SetCellStyle("Sheet1", fmt.Sprintf("A%d", rowIndex), fmt.Sprintf("A%d", rowIndex), headerStyle)
				rowIndex++

				energy := data.Rate["energy"].(map[string]interface{})
				rate := energy["rate"].(float64)
				unit := energy["unit"].(string)

				// Encabezados
				for colIndex, header := range headers {
					cell := ToAlphaString(colIndex) + fmt.Sprintf("%d", rowIndex)
					f.SetCellValue("Sheet1", cell, strings.Replace(header, "{unit}", fmt.Sprintf("(%s)", unit), -1))
					f.SetCellStyle("Sheet1", cell, cell, headerStyle)
				}
				rowIndex++

				// Datos
				for _, device := range data.Relations.EnergyMeter {
					f.SetCellValue("Sheet1", fmt.Sprintf("A%d", rowIndex), device.Name)
					f.SetCellValue("Sheet1", fmt.Sprintf("B%d", rowIndex), device.PreviousMonth)
					f.SetCellValue("Sheet1", fmt.Sprintf("C%d", rowIndex), device.CurrentMonth)
					f.SetCellValue("Sheet1", fmt.Sprintf("D%d", rowIndex), device.TotalConsumed)
					f.SetCellValue("Sheet1", fmt.Sprintf("E%d", rowIndex), fmt.Sprintf("%s%.3f", utils.GetCurrencySymbol(data.Currency), rate))
					f.SetCellValue("Sheet1", fmt.Sprintf("F%d", rowIndex), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(data.Currency), device.TotalToPay))
					rowIndex++
				}
				rowIndex++
			}
		}
	}

	// Guardar archivo
	if err := f.SaveAs(filename); err != nil {
		fmt.Println(err)
		return "", err
	}

	return filename, nil
}
