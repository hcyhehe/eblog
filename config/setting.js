
module.exports = {
    mysql:{
		connectionLimit: 20,
		connectTimeout: 5*1000,
        host: '127.0.0.1',
		port : '3306',
        database: 'eblog',
        
        user: 'root',
        password: 'root',    //server
    },

    port: '8089',   //端口设置
}