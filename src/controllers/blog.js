const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {
    const { title, body } = req.body; 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak memenuhi kriteria');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const Posting = new BlogPost({
        title: title,
        body: body,
        author: { uid: 1, name: 'Ahmad Rindhoni' }
    })

    Posting.save()
    .then(result => {
        res.status(201).json({
            message: 'Create Blog Post Success',
            data: result
        });
    })
    .catch(err => {
        console.log('err: ', err);
    });
}