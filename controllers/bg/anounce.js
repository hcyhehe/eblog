const moment = require('moment')
const code = require('../../commons/code')
const conn = require('../../config/pool')


exports.edit = async function (req, res, next) {
    try{
        let title = req.body.title
        let content = req.body.content
        let sql = ' select * from rule limit 1 '
        let [[raw]] = await conn.query(sql)
        if(!raw){
            let sql2 = ' insert into anounce(title, content) values(\''+title+'\', \''+content+'\') '
            await conn.query(sql2)
        } else {
            let sql2 = ' update anounce set title = \''+title+'\', content = \''+content+'\' where id = '+raw.id
            await conn.query(sql2)
        }
        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}


exports.info = async function (req, res, next) {
    try{
        let sql = ' select * from anounce limit 1 '
        let [[raw]] = await conn.query(sql)
        res.send({ "code": 2000000, "msg": code['2000000'], data:raw })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}
