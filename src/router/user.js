const {
    login
} = require('../controller/user');

const { set } = require('../db/redis');

const { SuccessModel, ErrorModel } = require('../model/resModel');


const handleUserRouter = async (req, res) => {
    const { path, method } = req;
    //登录
    if (method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.query;//req.body;
        const result = await login(username, password);
        if (result.username) {
            //设置session
            req.session.username = result.username;
            req.session.realName = result.realName;
            //同步到 redis
            set(req.sessionId,req.session);
            return new SuccessModel()
        };
        return new ErrorModel('登录失败');
    }
    // 登录验证的测试
    // if (method === 'GET' && path === '/api/user/login-test') {
    //     if (req.cookie.username) return Promise.resolve(new SuccessModel());
    //     return Promise.resolve(new ErrorModel('尚未登录'));
    // }
}

module.exports = handleUserRouter;