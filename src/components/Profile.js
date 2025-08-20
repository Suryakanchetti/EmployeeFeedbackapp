import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TABLES } from '../supabase';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

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
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>Error: {error}</div>
        <button onClick={fetchProfile} style={{
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
    maxWidth: '800px',
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

  const profileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '30px'
  };

  const profileCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb'
  };

  const fieldGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    color: '#1f2937',
    fontSize: '16px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  };

  const emptyValueStyle = {
    ...valueStyle,
    color: '#9ca3af',
    fontStyle: 'italic'
  };

  const statsCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '8px'
  };

  const statLabelStyle = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Profile</h1>
        <p style={subtitleStyle}>Your account information and preferences</p>
      </div>

      <div style={profileGridStyle}>
        <div style={profileCardStyle}>
          <h3 style={cardTitleStyle}>Personal Information</h3>
          
          <div style={fieldGroupStyle}>
            <div style={labelStyle}>First Name</div>
            <div style={profile?.first_name ? valueStyle : emptyValueStyle}>
              {profile?.first_name || 'Not set'}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <div style={labelStyle}>Last Name</div>
            <div style={profile?.last_name ? valueStyle : emptyValueStyle}>
              {profile?.last_name || 'Not set'}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <div style={labelStyle}>Email Address</div>
            <div style={valueStyle}>{user?.email}</div>
          </div>
        </div>

        <div style={profileCardStyle}>
          <h3 style={cardTitleStyle}>Work Information</h3>
          
          <div style={fieldGroupStyle}>
            <div style={labelStyle}>Department</div>
            <div style={profile?.department ? valueStyle : emptyValueStyle}>
              {profile?.department || 'Not set'}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <div style={labelStyle}>Position</div>
            <div style={profile?.position ? valueStyle : emptyValueStyle}>
              {profile?.position || 'Not set'}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <div style={labelStyle}>Member Since</div>
            <div style={valueStyle}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      <div style={statsCardStyle}>
        <h3 style={cardTitleStyle}>Account Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div>
            <div style={statValueStyle}>1</div>
            <div style={statLabelStyle}>Active Account</div>
          </div>
          <div>
            <div style={statValueStyle}>✓</div>
            <div style={statLabelStyle}>Email Verified</div>
          </div>
          <div>
            <div style={statValueStyle}>📧</div>
            <div style={statLabelStyle}>Notifications</div>
          </div>
        </div>
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

export default Profile;
