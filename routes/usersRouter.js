const express = require('express');
const usersRouter = express.Router();
const User = require('../models/User.js');

usersRouter.route('/')
    .get((req, res, next) => {
        User.find()
            .then(users => {
                const thinnedUsers = users.map(user => user.justUsername())
                return res.status(200).send(thinnedUsers);
            })
            .catch(err => {
                res.status(500)
                return next(err);
            })
    })


module.exports = usersRouter;