const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const blogController = require('../controllers/blog')

// POST CREATE : http://localhost:4000/v1/blog/post
router.post('/post', [
    body('title').isLength({min: 5}).withMessage('Title tidak memenuhi kriteria'),
    body('body').isLength({min: 5}).withMessage('Body tidak memenuhi kriteria')
], blogController.createBlogPost)


module.exports = router;