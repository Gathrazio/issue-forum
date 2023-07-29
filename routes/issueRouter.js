const express = require('express');
const issueRouter = express.Router();
const User = require('../models/User.js');
const Issue = require('../models/Issue.js');

issueRouter.post('/', (req, res, next) => { // post issue
    req.body.author = req.auth._id;
    const newIssue = new Issue(req.body);
    newIssue.save()
        .then(savedIssue => res.status(201).send(savedIssue))
        .catch(err => {
            res.status(500)
            return next(err);
        })
})

issueRouter.get('/', (req, res, next) => { // get all issues
    Issue.find()
        .then(issues => res.status(200).send(issues))
        .catch(err => {
            res.status(500)
            return next(err);
        })
})

issueRouter.get('/user', (req, res, next) => {
    Issue.find({ author: req.auth._id })
        .then(usersIssues => res.status(200).send(usersIssues))
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to find the user's posted issues."))
        })
})

issueRouter.put('/update/:issueID', (req, res, next) => { // update an issue, but only if the user is the author
    Issue.findOneAndUpdate(
        { _id: req.params.issueID,  author: req.auth._id },
        req.body,
        { new: true }
    )
        .then(updatedIssue => {
            if (!updatedIssue) {
                res.status(403)
                return next(new Error("Failed to update issue; user may not be authorized to do so or the issue may not exist."))
            }
            return res.status(201).send(updatedIssue)
        })
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to update issue."))
        })
})

issueRouter.put('/update/likes/:issueID', (req, res, next) => { // update an issue's likes
    Issue.findOneAndUpdate(
        { _id: req.params.issueID },
        req.body,
        { new: true }
    )
        .then(updatedIssue => {
            if (!updatedIssue) {
                res.status(403)
                return next(new Error("Failed to update issue's likes; the issue may not exist."))
            }
            return res.status(201).send(updatedIssue)
        })
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to update issue's likes."))
        })
})

issueRouter.delete('/:issueID', (req, res, next) => { // delete an issue, but only if the user is the author
    Issue.findOneAndDelete({ _id: req.params.issueID, author: req.auth._id })
        .then(deletedIssue => {
            if (!deletedIssue) {
                res.status(403)
                return next(new Error("Failed to delete issue; user may not be authorized to do so or the issue may not exist."))
            }
            return res.status(201).send(deletedIssue)
        })
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to delete issue."))
        })
})

module.exports = issueRouter;