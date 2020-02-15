const moment = require('moment')
const conn = require('../../config/pool')
const tool = require('../../commons/tool')


exports.home = async function (req, res, next) {
    try{
        let sql = ' select * from article where is_deleted = 1 order by create_time desc '
        let [raw] = await conn.query(sql)
        let sql2 = ' select * from article where is_deleted = 1 order by watch_num desc '
        let [raw2] = await conn.query(sql2)
        let sql3 = ' select * from anounce limit 1 '
        let [[raw3]] = await conn.query(sql3)
        raw.map(item=>{
            item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
            item.content = tool.delHtmlTag(unescape(item.content))
        })
        raw2.map(item=>{
            item.create_time = moment(item.create_time).format('YYYY-MM-DD')
            item.content = tool.delHtmlTag(unescape(item.content))
        })

        res.render('home', {
            title: 'JS全栈开发 - 首页',
            articles: raw,
            aside: raw2,
            anounce: raw3
        })
    } catch(e) {
        console.log(e)
    }
}


exports.article = async function (req, res, next) {
    try{
        let id = req.query.id
        //console.log(id)
        let sql = ' select * from article where id = \'' +id+ '\' '
        let [[raw]] = await conn.query(sql)
        raw.create_time = moment(raw.create_time).format('YYYY-MM-DD HH:mm:ss')
        raw.content = unescape(raw.content)
        raw.tags = raw.tags.split(',')
        let sql2 = ' select * from article where is_deleted = 1 order by watch_num desc '
        let [raw2] = await conn.query(sql2)
        raw2.map(item=>{
            item.create_time = moment(item.create_time).format('YYYY-MM-DD')
            item.content = tool.delHtmlTag(unescape(item.content))
        })
        //增加文章访问量
        let sql3 = ' update article set watch_num = watch_num + 1 where id = \''+raw.id+'\' '
        await conn.query(sql3)
        res.render('article', {
            title: raw.title,
            article: raw,
            aside: raw2
        })
    } catch(e) {
        console.log(e)
    }
}