const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IdeaSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    details: {
        type: String,
        require: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = Ideas = mongoose.model('ideas', IdeaSchema)
