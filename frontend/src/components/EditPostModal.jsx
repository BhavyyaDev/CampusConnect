import React, { useState } from 'react';
import api from '../services/api';
import './EditPostModal.css';

const EditPostModal = ({ post, onClose, onUpdate }) => {
  const [text, setText] = useState(post.text);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!text.trim()) {
      setError('Post text cannot be empty.');
      return;
    }

    try {
      const { data: updatedPost } = await api.put(`/posts/${post._id}`, { text });
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      setError('Failed to update post.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;