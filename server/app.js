/**
 * Express实例配置，全局中间件，跨域，静态资源
 */
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middle');

const app = express();

// 后台服务配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// 托管上传静态文件
app.use('/uploads', express.static('uploads'));

// 统一接口前缀
app.use('/api/admin', routes);

// 全局错误捕获（放最后）
app.use(errorMiddleware);

module.exports = app;