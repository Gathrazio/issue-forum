const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: 'Issue',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Comment", commentSchema);