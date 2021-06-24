const crypto = require('crypto');

//密匙
const SECRET_KEY = 'WJiol_8766#';

// md5加密
function md5(content){
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password){
    password = `${password}&key=${SECRET_KEY}`;
    return md5(password);
}

module.exports = {
    genPassword
}