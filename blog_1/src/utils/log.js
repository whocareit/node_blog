const fs = require('fs');
const path = require('path');

//写日志
const writeLog = (writeStream, log) => {
    writeStream.write(log + '\n'); //写入内容
}

//生成写文件流
const createWriteStream = (fliename) => {
    //join()中的内容所说的是上两级目录下的logs下的文件
    const fullFileName = path.join(__dirname, '../' ,'../' , 'logs' ,fliename);
    const writeStream = fs.createWriteStream(fullFileName , {
        flags: 'a' //表示在文件中追加内容
    })
    return writeStream;
}

//写访问日志
const accessWriteStream = createWriteStream('access.log');

const access = (log) => {
    writeLog(accessWriteStream  ,log);
}

module.exports = {
    access
}