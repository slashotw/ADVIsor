import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Building2,
  Shield,
  Eye,
  Workflow,
  UserCog,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  Server,
  Cog
} from 'lucide-react';
import { ConfigPanel } from './ConfigPanel';
import { appConfig } from '../config/app';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: '儀表板', href: '/', icon: Home },
  { name: '使用者管理', href: '/users', icon: Users },
  { name: '群組管理', href: '/groups', icon: UserCheck },
  { name: '組織單位', href: '/organizational-units', icon: Building2 },
  { name: '權限管理', href: '/permissions', icon: Shield },
  { name: 'AD 視覺化', href: '/visualization', icon: Eye },
  { name: '工作流程', href: '/workflows', icon: Workflow },
  { name: '自助服務', href: '/self-service', icon: UserCog },
  { name: '稽核日誌', href: '/audit-logs', icon: FileText },
  { name: '設定', href: '/settings', icon: Settings },
  { name: 'API 測試', href: '/api-test', icon: Server },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">ADVisor</h1>
              <button
                onClick={() => setConfigPanelOpen(true)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                title="應用程式配置"
              >
                <Cog className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">ADVisor</h1>
            <button
              onClick={() => setConfigPanelOpen(true)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              title="應用程式配置"
            >
              <Cog className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">開啟側邊欄</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="h-6 w-px bg-gray-200 lg:hidden" />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-bold text-gray-900">ADVisor</h1>
              <button
                onClick={() => setConfigPanelOpen(true)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
                title="應用程式配置"
              >
                <Cog className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          <div className="h-full min-h-full w-full">
            {children}
          </div>
        </main>
      </div>

      {/* 配置面板 */}
      <ConfigPanel 
        isOpen={configPanelOpen} 
        onClose={() => setConfigPanelOpen(false)} 
      />

      {/* 數據來源指示器 */}
      {!appConfig.api.enabled && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg shadow-lg text-sm">
          🔄 模擬模式
        </div>
      )}
    </div>
  );
} 