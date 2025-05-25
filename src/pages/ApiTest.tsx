import { useState } from 'react';
import { Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { adApi, authApi, healthCheck } from '../services/api';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export function ApiTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (name: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      } else {
        return [...prev, { name, status, message, data }];
      }
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // 測試 1: 健康檢查
    updateTestResult('健康檢查', 'pending', '正在檢查後端服務狀態...');
    try {
      const response = await healthCheck();
      updateTestResult('健康檢查', 'success', '後端服務正常運行', response.data);
    } catch (error) {
      updateTestResult('健康檢查', 'error', `後端服務無法連線: ${error}`);
    }

    // 測試 2: AD 連線測試
    updateTestResult('AD 連線測試', 'pending', '正在測試 AD 連線...');
    try {
      const response = await adApi.testConnection();
      const result = response.data as { success: boolean; message: string };
      if (result.success) {
        updateTestResult('AD 連線測試', 'success', result.message, response.data);
      } else {
        updateTestResult('AD 連線測試', 'error', result.message, response.data);
      }
    } catch (error) {
      updateTestResult('AD 連線測試', 'error', `AD 連線測試失敗: ${error}`);
    }

    // 測試 3: 獲取使用者列表
    updateTestResult('使用者列表', 'pending', '正在獲取使用者列表...');
    try {
      const response = await adApi.getUsers({ limit: 5 });
      updateTestResult('使用者列表', 'success', `成功獲取 ${response.data.length} 個使用者`, response.data);
    } catch (error) {
      updateTestResult('使用者列表', 'error', `獲取使用者列表失敗: ${error}`);
    }

    // 測試 4: 獲取群組列表
    updateTestResult('群組列表', 'pending', '正在獲取群組列表...');
    try {
      const response = await adApi.getGroups({ limit: 5 });
      updateTestResult('群組列表', 'success', `成功獲取 ${response.data.length} 個群組`, response.data);
    } catch (error) {
      updateTestResult('群組列表', 'error', `獲取群組列表失敗: ${error}`);
    }

    // 測試 5: 獲取儀表板統計
    updateTestResult('儀表板統計', 'pending', '正在獲取儀表板統計...');
    try {
      const response = await adApi.getDashboardStats();
      updateTestResult('儀表板統計', 'success', '成功獲取儀表板統計', response.data);
    } catch (error) {
      updateTestResult('儀表板統計', 'error', `獲取儀表板統計失敗: ${error}`);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API 連線測試</h1>
          <p className="mt-1 text-sm text-gray-500">
            測試前端與後端 API 的連線狀態
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Server className="h-4 w-4 mr-2" />
          {isRunning ? '測試中...' : '開始測試'}
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">測試結果</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <h3 className="ml-3 text-sm font-medium text-gray-900">
                      {result.name}
                    </h3>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    result.status === 'success' ? 'bg-green-100 text-green-800' :
                    result.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status === 'success' ? '成功' :
                     result.status === 'error' ? '失敗' : '進行中'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{result.message}</p>
                {result.data && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                      查看詳細資料
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">使用說明</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>1. 確保後端伺服器正在運行（預設端口：3001）</p>
          <p>2. 點擊「開始測試」按鈕執行所有 API 測試</p>
          <p>3. 查看每個測試的結果狀態</p>
          <p>4. 如果測試失敗，請檢查：</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>後端伺服器是否正在運行</li>
            <li>網路連線是否正常</li>
            <li>CORS 設定是否正確</li>
            <li>API 端點是否可訪問</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 