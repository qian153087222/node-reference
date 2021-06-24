const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { access } = require('./src/utils/log');

const {
    getCookieExpires
} = require('./utils');

// session 数据
const SESSION_DATA = {};

// 用于处理 post data
const getPostData = (req) => new Promise((resolve, reject) => {
    const { method, headers } = req;
    if (method !== 'POST') {
        resolve({});
        return;
    }

    if (headers['content-type'] !== 'application/json') {
        resolve({});
        return
    }

    let postData = '';

    req.on('data', chunk => {
        postData += chunk.toString();
    });

    req.on('end', () => {
        !postData ? resolve({}) : resolve(JSON.parse(postData));
    })
});
const serverHandle = async (req, res) => {
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);
    //设置返回格式 JSON
    res.setHeader('Content-type', 'application/json');
    const url = req.url
    req.path = url.split('?')[0];
    //解析 query
    req.query = querystring.parse(url.split('?')[1]);
    //解析cookie
    const cookieStr = req.headers.cookie || "";//k1=v1;k2=v2;
    //cookie对象
    const cookie = {};
    cookieStr.split(';').forEach(item => {
        if (!item) return;
        const cook = item.split('=');
        const key = cook[0].trim();
        const valuse = cook[1].trim();
        cookie[key] = valuse;
    });
    req.cookie = cookie;

    // 解析 session
    let userId = req.cookie.userid, needSetCookie = false;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];

    req.body = await getPostData(req);

    // 处理blog的路由
    const blogData = await handleBlogRouter(req, res);
    if (blogData) {
        if (needSetCookie) {
            //操作cookie 
            //httpOnly只允许server修改cookie
            // path = / 匹配所有路由
            // expires 设置过期时间
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        return res.end(JSON.stringify(blogData))
    };

    //处理user的路由
    const userData = await handleUserRouter(req, res);
    if (userData) {
        if (needSetCookie) {
            //操作cookie 
            //httpOnly只允许server修改cookie
            // path = / 匹配所有路由
            // expires 设置过期时间
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
        };
        return res.end(JSON.stringify(userData));
    };

    //未命中路由，返回404
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Fond\n");
    res.end();

}

module.exports = serverHandle

// process.env.NODE_ENV
