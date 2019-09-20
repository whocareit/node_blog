const { REDIS_CONF } = require('../conf/db');
const redis = require('redis');

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
redisClient.on('error',err => {
    console.log(err);
})

const set = ( key ,val ) => {
    if(typeof val === 'object'){
        val = JSON.stringify(val);
    }
    redisClient.set(key , val , redis.print);
}

const get = key => {
    const promise = new Promise((resolve , reject) => {
        redisClient.get(key,(err,val) => {

            //如果抛出错误执行这个if逻辑
            if(err){
                reject(err);
                return;
            }

            //对val做一个兼容性的处理
            if(val === null){
                resolve(null);
                return null;
            }

            //判断当前返回出的val的类型，如果val是JSON就将其转化为val形式，如果不是，就直接使用
            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val);
            }
        })
    })
    return promise;
}

//最后设置以及获取值得方式给返回出去
module.exports = {
    set,
    get
}