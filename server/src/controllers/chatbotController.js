const axios = require('axios');

const chatbotController = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

    // ✅ Use CHATBOT_URL env var (falls back to localhost:5002)
    const CHATBOT_URL = process.env.CHATBOT_URL || 'http://localhost:5002';
    const flaskResponse = await axios.post(`${CHATBOT_URL.replace(/\/$/, '')}/chat`, { message });

        res.json({ response: flaskResponse.data.response });
    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { chatbotController };