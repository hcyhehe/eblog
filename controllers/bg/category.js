const moment = require('moment')
const code = require('../../commons/code')
const conn = require('../../config/pool')


exports.list = async function (req, res, next) {
    try{
        let pages = parseInt(req.query.pages)
        let limit = parseInt(req.query.limit)
        let skip = parseInt(pages - 1) * limit
        if(!pages || !limit){
            return res.send({"code": 4000000, "msg": code[4000000] });
        }

        let sql = ' select * from category where 1 = 1 '
        let sql2 = ' select count(*) as count from category where 1 = 1 '

        sql += ` order by sort asc limit `+skip+`,`+limit
        //console.log(sql)
        let [list] = await conn.query(sql)
        let countRaw = await conn.query(sql2)
        let count = countRaw[0][0].count
        
        res.send({ "code": 2000000, "msg": code['2000000'], pages:pages, limit:limit, count:count, data:list })
    } catch(e) {
        console.log(e);
        res.send({ "code": 5000000, "msg": code['5000000'], data:[] });
    }
}


exports.add = async function (req, res, next) {
    try{
        let name = req.body.name        
        let sort = req.body.sort || 1
        if(!name){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let sql = ' insert into category(name, sort) '+
                  ' values(\''+name+'\','+sort+') '
        //console.log(sql)
        await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}


exports.edit = async function (req, res, next) {
    try{
        let id = req.body.id
        let name = req.body.name        
        let sort = req.body.sort || 1
        if(!id || !name){
            return res.send({"code": 4000000, "msg": code[4000000] })
        }
        let sql = ' update category set name = \''+name+'\', sort = '+sort+' where id = '+id
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
        let sql = ' delete from category where id = '+id
        await conn.query(sql)

        res.send({ "code": 2000000, "msg": code['2000000'], data:{} })
    } catch(e) {
        console.log(e)
        res.send({ "code": 5000000, "msg": code['5000000'], data:{} })
    }
}

