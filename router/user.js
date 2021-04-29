const { exec } = require('../db/mysql');
const { signUp, login } = require('../controller/user'); // 解构赋值的方式直接取相应的方法
const handleUserRouter = (req, res) => {
  switch (req.path) {
    case '/user/signup':
      signUp(req, res);
      break;
    case '/user/login':
      break;
    case '/user/changepassword':
      break;
    case '/user/resetpassword':
      break;
    case '/user/modifypersonalinfor':
      break;
    default:
      break;
  }
};
module.exports = handleUserRouter;
