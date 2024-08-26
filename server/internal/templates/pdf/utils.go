package pdf

import (
	"fmt"
	"image"
	"math"
	"os"
	"server/internal/models"
	"server/internal/utils"
	"strings"
	"time"

	"github.com/jung-kurt/gofpdf/v2"
)

func AddHeader(pdf *gofpdf.Fpdf, data models.ExportedData) {
	const maxImgWidth = 20  // Ancho máximo de la imagen
	const maxImgHeight = 20 // Alto máximo de la imagen

	if data.Img != "" {
		AddImageByUrl(pdf, data.Img, 175, 15, maxImgWidth, maxImgHeight)
	}

	// Continuar con el resto del header
	parseStartDate := time.UnixMilli(data.StartDateTs).Format("02/01/2006")
	parseEndDate := time.UnixMilli(data.EndDateTs).Format("02/01/2006")
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 10, data.Customer)

	pdf.Ln(7)
	pdf.Cell(0, 10, data.Branch)
	pdf.SetFont("Arial", "", 10)
	pdf.Ln(5)
	pdf.Cell(0, 10, fmt.Sprintf("Fecha de corte: %s - %s", parseStartDate, parseEndDate))
	pdf.Ln(10)
}

// Función para agregar un footer al PDF
func AddFooter(pdf *gofpdf.Fpdf) {
	pdf.SetY(-15)
	pdf.SetFont("Arial", "I", 8)
	pageStr := fmt.Sprintf("Página %d de {nb}", pdf.PageNo())
	pdf.CellFormat(0, 10, pdf.UnicodeTranslatorFromDescriptor("cp1252")(pageStr), "", 0, "C", false, 0, "")
}

func AddHeaderSupport(pdf *gofpdf.Fpdf, data models.ExportedData, support string) {
	// Definir el color de fondo (sin opacidad directa en gofpdf, pero elige un color claro para simular)
	// color azul de fondo claro
	pdf.SetFillColor(240, 244, 255) // R, G, B
	pdf.SetDrawColor(86, 111, 183)  // Color de borde igual al de fondo

	// Dibujar el rectángulo de fondo en la parte superior del PDF
	pdf.Rect(0, -10, 300, 40, "FD") // Rectángulo con color de fondo, ajusta las coordenadas y dimensiones

	// Dibujar línea inferior como borde
	pdf.SetLineWidth(0.1)    // Grosor de la línea
	pdf.Line(0, 30, 300, 30) // Línea en la parte inferior del rectángulo

	// Configurar el estilo de fuente para el nombre del cliente (grande y en la izquierda)
	pdf.SetXY(10, 12)              // Establecer posición para el texto
	pdf.SetFont("Arial", "B", 22)  // Fuente más grande
	pdf.SetTextColor(86, 111, 183) // Color azul
	pdf.Cell(0, 10, data.Customer) // Nombre del cliente

	// Posicionar el nombre de la sucursal en la parte derecha (encima del cliente)
	pdf.SetXY(170, 8)
	pdf.SetFont("Arial", "", 11) // Fuente estándar para la sucursal
	pdf.Cell(0, 10, data.Branch) // Nombre de la sucursal

	// Colocar el nombre del cliente (debajo de la sucursal en la derecha)
	pdf.SetXY(170, 13)
	pdf.SetFont("Arial", "", 10) // Fuente más pequeña
	// color gris claro
	pdf.SetTextColor(128, 128, 128) // R, G, B
	pdf.Cell(0, 10, support)

	// Avanzar la línea
	pdf.Ln(10)
}

func AddHeaderDue(pdf *gofpdf.Fpdf, data models.ExportedData, dueType string, total float64) {
	// Definir el color de fondo (sin opacidad directa en gofpdf, pero elige un color claro para simular)
	// color azul de fondo claro
	if strings.Contains(dueType, "Energ") {
		pdf.SetFillColor(255, 247, 232) // R, G, B
		pdf.SetDrawColor(255, 196, 90)  // Color de borde igual al de fondo
	} else {
		pdf.SetFillColor(237, 250, 255) // R, G, B
		pdf.SetDrawColor(159, 230, 255) // Color de borde igual al de fondo
	}

	// Dibujar el rectángulo de fondo en la parte superior del PDF
	pdf.Rect(0, -10, 300, 40, "F") // Rectángulo con color de fondo, ajusta las coordenadas y dimensiones

	// Dibujar línea inferior como borde
	pdf.SetLineWidth(0.1)    // Grosor de la línea
	pdf.Line(0, 30, 300, 30) // Línea en la parte inferior del rectángulo

	// Configurar el estilo de fuente para el nombre del cliente (grande y en la izquierda)
	pdf.SetXY(10, 12)              // Establecer posición para el texto
	pdf.SetFont("Arial", "B", 20)  // Fuente más grande
	pdf.SetTextColor(86, 111, 183) // Color azul                                     // Círculo en la esquina superior izquierda
	if strings.Contains(dueType, "Energ") {

		pdf.Image("./assets/icon-power.png", 15, 8, 15, 0, false, "", 0, "") // Logo en el círculo
	} else {
		pdf.Image("./assets/icon-water.png", 15, 8, 15, 0, false, "", 0, "") // Logo en el círculo
	}
	pdf.SetXY(35, 9)
	pdf.SetTextColor(80, 80, 80)
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(0, 10, "Detalle de Factura") // Nombre del cliente
	pdf.SetXY(35, 14)
	pdf.SetFont("Arial", "", 12)
	// color gris claro
	pdf.SetTextColor(128, 128, 128) // R, G, B
	pdf.Cell(0, 10, dueType)

	// Posicionar el nombre de la sucursal en la parte derecha (encima del cliente)
	pdf.SetXY(160, 8)
	pdf.SetFont("Arial", "", 11)     // Fuente estándar para la sucursal
	pdf.Cell(0, 10, "Total a Pagar") // Nombre de la sucursal

	// Colocar el nombre del cliente (debajo de la sucursal en la derecha)
	pdf.SetXY(160, 15)
	pdf.SetFont("Arial", "B", 16) // Fuente más pequeña
	// color gris claro
	pdf.SetTextColor(80, 80, 80) // R, G, B
	pdf.Cell(0, 10, fmt.Sprintf("%s %s", utils.GetCurrencySymbol(data.Currency), utils.FormatNumber(total)))

	// Avanzar la línea
	pdf.Ln(30)
}

func AddImageByUrl(pdf *gofpdf.Fpdf, url string, x, y, width, height float64) {
	tempImageFile := "temp.png"
	err := utils.DownloadImage(url, tempImageFile)
	if err != nil {
		fmt.Println("Error downloading image: ", err)
	}
	defer os.Remove(tempImageFile)

	// Obtener dimensiones originales de la imagen
	file, err := os.Open(tempImageFile)
	if err != nil {
		fmt.Println("Error opening image file:", err)
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		fmt.Println("Error decoding image:", err)
	}
	origWidth := float64(img.Bounds().Dx())
	origHeight := float64(img.Bounds().Dy())

	// Calcular escala proporcional
	widthScale := width / origWidth
	heightScale := height / origHeight
	scale := math.Min(widthScale, heightScale)

	// Calcular dimensiones finales de la imagen
	finalWidth := origWidth * scale
	finalHeight := origHeight * scale

	// Añadir imagen en el header, ajustada proporcionalmente
	pdf.Image("temp.png", x, y, finalWidth, finalHeight, false, "", 0, "")
}
