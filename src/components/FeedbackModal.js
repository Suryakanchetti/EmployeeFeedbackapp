import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TABLES, FEEDBACK_TYPES, FEEDBACK_STATUS } from '../supabase';

const FeedbackModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
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
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: FEEDBACK_TYPES.SUGGESTION,
        priority: 'medium'
      });
      
      // Call success callback
      onSuccess();
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

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        type: FEEDBACK_TYPES.SUGGESTION,
        priority: 'medium'
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  // Modal overlay styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const modalStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s'
  };

  const formGroupStyle = {
    marginBottom: '20px'
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
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s'
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
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Submit New Feedback</h2>
          <button 
            onClick={handleClose} 
            style={closeButtonStyle}
            disabled={loading}
          >
            ×
          </button>
        </div>

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
              type="button"
              onClick={handleClose}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={loading ? buttonDisabledStyle : primaryButtonStyle}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
