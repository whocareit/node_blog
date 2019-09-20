const crypto = require('crypto');

//密匙  用于加密密码  不能暴露否则很容易就会被黑客攻破信息
const SECRET_KEY = 'WJhou1@@_59454#';

//md5加密
const md5 = (content) => {
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}


//加密函数
const genPassword = password => {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
}

module.exports = {
    genPassword
}