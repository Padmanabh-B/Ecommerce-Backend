const BigPromise = require("../middlewares/bigPromise")

/* @Home */
exports.home = BigPromise(async(req, res) => {
    // const db = await something
    res.status(200).json({
        success: true,
        greeting: "Hello From API"
    });
})


exports.homeDummy = BigPromise((req, res) => {
    res.status(200).json({
        success: true,
        greeting: "Hello From API Dummy"
    })
})