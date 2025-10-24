import Post from '../models/postModel.js';
import mongoose from 'mongoose';

const createPost = async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Post text is required' });
  }

  try {
    const post = new Post({
      text,
      user: req.user._id,
    });

    const createdPost = await post.save();
    
    await createdPost.populate('user', 'name');

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 }); 
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    
    const updatedPost = await Post.findById(post._id).populate('user', 'name');
    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(4404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- ADD THIS NEW FUNCTION ---
const updatePost = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.text = text || post.text;
    
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('user', 'name');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- UPDATE THIS EXPORT LIST ---
export { createPost, getPosts, likePost, deletePost, updatePost };