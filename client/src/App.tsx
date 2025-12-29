import { useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg sticky-top bg-white">
        <div className="container">
          <span className="navbar-brand">
            💰 AI Finance
          </span>
          {token && (
            <button 
                className="btn btn-outline-danger btn-sm" 
                onClick={logout}
                style={{ borderRadius: '20px', padding: '5px 15px' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow-1 py-4">
        {token ? <Dashboard /> : <Auth />}
      </div>
      
      {/* Footer (Optional) */}
      <footer className="text-center py-4 text-muted mt-auto">
        <small>© 2025 AI Finance Manager. Built with MERN.</small>
      </footer>
    </div>
  );
}

export default App;