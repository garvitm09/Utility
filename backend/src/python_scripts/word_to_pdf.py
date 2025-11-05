import sys
import os
from docx2pdf import convert

def word_to_pdf(input_docx, output_pdf=None):
    """
    Convert Word document (DOCX) to PDF.
    Args:
        input_docx (str): Path to the input DOCX file.
        output_pdf (str, optional): Path to save the output PDF file.
                                   If None, saves in same directory as input.
    """
    if not os.path.isfile(input_docx):
        raise FileNotFoundError(f"DOCX file not found: {input_docx}")
    # If output_pdf is None, convert will save with same name as input in the same directory
    if output_pdf:
        convert(input_docx, output_pdf)
    else:
        convert(input_docx)
    print(f"PDF document saved to {output_pdf if output_pdf else os.path.splitext(input_docx)[0] + '.pdf'}")

if __name__ == "__main__":
    if len(sys.argv) not in (2, 3):
        print("Usage: python word_to_pdf.py input.docx [output.pdf]")
        sys.exit(1)
    input_docx = sys.argv[1]
    output_pdf = sys.argv[2] if len(sys.argv) == 3 else None
    word_to_pdf(input_docx, output_pdf)
