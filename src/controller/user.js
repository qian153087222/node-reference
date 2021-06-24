const { exec,escape } = require('../db/mysql');

//登录
const login = async (username, password) => {
    username = escape(username); 
    password = escape(password); 
    const sql = `
    select username, realname from users where username='${username}' and password='${password}'
    `;
    const [result] = await exec(sql);
    return result || {};
}

module.exports = { login };