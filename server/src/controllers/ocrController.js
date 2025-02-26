const { performOCR } = require('../services/ocrService');

const ocrController = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }
        
        const text = await performOCR(imageUrl);
        res.json({ text });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { ocrController };