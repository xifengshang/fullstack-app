// 登录和注册路由
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

router.get('/profile', authMiddleware, authController.getProfile);  // 需要认证

module.exports = router;