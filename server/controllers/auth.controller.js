// 登录和注册业务逻辑
const {success, fail} = require('../utils/response');
const authService = require('../services/auth.service');

// 注册接口
exports.register = async (req, res) => {
  try {
    const {username, password, nickname} = req.body;
    const user = await authService.register(username, password, nickname);
    res.json(success(user, "注册成功"));
  } catch (error) {
    res.json(fail(error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const result = await authService.login(username, password);
    res.json(success(result, "登录成功"));
  } catch (error) {
    res.json(fail(error.message));
  }
};
