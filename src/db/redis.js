const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
redisClient.on('error',err=>{
    console.log(err);
});

function set(key,val){
    if(typeof val === 'object'){
        val = JSON.stringify(val);
    }
    redisClient.set(key,val,redis.print);
}

function get(key){
    return new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            err && reject(err);
            if(val == null){
                resolve(null)
            }
            try {
                resolve(JSON.parse(val));
            } catch (error) {
                resolve(val);
            }
            //退出
            // redisClient.quit();
        });
    })
}


module.exports = {
    get,
    set
}