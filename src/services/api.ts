// src/services/api.ts - Updated with Axios and Cancelled Status Support
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

  return "https://dashbar.barareca.co.id/api";
};
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
}

// Create axios instance
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': getApiKey()
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

// Helper function to handle status mapping for API calls
const mapStatusForAPI = (status: string): string => {
  // When requesting "rejected", we want to get both rejected and cancelled
  if (status === 'rejected') {
    return 'rejected,cancelled'; // Send comma-separated values to API
  }
  return status;
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
      // Map the status for API call
      const mappedStatus = mapStatusForAPI(status);
      params.status = mappedStatus;
    }

    try {
      const response = await apiClient.get<{ data: LeaveApplication[] }>('/leave-applications/status', { params });

      if (!response.data.data) {
        const applications = Array.isArray(response.data) ? response.data : [];
        return { data: applications as LeaveApplication[] };
      }

      // If we requested "rejected" status, we need to filter locally too
      // in case the API doesn't support comma-separated status values
      let applications = response.data.data;
      
      if (status === 'rejected') {
        applications = applications.filter(app => {
          const appStatus = app.status?.toLowerCase();
          return appStatus === 'rejected' || appStatus === 'cancelled';
        });
      }

      return { data: applications };
    } catch (error) {
      // Fallback: if API doesn't support comma-separated status,
      // try separate requests and combine results
      if (status === 'rejected') {
        try {
          const [rejectedResponse, cancelledResponse] = await Promise.allSettled([
            apiClient.get<{ data: LeaveApplication[] }>('/leave-applications/status', { 
              params: { status: 'rejected' } 
            }),
            apiClient.get<{ data: LeaveApplication[] }>('/leave-applications/status', { 
              params: { status: 'cancelled' } 
            })
          ]);

          const rejectedData = rejectedResponse.status === 'fulfilled' 
            ? rejectedResponse.value.data.data || []
            : [];
          
          const cancelledData = cancelledResponse.status === 'fulfilled' 
            ? cancelledResponse.value.data.data || []
            : [];

          // Combine and deduplicate by ID
          const combined = [...rejectedData, ...cancelledData];
          const unique = combined.filter((app, index, self) => 
            index === self.findIndex(a => a.id === app.id)
          );

          return { data: unique };
        } catch {
          throw error; // Throw original error if fallback also fails
        }
      }
      
      throw error;
    }
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