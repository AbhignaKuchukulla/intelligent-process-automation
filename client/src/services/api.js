import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    let errorMessage = 'An unexpected error occurred';

    if (response?.data && typeof response.data === 'object' && 'message' in response.data) {
      errorMessage = response.data.message;
    } else if (response?.statusText) {
      errorMessage = response.statusText;
    }

    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;

// Document APIs
export const fetchDocuments = async () => {
  const response = await apiClient.get('/documents');
  return response.data;
};

export const fetchDocumentById = async (documentId) => {
  const response = await apiClient.get(`/documents/${documentId}`);
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const reprocessDocument = async (documentId) => {
  const response = await apiClient.post(`/documents/${documentId}/reprocess`);
  return response.data;
};

// Workflow APIs
export const fetchWorkflows = async () => {
  const response = await apiClient.get('/workflows');
  return response.data;
};

export const fetchWorkflowById = async (workflowId) => {
  const response = await apiClient.get(`/workflows/${workflowId}`);
  return response.data;
};

export const createWorkflow = async (workflowData) => {
  const response = await apiClient.post('/workflows', workflowData);
  return response.data;
};

export const updateWorkflow = async (workflowId, workflowData) => {
  const response = await apiClient.put(`/workflows/${workflowId}`, workflowData);
  return response.data;
};

export const deleteWorkflow = async (workflowId) => {
  const response = await apiClient.delete(`/workflows/${workflowId}`);
  return response.data;
};

export const executeWorkflow = async (workflowId) => {
  const response = await apiClient.post(`/workflows/${workflowId}/execute`);
  return response.data;
};

// Chatbot API
export const sendChatMessage = async (message, context = '') => {
  const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5002';
  const fullMessage = context ? `Context: ${context}\n\nQuestion: ${message}` : message;
  const response = await axios.post(`${CHATBOT_URL}/chat`, { message: fullMessage });
  return { message: response.data.response };
};
