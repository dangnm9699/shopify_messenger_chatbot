const path = require('path')
require('dotenv').config()

exports.port = process.env.PORT
exports.userMongoDB = process.env.MONGO_USER 
exports.passwordMongoDB = process.env.MONGO_PASSWORD 
exports.MongoDB = process.env.MONGO_DB 
exports.CollectionMongoDB = process.env.MONGO_COLLECTION 
exports.ClusterMongoDB = process.env.MONGO_CLUSTER 