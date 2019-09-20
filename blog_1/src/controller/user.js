const { exec,escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const UserMes = (username,password) => {
    //使用mysql中的escape来防止sql的注入
    
    const password = escape(password);
    //进行加密
    password = genPassword(password);

    const username = escape(username);

    const sql = `
        select username,realname from user where username = ${username} and password = ${password};
    `;

    return exec(sql).then( data => {
        console.log(data[0])
        return data[0] || {};
    })
}

module.exports = {
    UserMes
}