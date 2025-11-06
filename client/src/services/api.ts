import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { notify } from '../utils/notifier';
import type {
  APIResponse,
  User,
  LoginResponse,
  RegisterResponse,
  Document,
  DocumentUploadResponse,
  Workflow,
  NLPResponse,
  EntityExtractionResponse,
  OCRResponse,
  APIError
} from '../types';

class APIClient {
  private client: AxiosInstance;
  private static instance: APIClient;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
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

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIError>) => {
        const errorMessage = this.extractErrorMessage(error);
        console.error('API Error:', errorMessage);
        // Fire-and-forget notification (notify returns void)
        notify({ message: errorMessage, severity: 'error' });
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private extractErrorMessage(error: AxiosError<APIError>): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    return 'An unexpected error occurred';
  }

  // Auth APIs
  public async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<APIResponse<LoginResponse>>('/auth/login', { email, password });
    return response.data.data;
  }

  public async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await this.client.post<APIResponse<RegisterResponse>>('/auth/register', { name, email, password });
    return response.data.data;
  }

  public async getUserProfile(): Promise<User> {
    const response = await this.client.get<APIResponse<User>>('/users/profile');
    return response.data.data;
  }

  public async logout(): Promise<void> {
    await this.client.post<APIResponse<void>>('/auth/logout');
  }

  // Document APIs
  public async getDocuments(): Promise<Document[]> {
    const response = await this.client.get<APIResponse<Document[]>>('/documents');
    return response.data.data;
  }

  public async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<APIResponse<DocumentUploadResponse>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // Fire-and-forget notification (notify returns void)
    notify({ message: 'Document uploaded successfully', severity: 'success' });
    
    return response.data.data;
  }

  public async getDocumentById(id: string): Promise<Document> {
    const response = await this.client.get<APIResponse<Document>>(`/documents/${id}`);
    return response.data.data;
  }

  // NLP APIs
  public async processText(text: string): Promise<NLPResponse> {
    const response = await this.client.post<APIResponse<NLPResponse>>('/nlp/process', { text });
    return response.data.data;
  }

  public async extractEntities(text: string): Promise<EntityExtractionResponse> {
    const response = await this.client.post<APIResponse<EntityExtractionResponse>>('/nlp/entities', { text });
    return response.data.data;
  }

  // OCR APIs
  public async processOCR(file: File): Promise<OCRResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<APIResponse<OCRResponse>>('/ocr/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  public async getOCRResult(documentId: string): Promise<OCRResponse> {
    const response = await this.client.get<APIResponse<OCRResponse>>(`/ocr/result/${documentId}`);
    return response.data.data;
  }

  // Workflow APIs
  public async getWorkflows(): Promise<Workflow[]> {
    const response = await this.client.get<APIResponse<Workflow[]>>('/workflows');
    return response.data.data;
  }
}

// Export singleton instance
export const api = APIClient.getInstance();