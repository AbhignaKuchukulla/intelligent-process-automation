const { analyzeText } = require('../services/nlpService');

const nlpController = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const analysis = await analyzeText(text);
        res.json({ analysis });
    } catch (error) {
        console.error('NLP Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { nlpController };
