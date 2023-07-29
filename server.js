const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config()

app.use(express.json())
app.use(morgan('dev'))

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connected to rtvdb'))

app.use('/api/auth', require('./routes/authRouter.js'))
app.use('/api/protected', jwt({ secret: process.env.USER_SECRET, algorithms: ['HS256'] }))
app.use('/api/protected/issues', require('./routes/issueRouter.js'))
app.use('/api/protected/comments', require('./routes/commentRouter.js'))
app.use('/api/protected/users', require('./routes/usersRouter.js'))

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

app.listen(9000)