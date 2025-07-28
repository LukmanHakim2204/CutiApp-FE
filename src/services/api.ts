// src/services/api.ts - Updated with Axios
import axios, { type AxiosResponse, AxiosError } from 'axios';
import type {
  ApiErrorResponse,
  CreateLeaveApplicationRequest,
  DashboardData,
  LeaveApplication,
  LeaveType,
  UpdateLeaveApplicationRequest,
  User
} from '../types/type';

// Konfigurasi API
const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  return "http://localhost:8000/api";
};

// Create axios instance
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor untuk menambahkan auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.href = "/";
    }

    let errorMessage = "Network Error";

    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse;
      errorMessage = errorData.message || errorData.error || `HTTP ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user_data");
  return !!(token && userData);
};

// Get current user data
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};


// API Service
export const apiService = {
  async checkAuth(): Promise<boolean> {
    if (!isAuthenticated()) {
      return false;
    }
    try {
      const response = await apiClient.get('/user');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  async getDashboardData(): Promise<DashboardData> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }
    const response = await apiClient.get<DashboardData>('/statistics');
    return response.data;
  },

  async getLeaveApplications(status = ""): Promise<{ data: LeaveApplication[] }> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const params: Record<string, string> = {};
    if (status && status !== "all") {
      params.status = status;
    }

    const response = await apiClient.get<{ data: LeaveApplication[] }>('/leave-applications/status', { params });

    if (!response.data.data) {
      const applications = Array.isArray(response.data) ? response.data : [];
      return { data: applications as LeaveApplication[] };
    }

    return response.data;
  },

  async createLeaveApplication(data: CreateLeaveApplicationRequest): Promise<LeaveApplication> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient.post<LeaveApplication | { data: LeaveApplication }>('/leave-applications', data);

    if ('data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  async updateLeaveApplication(id: number, data: UpdateLeaveApplicationRequest): Promise<LeaveApplication> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient.put<LeaveApplication | { data: LeaveApplication }>(`/leave-applications/${id}`, data);

    if ('data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  async getLeaveTypes(): Promise<LeaveType[]> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient.get<LeaveType[] | { data: LeaveType[] }>('/leavetypes');

    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.data;
  },

  async getUserProfile(): Promise<User> {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient.get<User | { data: User }>('/user');

    if ('data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
};

export { apiClient };
