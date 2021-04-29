const http = require('http');
const urlObj = require('url');
const handleUserRouter = require('./router/user');
const PORT = 3000;
const IP = '127.0.0.1';
const routerMap = {
  '/user/signup': handleUserRouter,
  '/user/login': handleUserRouter,
  '/user/changepassword': handleUserRouter,
  '/user/resetpassword': handleUserRouter,
  '/user/modifypersonalinfor': handleUserRouter
};
const serverStart = () => {
  http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    req.path = urlObj.parse(req.url, true).pathname;
    // 获取请求参数，增加true后会转换成一个对象
    req.query = urlObj.parse(req.url, true).query;
    // 路由匹配的策略
    routerMap[req.path](req, res);
  })
  .listen(PORT, IP);
};
exports.serverStart = serverStart;

