// 后台管理员模型
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码长度不能小于6位'],
  },
  nickname: {
    type: String,
    required: [true, '昵称不能为空'],
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

// 保存前加密密码
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
//   next();
});

// 验证密码
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('AdminUser', userSchema);