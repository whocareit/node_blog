const env = process.env.NODE_ENV; //环境参数

let MYSQL_CONF;
let REDIS_CONF;

//线下环境使用,这个时候的服务器时本地的，如果在做线上开发的时候需要将host中的地址做一个更改
if(env === 'dev'){

    //配置mysql
    MYSQL_CONF= {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }

    //配置redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

//线上环境
if(env === 'production'){
    MYSQL_CONF= {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }

    //配置redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

//最后导出的是数据库中的信息
module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}