// 登录和注册路由
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

module.exports = router;