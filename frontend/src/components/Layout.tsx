import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-pink-600">Salão Leila</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                className="p-2 rounded-full text-gray-500 hover:text-pink-600 hover:bg-gray-100 transition-colors"
                title="Início"
              >
                <Home size={20} />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
