import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TABLES, FEEDBACK_TYPES, FEEDBACK_STATUS } from '../supabase';
import FeedbackModal from './FeedbackModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    addressed: 0,
    closed: 0
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch feedback statistics
      const { count: totalCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true })
        .eq('status', FEEDBACK_STATUS.PENDING);

      const { count: addressedCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true })
        .eq('status', FEEDBACK_STATUS.ADDRESSED);

      const { count: closedCount } = await supabase
        .from(TABLES.FEEDBACK)
        .select('*', { count: 'exact', head: true })
        .eq('status', FEEDBACK_STATUS.CLOSED);

      setStats({
        total: totalCount || 0,
        pending: pendingCount || 0,
        addressed: addressedCount || 0,
        closed: closedCount || 0
      });

      // Fetch recent feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from(TABLES.FEEDBACK)
        .select(`
          *,
          users:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (feedbackError) throw feedbackError;
      setRecentFeedback(feedbackData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedbackModal(false);
    fetchDashboardData(); // Refresh the data
  };

  const getStatusColor = (status) => {
    switch (status) {
      case FEEDBACK_STATUS.PENDING:
        return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case FEEDBACK_STATUS.IN_REVIEW:
        return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      case FEEDBACK_STATUS.ADDRESSED:
        return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case FEEDBACK_STATUS.CLOSED:
        return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case FEEDBACK_TYPES.POSITIVE:
        return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case FEEDBACK_TYPES.CONSTRUCTIVE:
        return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case FEEDBACK_TYPES.SUGGESTION:
        return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      case FEEDBACK_TYPES.CONCERN:
        return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>Error: {error}</div>
        <button onClick={fetchDashboardData} style={{
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
    maxWidth: '1200px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const statCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
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

  const sectionStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    border: '1px solid #e5e7eb'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'inline-block'
  };

  const feedbackItemStyle = {
    background: '#f9fafb',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb'
  };

  const badgeStyle = (colors) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    display: 'inline-block',
    marginRight: '8px'
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          Welcome back, {user?.user_metadata?.first_name || 'User'}! 👋
        </h1>
        <p style={subtitleStyle}>
          Here's what's happening with feedback in your organization
        </p>
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.total}</div>
          <div style={statLabelStyle}>Total Feedback</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.pending}</div>
          <div style={statLabelStyle}>Pending</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.addressed}</div>
          <div style={statLabelStyle}>Addressed</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.closed}</div>
          <div style={statLabelStyle}>Closed</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Quick Actions</h2>
        <button
          onClick={() => setShowFeedbackModal(true)}
          style={buttonStyle}
        >
          Submit New Feedback
        </button>
        <Link to="/feedback" style={{...buttonStyle, background: '#6b7280', marginLeft: '12px'}}>
          View All Feedback
        </Link>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Recent Feedback</h2>
        {recentFeedback.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>No feedback submitted yet</p>
            <button
              onClick={() => setShowFeedbackModal(true)}
              style={buttonStyle}
            >
              Be the first to submit feedback
            </button>
          </div>
        ) : (
          <div>
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} style={feedbackItemStyle}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={badgeStyle(getTypeColor(feedback.type))}>
                    {feedback.type}
                  </span>
                  <span style={badgeStyle(getStatusColor(feedback.status))}>
                    {feedback.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {feedback.title}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                  {feedback.description}
                </p>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {new Date(feedback.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
};

export default Dashboard;
