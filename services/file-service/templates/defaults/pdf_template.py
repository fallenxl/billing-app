from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Select Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Title
        self.cell(0, 10, 'PDF Report', 0, 1, 'C')

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_default_pdf(data, filename):
    pdf = PDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    # Add data to the PDF
    for key, value in data.items():
        pdf.cell(0, 10, f'{key}: {value}', 0, 1)
    # Save the PDF to a file
    pdf.output(f"../../storage/{filename}.pdf")