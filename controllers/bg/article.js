const moment = require('moment')
const code = require('../../commons/code')
const tool = require('../../commons/tool')
const conn = require('../../config/pool')


exports.list = async function (req, res, next) {
    try{
        let title = req.query.title
        let pages = parseInt(req.query.pages)
        let limit = parseInt(req.query.limit)
        let skip = parseInt(pages - 1) * limit
        if(!pages || !limit){
            return res.send({"code": 4000000, "msg": code[4000000] });
        }

        let sql = ' select * from article where is_deleted = 1 '
        let sql2 = ' select count(*) as count from article where is_deleted = 1 '

        if(title){
            sql += ` and title like "%`+title+`%" `
            sql2 += ` and title like "%`+title+`%" `
        }

        sql += ` order by create_time desc limit `+skip+`,`+limit
        console.log(sql)
        let [list] = await conn.query(sql)
        let countRaw = await conn.query(sql2)
        let count = countRaw[0][0].count
        
        res.send({ "code": 2000000, "msg": code['2000000'], pages:pages, limit:limit, count:count, data:list })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:[] })
    }
}


exports.add = async function (req, res, next) {
    try{
        let title = req.body.title
        let content = escape(req.body.content)
        let img = req.body.img || ''
        let tags = req.body.tags
        let sort = req.body.sort || 1
        if(!title || !content){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let now = moment().format('YYYY-MM-DD HH:mm:ss')
        let id = new Date().getTime()
        let sql = ' insert into article(id, title, content, img, tags, sort, create_time) '+
                  ' values(\''+id+'\', \''+title+'\', \''+content+'\', \''+img+'\', \''+tags+'\', '+sort+', \''+now+'\') '
        //console.log(sql)
        await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}


exports.info = async function (req, res, next) {
    try{
        let id = req.query.id
        if(!id){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let sql = ' select * from article where id = '+id
        let [[raw]] = await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:raw })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}


exports.edit = async function (req, res, next) {
    try{
        let id = req.body.id
        let title = req.body.title
        let content = escape(req.body.content)
        let img = req.body.img || ''
        let tags = req.body.tags
        let sort = req.body.sort || 1
        if(!id || !title || !content){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let sql = ' update article set title = \''+title+'\', content = \''+content+'\', img = \''+img+'\', '+
                  ' tags = \''+tags+'\', sort = '+sort+' where id = '+id
        //console.log(sql)
        await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}


exports.del = async function (req, res, next) {
    try{
        let id = req.body.id
        if(!id){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let sql = ' update article set is_deleted = 2 where id = '+id
        await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}

