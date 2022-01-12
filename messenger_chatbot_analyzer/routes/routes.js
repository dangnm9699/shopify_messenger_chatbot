const notFound = require('./404')
const chatlogRouter = require('./chatlogRoutes')


module.exports = function (app) {
    app.use('/api/chatlog', chatlogRouter)

    app.use(notFound)
}