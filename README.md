# Intelligent Process Automation (IPA) System

## Overview
The **Intelligent Process Automation (IPA) System** is an AI-powered automation solution designed to streamline document processing, data entry, and customer interactions for enterprises. It integrates **OCR, NLP, and AI-based document classification** to extract structured data from PDFs, images, and DOCX files, reducing manual effort and improving efficiency.

## Features
- **OCR Module**: Extracts text and tables from scanned documents using **Tesseract OCR, pdfplumber, and OpenCV**.
- **NLP Module**: Performs **Named Entity Recognition (NER)** to extract key information (e.g., names, dates, IDs) using **spaCy and Hugging Face Transformers**.
- **Document Classification**: Categorizes documents into different types using a **CNN model trained on the RVL-CDIP dataset**.
- **AI-Powered Chatbot**: Uses **Google Gemini AI** to handle customer queries related to document processing.

## Tech Stack
- **Backend**: FastAPI (Python) for API handling
- **Frontend**: React.js (optional UI for testing API calls)
- **AI Models**:
  - OCR: **Tesseract OCR, pdfplumber, PyMuPDF**
  - NLP: **spaCy, Hugging Face Transformers**
  - Document Classification: **Scikit-learn, TensorFlow**
- **Database**: MongoDB (for structured data storage)
- **Infrastructure**: AWS/GCP/Azure (for cloud deployment)

---

## Installation
### **Prerequisites**
Ensure you have the following installed:
- Python 3.8+
- Node.js (if using the frontend)
- MongoDB
- Git

### **Clone the Repository**
```sh
git clone https://github.com/AbhignaKuchukulla/intelligent-process-automation.git
cd intelligent-process-automation
```

### **Backend Setup**
1. Navigate to the `server/` directory:
    ```sh
    cd server
    ```
2. Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```
3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```
4. Start the FastAPI server:
    ```sh
    uvicorn main:app --reload
    ```

### **Frontend Setup (Optional)**
1. Navigate to the `client/` directory:
    ```sh
    cd client
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm start
    ```

---

## API Endpoints
### **1. OCR Processing**
- **Endpoint:** `POST /api/ocr`
- **Description:** Extracts text from images and PDFs
- **Request Example:**
    ```json
    {
      "file": "invoice.pdf"
    }
    ```

### **2. NLP Processing**
- **Endpoint:** `POST /api/nlp`
- **Description:** Extracts key information from text
- **Request Example:**
    ```json
    {
      "text": "Invoice issued to John Doe on 2025-02-25."
    }
    ```

### **3. Document Classification**
- **Endpoint:** `POST /api/classify`
- **Description:** Classifies document type
- **Request Example:**
    ```json
    {
      "file": "document.pdf"
    }
    ```

### **4. AI Chatbot**
- **Endpoint:** `POST /api/chatbot`
- **Description:** AI-powered chatbot for customer support
- **Request Example:**
    ```json
    {
      "query": "What is the status of my document processing?"
    }
    ```

---

## Testing
To run tests:
```sh
pytest tests/
```
---

## Contributors
- **Kuchukulla Abhigna**

For queries, contact **abhignakuchukulla@gmail.com**

