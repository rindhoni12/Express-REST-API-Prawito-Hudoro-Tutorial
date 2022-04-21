const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak memenuhi kriteria');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    // pengkondisian untuk mengecek di dalam request sudah di sertakan file image apa belum
    if (!req.file) {
        const err = new Error('Image belum diupload');
        err.errorStatus = 422;
        throw err;
    }

    // console.log(req.file);
    const image = req.file.path.replace(/\\/g, "/");
    // console.log(image);
    const { title, body } = req.body; 

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
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