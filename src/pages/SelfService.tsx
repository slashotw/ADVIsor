import { useState, useEffect } from 'react';
import { Key, User, Users, Shield, Clock, CheckCircle, XCircle, AlertTriangle, Plus, Search } from 'lucide-react';

// Self-service request types
interface SelfServiceRequest {
  id: string;
  type: 'PasswordReset' | 'ProfileUpdate' | 'GroupAccess' | 'PermissionRequest';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  requestedBy: string;
  requestDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  details: any;
  justification?: string;
  priority: 'Low' | 'Medium' | 'High';
}

// Mock data
const mockRequests: SelfServiceRequest[] = [
  {
    id: '1',
    type: 'PasswordReset',
    status: 'Completed',
    requestedBy: 'john.doe@company.com',
    requestDate: new Date('2024-01-15T10:30:00'),
    approvedBy: 'system',
    approvalDate: new Date('2024-01-15T10:31:00'),
    details: {
      reason: '忘記密碼',
      verificationMethod: 'Email'
    },
    priority: 'High'
  },
  {
    id: '2',
    type: 'GroupAccess',
    status: 'Pending',
    requestedBy: 'jane.smith@company.com',
    requestDate: new Date('2024-01-15T09:15:00'),
    details: {
      groupName: 'Finance-Managers',
      accessType: 'Member',
      duration: 'Permanent'
    },
    justification: '升職為財務經理，需要存取財務管理系統',
    priority: 'Medium'
  },
  {
    id: '3',
    type: 'PermissionRequest',
    status: 'Approved',
    requestedBy: 'bob.wilson@company.com',
    requestDate: new Date('2024-01-14T14:20:00'),
    approvedBy: 'security.admin@company.com',
    approvalDate: new Date('2024-01-14T16:45:00'),
    details: {
      resource: 'HR Database',
      accessLevel: 'Read',
      duration: '30 days',
      purpose: '年度績效評估'
    },
    justification: '需要查閱員工資料進行年度績效評估',
    priority: 'Medium'
  },
  {
    id: '4',
    type: 'ProfileUpdate',
    status: 'Rejected',
    requestedBy: 'alice.brown@company.com',
    requestDate: new Date('2024-01-13T11:30:00'),
    approvedBy: 'hr.admin@company.com',
    approvalDate: new Date('2024-01-13T15:20:00'),
    details: {
      field: 'Department',
      oldValue: 'Marketing',
      newValue: 'Sales',
      reason: '部門調動'
    },
    justification: '因組織調整需要更新部門資訊',
    priority: 'Low'
  }
];

const serviceCategories = [
  {
    id: 'password',
    name: '密碼服務',
    description: '重設密碼、變更密碼',
    icon: Key,
    color: 'bg-blue-500',
    services: [
      { name: '重設密碼', description: '忘記密碼時重設', available: true },
      { name: '變更密碼', description: '主動變更密碼', available: true },
      { name: '解鎖帳戶', description: '帳戶被鎖定時解鎖', available: true }
    ]
  },
  {
    id: 'profile',
    name: '個人資料',
    description: '更新個人資訊',
    icon: User,
    color: 'bg-green-500',
    services: [
      { name: '更新聯絡資訊', description: '電話、地址等', available: true },
      { name: '更新部門資訊', description: '部門調動申請', available: true },
      { name: '更新職位資訊', description: '職位變更申請', available: false }
    ]
  },
  {
    id: 'access',
    name: '存取權限',
    description: '申請系統存取權限',
    icon: Shield,
    color: 'bg-purple-500',
    services: [
      { name: '申請群組存取', description: '加入特定群組', available: true },
      { name: '申請系統權限', description: '特定系統存取權', available: true },
      { name: '申請檔案權限', description: '檔案夾存取權', available: true }
    ]
  },
  {
    id: 'group',
    name: '群組管理',
    description: '群組相關申請',
    icon: Users,
    color: 'bg-orange-500',
    services: [
      { name: '建立群組', description: '申請建立新群組', available: true },
      { name: '群組成員管理', description: '新增/移除成員', available: false },
      { name: '群組權限申請', description: '申請群組權限', available: true }
    ]
  }
];

export function SelfService() {
  const [requests, setRequests] = useState<SelfServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'PasswordReset' | 'ProfileUpdate' | 'GroupAccess' | 'PermissionRequest'>('all');
  const [activeTab, setActiveTab] = useState<'services' | 'requests' | 'history'>('services');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'PasswordReset':
        return '密碼重設';
      case 'ProfileUpdate':
        return '個人資料更新';
      case 'GroupAccess':
        return '群組存取申請';
      case 'PermissionRequest':
        return '權限申請';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入自助服務資料中...</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(req => req.status === 'Pending').length;
  const approvedCount = requests.filter(req => req.status === 'Approved').length;
  const completedCount = requests.filter(req => req.status === 'Completed').length;
  const rejectedCount = requests.filter(req => req.status === 'Rejected').length;

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">自助服務入口</h1>
        <p className="mt-1 text-sm text-gray-500">
          使用者自助密碼重設和個人資料管理
        </p>
      </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowRequestForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增申請
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 p-3 rounded-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">待審核</dt>
                  <dd className="text-lg font-medium text-gray-900">{pendingCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-500 p-3 rounded-md">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">已核准</dt>
                  <dd className="text-lg font-medium text-gray-900">{approvedCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 p-3 rounded-md">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">已完成</dt>
                  <dd className="text-lg font-medium text-gray-900">{completedCount}</dd>
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
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">已拒絕</dt>
                  <dd className="text-lg font-medium text-gray-900">{rejectedCount}</dd>
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
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              服務目錄
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              我的申請
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              歷史記錄
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {serviceCategories.map((category) => (
                  <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className={`${category.color} p-3 rounded-md mr-4`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {category.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-xs text-gray-500">{service.description}</div>
                          </div>
                          <button
                            disabled={!service.available}
                            onClick={() => {
                              setSelectedService(service.name);
                              setShowRequestForm(true);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              service.available
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {service.available ? '申請' : '暫停'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋申請..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                  >
                    <option value="all">所有狀態</option>
                    <option value="Pending">待審核</option>
                    <option value="Approved">已核准</option>
                    <option value="Rejected">已拒絕</option>
                    <option value="Completed">已完成</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                  >
                    <option value="all">所有類型</option>
                    <option value="PasswordReset">密碼重設</option>
                    <option value="ProfileUpdate">個人資料更新</option>
                    <option value="GroupAccess">群組存取申請</option>
                    <option value="PermissionRequest">權限申請</option>
                  </select>
                </div>
              </div>

              {/* Requests Table */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申請
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申請日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        審核者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        優先級
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {getStatusIcon(request.status)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getTypeDisplayName(request.type)}
                              </div>
                              <div className="text-sm text-gray-500">ID: {request.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.requestDate.toLocaleDateString('zh-TW')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.approvedBy || '待指派'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.priority === 'High' ? 'bg-red-100 text-red-800' :
                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">
                            檢視
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">申請統計</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
                    <div className="text-sm text-gray-500">總申請數</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                    <div className="text-sm text-gray-500">已核准</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                    <div className="text-sm text-gray-500">已拒絕</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {Math.round((approvedCount / requests.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">核准率</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">最近申請</h3>
                <div className="space-y-4">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getStatusIcon(request.status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getTypeDisplayName(request.type)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.requestDate.toLocaleDateString('zh-TW')}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">新增申請</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">申請類型</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">請選擇申請類型</option>
                    <option value="PasswordReset">密碼重設</option>
                    <option value="ProfileUpdate">個人資料更新</option>
                    <option value="GroupAccess">群組存取申請</option>
                    <option value="PermissionRequest">權限申請</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">申請說明</label>
                  <textarea 
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="請詳細說明您的申請需求..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">業務理由</label>
                  <textarea 
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="請說明申請的業務理由..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">優先級</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="Low">低</option>
                    <option value="Medium">中</option>
                    <option value="High">高</option>
                  </select>
                </div>
              </form>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  提交申請
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 