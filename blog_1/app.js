const handleUserRouter = require('./src/router/user');
const handleBlogRouter = require('./src/router/blog');
const { access } = require('./src/utils/log')
const querystring = require('querystring');

//获取cooki过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    console.log('d.toGMTString() is ', d.toGMTString());
    return  d.toGMTString();
}

//session 数据
const SESSION_DATA = {};

//用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise;
}

const serverHandle = (req, res) => {
    //记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    //设置返回JSON的格式
    res.setHeader('Content-type', 'application/json');

    //代码优化
    const url = req.url; //获取请求url
    req.path = url.split('?')[0]; //获取路由

    //解析query
    req.query = querystring.parse(url.split('?')[1]);

    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; //获取到的cookie形式为k1=value1;k2=value2
    cookieStr.split(';').forEach(ele => {
        if(!ele){
            return; //做兼容性的处理
        }
        const arr = ele.split("=");
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });

    //解析session
    //首先将req.cookie.userid赋值给uerId,在session中只需要判断cookie中是否存在userId即可
    let needSetCookie = false;
    let userId = req.cookie.userid;  //两者都是变量而不是常量
    if(userId){
        if(!SESSION_DATA[userId]){
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()*10}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];

    //处理post data
    getPostData(req).then(postData => {
        req.body = postData;

        //因为此时所获取到的hanleBlogRouter，返回的是一个promise对象，因此在这里需要对信息做一个处理
        //处理blog路由
        const blogResult = handleBlogRouter(req,res);
        if(blogResult){
            blogResult.then(blogData => {

                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userid='${userId}'; path='/'; httpOnly; expires=${getCookieExpires()}`);
                }

                if(blogData){
                    res.end(
                        JSON.stringify(blogData)
                    )
                }
            })
            return
        }

        // const blogData = handleBlogRouter(req, res);
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }

        const userResult = handleUserRouter(req, res);
        if(userResult){
            userResult.then(userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userid='${userId}'; path='/'; httpOnly; expires=${getCookieExpires()}`);
                }

                res.end(
                        JSON.stringify(userData)
                    )
            })
            return;
        }

        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        //未命中路由就执行下面的操作
        res.writeHead(404, { "Content-type": "text/plain" });
        res.write("404 Not Found\n");
        res.end()

    })
}
module.exports = serverHandle;
//process.env.NODE_ENV