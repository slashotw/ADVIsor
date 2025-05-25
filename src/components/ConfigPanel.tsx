import { useState } from 'react';
import { Settings, Database, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { appConfig, updateConfig } from '../config/app';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigPanel({ isOpen, onClose }: ConfigPanelProps) {
  const [config, setConfig] = useState(appConfig);

  const handleConfigChange = (section: string, key: string, value: any) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [key]: value
      }
    };
    setConfig(newConfig);
    updateConfig(newConfig);
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              應用程式配置
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* API 設定 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                數據來源設定
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {config.api.enabled ? (
                      <Wifi className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      啟用 API 連線
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.api.enabled}
                      onChange={(e) => handleConfigChange('api', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {config.api.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API 基礎 URL
                      </label>
                      <input
                        type="text"
                        value={config.api.baseURL}
                        onChange={(e) => handleConfigChange('api', 'baseURL', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="/api"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        請求超時時間 (毫秒)
                      </label>
                      <input
                        type="number"
                        value={config.api.timeout}
                        onChange={(e) => handleConfigChange('api', 'timeout', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                        min="1000"
                        max="60000"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.api.fallbackToMockData}
                        onChange={(e) => handleConfigChange('api', 'fallbackToMockData', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        API 失敗時自動回退到模擬數據
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 模擬數據設定 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">模擬數據設定</h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.mockData.enableDelay}
                    onChange={(e) => handleConfigChange('mockData', 'enableDelay', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    啟用模擬延遲
                  </label>
                </div>

                {config.mockData.enableDelay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      延遲時間 (毫秒)
                    </label>
                    <input
                      type="number"
                      value={config.mockData.delayTime}
                      onChange={(e) => handleConfigChange('mockData', 'delayTime', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                      max="5000"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.mockData.showWarning}
                    onChange={(e) => handleConfigChange('mockData', 'showWarning', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    顯示模擬數據警告
                  </label>
                </div>
              </div>
            </div>

            {/* 功能開關 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">功能開關</h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.features.enableADConnectionTest}
                    onChange={(e) => handleConfigChange('features', 'enableADConnectionTest', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    啟用 AD 連線測試
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.features.enableOfflineMode}
                    onChange={(e) => handleConfigChange('features', 'enableOfflineMode', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    啟用離線模式
                  </label>
                </div>
              </div>
            </div>

            {/* 狀態指示 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">目前狀態</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  {config.api.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700">
                    數據來源: {config.api.enabled ? 'API + 模擬數據回退' : '僅模擬數據'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    離線模式: {config.features.enableOfflineMode ? '啟用' : '停用'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              關閉
            </button>
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
            >
              重新載入應用程式
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 