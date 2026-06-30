const jwt = require('jsonwebtoken');
const config = require('../config/index');

// 生成token
exports.createToken = (user) => {
  return jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// 验证token
exports.verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};