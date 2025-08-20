import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TABLES, FEEDBACK_TYPES, FEEDBACK_STATUS } from '../supabase';

const FeedbackForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: FEEDBACK_TYPES.SUGGESTION,
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('🔄 Starting feedback submission...');
      console.log('Form data:', formData);
      console.log('User ID:', user.id);

      const feedbackData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        priority: formData.priority,
        status: FEEDBACK_STATUS.PENDING,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      console.log('📤 Submitting to Supabase:', feedbackData);

      const { data, error: submitError } = await supabase
        .from(TABLES.FEEDBACK)
        .insert([feedbackData])
        .select();

      if (submitError) {
        console.error('❌ Supabase error:', submitError);
        throw submitError;
      }

      console.log('✅ Feedback submitted successfully:', data);
      navigate('/feedback');
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      
      // Better error messages based on error type
      if (error.code === 'PGRST116') {
        setError('Table not found. Please check database setup.');
      } else if (error.code === '42501') {
        setError('Permission denied. Check Row Level Security (RLS) policies.');
      } else if (error.code === '23505') {
        setError('Duplicate entry. Please try again.');
      } else if (error.message) {
        setError(`Submission failed: ${error.message}`);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const formStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const formGroupStyle = {
    marginBottom: '24px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '32px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center'
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

  const buttonDisabledStyle = {
    ...primaryButtonStyle,
    background: '#9ca3af',
    cursor: 'not-allowed'
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #fecaca'
  };



  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Submit New Feedback</h1>
        <p style={subtitleStyle}>Share your thoughts and suggestions with the team</p>
      </div>

      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Feedback Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Brief description of your feedback"
              required
              disabled={loading}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Provide detailed feedback, suggestions, or concerns..."
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Feedback Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={selectStyle}
                disabled={loading}
              >
                <option value={FEEDBACK_TYPES.POSITIVE}>Positive Feedback</option>
                <option value={FEEDBACK_TYPES.CONSTRUCTIVE}>Constructive Feedback</option>
                <option value={FEEDBACK_TYPES.SUGGESTION}>Suggestion</option>
                <option value={FEEDBACK_TYPES.CONCERN}>Concern</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={selectStyle}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="submit"
              disabled={loading}
              style={loading ? buttonDisabledStyle : primaryButtonStyle}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/feedback')}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
