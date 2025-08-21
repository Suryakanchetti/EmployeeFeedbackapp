import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!Object.values(formData).every(value => value)) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      console.log('🔄 Starting sign up...');
      const startTime = Date.now();
      
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        department: formData.department,
        position: formData.position
      };

      const { error } = await signUp(formData.email, formData.password, userData);
      
      const endTime = Date.now();
      console.log(`⏱️ Sign up took: ${endTime - startTime}ms`);
      
      if (error) {
        setError(error.message);
      } else {
        console.log('✅ Sign up successful, redirecting...');
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setError('Failed to create account');
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
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
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
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, opacity 0.2s'
  };



  const inputSuccessStyle = {
    ...inputStyle,
    border: '2px solid #059669'
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
    transition: 'background-color 0.2s, transform 0.1s'
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
    fontWeight: '600',
    transition: 'color 0.2s'
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

  // Get password match status for visual feedback
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const isPasswordValid = formData.password.length >= 6;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Join Feedback Hub</h1>
        <p style={subtitleStyle}>Create your account and start sharing your thoughts</p>
      </div>
      
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={loading ? { ...inputStyle, opacity: 0.6 } : inputStyle}
                placeholder="first name"
                required
                disabled={loading}
                onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
                onBlur={(e) => e.target.style.border = '2px solid #e5e7eb'}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={loading ? { ...inputStyle, opacity: 0.6 } : inputStyle}
                placeholder="last name"
                required
                disabled={loading}
                onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
                onBlur={(e) => e.target.style.border = '2px solid #e5e7eb'}
              />
            </div>
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={loading ? { ...inputStyle, opacity: 0.6 } : inputStyle}
              placeholder="email"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
              onBlur={(e) => e.target.style.border = '2px solid #e5e7eb'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={loading ? { ...inputStyle, opacity: 0.6 } : inputStyle}
                placeholder="department"
                required
                disabled={loading}
                onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
                onBlur={(e) => e.target.style.border = '2px solid #e5e7eb'}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                style={loading ? { ...inputStyle, opacity: 0.6 } : inputStyle}
                placeholder="position"
                required
                disabled={loading}
                onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
                onBlur={(e) => e.target.style.border = '2px solid #e5e7eb'}
              />
            </div>
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={loading ? { ...inputStyle, opacity: 0.6 } : (isPasswordValid ? inputSuccessStyle : inputStyle)}
              placeholder="Create a password"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
              onBlur={(e) => e.target.style.border = isPasswordValid ? '2px solid #059669' : '2px solid #e5e7eb'}
            />
            {formData.password && (
              <small style={{ 
                color: isPasswordValid ? '#059669' : '#dc2626', 
                fontSize: '12px', 
                marginTop: '4px',
                display: 'block'
              }}>
                {isPasswordValid ? '✓ Password meets requirements' : 'Password must be at least 6 characters'}
              </small>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={loading ? { ...inputStyle, opacity: 0.6 } : (isPasswordMatch ? inputSuccessStyle : inputStyle)}
              placeholder="Confirm your password"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.border = '2px solid #2563eb'}
              onBlur={(e) => e.target.style.border = isPasswordMatch ? '2px solid #059669' : '2px solid #e5e7eb'}
            />
            {formData.confirmPassword && (
              <small style={{ 
                color: isPasswordMatch ? '#059669' : '#dc2626', 
                fontSize: '12px', 
                marginTop: '4px',
                display: 'block'
              }}>
                {isPasswordMatch ? '✓ Passwords match' : 'Passwords do not match'}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? buttonLoadingStyle : buttonStyle}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#1d4ed8')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#2563eb')}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? (
              <div style={loadingTextStyle}>
                <div style={spinnerStyle}></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </button>

          <div style={textCenterStyle}>
            <p>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.color = '#2563eb'}
              >
                Sign in here
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

export default Register;
