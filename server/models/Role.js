// 角色
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '角色名称不能为空'],
    unique: true,
  },
  // 角色拥有的菜单ID数组
  menuIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
  }]
});

module.exports = mongoose.model('Role', roleSchema);