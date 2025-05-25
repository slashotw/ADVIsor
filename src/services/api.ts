import axios from 'axios';
import { appConfig } from '../config/app';

// 建立 axios 實例
const api = axios.create({
  baseURL: appConfig.api.baseURL,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 添加認證 token（如果存在）
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除過期的 token
      localStorage.removeItem('authToken');
      // 可以在這裡重定向到登入頁面
    }
    return Promise.reject(error);
  }
);

// AD 相關 API
export const adApi = {
  // 測試 AD 連線
  testConnection: () => api.get('/ad/connection/test'),
  
  // 獲取連線狀態
  getConnectionStatus: () => api.get('/ad/connection/status'),
  
  // 獲取使用者列表
  getUsers: (params?: { search?: string; limit?: number; offset?: number }) => 
    api.get('/ad/users', { params }),
  
  // 獲取群組列表
  getGroups: (params?: { search?: string; limit?: number; offset?: number }) => 
    api.get('/ad/groups', { params }),
  
  // 獲取組織單位
  getOrganizationalUnits: () => api.get('/ad/organizational-units'),
  
  // 獲取稽核日誌
  getAuditLogs: (params?: { 
    search?: string; 
    severity?: string; 
    category?: string; 
    dateFrom?: string; 
    dateTo?: string; 
    limit?: number; 
    offset?: number 
  }) => api.get('/ad/audit-logs', { params }),
  
  // 獲取儀表板統計
  getDashboardStats: () => api.get('/ad/dashboard/stats')
};

// 認證相關 API
export const authApi = {
  // 登入
  login: (credentials: { username: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  // 驗證 token
  verifyToken: () => api.get('/auth/verify')
};

// 健康檢查
export const healthCheck = () => api.get('/health');

export default api; 