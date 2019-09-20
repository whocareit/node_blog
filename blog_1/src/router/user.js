const { UserMes } = require('../controller/user');
const { SuccessModel,ErrorModel } = require('../model/resModel');
const { set } = require('../db/redis');


const handleUserRouter = (req,res) =>{
    const method = req.method;
    // const url = req.url;
    // const path = url.split('?')[0];

    if(method === 'POST' && req.path === '/api/user/login'){
        const { username, password } = req.body;
        // const { username, password } = req.query;
        const result =  UserMes(username ,password);
        return result.then(data => {
            console.log(username,password);
            if(data.username){
                //设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                
                //同步到redis当中
                set(req.sessionid, req.session);
                
                return new SuccessModel();
            }
            return new ErrorModel('登录失败');
        })
        // if(result){
        //     return new SuccessModel();
        // }else{
        //     return new ErrorModel('登录失败');
        // }
    }

    //登录验证测试
    // if(method === 'GET' && req.path === '/api/user/login-test'){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel({
    //             username: req.session.username
    //         }
    //         ));
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'));
    // }
}
module.exports = handleUserRouter;