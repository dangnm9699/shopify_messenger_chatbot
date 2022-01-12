const { json } = require('express')
const Conversations = require('../models/chatlog')

const Collections = ['giày', 'chân váy', 'váy', 'quần jeans', 'quần dài', 'quần short', 'quần', 'áo', 'áo sơ mi', 'áo len', 'áo khoác', 'áo thun']
const Gender = ['nam', 'nữ']

async function getTopFindingByCollection(req, res) {
    let kLimit = req.query.limit
    if (kLimit == undefined) {
        kLimit = Collections.length
    }

    let result = []
    for (i = 0; i < Collections.length; i++) {
        docs = await Conversations.find({
            "events.event": {
                $in: ['user', 'bot']
            },
            "events.text": {
                $regex: '.*' + Collections[i] + '.*',
                // $regex: '^'+Collections[i],
                $options: 'i' //Match both upper and lowercase
            }
        }).exec()

        result.push({
            count: docs.length,
            tag: Collections[i]
        })
    }

    result.sort((a, b) => (a.count > b.count) ? -1 : 1)

    if (kLimit > result.length) kLimit = result.length
    result = result.slice(0, kLimit)

    res.status(200).json({
        meta: {
            code: 200,
            message: "ok"
        },
        data: {
            top: result
        }
    })
}

async function getTopFindingByGender(req, res) {
    let kLimit = req.query.limit
    if (kLimit == undefined) {
        kLimit = Collections.length
    }

    let result = []
    for (i = 0; i < Gender.length; i++) {
        let tempResult = []
        for (j = 0; j < Collections.length; j++) {
            docs = await Conversations.find({
                $or: [
                    {
                        "events.event": "user",
                        "events.text": {
                            $regex: '.*' + Gender[i] + '.*' + Collections[j] + '.*',
                            $options: 'i' //Match both uppercase and lowercase
                        }
                    },
                    {
                        "events.event": "user",
                        "events.text": {
                            $regex: '.*' + Collections[j] + '.*' + Gender[i] + '.*',
                            $options: 'i' //Match both uppercase and lowercase
                        }
                    }
                ]
            }).exec()

            tempResult.push({
                count: docs.length,
                tag: Collections[j]
            })
        }
        tempResult.sort((a, b) => (a.count > b.count) ? -1 : 1)

        let tempKLimit = Math.min(tempResult.length, kLimit)
        result.push({
            gender: Gender[i],
            product: tempResult.slice(0, tempKLimit)
        })
    }

    res.status(200).json({
        meta: {
            code: 200,
            message: "ok"
        },
        data: {
            top: result
        }
    })
}

module.exports = {
    getTopFindingByCollection: getTopFindingByCollection,
    getTopFindingByGender: getTopFindingByGender,
}