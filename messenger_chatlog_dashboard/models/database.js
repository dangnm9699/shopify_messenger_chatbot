const config = require("../config/config")
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')

const uri = `mongodb+srv://${config.userMongoDB}:${config.passwordMongoDB}@${config.ClusterMongoDB}/${config.MongoDB}?retryWrites=true&w=majority`

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to %s", config.userMongoDB)
}).catch(err => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
})

console.log("Connecting to database...");

var db = mongoose.connection

module.exports = db