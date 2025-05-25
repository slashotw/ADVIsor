// 應用程式配置
export const appConfig = {
  // API 設定
  api: {
    // 是否啟用 API 連線（設為 false 則只使用模擬數據）
    enabled: true,
    
    // API 基礎 URL
    baseURL: '/api',
    
    // 請求超時時間（毫秒）
    timeout: 10000,
    
    // 是否在 API 失敗時自動回退到模擬數據
    fallbackToMockData: true
  },

  // 模擬數據設定
  mockData: {
    // 是否啟用模擬延遲
    enableDelay: true,
    
    // 模擬延遲時間（毫秒）
    delayTime: 1000,
    
    // 是否顯示模擬數據警告
    showWarning: true
  },

  // 功能開關
  features: {
    // 是否啟用 AD 連線測試
    enableADConnectionTest: true,
    
    // 是否啟用實時數據更新
    enableRealTimeUpdates: false,
    
    // 是否啟用離線模式
    enableOfflineMode: true
  },

  // UI 設定
  ui: {
    // 預設主題
    theme: 'light',
    
    // 是否顯示除錯資訊
    showDebugInfo: false,
    
    // 分頁大小
    pageSize: 20
  }
};

// 環境檢測
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// 動態配置更新函數
export const updateConfig = (newConfig: Partial<typeof appConfig>) => {
  Object.assign(appConfig, newConfig);
  
  // 保存到 localStorage
  localStorage.setItem('advicer-config', JSON.stringify(appConfig));
};

// 從 localStorage 載入配置
export const loadConfig = () => {
  try {
    const savedConfig = localStorage.getItem('advicer-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      Object.assign(appConfig, parsed);
    }
  } catch (error) {
    console.warn('無法載入保存的配置:', error);
  }
};

// 重置配置到預設值
export const resetConfig = () => {
  localStorage.removeItem('advicer-config');
  // 這裡可以重新載入頁面或重新初始化配置
};

// 初始化配置
loadConfig(); 