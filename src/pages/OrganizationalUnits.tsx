import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Move, Users, Building2, FolderPlus, Search } from 'lucide-react';
import type { OrganizationalUnit, User, Group } from '../types';

// Mock data
const mockOUStructure: OrganizationalUnit = {
  id: 'root',
  name: 'company.com',
  path: 'DC=company,DC=com',
  description: '公司根網域',
  children: [
    {
      id: 'departments',
      name: 'Departments',
      path: 'OU=Departments,DC=company,DC=com',
      parentId: 'root',
      description: '部門組織單位',
      children: [
        {
          id: 'it',
          name: 'IT',
          path: 'OU=IT,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          description: 'IT 部門',
          children: [
            {
              id: 'it-dev',
              name: 'Development',
              path: 'OU=Development,OU=IT,OU=Departments,DC=company,DC=com',
              parentId: 'it',
              description: '軟體開發團隊',
              children: [],
              users: [
                { id: '1', username: 'john.doe', displayName: 'John Doe', email: 'john.doe@company.com', department: 'IT', title: '軟體工程師', isActive: true, createdDate: new Date(), groups: [], ou: '' }
              ],
              groups: []
            }
          ],
          users: [
            { id: '2', username: 'jane.smith', displayName: 'Jane Smith', email: 'jane.smith@company.com', department: 'IT', title: 'IT 經理', isActive: true, createdDate: new Date(), groups: [], ou: '' }
          ],
          groups: [
            { id: '1', name: 'IT-Administrators', description: 'IT 管理員', type: 'Security', members: [], permissions: [], ou: '' }
          ]
        },
        {
          id: 'hr',
          name: 'HR',
          path: 'OU=HR,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          description: '人力資源部門',
          children: [],
          users: [
            { id: '3', username: 'bob.wilson', displayName: 'Bob Wilson', email: 'bob.wilson@company.com', department: 'HR', title: 'HR 專員', isActive: false, createdDate: new Date(), groups: [], ou: '' }
          ],
          groups: [
            { id: '2', name: 'HR-Users', description: 'HR 使用者', type: 'Security', members: [], permissions: [], ou: '' }
          ]
        },
        {
          id: 'finance',
          name: 'Finance',
          path: 'OU=Finance,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          description: '財務部門',
          children: [],
          users: [],
          groups: []
        }
      ],
      users: [],
      groups: []
    },
    {
      id: 'users',
      name: 'Users',
      path: 'OU=Users,DC=company,DC=com',
      parentId: 'root',
      description: '一般使用者容器',
      children: [],
      users: [],
      groups: []
    },
    {
      id: 'computers',
      name: 'Computers',
      path: 'OU=Computers,DC=company,DC=com',
      parentId: 'root',
      description: '電腦物件容器',
      children: [],
      users: [],
      groups: []
    }
  ],
  users: [],
  groups: []
};

interface TreeNodeProps {
  ou: OrganizationalUnit;
  level: number;
  expandedNodes: Set<string>;
  selectedNode: string | null;
  onToggleExpand: (nodeId: string) => void;
  onSelectNode: (ou: OrganizationalUnit) => void;
  onEditNode: (ou: OrganizationalUnit) => void;
  onDeleteNode: (ou: OrganizationalUnit) => void;
  onAddChild: (parentOu: OrganizationalUnit) => void;
}

function TreeNode({ 
  ou, 
  level, 
  expandedNodes, 
  selectedNode, 
  onToggleExpand, 
  onSelectNode, 
  onEditNode, 
  onDeleteNode,
  onAddChild 
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(ou.id);
  const hasChildren = ou.children && ou.children.length > 0;
  const isSelected = selectedNode === ou.id;

  return (
    <div>
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer ${
          isSelected ? 'bg-primary-50 border-r-2 border-primary-500' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => onSelectNode(ou)}
      >
        <div className="flex items-center flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(ou.id);
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          <Building2 className="h-4 w-4 text-blue-500 mr-2" />
          
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{ou.name}</div>
            <div className="text-xs text-gray-500">
              {ou.users?.length || 0} 使用者, {ou.groups?.length || 0} 群組
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(ou);
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="新增子 OU"
          >
            <FolderPlus className="h-3 w-3 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditNode(ou);
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="編輯"
          >
            <Edit className="h-3 w-3 text-gray-500" />
          </button>
          {ou.id !== 'root' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(ou);
              }}
              className="p-1 hover:bg-gray-200 rounded"
              title="刪除"
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {ou.children.map((child) => (
            <TreeNode
              key={child.id}
              ou={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              selectedNode={selectedNode}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationalUnits() {
  const [ouStructure, setOuStructure] = useState<OrganizationalUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'departments']));
  const [selectedNode, setSelectedNode] = useState<string | null>('root');
  const [selectedOU, setSelectedOU] = useState<OrganizationalUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setOuStructure(mockOUStructure);
      setSelectedOU(mockOUStructure);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleSelectNode = (ou: OrganizationalUnit) => {
    setSelectedNode(ou.id);
    setSelectedOU(ou);
  };

  const handleEditNode = (ou: OrganizationalUnit) => {
    setSelectedOU(ou);
    setShowEditModal(true);
  };

  const handleDeleteNode = (ou: OrganizationalUnit) => {
    if (confirm(`確定要刪除組織單位 "${ou.name}" 嗎？`)) {
      // 實際應用中會調用 API
      console.log('刪除 OU:', ou.name);
    }
  };

  const handleAddChild = (parentOu: OrganizationalUnit) => {
    setSelectedOU(parentOu);
    setShowCreateModal(true);
  };

  const getTotalCounts = (ou: OrganizationalUnit): { users: number; groups: number; ous: number } => {
    let users = ou.users?.length || 0;
    let groups = ou.groups?.length || 0;
    let ous = 1; // 包含自己

    if (ou.children) {
      ou.children.forEach(child => {
        const childCounts = getTotalCounts(child);
        users += childCounts.users;
        groups += childCounts.groups;
        ous += childCounts.ous;
      });
    }

    return { users, groups, ous: ous - 1 }; // 不包含自己
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入組織結構中...</p>
        </div>
      </div>
    );
  }

  if (!ouStructure) {
    return <div>載入失敗</div>;
  }

  const totalCounts = getTotalCounts(ouStructure);

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">組織單位管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理 Active Directory 組織單位結構
        </p>
      </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            建立 OU
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
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">組織單位總數</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalCounts.ous}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">總使用者數</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalCounts.users}</dd>
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
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">總群組數</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalCounts.groups}</dd>
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
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">最大深度</dt>
                  <dd className="text-lg font-medium text-gray-900">4</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OU Tree */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">組織結構樹</h3>
                <button
                  onClick={() => setExpandedNodes(new Set(['root', 'departments', 'it', 'hr', 'finance']))}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  展開全部
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜尋 OU..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto group">
                <TreeNode
                  ou={ouStructure}
                  level={0}
                  expandedNodes={expandedNodes}
                  selectedNode={selectedNode}
                  onToggleExpand={handleToggleExpand}
                  onSelectNode={handleSelectNode}
                  onEditNode={handleEditNode}
                  onDeleteNode={handleDeleteNode}
                  onAddChild={handleAddChild}
                />
              </div>
            </div>
          </div>
        </div>

        {/* OU Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {selectedOU ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                        {selectedOU.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{selectedOU.path}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNode(selectedOU)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        編輯
                      </button>
                      <button
                        onClick={() => handleAddChild(selectedOU)}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        新增子 OU
                      </button>
                    </div>
                  </div>

                  {selectedOU.description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">描述</h4>
                      <p className="text-sm text-gray-600">{selectedOU.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Users */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        使用者 ({selectedOU.users?.length || 0})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOU.users && selectedOU.users.length > 0 ? (
                          selectedOU.users.map((user) => (
                            <div key={user.id} className="flex items-center p-2 bg-gray-50 rounded">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                <span className="text-xs font-medium text-gray-700">
                                  {user.displayName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                                <div className="text-xs text-gray-500">{user.title}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">此 OU 中沒有使用者</p>
                        )}
                      </div>
                    </div>

                    {/* Groups */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        群組 ({selectedOU.groups?.length || 0})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOU.groups && selectedOU.groups.length > 0 ? (
                          selectedOU.groups.map((group) => (
                            <div key={group.id} className="flex items-center p-2 bg-gray-50 rounded">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                <div className="text-xs text-gray-500">{group.type}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">此 OU 中沒有群組</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Child OUs */}
                  {selectedOU.children && selectedOU.children.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        子組織單位 ({selectedOU.children.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedOU.children.map((child) => (
                          <div 
                            key={child.id} 
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleSelectNode(child)}
                          >
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 text-blue-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{child.name}</div>
                                <div className="text-xs text-gray-500">
                                  {child.users?.length || 0} 使用者, {child.groups?.length || 0} 群組
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">選擇組織單位</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    從左側樹狀結構中選擇一個組織單位來查看詳細資訊
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 