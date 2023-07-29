const express = require('express');
const commentRouter = express.Router();
const User = require('../models/User.js');
const Issue = require('../models/Issue.js');
const Comment = require('../models/Comment.js');

commentRouter.route('/')
    .get((req, res, next) => { // get all comments
        Comment.find()
            .then(comments => res.status(200).send(comments))
            .catch(err => {
                res.status(500)
                return next(err);
            })
    })
    .post((req, res, next) => { // post a comment
        req.body.author = req.auth._id;
        const newComment = new Comment(req.body);
        newComment.save()
            .then(savedComment => res.status(201).send(savedComment))
            .catch(err => {
                res.status(500)
                return next(err);
            })
    })

commentRouter.route('/issue/:issueID')
    .get((req, res, next) => { // get all comments related to an issue
        Comment.find({ issue: req.params.issueID })
            .then(comments => res.status(200).send(comments))
            .catch(err => {
                res.status(500)
                return next(err);
            })
    })

module.exports = commentRouter;