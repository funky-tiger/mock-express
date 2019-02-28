// const express = require('express');
const express = require('./express');

let app = new express();

app.get('/',(req,res)=>{
    res.end('home Page.');
});

app.get('/center',(req,res)=>{
    res.end('center Page.');
});

/** 匹配到动态路由 获取路由参数并返回 */
app.get('/product/:id/:name',(req,res)=>{
    res.end(JSON.stringify(req.params));
});

/** 当以上路径都没有匹配成功时 返回404 */
app.all('*',(req,res)=>{
    res.end('404');
});

let port = 3000;

app.listen(port,()=>{
    console.log(`Server is start on port ${port}`);
});