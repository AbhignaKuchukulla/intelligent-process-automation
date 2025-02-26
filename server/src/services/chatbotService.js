const axios = require('axios');

const getChatbotResponse = async (message) => {
    try {
        console.log(`🔹 Sending message to chatbot: ${message}`);
        const response = await axios.post('http://127.0.0.1:5002/chat', { message });
        console.log(`✅ Chatbot response received: ${response.data.response}`);
        return response.data.response;
    } catch (error) {
        console.error('❌ Chatbot API Error:', error.message);
        throw new Error('Error processing chatbot request');
    }
};

module.exports = { getChatbotResponse };
