import { useState, useEffect } from 'react';
import { Users, UserCheck, Building2, AlertTriangle, Activity, Clock } from 'lucide-react';
import type { Dashboard as DashboardData, SecurityAlert, AuditLog } from '../types';
import { dataService } from '../services/dataService';

// Mock data - 在實際應用中，這些數據會從 API 獲取
const mockDashboardData: DashboardData = {
  totalUsers: 1247,
  activeUsers: 1156,
  totalGroups: 89,
  totalOUs: 23,
  recentActivities: [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:30:00'),
      action: '使用者建立',
      user: 'admin@company.com',
      target: 'john.doe@company.com',
      details: '新增使用者到 IT 部門',
      severity: 'Low'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T09:15:00'),
      action: '群組修改',
      user: 'hr.admin@company.com',
      target: 'HR-Managers',
      details: '新增 3 位成員到 HR 管理群組',
      severity: 'Medium'
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T08:45:00'),
      action: '權限變更',
      user: 'security.admin@company.com',
      target: 'Finance-OU',
      details: '更新財務部門的存取權限',
      severity: 'High'
    }
  ],
  securityAlerts: [
    {
      id: '1',
      type: 'OverPrivileged',
      severity: 'High',
      message: '發現 5 個具有過度權限的使用者帳戶',
      timestamp: new Date('2024-01-15T11:00:00'),
      resolved: false
    },
    {
      id: '2',
      type: 'InactiveUser',
      severity: 'Medium',
      message: '12 個使用者帳戶超過 90 天未登入',
      timestamp: new Date('2024-01-15T10:00:00'),
      resolved: false
    }
  ]
};

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dataService.getDashboardStats();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('無法載入儀表板數據:', error);
        // 使用預設的模擬數據
        setDashboardData(mockDashboardData);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>載入失敗</div>;
  }

  const stats = [
    {
      name: '總使用者數',
      value: dashboardData.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: '活躍使用者',
      value: dashboardData.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: '群組數量',
      value: dashboardData.totalGroups.toLocaleString(),
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      name: '組織單位',
      value: dashboardData.totalOUs.toLocaleString(),
      icon: Building2,
      color: 'bg-orange-500'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-red-500 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="mt-1 text-sm text-gray-500">
          Active Directory 管理概覽
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                安全警示
              </h3>
            </div>
            <div className="space-y-3">
              {dashboardData.securityAlerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-red-400 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{alert.message}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-red-500">
                          {alert.timestamp.toLocaleString('zh-TW')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-blue-500 mr-2" />
                最近活動
              </h3>
            </div>
            <div className="flow-root">
              <ul className="-mb-8">
                {dashboardData.recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== dashboardData.recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <Clock className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                              執行了 <span className="font-medium">{activity.action}</span>
                            </p>
                            <p className="text-sm text-gray-500">目標: {activity.target}</p>
                            <p className="text-xs text-gray-400">{activity.details}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>{activity.timestamp.toLocaleString('zh-TW')}</time>
                            <div className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(activity.severity)}`}>
                                {activity.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 