const { validationResult } = require('express-validator');

exports.createBlogPost = (req, res, next) => {
    const { title, body } = req.body; 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak memenuhi kriteria');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const result = {
        message: 'Create Blog Post Success',
        data: {
            post_id: 1,
            title: "Blog Title",
            // image: blog1.png,
            body: "lorem ipsum dolor sit atme",
            created_at: "12/06/2022",
            author: {
                uid: 1,
                name: "Tester User"
            }
        }
    }
    res.status(201).json(result);
    next();
}