import express from 'express';
import {
  createPost,
  getPosts,
  likePost,
  deletePost,
  updatePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createPost).get(getPosts);
router.route('/:id/like').put(protect, likePost);

router
  .route('/:id')
  .delete(protect, deletePost)
  .put(protect, updatePost);

export default router;