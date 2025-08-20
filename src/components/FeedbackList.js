import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase, TABLES, FEEDBACK_TYPES, FEEDBACK_STATUS } from '../supabase';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from(TABLES.FEEDBACK)
        .select(`
          *,
          users:user_id (
            first_name,
            last_name,
            department
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter === 'pending') {
        query = query.eq('status', FEEDBACK_STATUS.PENDING);
      } else if (filter === 'addressed') {
        query = query.eq('status', FEEDBACK_STATUS.ADDRESSED);
      } else if (filter === 'closed') {
        query = query.eq('status', FEEDBACK_STATUS.CLOSED);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'medium':
        return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'high':
        return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
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
        <p>Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>Error: {error}</div>
        <button onClick={fetchFeedback} style={{
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

  const controlsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const filterGroupStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const filterButtonStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: active ? 'none' : '1px solid #d1d5db',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    background: active ? '#2563eb' : 'transparent',
    color: active ? 'white' : '#6b7280'
  });

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
    transition: 'background-color 0.2s'
  };

  const feedbackGridStyle = {
    display: 'grid',
    gap: '20px'
  };

  const feedbackItemStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  };

  const feedbackHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  };

  const feedbackTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  };

  const feedbackDescriptionStyle = {
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '16px'
  };

  const feedbackMetaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  };

  const badgeStyle = (colors) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    display: 'inline-block'
  });

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  };

  const emptyTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px'
  };

  const emptySubtitleStyle = {
    marginBottom: '24px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>All Feedback</h1>
        <p style={subtitleStyle}>Review and manage feedback from your team</p>
      </div>

      <div style={controlsStyle}>
        <div style={filterGroupStyle}>
          <button
            onClick={() => setFilter('all')}
            style={filterButtonStyle(filter === 'all')}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={filterButtonStyle(filter === 'pending')}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('addressed')}
            style={filterButtonStyle(filter === 'addressed')}
          >
            Addressed
          </button>
          <button
            onClick={() => setFilter('closed')}
            style={filterButtonStyle(filter === 'closed')}
          >
            Closed
          </button>
        </div>

        <Link to="/feedback/new" style={buttonStyle}>
          Submit New Feedback
        </Link>
      </div>

      {feedback.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyTitleStyle}>No feedback found</div>
          <div style={emptySubtitleStyle}>
            {filter === 'all' 
              ? "There's no feedback submitted yet. Be the first to share your thoughts!"
              : `No ${filter} feedback found.`
            }
          </div>
          <Link to="/feedback/new" style={buttonStyle}>
            Submit First Feedback
          </Link>
        </div>
      ) : (
        <div style={feedbackGridStyle}>
          {feedback.map((item) => (
            <div key={item.id} style={feedbackItemStyle}>
              <div style={feedbackHeaderStyle}>
                <div>
                  <h3 style={feedbackTitleStyle}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={badgeStyle(getTypeColor(item.type))}>
                      {item.type}
                    </span>
                    <span style={badgeStyle(getStatusColor(item.status))}>
                      {item.status}
                    </span>
                    <span style={badgeStyle(getPriorityColor(item.priority))}>
                      {item.priority} priority
                    </span>
                  </div>
                </div>
              </div>

              <p style={feedbackDescriptionStyle}>{item.description}</p>

              <div style={feedbackMetaStyle}>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Submitted by:</strong> {item.users?.first_name} {item.users?.last_name}
                  {item.users?.department && ` (${item.users.department})`}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FeedbackList;
