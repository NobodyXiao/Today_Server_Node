const { exec } = require('../db/mysql');
const querystring = require('querystring');
const sha1 = require('sha1');
const UUID = require('uuid');
const { insert } = require('../db/querys');
const fs = require('fs');
const path = require('path');
const login = (req) => {
  let username = req.username
  let password = req.password
  const sql = `select username,realname from users where username='${username}' and password = ${password}`
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

const signUp = (req, res) => { 
  // 获取客户端传来的各个字段数据
  let str = "";
  req.on('data', function (data) {
    str += data;
  });
  req.on('end', function () {
    //即得到JSON形式的数据。这种方式处理过POST请求的数据较为方便。
    let postData = querystring.parse(str);
    let errorMsg = validateInfor(postData);
    res.writeHead(200, { 'Content-type': 'text/plain' });
    // 如果有错误，服务端直接返回报错
    if (errorMsg) {
      res.write(JSON.stringify({
          success: false,
          msg: errorMsg
        })
      );
    } else {
      // 如果没有错误，进行服务端
      postData.password = sha1(postData.password);
      postData['userid'] = UUID.v1();
      // 数据库中进行用户名, 昵称, 邮箱, 电话的查重
      const sql = insert(postData, 'user');
      exec(sql).then((rows) => {
        console.log(rows[0]);
      });
    }
    res.end();
  });
}

// 校验用户名以及密码等信息的合法性
const validateInfor = (personInfor) => { 
  let errorMsg = '';
  let requiredErrorMsgMap = {
    username: '用户名必填',
    password: '密码必填',
    nickname: '昵称必填',
    sex: '性别必填',
    email: '邮箱必填'
  };
  let passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  let emailReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
  let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  for (let key in personInfor) { 
    if (!errorMsg) { 
      (!personInfor[key] && requiredErrorMsgMap.hasOwnProperty(key)) 
        && (errorMsg = requiredErrorMsgMap[key]);
    }
  }
  // 对用户名进行长度校验
  if (!errorMsg && (personInfor.username.length < 8 || personInfor.username.length > 100)) { 
    errorMsg = '用户名长度在8-100之间';
  }
  
  // 对昵称进行长度校验
  if (!errorMsg && (personInfor.nickname.length < 8 || personInfor.nickname.length > 100)) { 
    errorMsg = '昵称长度在8-100之间';
  }

  // 对密码进行格式校验
  if (!errorMsg && !passwordReg.test(personInfor.password)) { 
    errorMsg = '密码必须包含数字，大写字母，小写字母，特殊字符"@$!%*?&",且长度介于8-16位';
  }

  // 对邮箱进行格式校验
  if (!errorMsg && !emailReg.test(personInfor.email)) { 
    errorMsg = '请输入正确的邮箱地址';
  }

  // 对手机号进行格式校验
  if (!errorMsg && !personInfor.phone && !phoneReg.test(personInfor.phone)) {
    errorMsg = '请输入正确的手机号码';
  }
  return errorMsg;
}

module.exports = { signUp, login };