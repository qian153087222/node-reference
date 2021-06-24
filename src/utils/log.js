const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV; // 环境参数

// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n'); //关键代码
}

//生成 write Stream

function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs',fileName);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a',//累加 w 覆盖
    });
    return writeStream;
}

const visitWrite = ['access','error','event'];//访问日志 错误日志 自定义事件日志

const visitWriteFn = {};
//批量添加 处理事件
for (let index = 0; index < visitWrite.length; index++) {
    //日志
    const write = visitWrite[index];
    const accessWriteStream = createWriteStream(write+'.log');
    visitWriteFn[write] = function(log){
        if(env === 'dev'){
            console.log(log);
        }
        if(env === 'production'){
            writeLog(accessWriteStream, log);
        }
    }
}

module.exports = visitWriteFn;