
const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

try {

    //创建链接对象
    const con = mysql.createConnection(MYSQL_CONF);

    //开始链接
    con.connect();

    // 统一执行 sql 的函数

    function exec(sql) {
        return new Promise((resole, reject) => {
            //查询
            con.query(sql, (err, result) => {
                err ? reject(err) : resole(result);
            });
        });
    }

} catch (error) {
    console.log(error)
}

module.exports = {
    exec,
    escape:mysql.escape
}