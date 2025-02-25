import { createWorker } from 'tesseract.js';
import logger from '../utils/logger';

interface OCRResult {
  text: string;
  confidence: number;
}

export const processImage = async (imagePath: string): Promise<OCRResult> => {
  const worker = await createWorker('eng');
  
  try {
    logger.info(`Processing OCR for image: ${imagePath}`);
    
    const { data } = await worker.recognize(imagePath);
    
    await worker.terminate();
    
    return {
      text: data.text,
      confidence: data.confidence
    };
  } catch (error) {
    logger.error('OCR processing error:', error);
    await worker.terminate();
    throw new Error('Failed to process image');
  }
};

export const extractDataFromText = (text: string, dataType: 'invoice' | 'receipt' | 'id'): Record<string, any> => {
  // This is a simplified example. In a real application, you would implement
  // more sophisticated text parsing based on the document type.
  
  logger.info(`Extracting ${dataType} data from OCR text`);
  
  let extractedData: Record<string, any> = {};
  
  switch (dataType) {
    case 'invoice':
      // Extract invoice number, date, amount, etc.
      const invoiceMatch = text.match(/Invoice[:\s]*#?(\w+)/i);
      const dateMatch = text.match(/Date[:\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i);
      const amountMatch = text.match(/Amount[:\s]*[$£€]?(\d+([.,]\d{2})?)/i);
      
      if (invoiceMatch) extractedData.invoiceNumber = invoiceMatch[1];
      if (dateMatch) extractedData.date = dateMatch[1];
      if (amountMatch) extractedData.amount = amountMatch[1];
      break;
      
    case 'receipt':
      // Extract store name, date, total, etc.
      const storeMatch = text.match(/^([A-Z][A-Za-z\s]+)[\r\n]/m);
      const receiptDateMatch = text.match(/Date[:\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i);
      const totalMatch = text.match(/Total[:\s]*[$£€]?(\d+([.,]\d{2})?)/i);
      
      if (storeMatch) extractedData.store = storeMatch[1].trim();
      if (receiptDateMatch) extractedData.date = receiptDateMatch[1];
      if (totalMatch) extractedData.total = totalMatch[1];
      break;
      
    case 'id':
      // Extract name, ID number, DOB, etc.
      const nameMatch = text.match(/Name[:\s]*([A-Za-z\s]+)/i);
      const idMatch = text.match(/ID[:\s]*#?(\w+)/i);
      const dobMatch = text.match(/Birth[:\s]*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i);
      
      if (nameMatch) extractedData.name = nameMatch[1].trim();
      if (idMatch) extractedData.idNumber = idMatch[1];
      if (dobMatch) extractedData.dateOfBirth = dobMatch[1];
      break;
  }
  
  return extractedData;
};