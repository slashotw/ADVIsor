export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  department: string;
  title: string;
  manager?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdDate: Date;
  groups: string[];
  ou: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'Security' | 'Distribution';
  members: string[];
  permissions: Permission[];
  ou: string;
}

export interface OrganizationalUnit {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children: OrganizationalUnit[];
  users: User[];
  groups: Group[];
  description?: string;
}

export interface Permission {
  id: string;
  resource: string;
  access: 'Read' | 'Write' | 'FullControl' | 'Deny';
  inherited: boolean;
  grantedTo: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  target: string;
  details: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Dashboard {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalOUs: number;
  recentActivities: AuditLog[];
  securityAlerts: SecurityAlert[];
}

export interface SecurityAlert {
  id: string;
  type: 'OverPrivileged' | 'InactiveUser' | 'UnusualAccess' | 'PolicyViolation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface WorkflowTask {
  id: string;
  type: 'UserCreation' | 'UserDeactivation' | 'GroupModification' | 'PermissionChange';
  status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
  requestedBy: string;
  assignedTo?: string;
  createdDate: Date;
  dueDate?: Date;
  details: any;
}

export interface BulkOperation {
  id: string;
  type: 'UserImport' | 'UserUpdate' | 'UserDeactivation';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors: string[];
  createdBy: string;
  createdDate: Date;
} 