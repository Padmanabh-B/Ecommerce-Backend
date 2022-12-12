//try catch and async - await || use Promise everywhere

module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next))
        .catch(error =>
            console.log(error),
            next


        )
}