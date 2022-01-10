const config = require('../config/config')
const mongoose = require('mongoose')

const ChatlogSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    events: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model(String(config.CollectionMongoDB), ChatlogSchema)