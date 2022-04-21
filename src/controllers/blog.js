const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
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

exports.getAllBlogPost = (req, res, next) => {
    BlogPost.find()
    .then(result => {
        res.status(200).json({
            message: 'Get All Data(s) Success',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result => {
        if(!result) {
            const error = new Error('Post tidak ditemukan');
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Showing Post By Id Success',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.updateBlogPost = (req, res, next) => {
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
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        // jika post ditemukan maka ubah data lam dg yg baru
        post.title = title;
        post.body = body;
        post.image = image;

        return post.save(); // lalu simpan, karena menghasilkan promise, buat then kedua dibawahnya
    })
    .then(result => {
        res.status(200).json({
            message: 'Update Post Success',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Delete Post Success',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('my dirname: ', __dirname);

    // dirname: C:\Users\Rindhoni\Desktop\Latihan\Tutorial MERN Prawito Hudoro\src\controllers
    // filePath: images/1650518567880-d92nqvc-217ec91a-8551-4ffb-a295-942e1324b4f1.png
    filePath = path.join(__dirname, '../..', filePath);
    // new filePath: C:\Users\Rindhoni\Desktop\Latihan\Tutorial MERN Prawito Hudoro\images\1650518567880-d92nqvc-217ec91a-8551-4ffb-a295-942e1324b4f1.png
    // console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}