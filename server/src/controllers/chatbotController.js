const { getChatbotResponse } = require('../services/chatbotService');

const chatbotController = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const response = await getChatbotResponse(message);
        res.json({ response });
    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { chatbotController };
