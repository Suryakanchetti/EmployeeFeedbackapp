import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const brandStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  };

  const navLinkStyle = (active) => ({
    color: active ? '#2563eb' : '#6b7280',
    textDecoration: 'none',
    fontWeight: active ? '600' : '500',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    ...(active && {
      background: '#eff6ff',
      color: '#2563eb'
    })
  });

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#2563eb',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db'
  };

  // Show loading state
  if (loading) {
    return (
      <nav style={navStyle}>
        <div style={containerStyle}>
          <div style={brandStyle}>Feedback Hub</div>
          <div style={{ color: '#6b7280' }}>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={brandStyle}>
          Feedback Hub
        </Link>

        {user ? (
          // Authenticated user navigation
          <div style={navLinksStyle}>
            <Link to="/" style={navLinkStyle(isActive('/'))}>
              Dashboard
            </Link>
            <Link to="/feedback" style={navLinkStyle(isActive('/feedback'))}>
              View All
            </Link>
            <Link to="/profile" style={navLinkStyle(isActive('/profile'))}>
              Profile
            </Link>
            <button onClick={handleSignOut} style={secondaryButtonStyle}>
              Sign Out
            </button>
          </div>
        ) : (
          // Guest user navigation
          <div style={navLinksStyle}>
            <Link to="/login" style={primaryButtonStyle}>
              Sign In
            </Link>
            <Link to="/register" style={secondaryButtonStyle}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
