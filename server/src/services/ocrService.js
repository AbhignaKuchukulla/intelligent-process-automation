const Tesseract = require('tesseract.js');

const performOCR = async (imageUrl, lang = 'eng') => {
    try {
        const { data } = await Tesseract.recognize(imageUrl, lang);
        return data.text.trim(); // Trim extra whitespace
    } catch (error) {
        console.error('OCR Processing Error:', error.message);
        throw new Error(`OCR failed: ${error.message}`);
    }
};

module.exports = { performOCR };
