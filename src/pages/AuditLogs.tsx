import { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, AlertTriangle, Eye, User, Activity, Clock } from 'lucide-react';
import type { AuditLog } from '../types';
import { adApi } from '../services/api';

// Extended AuditLog interface for detailed view
interface DetailedAuditLog extends AuditLog {
  ipAddress: string;
  userAgent: string;
  result: 'Success' | 'Failed' | 'Warning';
  category: 'UserManagement' | 'GroupManagement' | 'PermissionChange' | 'Login' | 'SystemConfig';
  riskScore: number;
}

// Mock data
const mockAuditLogs: DetailedAuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    action: '使用者建立',
    user: 'admin@company.com',
    target: 'john.doe@company.com',
    details: '新增使用者到 IT 部門，設定初始權限',
    severity: 'Low',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'Success',
    category: 'UserManagement',
    riskScore: 2
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T09:15:00'),
    action: '群組修改',
    user: 'hr.admin@company.com',
    target: 'HR-Managers',
    details: '新增 3 位成員到 HR 管理群組',
    severity: 'Medium',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'Success',
    category: 'GroupManagement',
    riskScore: 5
  },
  {
    id: '3',
    timestamp: new Date('2024-01-15T08:45:00'),
    action: '權限變更',
    user: 'security.admin@company.com',
    target: 'Finance-OU',
    details: '更新財務部門的存取權限，提升安全等級',
    severity: 'High',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'Success',
    category: 'PermissionChange',
    riskScore: 8
  },
  {
    id: '4',
    timestamp: new Date('2024-01-15T08:30:00'),
    action: '登入失敗',
    user: 'unknown@company.com',
    target: 'Domain Controller',
    details: '多次嘗試登入失敗，可能的暴力破解攻擊',
    severity: 'Critical',
    ipAddress: '203.0.113.45',
    userAgent: 'curl/7.68.0',
    result: 'Failed',
    category: 'Login',
    riskScore: 10
  },
  {
    id: '5',
    timestamp: new Date('2024-01-15T07:20:00'),
    action: '系統配置變更',
    user: 'admin@company.com',
    target: 'Password Policy',
    details: '更新密碼複雜度要求，啟用多因素驗證',
    severity: 'Medium',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'Success',
    category: 'SystemConfig',
    riskScore: 4
  },
  {
    id: '6',
    timestamp: new Date('2024-01-14T16:45:00'),
    action: '使用者停用',
    user: 'hr.admin@company.com',
    target: 'bob.wilson@company.com',
    details: '員工離職，停用帳戶並移除所有權限',
    severity: 'Low',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'Success',
    category: 'UserManagement',
    riskScore: 3
  }
];

export function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<DetailedAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Critical'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'UserManagement' | 'GroupManagement' | 'PermissionChange' | 'Login' | 'SystemConfig'>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'Success' | 'Failed' | 'Warning'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<DetailedAuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        // 嘗試從 API 獲取數據
        const response = await adApi.getAuditLogs();
        setAuditLogs(response.data as DetailedAuditLog[]);
        setLoading(false);
      } catch (error) {
        console.warn('API 無法連線，使用模擬數據:', error);
        // 如果 API 無法連線，使用模擬數據
        setTimeout(() => {
          setAuditLogs(mockAuditLogs);
          setLoading(false);
        }, 1000);
      }
    };

    fetchAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesResult = filterResult === 'all' || log.result === filterResult;
    
    // Date range filter
    const now = new Date();
    const logDate = new Date(log.timestamp);
    let matchesDate = true;
    
    if (dateRange === 'today') {
      matchesDate = logDate.toDateString() === now.toDateString();
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= monthAgo;
    }
    
    return matchesSearch && matchesSeverity && matchesCategory && matchesResult && matchesDate;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'UserManagement':
        return <User className="h-4 w-4" />;
      case 'GroupManagement':
        return <User className="h-4 w-4" />;
      case 'PermissionChange':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Login':
        return <Activity className="h-4 w-4" />;
      case 'SystemConfig':
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入稽核日誌中...</p>
        </div>
      </div>
    );
  }

  const criticalCount = auditLogs.filter(log => log.severity === 'Critical').length;
  const failedCount = auditLogs.filter(log => log.result === 'Failed').length;
  const highRiskCount = auditLogs.filter(log => log.riskScore >= 8).length;

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">稽核日誌</h1>
        <p className="mt-1 text-sm text-gray-500">
            查看和分析 AD 操作記錄與安全事件
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            自訂日期
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            匯出日誌
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 p-3 rounded-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">總事件數</dt>
                  <dd className="text-lg font-medium text-gray-900">{auditLogs.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-red-500 p-3 rounded-md">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">嚴重事件</dt>
                  <dd className="text-lg font-medium text-gray-900">{criticalCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-orange-500 p-3 rounded-md">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">失敗操作</dt>
                  <dd className="text-lg font-medium text-gray-900">{failedCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-500 p-3 rounded-md">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">高風險事件</dt>
                  <dd className="text-lg font-medium text-gray-900">{highRiskCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋日誌..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
            >
              <option value="all">所有嚴重性</option>
              <option value="Critical">嚴重</option>
              <option value="High">高</option>
              <option value="Medium">中</option>
              <option value="Low">低</option>
            </select>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="all">所有類別</option>
              <option value="UserManagement">使用者管理</option>
              <option value="GroupManagement">群組管理</option>
              <option value="PermissionChange">權限變更</option>
              <option value="Login">登入事件</option>
              <option value="SystemConfig">系統配置</option>
            </select>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value as any)}
            >
              <option value="all">所有結果</option>
              <option value="Success">成功</option>
              <option value="Failed">失敗</option>
              <option value="Warning">警告</option>
            </select>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="all">所有時間</option>
              <option value="today">今天</option>
              <option value="week">過去一週</option>
              <option value="month">過去一個月</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                目標
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                結果
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                嚴重性
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                風險評分
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{log.timestamp.toLocaleDateString('zh-TW')}</div>
                  <div className="text-xs text-gray-500">
                    {log.timestamp.toLocaleTimeString('zh-TW')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getCategoryIcon(log.category)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.action}</div>
                      <div className="text-xs text-gray-500">{log.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.user}</div>
                  <div className="text-xs text-gray-500">{log.ipAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(log.result)}`}>
                    {log.result}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getRiskScoreColor(log.riskScore)}`}>
                    {log.riskScore}/10
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setSelectedLog(log);
                      setShowDetails(true);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一頁
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一頁
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              顯示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredLogs.length}</span> 筆，
              共 <span className="font-medium">{filteredLogs.length}</span> 筆結果
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                上一頁
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                下一頁
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">稽核日誌詳細資訊</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">時間</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.timestamp.toLocaleString('zh-TW')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">操作</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">使用者</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.user}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">目標</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.target}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP 位址</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">風險評分</label>
                    <p className={`mt-1 text-sm font-medium ${getRiskScoreColor(selectedLog.riskScore)}`}>
                      {selectedLog.riskScore}/10
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">詳細描述</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.details}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">使用者代理</label>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedLog.userAgent}</p>
                </div>
                
                <div className="flex space-x-4">
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(selectedLog.result)}`}>
                      {selectedLog.result}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 