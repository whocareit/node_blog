const fs = require('fs');
const path = require('path');
const readline = require('readline');

//获取文件名
const fileName = path.join(__dirname, '../' , '../' , 'logs' ,'access.log');
//创建 read stream
const readStream = fs.createReadStream(fileName);

//创建readline对象
const rl = readline.createInterface({
    input : readStream
})

let chromeNum = 0;
let sum = 0;

//逐行读取
rl.on('line' , dataLine => {
    if(!dataLine){
        return;
    }

    sum++;
    //分析日志中的chrome
    const arr = dataLine.split(' -- ');
    if(arr[2] && arr[2].indexOf('Chrome') > 0){
        chromeNum ++ ;
    }
})

rl.on('close' , () => {
    console.log('占比为',chromeNum / sum)
})