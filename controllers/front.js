const moment = require('moment')

exports.home = async function (req, res, next) {
    try{
        res.render('home', {
            title: 'JS全栈开发',
            articles: [1,2,3,4,5,6,7,8,9,10],
            aside: [1,2,3]
        })
    } catch(e) {
        console.log(e)
    }
}