const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

//创建连接
const con = mysql.createConnection(MYSQL_CONF);

//连接数据库
con.connect();

//统一的执行sql函数，因此在这里将里面的内容封装起来即可
function exec(sql){
    //在这里使用Promise来做这个异步的处理
    const promise = new Promise((resolve,reject) => {
        con.query(sql,(err,result) => {
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        })
    })
    return promise;
}

module.exports = {
    exec,
    escape: mysql.escape
}

