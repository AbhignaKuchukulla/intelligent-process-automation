import axios, { AxiosError } from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication (if needed)
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

// Add response interceptor for error handling
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

// ------------------- Chatbot API -------------------
export async function sendChatMessage(message: string): Promise<{ message: string }> {
  const response = await apiClient.post('/chat', { message });
  return response.data;
}

// ------------------- Documents API -------------------
export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  confidence: number;
}

// Fetch documents (mocked)
export async function fetchDocuments(): Promise<Document[]> {
  return mockDocuments;
}

// Upload document (mocked)
export async function uploadDocument(file: File): Promise<{ id: string; name: string }> {
  const formData = new FormData();
  formData.append('document', file);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `doc_${Date.now()}`,
        name: file.name,
      });
    }, 2000);
  });
}

// Mock data for documents
const mockDocuments: Document[] = [
  {
    id: 'doc_1',
    name: 'Invoice-XYZ-123.pdf',
    type: 'Invoice',
    date: '2025-02-15',
    status: 'Processed',
    confidence: 92,
  },
  {
    id: 'doc_2',
    name: 'Contract-ABC-456.pdf',
    type: 'Contract',
    date: '2025-02-10',
    status: 'Processed',
    confidence: 88,
  },
];

// ------------------- Workflows API -------------------
export interface Workflow {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  nextRun: string;
}

// Fetch workflows (mocked)
export async function fetchWorkflows(): Promise<Workflow[]> {
  return mockWorkflows;
}

// Mock data for workflows
const mockWorkflows: Workflow[] = [
  {
    id: 'workflow_1',
    name: 'Invoice Processing',
    type: 'OCR & Data Extraction',
    status: 'Active',
    lastRun: '2025-02-20',
    nextRun: '2025-02-25',
  },
  {
    id: 'workflow_2',
    name: 'Contract Validation',
    type: 'AI Compliance Check',
    status: 'Completed',
    lastRun: '2025-02-18',
    nextRun: 'N/A',
  },
];

export default apiClient;
