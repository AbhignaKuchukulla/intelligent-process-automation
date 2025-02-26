const Tesseract = require('tesseract.js');

const performOCR = async (imageUrl) => {
    try {
        const { data } = await Tesseract.recognize(imageUrl, 'eng');
        return data.text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Error processing image for OCR');
    }
};

module.exports = { performOCR };