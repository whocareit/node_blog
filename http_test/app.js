const http = require('http');
// 使用node去处理get请求
// 获取url参数
// const querystring = require('querystring');

// const server = http.createServer((req,res) => {
//     console.log('method:',req.method); //GET
//     const url = req.url;
//     console.log('url:',url);
//     req.query = querystring.parse(url.split('?')[1]);
//     console.log('req.query',req.query);
//     res.end(
//         JSON.stringify(req.query)
//     )
// })

// 使用node去处理post请求
// const server = http.createServer((req,res) => {
//     if(req.method === 'POST'){
//         //req数据格式
//         console.log('req content-type:',req.headers['content-type']);
//         //postData来接收数据
//         const postData = '';
//         req.on('data',chunk => {
//             postData += chunk.toString();
//         })
//         req.on('end',() => {
//             console.log('postData:',postData);
//             res.end('ni hao!');
//         })
//     }
// })


const querystring = require('querystring');

const server = http.createServer((req,res) => {
    const method = req.method;
    const url = req.url;
    const path = url.split('?')[0];
    const query = querystring.parse(url.split('?')[1]);

    // 设置返回格式为JSON格式
    res.setHeader('Content-type','application/json');

    const getData = {
        method,
        url,
        path,
        query
    }

    if(method === 'GET'){
        res.end(JSON.stringify(getData))
    }

    if(method === 'POST'){
        let postData = '';
        req.on('data',chunk => {
            postData += chunk.toString();
        })
        req.on('end',() => {
            getData.postData = postData;
            res.end(
                JSON.stringify(getData.postData)
            );
        });
    }

})
server.listen(8000);
console.log('ok');