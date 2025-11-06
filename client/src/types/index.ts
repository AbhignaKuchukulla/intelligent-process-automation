// API Response Types
export interface APIResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentUploadResponse {
  id: string;
  name: string;
  status: string;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  nextRun: string;
  config?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// NLP Types
export interface NLPResponse {
  result: string;
  confidence: number;
  language?: string;
}

export interface EntityExtractionResponse {
  entities: Array<{
    text: string;
    type: string;
    confidence: number;
  }>;
}

// OCR Types
export interface OCRResponse {
  extractedText: string;
  confidence: number;
  pages: number;
  language?: string;
}

// Error Types
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}