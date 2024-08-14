package supports

import (
	"fmt"
	"github.com/jung-kurt/gofpdf/v2"
	"os"
	"server/internal/models"
	"server/internal/utils"
	"time"
)

func AddHeader(pdf *gofpdf.Fpdf, data models.DataDTO) {
	if data.Img != "" {
		tempImageFile := "temp.png"
		err := utils.DownloadImage(data.Img, tempImageFile)
		if err != nil {
			fmt.Println("Error downloading image: ", err)
		}
		defer os.Remove(tempImageFile)
	}
	parseStartDate := time.UnixMilli(data.StartDateTs).Format("02/01/2006")
	parseEndDate := time.UnixMilli(data.EndDateTs).Format("02/01/2006")
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 10, data.Customer)
	//AGREGAR AL OTRO EXTREMO LA IMAGEN SI EXISTE
	if data.Img != "" {
		pdf.Image("temp.png", 180, 10, 20, 20, false, "", 0, "")
	}
	pdf.Ln(7)
	pdf.Cell(0, 10, data.Branch)
	pdf.SetFont("Arial", "", 10)
	pdf.Ln(5)
	pdf.Cell(0, 10, fmt.Sprintf("Fecha de corte: %s - %s", parseStartDate, parseEndDate))
	pdf.Ln(40)
	//	MARGIN BOTTOM
}

// Función para agregar un footer al PDF
func AddFooter(pdf *gofpdf.Fpdf) {
	pdf.SetY(-15)
	pdf.SetFont("Arial", "I", 8)
	pageStr := fmt.Sprintf("Página %d de {nb}", pdf.PageNo())
	pdf.CellFormat(0, 10, pdf.UnicodeTranslatorFromDescriptor("cp1252")(pageStr), "", 0, "C", false, 0, "")
}
