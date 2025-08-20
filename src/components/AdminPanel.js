import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TABLES } from '../supabase';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFeedback: 0,
    pendingFeedback: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch user count
      const { count: userCount } = await supabase
        .from(TABLES.USERS)
        .select('*', { count: 'exact', head: true });

      // Fetch feedback count
      const { count: feedbackCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true });

      // Fetch pending feedback count
      const { count: pendingCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: userCount || 0,
        totalFeedback: feedbackCount || 0,
        pendingFeedback: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>Error: {error}</div>
        <button onClick={fetchAdminStats} style={{
          padding: '10px 20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Try Again
        </button>
      </div>
    );
  }

  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto'
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

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const statCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '8px'
  };

  const statLabelStyle = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  };

  const sectionStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  };

  const infoTextStyle = {
    color: '#6b7280',
    fontSize: '16px',
    lineHeight: '1.6'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Admin Panel</h1>
        <p style={subtitleStyle}>Manage your organization's feedback system</p>
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.totalUsers}</div>
          <div style={statLabelStyle}>Total Users</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.totalFeedback}</div>
          <div style={statLabelStyle}>Total Feedback</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.pendingFeedback}</div>
          <div style={statLabelStyle}>Pending Feedback</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Quick Actions</h2>
        <p style={infoTextStyle}>
          Use the navigation menu above to access different sections of the admin panel.
          You can view user profiles, manage feedback, and monitor system statistics.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>System Information</h2>
        <p style={infoTextStyle}>
          This admin panel provides an overview of your feedback system.
          Monitor user engagement and feedback trends to improve your organization.
        </p>
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

export default AdminPanel;
