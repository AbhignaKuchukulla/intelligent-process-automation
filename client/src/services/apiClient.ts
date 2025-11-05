import axios, { AxiosError } from 'axios';
import { notify } from '../utils/notifier';

// ✅ Set API base URL (Backend: Express API)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

// ✅ Create Axios Instance for API Calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Required for authentication & sessions
});

// ✅ Add Authorization Token to Requests (if available)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Handle API Errors Gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    let errorMessage = 'An unexpected error occurred';

    if (response) {
      // Extract error message from response
      if (response.data && typeof response.data === 'object' && 'message' in response.data) {
        errorMessage = (response.data as { message: string }).message;
      } else if (response.statusText) {
        errorMessage = response.statusText;
      }
    }

    console.error('API Error:', errorMessage);
    try {
      notify({ message: errorMessage, severity: 'error' });
    } catch (e) {
      // ignore notifier failures
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;

//
// ----------------- ✅ AUTHENTICATION APIs -----------------
//

// ✅ User Login
export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('Failed to log in');
  }
}

// ✅ User Registration
export async function registerUser(name: string, email: string, password: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('Failed to register');
  }
}

// ✅ Fetch User Profile
export async function fetchUserProfile(): Promise<{ id: string; name: string; email: string }> {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    throw new Error('Failed to fetch profile');
  }
}

// ✅ Logout User
export async function logoutUser(): Promise<{ message: string }> {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error);
    throw new Error('Failed to log out');
  }
}

//
// ----------------- ✅ CHATBOT API -----------------
//

// ✅ Chatbot API: Send Message (Connects to Flask Chatbot on Port 5002)
export async function sendChatMessage(message: string): Promise<{ message: string }> {
  try {
    const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:5002';
    const response = await axios.post(`${CHATBOT_URL.replace(/\/$/, '')}/chat`, { message }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false, // If Flask CORS is permissive, keep this false for cross-origin
    });

    return { message: response.data.response };
  } catch (error: any) {
    const chatErrMsg = error.response?.data?.error || error.message || 'Failed to send message';
    console.error("🚨 Chat API Error:", error.response?.data || error.message);
    try {
      notify({ message: chatErrMsg, severity: 'error' });
    } catch (e) {
      // ignore
    }
    throw new Error(chatErrMsg);
  }
}

//
// ----------------- ✅ DOCUMENT MANAGEMENT APIs -----------------
//

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  confidence: number;
}

// ✅ Fetch Documents from Backend
export async function fetchDocuments(): Promise<Document[]> {
  try {
    const response = await apiClient.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Fetch Documents Error:', error);
    throw new Error('Failed to fetch documents');
  }
}

// ✅ Upload Document via Backend
export async function uploadDocument(file: File): Promise<{ id: string; name: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    try {
      notify({ message: 'Document uploaded successfully.', severity: 'success' });
    } catch (e) {
      // ignore notifier errors
    }

    return response.data;
  } catch (error) {
    console.error('Upload Document Error:', error);
    throw new Error('Failed to upload document');
  }
}

// ✅ Fetch Document by ID
export async function fetchDocumentById(documentId: string): Promise<Document> {
  try {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch Document by ID Error:', error);
    throw new Error('Failed to fetch document');
  }
}

//
// ----------------- ✅ NLP PROCESSING APIs -----------------
//

// ✅ Process Text using NLP
export async function processTextNLP(text: string): Promise<{ result: string }> {
  try {
    const response = await apiClient.post('/nlp/process', { text });
    return response.data;
  } catch (error) {
    console.error('NLP Processing Error:', error);
    throw new Error('Failed to process text');
  }
}

// ✅ Extract Named Entities from Text
export async function extractEntities(text: string): Promise<{ entities: string[] }> {
  try {
    const response = await apiClient.post('/nlp/entities', { text });
    return response.data;
  } catch (error) {
    console.error('Entity Extraction Error:', error);
    throw new Error('Failed to extract entities');
  }
}

//
// ----------------- ✅ OCR PROCESSING APIs -----------------
//

// ✅ Upload Image for OCR Processing
export async function uploadImageForOCR(file: File): Promise<{ extractedText: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/ocr/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('OCR Upload Error:', error);
    throw new Error('Failed to upload image for OCR');
  }
}

// ✅ Get OCR Processing Results
export async function getOCRResults(documentId: string): Promise<{ text: string }> {
  try {
    const response = await apiClient.get(`/ocr/result/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('OCR Results Error:', error);
    throw new Error('Failed to fetch OCR results');
  }
}

//
// ----------------- ✅ WORKFLOW MANAGEMENT APIs -----------------
//

export interface Workflow {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  nextRun: string;
}

// ✅ Fetch Workflows from Backend
export async function fetchWorkflows(): Promise<Workflow[]> {
  try {
    const response = await apiClient.get('/workflows');
    return response.data;
  } catch (error) {
    console.error('Fetch Workflows Error:', error);
    throw new Error('Failed to fetch workflows');
  }
}