const express = require('express')
const cors = require('cors')

const port = require('./config/config').port
const db = require('./models/database')
const routes = require('./routes/routes')

const app = express()

app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        //console.log(origin)
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
}))


routes(app)

app.listen(port, () => console.log(`App is listening on port ${port}`))

// ChatlogController.getTopFindingByCollection(3).then((result) => {
//     console.log("getTopFindingByCollection:\n");
//     console.log(result);
// })

// ChatlogController.getTopFindingByGender(3).then((result) => {
//     console.log("getTopFindingByGender:\n");
//     console.log(result[0].product);
//     console.log(result[1].product);
// })