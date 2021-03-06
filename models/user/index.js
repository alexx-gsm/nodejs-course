const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    hash: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = User = mongoose.model('User', UserSchema)
