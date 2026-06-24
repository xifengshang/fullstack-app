// 登录和注册业务逻辑
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');
const {createToken, verifyToken} = require('../utils/jwt');
const {success, fail} = require('../utils/response');

// 注册接口
exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const {username, password, nickname} = req.body;
    // 校验用户名是否存在
    const existUser = await AdminUser.findOne({username});
    if (existUser) {
      return res.json(fail('用户名已存在'));
    }
    // 创建用户
    const user = await AdminUser.create({
      username,
      password,
      nickname,
    });
    // 不返回密码
    user.password = undefined;
    res.json(success(user), "注册成功");
  } catch (error) {
    console.error(error);
    res.json(fail(error.message));
  }
};

// 登录接口
exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;
    // 校验用户名是否存在
    const user = await AdminUser.findOne({username});
    if (!user) {
      return res.json(fail('用户名不存在'));
    }
    // 判断账号是否禁用
    if (user.status === 0) return res.json(fail("账号已被禁用"));
    // 校验密码是否正确
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json(fail('密码错误'));
    }
    // 生成token
    const token = createToken({username: user.username});
    res.json(success({token}, "登录成功"));
  } catch (error) {
    res.json(fail(error.message));
  }
};
