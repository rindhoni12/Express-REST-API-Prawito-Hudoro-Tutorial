const express = require('express');

const app = express();
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type, Authorization');
    next();
})

app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({ message: message, data: data });
})

app.listen(4000);