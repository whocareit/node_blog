//处理发送的请求所获得信息是否符合要求
class BaseMOdel{
    //data和message信息的获取
    constructor(data,message){
        //第一个参数传入的是message
        if(typeof data === 'string'){
            this.message = message;
            data = null;
            message = null;
        }
        if(data){
            this.data = data;
        }
        if(message){
            this.message = message;
        }
    }
}

//请求成功返回errno = 0  请求失败返回errno = -1

class SuccessModel extends BaseMOdel{
    constructor(data,message){
        super(data,message);
        this.errno = 0;
    }
}

class ErrorModel extends BaseMOdel{
    constructor(data,message){
        super(data,message);
        this.errno = -1;
    }
}

//导出SuccessModel和ErrorModel
module.exports = {
    SuccessModel,
    ErrorModel
}

