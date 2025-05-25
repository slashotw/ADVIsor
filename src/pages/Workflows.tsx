import { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, XCircle, Clock, User, AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import type { WorkflowTask } from '../types';

// Extended WorkflowTask interface
interface ExtendedWorkflowTask extends WorkflowTask {
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedTime: number; // in hours
  actualTime?: number;
  approvers: string[];
  currentApprover?: string;
  comments: string[];
  attachments: string[];
}

// Mock data
const mockWorkflowTasks: ExtendedWorkflowTask[] = [
  {
    id: '1',
    type: 'UserCreation',
    status: 'Pending',
    requestedBy: 'hr.admin@company.com',
    assignedTo: 'it.admin@company.com',
    createdDate: new Date('2024-01-15T09:00:00'),
    dueDate: new Date('2024-01-16T17:00:00'),
    details: {
      userName: 'new.employee@company.com',
      department: 'Marketing',
      position: '行銷專員',
      manager: 'marketing.manager@company.com',
      groups: ['Marketing-Users', 'All-Employees'],
      ou: 'OU=Marketing,OU=Departments,DC=company,DC=com'
    },
    priority: 'Medium',
    estimatedTime: 2,
    approvers: ['it.admin@company.com', 'security.admin@company.com'],
    currentApprover: 'it.admin@company.com',
    comments: ['新員工報到，需要建立帳戶並設定基本權限'],
    attachments: ['employee_form.pdf']
  },
  {
    id: '2',
    type: 'UserDeactivation',
    status: 'InProgress',
    requestedBy: 'hr.admin@company.com',
    assignedTo: 'it.admin@company.com',
    createdDate: new Date('2024-01-14T14:30:00'),
    dueDate: new Date('2024-01-15T17:00:00'),
    details: {
      userName: 'leaving.employee@company.com',
      reason: '員工離職',
      lastWorkingDay: '2024-01-15',
      dataBackup: true,
      accessRevocation: ['All Groups', 'Email Access', 'VPN Access']
    },
    priority: 'High',
    estimatedTime: 1,
    actualTime: 0.5,
    approvers: ['it.admin@company.com'],
    currentApprover: 'it.admin@company.com',
    comments: ['已完成資料備份，正在撤銷存取權限'],
    attachments: ['resignation_letter.pdf', 'asset_return_form.pdf']
  },
  {
    id: '3',
    type: 'GroupModification',
    status: 'Completed',
    requestedBy: 'finance.manager@company.com',
    assignedTo: 'it.admin@company.com',
    createdDate: new Date('2024-01-13T10:15:00'),
    dueDate: new Date('2024-01-14T17:00:00'),
    details: {
      groupName: 'Finance-Managers',
      action: 'Add Members',
      members: ['new.finance.manager@company.com'],
      permissions: ['Finance Database - Read/Write']
    },
    priority: 'Medium',
    estimatedTime: 0.5,
    actualTime: 0.3,
    approvers: ['it.admin@company.com', 'security.admin@company.com'],
    comments: ['已完成群組成員新增，權限已生效'],
    attachments: []
  },
  {
    id: '4',
    type: 'PermissionChange',
    status: 'Failed',
    requestedBy: 'it.manager@company.com',
    assignedTo: 'security.admin@company.com',
    createdDate: new Date('2024-01-12T16:45:00'),
    dueDate: new Date('2024-01-13T17:00:00'),
    details: {
      target: 'Database Servers',
      requestedPermissions: ['Full Control'],
      justification: '系統維護需要',
      temporaryAccess: true,
      duration: '24 hours'
    },
    priority: 'Critical',
    estimatedTime: 1,
    actualTime: 2,
    approvers: ['security.admin@company.com', 'ciso@company.com'],
    comments: ['權限過高，已拒絕申請', '建議使用受限制的維護帳戶'],
    attachments: ['maintenance_plan.pdf']
  }
];

const workflowTemplates = [
  {
    id: '1',
    name: '新員工入職流程',
    description: '自動化新員工帳戶建立和權限設定',
    steps: ['HR 申請', 'IT 審核', '帳戶建立', '權限設定', '通知完成'],
    estimatedTime: '2-4 小時',
    approvers: ['IT Admin', 'Security Admin'],
    isActive: true
  },
  {
    id: '2',
    name: '員工離職流程',
    description: '安全地停用離職員工的所有存取權限',
    steps: ['HR 通知', '資料備份', '權限撤銷', '帳戶停用', '資產回收'],
    estimatedTime: '1-2 小時',
    approvers: ['IT Admin'],
    isActive: true
  },
  {
    id: '3',
    name: '權限申請流程',
    description: '管理特殊權限申請和審批',
    steps: ['使用者申請', '主管審核', '安全審核', '權限授予', '定期檢視'],
    estimatedTime: '1-3 天',
    approvers: ['Manager', 'Security Admin', 'CISO'],
    isActive: true
  }
];

export function Workflows() {
  const [workflowTasks, setWorkflowTasks] = useState<ExtendedWorkflowTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'InProgress' | 'Completed' | 'Failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'UserCreation' | 'UserDeactivation' | 'GroupModification' | 'PermissionChange'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Critical'>('all');
  const [activeTab, setActiveTab] = useState<'tasks' | 'templates' | 'analytics'>('tasks');
  const [selectedTask, setSelectedTask] = useState<ExtendedWorkflowTask | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setWorkflowTasks(mockWorkflowTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTasks = workflowTasks.filter(task => {
    const matchesSearch = task.details && JSON.stringify(task.details).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'InProgress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'UserCreation':
        return '使用者建立';
      case 'UserDeactivation':
        return '使用者停用';
      case 'GroupModification':
        return '群組修改';
      case 'PermissionChange':
        return '權限變更';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入工作流程資料中...</p>
        </div>
      </div>
    );
  }

  const pendingCount = workflowTasks.filter(task => task.status === 'Pending').length;
  const inProgressCount = workflowTasks.filter(task => task.status === 'InProgress').length;
  const completedCount = workflowTasks.filter(task => task.status === 'Completed').length;
  const overdueCount = workflowTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && 
    !['Completed', 'Failed'].includes(task.status)
  ).length;

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">工作流程管理</h1>
        <p className="mt-1 text-sm text-gray-500">
            自動化 AD 管理工作流程與審批程序
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Plus className="h-4 w-4 mr-2" />
            建立工作流程
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
                  <dt className="text-sm font-medium text-gray-500 truncate">待處理</dt>
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
                <div className="bg-blue-500 p-3 rounded-md">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">進行中</dt>
                  <dd className="text-lg font-medium text-gray-900">{inProgressCount}</dd>
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
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">逾期</dt>
                  <dd className="text-lg font-medium text-gray-900">{overdueCount}</dd>
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
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              工作任務
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              流程範本
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              分析報告
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋工作流程..."
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
                    <option value="Pending">待處理</option>
                    <option value="InProgress">進行中</option>
                    <option value="Completed">已完成</option>
                    <option value="Failed">失敗</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                  >
                    <option value="all">所有類型</option>
                    <option value="UserCreation">使用者建立</option>
                    <option value="UserDeactivation">使用者停用</option>
                    <option value="GroupModification">群組修改</option>
                    <option value="PermissionChange">權限變更</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                  >
                    <option value="all">所有優先級</option>
                    <option value="Critical">緊急</option>
                    <option value="High">高</option>
                    <option value="Medium">中</option>
                    <option value="Low">低</option>
                  </select>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        任務
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        優先級
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申請者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        負責人
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        到期日
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {getStatusIcon(task.status)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getTypeDisplayName(task.type)}
                              </div>
                              <div className="text-sm text-gray-500">ID: {task.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.requestedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.assignedTo || '未指派'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.dueDate ? (
                            <div>
                              <div>{new Date(task.dueDate).toLocaleDateString('zh-TW')}</div>
                              {new Date(task.dueDate) < new Date() && !['Completed', 'Failed'].includes(task.status) && (
                                <div className="text-xs text-red-500">逾期</div>
                              )}
                            </div>
                          ) : (
                            '無期限'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowTaskDetails(true);
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
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

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workflowTemplates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive ? '啟用' : '停用'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">流程步驟</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {template.steps.map((step, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-5 h-5 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-xs mr-2">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">預估時間:</span>
                        <span className="font-medium">{template.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">審批者:</span>
                        <span className="font-medium">{template.approvers.length} 人</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        編輯
                      </button>
                      <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                        使用
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">任務完成率</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">本週完成</span>
                      <span className="text-sm font-medium">{completedCount}/{workflowTasks.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(completedCount / workflowTasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      完成率: {Math.round((completedCount / workflowTasks.length) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">平均處理時間</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">使用者建立</span>
                      <span className="text-sm font-medium">2.1 小時</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">使用者停用</span>
                      <span className="text-sm font-medium">0.8 小時</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">群組修改</span>
                      <span className="text-sm font-medium">0.5 小時</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">權限變更</span>
                      <span className="text-sm font-medium">1.5 小時</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">工作流程詳細資訊</h3>
                <button
                  onClick={() => setShowTaskDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">任務類型</label>
                    <p className="mt-1 text-sm text-gray-900">{getTypeDisplayName(selectedTask.type)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">狀態</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">申請者</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTask.requestedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">負責人</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTask.assignedTo || '未指派'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">優先級</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">預估時間</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTask.estimatedTime} 小時</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">任務詳情</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedTask.details, null, 2)}</pre>
                  </div>
                </div>
                
                {selectedTask.comments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">備註</label>
                    <div className="mt-1 space-y-2">
                      {selectedTask.comments.map((comment, index) => (
                        <div key={index} className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                          {comment}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTaskDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  關閉
                </button>
                {selectedTask.status === 'Pending' && (
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    開始處理
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 