import { useState, useEffect } from 'react';
import { Server, Shield, Bell, Monitor, Database, Key, Users, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { adApi } from '../services/api';

// Settings interfaces
interface ADConnectionSettings {
  domainController: string;
  port: number;
  useSSL: boolean;
  baseDN: string;
  serviceAccount: string;
  connectionTimeout: number;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: Date;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  historyCount: number;
  lockoutThreshold: number;
  lockoutDuration: number;
}

interface SecuritySettings {
  enableMFA: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  enableAuditLogging: boolean;
  logRetentionDays: number;
  enableRiskAnalysis: boolean;
  alertThreshold: 'Low' | 'Medium' | 'High';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  webhookUrl: string;
  notifyOnUserCreation: boolean;
  notifyOnPermissionChange: boolean;
  notifyOnSecurityAlert: boolean;
  adminEmails: string[];
}

// Mock data
const mockADSettings: ADConnectionSettings = {
  domainController: 'dc01.company.com',
  port: 636,
  useSSL: true,
  baseDN: 'DC=company,DC=com',
  serviceAccount: 'svc-admanager@company.com',
  connectionTimeout: 30,
  status: 'Connected',
  lastSync: new Date('2024-01-15T10:30:00')
};

const mockPasswordPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90,
  historyCount: 12,
  lockoutThreshold: 5,
  lockoutDuration: 30
};

const mockSecuritySettings: SecuritySettings = {
  enableMFA: true,
  sessionTimeout: 480,
  maxLoginAttempts: 3,
  enableAuditLogging: true,
  logRetentionDays: 365,
  enableRiskAnalysis: true,
  alertThreshold: 'Medium'
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  webhookUrl: 'https://hooks.company.com/ad-alerts',
  notifyOnUserCreation: true,
  notifyOnPermissionChange: true,
  notifyOnSecurityAlert: true,
  adminEmails: ['admin@company.com', 'security@company.com']
};

export function Settings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connection' | 'password' | 'security' | 'notifications' | 'monitoring'>('connection');
  const [adSettings, setAdSettings] = useState<ADConnectionSettings>(mockADSettings);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(mockPasswordPolicy);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = () => {
    // 模擬保存設定
    console.log('Saving settings...');
    setHasChanges(false);
    // 實際應用中會調用 API
  };

  const testConnection = async () => {
    try {
      console.log('Testing AD connection...');
      setAdSettings(prev => ({ ...prev, status: 'Disconnected' }));
      
      const response = await adApi.testConnection();
      const result = response.data as { success: boolean; message: string; timestamp: string };
      
      if (result.success) {
        setAdSettings(prev => ({ 
          ...prev, 
          status: 'Connected',
          lastSync: new Date(result.timestamp)
        }));
        console.log('AD connection successful');
      } else {
        setAdSettings(prev => ({ 
          ...prev, 
          status: 'Error'
        }));
        console.error('AD connection failed:', result.message);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setAdSettings(prev => ({ 
        ...prev, 
        status: 'Error'
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入系統設定中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
        <p className="mt-1 text-sm text-gray-500">
            配置 AD 連線、安全政策和系統參數
          </p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && (
            <button 
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Save className="h-4 w-4 mr-2" />
              儲存變更
            </button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${adSettings.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}>
                  <Server className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AD 連線狀態</dt>
                  <dd className="text-lg font-medium text-gray-900">{adSettings.status}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${securitySettings.enableMFA ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">多因素驗證</dt>
                  <dd className="text-lg font-medium text-gray-900">{securitySettings.enableMFA ? '啟用' : '停用'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${securitySettings.enableAuditLogging ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <Monitor className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">稽核日誌</dt>
                  <dd className="text-lg font-medium text-gray-900">{securitySettings.enableAuditLogging ? '啟用' : '停用'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${notificationSettings.emailNotifications ? 'bg-purple-500' : 'bg-gray-500'}`}>
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">通知服務</dt>
                  <dd className="text-lg font-medium text-gray-900">{notificationSettings.emailNotifications ? '啟用' : '停用'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('connection')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'connection'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AD 連線
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              密碼政策
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              安全設定
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              通知設定
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitoring'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              系統監控
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">AD 伺服器設定</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">網域控制器</label>
                    <input
                      type="text"
                      value={adSettings.domainController}
                      onChange={(e) => {
                        setAdSettings(prev => ({ ...prev, domainController: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">連接埠</label>
                      <input
                        type="number"
                        value={adSettings.port}
                        onChange={(e) => {
                          setAdSettings(prev => ({ ...prev, port: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">連線逾時 (秒)</label>
                      <input
                        type="number"
                        value={adSettings.connectionTimeout}
                        onChange={(e) => {
                          setAdSettings(prev => ({ ...prev, connectionTimeout: parseInt(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">基礎 DN</label>
                    <input
                      type="text"
                      value={adSettings.baseDN}
                      onChange={(e) => {
                        setAdSettings(prev => ({ ...prev, baseDN: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">服務帳戶</label>
                    <input
                      type="text"
                      value={adSettings.serviceAccount}
                      onChange={(e) => {
                        setAdSettings(prev => ({ ...prev, serviceAccount: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={adSettings.useSSL}
                      onChange={(e) => {
                        setAdSettings(prev => ({ ...prev, useSSL: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      使用 SSL/TLS 加密連線
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">連線狀態</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        adSettings.status === 'Connected' ? 'bg-green-500' : 
                        adSettings.status === 'Error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        狀態: {adSettings.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>最後同步: {adSettings.lastSync.toLocaleString('zh-TW')}</div>
                      <div>伺服器: {adSettings.domainController}:{adSettings.port}</div>
                      <div>加密: {adSettings.useSSL ? 'SSL/TLS' : '無'}</div>
                    </div>
                  </div>

                  <button
                    onClick={testConnection}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    測試連線
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">密碼複雜度要求</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">最小長度</label>
                    <input
                      type="number"
                      min="6"
                      max="128"
                      value={passwordPolicy.minLength}
                      onChange={(e) => {
                        setPasswordPolicy(prev => ({ ...prev, minLength: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passwordPolicy.requireUppercase}
                        onChange={(e) => {
                          setPasswordPolicy(prev => ({ ...prev, requireUppercase: e.target.checked }));
                          setHasChanges(true);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        需要大寫字母
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passwordPolicy.requireLowercase}
                        onChange={(e) => {
                          setPasswordPolicy(prev => ({ ...prev, requireLowercase: e.target.checked }));
                          setHasChanges(true);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        需要小寫字母
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passwordPolicy.requireNumbers}
                        onChange={(e) => {
                          setPasswordPolicy(prev => ({ ...prev, requireNumbers: e.target.checked }));
                          setHasChanges(true);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        需要數字
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passwordPolicy.requireSpecialChars}
                        onChange={(e) => {
                          setPasswordPolicy(prev => ({ ...prev, requireSpecialChars: e.target.checked }));
                          setHasChanges(true);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        需要特殊字元
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">密碼有效期 (天)</label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={passwordPolicy.maxAge}
                      onChange={(e) => {
                        setPasswordPolicy(prev => ({ ...prev, maxAge: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">密碼歷史記錄</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={passwordPolicy.historyCount}
                      onChange={(e) => {
                        setPasswordPolicy(prev => ({ ...prev, historyCount: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">防止重複使用最近的密碼</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">帳戶鎖定閾值</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={passwordPolicy.lockoutThreshold}
                      onChange={(e) => {
                        setPasswordPolicy(prev => ({ ...prev, lockoutThreshold: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">失敗登入次數達到此值時鎖定帳戶</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">鎖定持續時間 (分鐘)</label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={passwordPolicy.lockoutDuration}
                      onChange={(e) => {
                        setPasswordPolicy(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">安全設定</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableMFA}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, enableMFA: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用多因素驗證 (MFA)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">工作階段逾時 (分鐘)</label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">最大登入嘗試次數</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAuditLogging}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, enableAuditLogging: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用稽核日誌
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">日誌保留天數</label>
                    <input
                      type="number"
                      min="30"
                      max="2555"
                      value={securitySettings.logRetentionDays}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, logRetentionDays: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableRiskAnalysis}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, enableRiskAnalysis: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用風險分析
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">警示閾值</label>
                    <select
                      value={securitySettings.alertThreshold}
                      onChange={(e) => {
                        setSecuritySettings(prev => ({ ...prev, alertThreshold: e.target.value as any }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Low">低</option>
                      <option value="Medium">中</option>
                      <option value="High">高</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">通知設定</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用電子郵件通知
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用簡訊通知
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
                    <input
                      type="url"
                      value={notificationSettings.webhookUrl}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, webhookUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://hooks.example.com/webhook"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">通知事件</h4>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnUserCreation}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, notifyOnUserCreation: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      使用者建立
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnPermissionChange}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, notifyOnPermissionChange: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      權限變更
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnSecurityAlert}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ ...prev, notifyOnSecurityAlert: e.target.checked }));
                        setHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      安全警示
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">管理員電子郵件</label>
                    <textarea
                      rows={3}
                      value={notificationSettings.adminEmails.join('\n')}
                      onChange={(e) => {
                        setNotificationSettings(prev => ({ 
                          ...prev, 
                          adminEmails: e.target.value.split('\n').filter(email => email.trim()) 
                        }));
                        setHasChanges(true);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="admin@company.com&#10;security@company.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">每行一個電子郵件地址</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">系統監控</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">系統效能</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CPU 使用率</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">記憶體使用率</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">磁碟使用率</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">服務狀態</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">AD 連線服務</span>
                      </div>
                      <span className="text-xs text-green-600">正常</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">稽核服務</span>
                      </div>
                      <span className="text-xs text-green-600">正常</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">通知服務</span>
                      </div>
                      <span className="text-xs text-green-600">正常</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">備份服務</span>
                      </div>
                      <span className="text-xs text-yellow-600">警告</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">最近事件</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">系統啟動完成</div>
                      <div className="text-xs text-gray-500">2024-01-15 08:30:00</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">備份服務延遲</div>
                      <div className="text-xs text-gray-500">2024-01-15 07:45:00</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Monitor className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">定期健康檢查完成</div>
                      <div className="text-xs text-gray-500">2024-01-15 06:00:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 