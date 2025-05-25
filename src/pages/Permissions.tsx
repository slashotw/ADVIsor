import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Eye, Search, Filter, Download, RefreshCw } from 'lucide-react';
import type { Permission, User, Group } from '../types';

// Extended Permission interface for detailed view
interface DetailedPermission extends Permission {
  grantedToType: 'User' | 'Group';
  grantedToName: string;
  lastModified: Date;
  modifiedBy: string;
  isOverPrivileged?: boolean;
}

// Mock data
const mockPermissions: DetailedPermission[] = [
  {
    id: '1',
    resource: 'Domain Controllers',
    access: 'FullControl',
    inherited: false,
    grantedTo: 'IT-Administrators',
    grantedToType: 'Group',
    grantedToName: 'IT 管理員群組',
    lastModified: new Date('2024-01-10'),
    modifiedBy: 'admin@company.com',
    isOverPrivileged: false
  },
  {
    id: '2',
    resource: 'HR Database',
    access: 'Read',
    inherited: true,
    grantedTo: 'HR-Users',
    grantedToType: 'Group',
    grantedToName: 'HR 使用者群組',
    lastModified: new Date('2024-01-08'),
    modifiedBy: 'hr.admin@company.com',
    isOverPrivileged: false
  },
  {
    id: '3',
    resource: 'Finance System',
    access: 'FullControl',
    inherited: false,
    grantedTo: 'john.doe@company.com',
    grantedToType: 'User',
    grantedToName: 'John Doe',
    lastModified: new Date('2024-01-15'),
    modifiedBy: 'finance.admin@company.com',
    isOverPrivileged: true
  },
  {
    id: '4',
    resource: 'Company Intranet',
    access: 'Read',
    inherited: false,
    grantedTo: 'All-Employees',
    grantedToType: 'Group',
    grantedToName: '全體員工群組',
    lastModified: new Date('2024-01-05'),
    modifiedBy: 'admin@company.com',
    isOverPrivileged: false
  },
  {
    id: '5',
    resource: 'Backup System',
    access: 'Write',
    inherited: true,
    grantedTo: 'jane.smith@company.com',
    grantedToType: 'User',
    grantedToName: 'Jane Smith',
    lastModified: new Date('2024-01-12'),
    modifiedBy: 'it.admin@company.com',
    isOverPrivileged: true
  }
];

const mockRoles = [
  {
    id: '1',
    name: 'Domain Admin',
    description: '網域管理員角色',
    permissions: ['FullControl on Domain Controllers', 'FullControl on AD Users', 'FullControl on AD Groups'],
    assignedTo: ['admin@company.com'],
    riskLevel: 'Critical'
  },
  {
    id: '2',
    name: 'HR Manager',
    description: 'HR 管理員角色',
    permissions: ['Read/Write on HR Database', 'Read on Employee Records'],
    assignedTo: ['hr.admin@company.com', 'alice.brown@company.com'],
    riskLevel: 'Medium'
  },
  {
    id: '3',
    name: 'IT Support',
    description: 'IT 支援角色',
    permissions: ['Read on Computer Objects', 'Reset User Passwords'],
    assignedTo: ['support1@company.com', 'support2@company.com'],
    riskLevel: 'Low'
  }
];

export function Permissions() {
  const [permissions, setPermissions] = useState<DetailedPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccess, setFilterAccess] = useState<'all' | 'Read' | 'Write' | 'FullControl' | 'Deny'>('all');
  const [filterType, setFilterType] = useState<'all' | 'User' | 'Group'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'normal'>('all');
  const [activeTab, setActiveTab] = useState<'permissions' | 'roles' | 'audit'>('permissions');

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setPermissions(mockPermissions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.grantedToName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccess = filterAccess === 'all' || permission.access === filterAccess;
    const matchesType = filterType === 'all' || permission.grantedToType === filterType;
    const matchesRisk = filterRisk === 'all' || 
                       (filterRisk === 'high' && permission.isOverPrivileged) ||
                       (filterRisk === 'normal' && !permission.isOverPrivileged);
    
    return matchesSearch && matchesAccess && matchesType && matchesRisk;
  });

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'FullControl':
        return 'bg-red-100 text-red-800';
      case 'Write':
        return 'bg-yellow-100 text-yellow-800';
      case 'Read':
        return 'bg-green-100 text-green-800';
      case 'Deny':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入權限資料中...</p>
        </div>
      </div>
    );
  }

  const overPrivilegedCount = permissions.filter(p => p.isOverPrivileged).length;
  const totalPermissions = permissions.length;
  const inheritedCount = permissions.filter(p => p.inherited).length;

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">權限管理</h1>
        <p className="mt-1 text-sm text-gray-500">
            管理和稽核 Active Directory 權限與角色
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            重新掃描
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            匯出報告
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">總權限數</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalPermissions}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">過度權限</dt>
                  <dd className="text-lg font-medium text-gray-900">{overPrivilegedCount}</dd>
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
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">繼承權限</dt>
                  <dd className="text-lg font-medium text-gray-900">{inheritedCount}</dd>
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
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">風險評分</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round((overPrivilegedCount / totalPermissions) * 100)}%
                  </dd>
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
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              權限矩陣
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              角色管理
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              權限稽核
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋資源或使用者..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterAccess}
                    onChange={(e) => setFilterAccess(e.target.value as any)}
                  >
                    <option value="all">所有權限</option>
                    <option value="FullControl">完全控制</option>
                    <option value="Write">寫入</option>
                    <option value="Read">讀取</option>
                    <option value="Deny">拒絕</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                  >
                    <option value="all">所有類型</option>
                    <option value="User">使用者</option>
                    <option value="Group">群組</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as any)}
                  >
                    <option value="all">所有風險</option>
                    <option value="high">高風險</option>
                    <option value="normal">正常</option>
                  </select>
                </div>
              </div>

              {/* Permissions Table */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        資源
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        權限等級
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        授予對象
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繼承
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        風險
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最後修改
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPermissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{permission.resource}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccessColor(permission.access)}`}>
                            {permission.access}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                {permission.grantedToType === 'User' ? (
                                  <span className="text-xs font-medium text-gray-700">
                                    {permission.grantedToName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                ) : (
                                  <Users className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{permission.grantedToName}</div>
                              <div className="text-sm text-gray-500">{permission.grantedToType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            permission.inherited ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {permission.inherited ? '繼承' : '直接'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {permission.isOverPrivileged && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              高風險
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{permission.lastModified.toLocaleDateString('zh-TW')}</div>
                          <div className="text-xs text-gray-400">{permission.modifiedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            檢視
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            撤銷
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockRoles.map((role) => (
                  <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(role.riskLevel)}`}>
                        {role.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">權限</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {role.permissions.map((permission, index) => (
                          <li key={index} className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-gray-400" />
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        指派對象 ({role.assignedTo.length})
                      </h4>
                      <div className="space-y-1">
                        {role.assignedTo.map((user, index) => (
                          <div key={index} className="text-sm text-gray-600">{user}</div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        編輯
                      </button>
                      <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                        指派
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      發現 {overPrivilegedCount} 個過度權限問題
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>建議檢視並調整這些高風險權限設定，以降低安全風險。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">權限分佈</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">完全控制</span>
                      <span className="text-sm font-medium">
                        {permissions.filter(p => p.access === 'FullControl').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">寫入權限</span>
                      <span className="text-sm font-medium">
                        {permissions.filter(p => p.access === 'Write').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">讀取權限</span>
                      <span className="text-sm font-medium">
                        {permissions.filter(p => p.access === 'Read').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">風險評估</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">高風險權限</span>
                      <span className="text-sm font-medium text-red-600">{overPrivilegedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">繼承權限比例</span>
                      <span className="text-sm font-medium">
                        {Math.round((inheritedCount / totalPermissions) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">直接授予權限</span>
                      <span className="text-sm font-medium">
                        {totalPermissions - inheritedCount}
                      </span>
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
