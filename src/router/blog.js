const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

//统一的登录验证函数

const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
}


const handleBlogRouter = async (req, res) => {
    const { path, method } = req;
    const query = req.query;
    const { id } = query;

    //获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const { author = '', keyword = '' } = query;
        if (req.query.isadmin) {
            //管理员界面
            const loginCheckResult = loginCheck(req);
            if(loginCheckResult){
                //未登录
                return loginCheckResult;
            }
            //强制查询自己的博客
            author = req.session.username;
        }

        const listData = await getList(author, keyword);
        return new SuccessModel(listData);
    }

    //获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        const Blog = await getDetail(id);
        return new SuccessModel(Blog);
    }

    //新建一篇博客
    if (method === 'POST' && path === '/api/blog/new') {
        //验证登录

        //统一的登录验证函数
        const loginCheckResult = await loginCheck(req);

        if (loginCheckResult) {
            return loginCheckResult;
        }
        const data = await newBlog(req.body);
        return new SuccessModel(data);
    }

    //更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {
        //统一的登录验证函数
        const loginCheckResult = await loginCheck(req);

        if (loginCheckResult) {
            return loginCheckResult;
        }
        const result = await updateBlog(id, req.body);
        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('更新博客失败');
        }
    }

    //删除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {
        //统一的登录验证函数
        const loginCheckResult = await loginCheck(req);

        if (loginCheckResult) {
            return loginCheckResult;
        }
        const result = await delBlog(id, req.body.author);
        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('删除博客失败');
        }
    }
}

module.exports = handleBlogRouter;