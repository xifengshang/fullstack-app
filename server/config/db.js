// 数据库连接
const mongoose = require('mongoose');
const config = require('./index');

async function connectDB() {
  await mongoose.connect(config.MONGODB_URI);
  console.log('✅ 数据库连接成功');
}
connectDB();