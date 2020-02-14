const moment = require('moment')
const crypto = require('crypto')
const code = require('../../commons/code')
const conn = require('../../config/pool')


exports.login = async function (req, res, next) {
    try{
        let username = req.body.username;
        let password = req.body.password;
        if(!username || !password){
            return res.send({"code": 4000000, "msg": code[4000000] });
        }
        
        let sql = ' select id, username, role from admin '+
                  ' where username = \''+username+'\' and password = \''+password+'\' ';
        let raw = await conn.query(sql);
        if(raw[0].length == 0){
            return res.send({"code": 4000002, "msg": code[4000002] });
        } 

        let id = raw[0][0].id;
        let data = raw[0][0];

        //插入最后登录时间，ip
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
        if(ip == '::1') ip = '127.0.0.1';
        let sql2 = ' update admin set last_login_time = \''+now+'\', last_login_ip = \''+ip+'\' where id = '+id; 
        await conn.query(sql2);
        
        if(data.role == 0){data.role = ['visitor'];data.token = 'visitor';}
        if(data.role == 1){data.role = ['editor'];data.token = 'editor';}
        if(data.role == 2){data.role = ['admin'];data.token = 'admin';}

        res.send({ "code": 2000000, "msg": code['2000000'], data:data });
    } catch(e) {
        console.log(e);
        res.send({"code": 5000000,"msg": code['5000000'] });
    }
}