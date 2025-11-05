const axios = require('axios');

const getChatbotResponse = async (message) => {
    try {
        const CHATBOT_URL = process.env.CHATBOT_URL || 'http://127.0.0.1:5002';
        console.log(`🔹 Sending message to chatbot (${CHATBOT_URL}): ${message}`);
        const response = await axios.post(`${CHATBOT_URL.replace(/\/$/, '')}/chat`, { message });
        console.log(`✅ Chatbot response received: ${response.data.response}`);
        return response.data.response;
    } catch (error) {
        console.error('❌ Chatbot API Error:', error.message);
        throw new Error('Error processing chatbot request');
    }
};

module.exports = { getChatbotResponse };
