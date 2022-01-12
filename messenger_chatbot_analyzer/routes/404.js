module.exports = function (req, res) {
    res.status(404).json({
        meta: {
            code: 404,
            message: `${req.originalUrl} not found`
        }
    })
}