module.exports = function (req, res) {
    res.status(404).json({
        meta: {
            status: 404,
            message: `${req.originalUrl} not found`
        }
    })
}