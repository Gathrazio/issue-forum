const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const opinionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    agree: {
        type: Number,
        enum: [-1, 0, 1],
        required: true,
        default: 0
    }
}, { _id: false })

const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    opinions: {
        type: [opinionSchema],
        required: true,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model("Issue", issueSchema);