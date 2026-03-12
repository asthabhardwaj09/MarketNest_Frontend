import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div 
          className="navbar-brand"
          onClick={() => navigate('/')}
        >
          <span className="text-primary-600">🛍️</span> MarketNest
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          {user ? (
            <>
              {/* User Name */}
              <div className="flex items-center gap-1">
                <span className="text-neutral-700 font-medium">{user.name}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs badge badge-primary">
                  {user.role === 'Brand' ? '🏪 Seller' : '🛒 Buyer'}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-neutral-200"></div>

              {/* Dashboard Button */}
              <button
                onClick={() => navigate(user.role === 'Brand' ? '/brand/dashboard' : '/marketplace')}
                className="navbar-link"
              >
                {user.role === 'Brand' ? '📊 Dashboard' : '🏬 Marketplace'}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="btn btn-ghost text-sm"
              >
                Login
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => navigate('/signup')}
                className="btn btn-primary text-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;