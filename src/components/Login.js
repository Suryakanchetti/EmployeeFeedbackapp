import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      console.log('🔄 Starting sign in...');
      const startTime = Date.now();
      
      const { error } = await signIn(email, password);
      
      const endTime = Date.now();
      console.log(`⏱️ Sign in took: ${endTime - startTime}ms`);
      
      if (error) {
        setError(error.message);
      } else {
        console.log('✅ Sign in successful, redirecting...');
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '16px'
  };

  const formStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.2s'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    background: '#9ca3af',
    cursor: 'not-allowed'
  };

  const buttonLoadingStyle = {
    ...buttonStyle,
    background: '#1d4ed8',
    cursor: 'wait'
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #fecaca'
  };

  const linkStyle = {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600'
  };

  const textCenterStyle = {
    textAlign: 'center',
    color: '#6b7280'
  };

  const loadingTextStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Welcome Back!</h1>
        <p style={subtitleStyle}>Sign in to your Feedback Hub account</p>
      </div>
      
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? buttonLoadingStyle : buttonStyle}
          >
            {loading ? (
              <div style={loadingTextStyle}>
                <div style={spinnerStyle}></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <div style={textCenterStyle}>
            <p>
              Don't have an account?{' '}
              <Link to="/register" style={linkStyle}>
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
