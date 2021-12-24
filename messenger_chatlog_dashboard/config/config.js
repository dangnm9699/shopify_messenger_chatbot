const path = require('path')
require('dotenv').config()

exports.userMongoDB = process.env.MONGO_USER || "tuantungdang"
exports.passwordMongoDB = process.env.MONGO_PASSWORD || "dangtuantung"
exports.MongoDB = process.env.MONGO_DB || "rasa"
exports.CollectionMongoDB = process.env.MONGO_COLLECTION || "conversations"
exports.ClusterMongoDB = process.env.MONGO_CLUSTER || "cluster0.ibd9d.mongodb.net"