import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import EditPostModal from '../components/EditPostModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [error, setError] = useState('');
  
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
        setError('Failed to load feed.');
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const { data: newPost } = await api.post('/posts', { text: newPostText });
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setError('');
    } catch (err) {
      console.error('Failed to create post', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const { data: updatedPost } = await api.put(`/posts/${postId}/like`);
      setPosts(posts.map((post) => 
        post._id === postId ? updatedPost : post
      ));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post', err);
      setError(err.response?.data?.message || 'Failed to delete post.');
    }
  };
  
  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    setEditingPost(null);
  };

  const hasLiked = (post) => post.likes.includes(user._id);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="post-creator">
          <form onSubmit={handlePostSubmit}>
            <textarea
              placeholder="What's on your mind?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              rows="3"
            />
            <button type="submit">Post</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="post-feed">
          <h2>Campus Feed</h2>
          {posts.length === 0 ? (
            <p>No posts yet. Be the first!</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.user.name}</h3>
                <p>{post.text}</p>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
                
                <div className="post-actions">
                  <button 
                    onClick={() => handleLikePost(post._id)}
                    className={`like-button ${hasLiked(post) ? 'liked' : ''}`}
                  >
                    ❤️ {hasLiked(post) ? 'Liked' : 'Like'} ({post.likes.length})
                  </button>
                  
                  {post.user._id === user._id && (
                    <>
                      <button 
                        onClick={() => setEditingPost(post)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}
    </>
  );
};

export default Dashboard;