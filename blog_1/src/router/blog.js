const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

//统一验证的函数
const loginCheck = (req) => {
    if(! req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method; //获取请求方式
    const id = req.query.id;

    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keywords = req.query.keywords || '';
        // const listData = getList(author,keywords);
        // return new SuccessModel(listData);
        //因为这里result返回的是一个promise对象因此在这里使用then方法来进行处理
        const result = getList(author, keywords);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const detailData = getDetail(id);
        // return new SuccessModel(detailData);
        const result = getDetail(id);
        return result.then(detailData => {
            return new SuccessModel(detailData);
        })
    }

    if (method === 'POST' && req.path === '/api/blog/new') {

        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }

        // const data = newBlog(req.body);
        // return new SuccessModel(data);
        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    if (method === 'POST' && req.path === '/api/blog/delete') {
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }


        // 在这里设置假数据的原因是在删除博客的时候不仅需要id还需要作者的名字
        const author = req.session.username;
        const result = delBlog(id, author);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel('删除博客失败');
            }

        })
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }


        const result = updateBlog(id, req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel('更新博客失败');
            }
        })
    }
}
module.exports = handleBlogRouter;