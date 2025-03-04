import axios, { AxiosError } from 'axios';

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
  (error) => Promise.reject(error)
);

// ✅ Handle API Errors Gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    const errorMessage =
      response?.data && typeof response.data === 'object' && 'message' in response.data
        ? (response.data as { message: string }).message
        : 'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;

//
// ----------------- ✅ AUTHENTICATION APIs -----------------
//

// ✅ User Login
export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

// ✅ User Registration
export async function registerUser(name: string, email: string, password: string): Promise<{ message: string }> {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
}

// ✅ Fetch User Profile
export async function fetchUserProfile(): Promise<{ id: string; name: string; email: string }> {
  const response = await apiClient.get('/users/profile');
  return response.data;
}

// ✅ Logout User
export async function logoutUser(): Promise<{ message: string }> {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

//
// ----------------- ✅ CHATBOT API -----------------
//

// ✅ Chatbot API: Send Message (Connects to Flask Chatbot on Port 5002)
export async function sendChatMessage(message: string): Promise<{ message: string }> {
  try {
    const response = await axios.post(
      'http://localhost:5002/chat',
      { message },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false, // 🚨 If using `*` in Flask CORS, set this to false
      }
    );

    return { message: response.data.response };
  } catch (error: any) {
    console.error("🚨 Chat API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to send message");
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
  const response = await apiClient.get('/upload'); // ✅ Fetch from correct API endpoint
  return response.data;
}
// ✅ Upload Document via Backend
export async function uploadDocument(file: File): Promise<{ id: string; name: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

//
// ----------------- ✅ NLP PROCESSING APIs -----------------
//

// ✅ Process Text using NLP
export async function processTextNLP(text: string): Promise<{ result: string }> {
  const response = await apiClient.post('/nlp/process', { text });
  return response.data;
}

// ✅ Extract Named Entities from Text
export async function extractEntities(text: string): Promise<{ entities: string[] }> {
  const response = await apiClient.post('/nlp/entities', { text });
  return response.data;
}

//
// ----------------- ✅ OCR PROCESSING APIs -----------------
//

// ✅ Upload Image for OCR Processing
export async function uploadImageForOCR(file: File): Promise<{ extractedText: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/ocr/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

// ✅ Get OCR Processing Results
export async function getOCRResults(documentId: string): Promise<{ text: string }> {
  const response = await apiClient.get(`/ocr/result/${documentId}`);
  return response.data;
}

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
  const response = await apiClient.get('/workflows');
  return response.data;
}
