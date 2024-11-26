package excel

import (
	"fmt"
	"server/internal/models"
	"server/internal/utils"
	"strings"
	"time"

	"github.com/xuri/excelize/v2"
)

func CreateExcel(filename string, exportedData models.ExportedData) (string, error) {
	// Crear nuevo archivo de Excel
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	// Crear encabezados
	createHeaders := func(f *excelize.File, sheet string, startRow int, unit string) {
		headers := []string{
			"Name",
			fmt.Sprintf("Last Measure (%s)", unit),
			fmt.Sprintf("Current Measure (%s)", unit),
			fmt.Sprintf("Total Consumed (%s)", unit),
			"Rate",
			"Total to Pay",
		}
		for i, header := range headers {
			col := string(rune('A' + i)) // Convertir índice a letra de columna
			cell := fmt.Sprintf("%s%d", col, startRow)
			f.SetCellValue(sheet, cell, header)
			f.SetColWidth(sheet, col, col, 20) // Ajustar ancho de columna

			// Aplicar estilo con negrita y relleno
			style, _ := f.NewStyle(&excelize.Style{
				Font: &excelize.Font{
					Bold: true,
				},
				Fill: excelize.Fill{
					Type:    "pattern",
					Color:   []string{"#DDEBF7"},
					Pattern: 1,
				},
				Alignment: &excelize.Alignment{
					Horizontal: "center",
					Vertical:   "center",
				},
			})
			f.SetCellStyle(sheet, cell, cell, style)
		}
	}

	// Crear hoja para la relación
	sheet := "Report"
	index, err := f.NewSheet(sheet)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	// Definir las columnas y unidades
	unitEnergy := utils.GetUnitByDeviceType("energy meter", exportedData.Units)
	unitWater := utils.GetUnitByDeviceType("water meter", exportedData.Units)

	row := 1 // Fila inicial
	// Título Customer con estilo centrado y letra más grande
	f.SetCellValue(sheet, fmt.Sprintf("A%d", row), exportedData.Customer)
	styleCustomer, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold: true,
			Size: 14, // Tamaño de letra más grande
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.MergeCell(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row)) // Centrar en ancho de las tablas
	f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), styleCustomer)
	row += 2

	// Branch con estilo más pequeño
	f.SetCellValue(sheet, fmt.Sprintf("A%d", row), exportedData.Branch)
	styleBranch, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold: true,
			Size: 12,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
		},
	})
	f.MergeCell(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row))
	f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), styleBranch)
	row += 2

	// Fecha de corte
	parseStartDate := time.UnixMilli(exportedData.StartDateTs).Format("02/01/2006")
	parseEndDate := time.UnixMilli(exportedData.EndDateTs).Format("02/01/2006")
	f.SetCellValue(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("Fecha de corte: %s - %s", parseStartDate, parseEndDate))
	f.MergeCell(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row))
	f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), styleBranch)
	row += 2

	everyAssetsLocal := true

	if everyAssetsLocal {
		// Crear encabezados
		hasEnergyMeter := false
		hasWaterMeter := false
		rowStyle, _ := f.NewStyle(&excelize.Style{
			Font: &excelize.Font{
				Bold: false,
				Size: 11,
			},
			Alignment: &excelize.Alignment{
				Horizontal: "center",
			},
		})

		for _, entity := range exportedData.Relations {
			for _, relation := range *entity.Relations {
				if strings.Contains(strings.ToLower(relation.Type), "energy meter") {
					hasEnergyMeter = true
				}
				if strings.Contains(strings.ToLower(relation.Type), "water meter") {
					hasWaterMeter = true
				}
			}
		}

		if hasEnergyMeter {
			// title
			row++
			f.SetCellValue(sheet, fmt.Sprintf("A%d", row), "Energy Meters")
			style, _ := f.NewStyle(&excelize.Style{
				Font: &excelize.Font{
					Bold: true,
					Size: 11,
				},
				Alignment: &excelize.Alignment{
					Horizontal: "left",
				},
			})
			f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), style)
			row += 2
			createHeaders(f, sheet, row, unitEnergy)
			row++

			// Agregar datos de Energy Meters y Water Meters
			for _, entity := range exportedData.Relations {
				for _, relation := range *entity.Relations {
					if strings.Contains(strings.ToLower(relation.Type), "energy meter") {
						// f.SetCellValue(sheet, fmt.Sprintf("A%d", row), *relation.Label)
						if entity.Label != nil {
							f.SetCellValue(sheet, fmt.Sprintf("A%d", row), *entity.Label)
						} else {
							f.SetCellValue(sheet, fmt.Sprintf("A%d", row), entity.Name)
						}
						f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row), rowStyle)
						f.SetCellValue(sheet, fmt.Sprintf("B%d", row), *relation.PreviousMonth)
						f.SetCellValue(sheet, fmt.Sprintf("C%d", row), *relation.CurrentMonth)
						f.SetCellValue(sheet, fmt.Sprintf("D%d", row), *relation.TotalConsumed)
						f.SetCellValue(sheet, fmt.Sprintf("E%d", row), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(exportedData.Currency), exportedData.Rate["energy"]))
						f.SetCellValue(sheet, fmt.Sprintf("F%d", row), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(exportedData.Currency), *relation.TotalToPay))
						row++
					}
				}
			}
			row += 2
		}

		if hasWaterMeter {
			// title
			row++
			f.SetCellValue(sheet, fmt.Sprintf("A%d", row), "Water Meters")
			style, _ := f.NewStyle(&excelize.Style{
				Font: &excelize.Font{
					Bold: true,
					Size: 11,
				},
				Alignment: &excelize.Alignment{
					Horizontal: "left",
				},
			})
			f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), style)
			row += 2
			createHeaders(f, sheet, row, unitWater)
			row++
			for _, entity := range exportedData.Relations {
				for _, relation := range *entity.Relations {
					if strings.Contains(strings.ToLower(relation.Type), "water meter") {
						// f.SetCellValue(sheet, fmt.Sprintf("A%d", row), *relation.Label)
						if entity.Label != nil {
							f.SetCellValue(sheet, fmt.Sprintf("A%d", row), *entity.Label)
						} else {
							f.SetCellValue(sheet, fmt.Sprintf("A%d", row), entity.Name)
						}

						f.SetCellStyle(sheet, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row), rowStyle)
						f.SetCellValue(sheet, fmt.Sprintf("B%d", row), *relation.PreviousMonth)
						f.SetCellValue(sheet, fmt.Sprintf("C%d", row), *relation.CurrentMonth)
						f.SetCellValue(sheet, fmt.Sprintf("D%d", row), *relation.TotalConsumed)
						f.SetCellValue(sheet, fmt.Sprintf("E%d", row), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(exportedData.Currency), exportedData.Rate["water"]))
						f.SetCellValue(sheet, fmt.Sprintf("F%d", row), fmt.Sprintf("%s%.2f", utils.GetCurrencySymbol(exportedData.Currency), *relation.TotalToPay))
						row++
					}
				}
			}

			row += 2
		}
	}
	f.SetActiveSheet(index)
	// Guardar archivo
	if err := f.SaveAs(filename); err != nil {
		fmt.Println(err)
		return "", err
	}
	return filename, nil
}
