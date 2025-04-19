import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type Page = 'dashboard' | 'warehouses' | 'users' | 'inventory' | 'reports' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;