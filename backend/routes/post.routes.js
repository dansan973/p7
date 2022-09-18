const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require("multer");
const upload = multer();
const auth = require('../middleware/auth.middleware')

router.get('/', auth.requireAuth, postController.readPost);
router.post('/', auth.requireAuth, postController.createPost);
router.put('/:id', auth.requireAuth, postController.updatePost);
router.delete('/:id', auth.requireAuth, postController.deletePost);
router.patch('/like-post/:id', auth.requireAuth, postController.likePost)

module.exports = router;