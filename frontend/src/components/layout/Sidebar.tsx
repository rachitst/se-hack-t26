import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Warehouse,
  Users,
  Settings,
  Package,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Menu
} from 'lucide-react';

type Page = 'dashboard' | 'warehouses' | 'users' | 'inventory' | 'reports' | 'settings';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

interface NavItem {
  name: string;
  page: Page;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, currentPage, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Warehouses', page: 'warehouses', icon: <Warehouse size={20} /> },
    { name: 'Users', page: 'users', icon: <Users size={20} /> },
    { name: 'Inventory', page: 'inventory', icon: <Package size={20} /> },
    { name: 'Reports', page: 'reports', icon: <BarChart3 size={20} /> },
    { name: 'Settings', page: 'settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative h-screen bg-indigo-600 flex flex-col transition-all duration-300 z-40
          ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-500/20">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-lg">InventoryPro</span>
                <span className="text-indigo-200 text-xs">Management System</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 mx-auto">
              <Building2 size={20} className="text-white" />
            </div>
          )}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-indigo-500/30 text-indigo-200 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => onPageChange(item.page)}
                    className={`flex items-center p-2 rounded-lg transition-colors w-full ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-indigo-200 hover:bg-indigo-500/30'
                    }`}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-indigo-500/20">
          <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center'}`}>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">John Smith</p>
                <p className="text-xs text-indigo-200">Administrator</p>
              </div>
            )}
            <button className="p-2 rounded-lg hover:bg-indigo-500/30 text-indigo-200 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;