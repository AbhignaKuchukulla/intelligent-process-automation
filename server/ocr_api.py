from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF for PDFs
import docx
import pytesseract
import cv2
import numpy as np
import pdfplumber
from PIL import Image
from tabulate import tabulate

app = Flask(__name__)

# ✅ Set up Tesseract path (Update this if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ✅ Detect file type
def detect_file_type(file_path):
    extension = os.path.splitext(file_path)[1].lower()
    if extension in ['.pdf']:
        return 'pdf'
    elif extension in ['.docx']:
        return 'docx'
    elif extension in ['.jpg', '.jpeg', '.png']:
        return 'image'
    else:
        raise ValueError("Unsupported file format.")

# ✅ Preprocess images for better OCR accuracy
def preprocess_image(image):
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    _, thresh = cv2.threshold(resized, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    denoised = cv2.medianBlur(thresh, 3)
    return denoised

# ✅ Extract text from an image
def extract_text_from_image(image):
    preprocessed_img = preprocess_image(image)
    custom_config = r'--oem 3 --psm 6'
    return pytesseract.image_to_string(preprocessed_img, config=custom_config)

# ✅ Extract content from a PDF
def extract_content_from_pdf(file_path):
    full_content = ""
    extracted_tables = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.filter(lambda obj: obj["object_type"] == "char").extract_text()
            if page_text:
                full_content += f"\n{page_text}\n"

            tables = page.extract_tables()
            for table in tables:
                formatted_table = format_table(table)
                extracted_tables.append(formatted_table)

    for table in extracted_tables:
        full_content += f"\n{table}\n"
    
    return full_content

# ✅ Format tables properly
def format_table(table_data):
    if not table_data:
        return "No table detected."
    headers = table_data[0]
    rows = table_data[1:]
    return tabulate(rows, headers=headers, tablefmt="grid")

# ✅ Handle PDF files
def handle_pdf(file_path):
    full_content = extract_content_from_pdf(file_path)
    if not full_content.strip():
        text = ""
        pdf = fitz.open(file_path)
        for page_num in range(len(pdf)):
            page = pdf.load_page(page_num)
            image = page.get_pixmap()
            img = Image.frombytes("RGB", [image.width, image.height], image.samples)
            text += extract_text_from_image(img) + "\n"
        return text
    return full_content

# ✅ Handle DOCX files
def handle_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

# ✅ Handle Image files
def handle_image(file_path):
    img = Image.open(file_path)
    return extract_text_from_image(img)

# ✅ Extract text based on file type
def extract_text(file_path):
    file_type = detect_file_type(file_path)
    if file_type == 'pdf':
        return handle_pdf(file_path)
    elif file_type == 'docx':
        return handle_docx(file_path)
    elif file_type == 'image':
        return handle_image(file_path)

# ✅ Flask API Route for OCR Processing
@app.route('/perform-ocr', methods=['POST'])
def perform_ocr():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_path = f"temp_{file.filename}"
    file.save(file_path)

    try:
        extracted_text = extract_text(file_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(file_path)  # Clean up temp file

    return jsonify({"text": extracted_text})

# ✅ Start Flask Server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Running on port 5001