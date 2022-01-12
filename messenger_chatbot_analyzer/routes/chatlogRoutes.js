const chatlogRouter = require('express').Router()
const chatlogController = require('../controllers/chatlogController')
const notFound = require('./404')

chatlogRouter.get('/top-finding-collection', chatlogController.getTopFindingByCollection)
chatlogRouter.get('/top-finding-gender', chatlogController.getTopFindingByGender)

chatlogRouter.use(notFound)

module.exports = chatlogRouter
