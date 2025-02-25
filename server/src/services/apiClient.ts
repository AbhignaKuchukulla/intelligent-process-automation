// client/src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust based on your backend server URL

export const sendChatMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to communicate with chatbot.');
  }
};
