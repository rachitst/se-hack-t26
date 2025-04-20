import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import Users from './pages/Users';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

type Page = 'dashboard' | 'warehouses' | 'users' | 'inventory' | 'reports' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'warehouses':
        return <Warehouses />;
      case 'users':
        return <Users />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </Provider>
  );
}

export default App;