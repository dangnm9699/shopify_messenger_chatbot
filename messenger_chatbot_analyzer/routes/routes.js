const notFound = require('./404')
const chatlogRouter = require('./chatlogRoutes')


module.exports = function (app) {
    app.use('/chatlog', chatlogRouter)

    app.use(notFound)
}