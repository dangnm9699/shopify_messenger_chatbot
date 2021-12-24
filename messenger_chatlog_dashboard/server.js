const db = require('./models/database')
const ChatlogController = require('./controllers/chatlogController')

ChatlogController.getTopFindingByCollection(3).then((result) => {
    console.log("getTopFindingByCollection:\n");
    console.log(result);
})

// ChatlogController.getTopFindingByGender(3).then((result) => {
//     console.log("getTopFindingByGender:\n");
//     console.log(result[0].product);
//     console.log(result[1].product);
// })

console.log("App is running...")