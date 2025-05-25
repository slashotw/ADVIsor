import { appConfig } from '../config/app';
import { adApi } from './api';
import type { User, Group, Dashboard, AuditLog, OrganizationalUnit } from '../types';

// 模擬數據
const mockDashboardData: Dashboard = {
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
    }
  ]
};

const mockUsers: User[] = [
  {
    id: '1',
    username: 'john.doe',
    displayName: 'John Doe',
    email: 'john.doe@company.com',
    department: 'IT',
    title: '軟體工程師',
    manager: 'jane.smith@company.com',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:30:00'),
    createdDate: new Date('2023-06-01'),
    groups: ['IT-Users', 'Developers'],
    ou: 'OU=IT,OU=Departments,DC=company,DC=com'
  },
  {
    id: '2',
    username: 'jane.smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'IT',
    title: 'IT 經理',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:15:00'),
    createdDate: new Date('2022-03-15'),
    groups: ['IT-Users', 'IT-Managers', 'Administrators'],
    ou: 'OU=IT,OU=Departments,DC=company,DC=com'
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'IT-Administrators',
    description: 'IT 部門管理員群組',
    type: 'Security',
    members: ['john.doe@company.com', 'jane.smith@company.com'],
    permissions: [
      {
        id: '1',
        resource: 'Domain Controllers',
        access: 'FullControl',
        inherited: false,
        grantedTo: 'IT-Administrators'
      }
    ],
    ou: 'OU=IT,OU=Groups,DC=company,DC=com'
  }
];

// 模擬延遲函數
const mockDelay = (data: any) => {
  return new Promise((resolve) => {
    const delay = appConfig.mockData.enableDelay ? appConfig.mockData.delayTime : 0;
    setTimeout(() => {
      if (appConfig.mockData.showWarning) {
        console.warn('🔄 使用模擬數據 - 這不是來自真實 AD 的數據');
      }
      resolve(data);
    }, delay);
  });
};

// 統一數據服務
export const dataService = {
  // 獲取儀表板數據
  async getDashboardStats(): Promise<Dashboard> {
    if (!appConfig.api.enabled) {
      return mockDelay(mockDashboardData) as Promise<Dashboard>;
    }

    try {
      const response = await adApi.getDashboardStats();
      return response.data as Dashboard;
    } catch (error) {
      if (appConfig.api.fallbackToMockData) {
        console.warn('API 失敗，回退到模擬數據:', error);
        return mockDelay(mockDashboardData) as Promise<Dashboard>;
      }
      throw error;
    }
  },

  // 獲取使用者列表
  async getUsers(params?: { search?: string; limit?: number; offset?: number }): Promise<User[]> {
    if (!appConfig.api.enabled) {
      let filteredUsers = mockUsers;
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = mockUsers.filter(user =>
          user.displayName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.department.toLowerCase().includes(searchTerm)
        );
      }
      return mockDelay(filteredUsers) as Promise<User[]>;
    }

    try {
      const response = await adApi.getUsers(params);
      return response.data as User[];
    } catch (error) {
      if (appConfig.api.fallbackToMockData) {
        console.warn('API 失敗，回退到模擬數據:', error);
        return mockDelay(mockUsers) as Promise<User[]>;
      }
      throw error;
    }
  },

  // 獲取群組列表
  async getGroups(params?: { search?: string; limit?: number; offset?: number }): Promise<Group[]> {
    if (!appConfig.api.enabled) {
      let filteredGroups = mockGroups;
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredGroups = mockGroups.filter(group =>
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm)
        );
      }
      return mockDelay(filteredGroups) as Promise<Group[]>;
    }

    try {
      const response = await adApi.getGroups(params);
      return response.data as Group[];
    } catch (error) {
      if (appConfig.api.fallbackToMockData) {
        console.warn('API 失敗，回退到模擬數據:', error);
        return mockDelay(mockGroups) as Promise<Group[]>;
      }
      throw error;
    }
  },

  // 獲取組織單位
  async getOrganizationalUnits(): Promise<OrganizationalUnit[]> {
    const mockOUs: OrganizationalUnit[] = [
      {
        id: '1',
        name: 'Company',
        path: 'DC=company,DC=com',
        children: [
          {
            id: '2',
            name: 'Departments',
            path: 'OU=Departments,DC=company,DC=com',
            parentId: '1',
            children: [
              {
                id: '3',
                name: 'IT',
                path: 'OU=IT,OU=Departments,DC=company,DC=com',
                parentId: '2',
                children: [],
                users: [],
                groups: []
              }
            ],
            users: [],
            groups: []
          }
        ],
        users: [],
        groups: []
      }
    ];

    if (!appConfig.api.enabled) {
      return mockDelay(mockOUs) as Promise<OrganizationalUnit[]>;
    }

    try {
      const response = await adApi.getOrganizationalUnits();
      return response.data as OrganizationalUnit[];
    } catch (error) {
      if (appConfig.api.fallbackToMockData) {
        console.warn('API 失敗，回退到模擬數據:', error);
        return mockDelay(mockOUs) as Promise<OrganizationalUnit[]>;
      }
      throw error;
    }
  },

  // 獲取稽核日誌
  async getAuditLogs(params?: { 
    search?: string; 
    severity?: string; 
    category?: string; 
    dateFrom?: string; 
    dateTo?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<any[]> {
    const mockLogs = [
      {
        id: '1',
        timestamp: new Date('2024-01-15T10:30:00'),
        action: '使用者建立',
        user: 'admin@company.com',
        target: 'john.doe@company.com',
        details: '新增使用者到 IT 部門',
        severity: 'Low',
        category: 'UserManagement',
        result: 'Success',
        ipAddress: '192.168.1.100',
        riskScore: 2
      }
    ];

    if (!appConfig.api.enabled) {
      return mockDelay(mockLogs) as Promise<any[]>;
    }

    try {
      const response = await adApi.getAuditLogs(params);
      return response.data as any[];
    } catch (error) {
      if (appConfig.api.fallbackToMockData) {
        console.warn('API 失敗，回退到模擬數據:', error);
        return mockDelay(mockLogs) as Promise<any[]>;
      }
      throw error;
    }
  },

  // 測試 AD 連線
  async testConnection(): Promise<{ success: boolean; message: string; timestamp: Date }> {
    if (!appConfig.api.enabled || !appConfig.features.enableADConnectionTest) {
      return mockDelay({
        success: false,
        message: '模擬模式 - 無法連接真實 AD',
        timestamp: new Date()
      }) as Promise<{ success: boolean; message: string; timestamp: Date }>;
    }

    try {
      const response = await adApi.testConnection();
      return response.data as { success: boolean; message: string; timestamp: Date };
    } catch (error) {
      return {
        success: false,
        message: `連線失敗: ${error}`,
        timestamp: new Date()
      };
    }
  }
};

// 導出配置和模擬數據供其他組件使用
export { mockDashboardData, mockUsers, mockGroups }; 