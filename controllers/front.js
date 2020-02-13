const moment = require('moment')

exports.home = async function (req, res, next) {
    try{
        res.render('home')
    } catch(e) {
        console.log(e)
    }
}