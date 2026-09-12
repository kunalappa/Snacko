import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider, useModal } from './context/ModalContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import TokenModal from './components/TokenModal';
import { useLocation } from 'react-router-dom';

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-4">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>;
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthModalOpen, closeAuthModal, authModalConfig } = useModal();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-600">
      {!isAdminPath && !isAuthPath && <Navbar />}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
      />

      <TokenModal />


      <main>
        <AppRoutes />
      </main>

      {!isAdminPath && !isAuthPath && (
        <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Snacko</span>
              </div>

              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a href="/#home" className="hover:text-orange-500 transition-colors">Home</a>
                  <a href="/#about" className="hover:text-orange-500 transition-colors">About</a>
                  <a href="/#features" className="hover:text-orange-500 transition-colors">Features</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ModalProvider>
            <Router>
              <AppContent />
            </Router>
          </ModalProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
