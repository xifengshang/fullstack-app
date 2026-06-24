// 程序入口：连接数据库 + 启动服务
require('dotenv').config({ path: __dirname + '/.env' });

// 1. 连接数据库
require('./config/db');

// 2. 引入express实例
const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅ 服务已启动，监听端口 ${PORT}`);
});