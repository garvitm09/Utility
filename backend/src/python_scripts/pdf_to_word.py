from pdf2image import convert_from_path
import pytesseract
from docx import Document
import sys
import os

def pdf_to_word(pdf_path, output_docx):
    """
    Convert PDF to Word document (with OCR for scanned PDFs).
    Args:
        pdf_path (str): Path to the input PDF file.
        output_docx (str): Path to save the output DOCX file.
    """
    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")
    pages = convert_from_path(pdf_path)
    doc = Document()
    for page_num, image in enumerate(pages, 1):
        text = pytesseract.image_to_string(image)
        doc.add_paragraph(text)
        print(f"OCR completed for page {page_num}")
    doc.save(output_docx)
    print(f"Word document saved to {output_docx}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_to_word.py input.pdf output.docx")
        sys.exit(1)
    pdf_path = sys.argv[1]
    output_docx = sys.argv[2]
    pdf_to_word(pdf_path, output_docx)