let http = require('http');
let url = require('url');
let methods = require('methods');

function application(){
    let app = (req,res) => {
        let { pathname } = url.parse(req.url);
        let requestMethod = req.method.toLowerCase();
        for(let i = 0; i < app.routes.length; i++){
            let { path, method, cb } = app.routes[i];
            /** 7 如果请求路径path中 就说明该路由是动态的 */
            if(path.params){
                /** 8 匹配该动态路由后面的动态参数 匹配成功返回true */
                if(path.test(pathname)){
                    /** 9 解构赋值 拿到动态路由的参数 */
                    let [, ...otherParams] = pathname.match(path);
                    /** 10 通过reduce()方法 将路由参数转换为对象形式
                     * 并放到req.params中
                     */
                    req.params = path.params.reduce(
                        (memo,key,index)=>(
                            memo[key]=otherParams[index],memo
                        ),{}
                    );
                    /** 11 返回匹配到的动态路由 */
                    return cb(req,res);
                }
            }

            if((pathname===path||path==='*') && (requestMethod===method)||method==='all'){
                return cb(req,res);
            }
        }
        res.end(`Cannot found ${pathname}/${requestMethod}`);
    }

    app.routes = [];
    [...methods,'all'].forEach((method)=>{
        app[method] = function(path,cb){
            let layer = { path, method, cb };

            /** 1 定义一个空数组 来存放动态路由的参数 */
            let params = [];
            /** 2 如果路径中包含: 说明该路由是动态路由 */
            if(path.includes(':')){
                /** 3 更改该动态路由的路径path为一个正则表达式
                 * 目的是为了等真正请求到来时 匹配到该动态路由 并拿到路由参数
                 */
                layer.path = new RegExp(path.replace(/:([^\/]*)/g,function(){
                    /** 4 将动态路由参数的key 放入params数组中 */
                    params.push(arguments[1]);
                    /** 5 返回了一个正则来匹配真正的动态路由参数 注意此处没有: */
                    return '([^\/]*)';
                }));
                /** 6 把解析到的动态路由放到该路由路径path的params上 */
                layer.path.params = params;
            }

            app.routes.push(layer);
        }
    });

    app.listen = function(...arguments){
        let server = http.createServer(app);
        server.listen(...arguments);
    }

    return app;
}

module.exports = application;












