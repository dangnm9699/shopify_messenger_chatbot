const config = require("../config/config")
const mongoose = require('mongoose')

const uri = `mongodb+srv://${config.userMongoDB}:${config.passwordMongoDB}@${config.ClusterMongoDB}/${config.MongoDB}?retryWrites=true&w=majority`

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to database ${config.userMongoDB}`)
}).catch(err => {
    console.error(`Failed to connect to database ${config.userMongoDB}: ${err}`)
    process.exit(1)
})

console.log("Connecting to database...");

var db = mongoose.connection

module.exports = db