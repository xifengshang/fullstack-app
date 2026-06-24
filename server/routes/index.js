// 路由聚合
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');

// 合并路由
router.use('/auth', authRoutes);

module.exports = router;