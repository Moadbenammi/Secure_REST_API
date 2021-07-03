const express = require('express');

const { getPosts, getPost, createPost, updatePost, likePost, deletePost } = require('../controllers/posts.js');

const router = express.Router();
const {auth} =  require("../middleware/auth.js");

router.get('/', getPosts);
router.post('/',auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

module.exports = router;