const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');
const {createToken, verifyToken} = require('../utils/jwt');

class AuthService {
    async register(username, password, nickname) {
        const existUser = await AdminUser.findOne({username});
        if (existUser) {
            throw new Error('用户名已存在');
        }
        const user = await AdminUser.create({
            username,
            password,
            nickname,
        });
        user.password = undefined;
        return user;
    }

    async login(username, password) {
        const user = await AdminUser.findOne({username});
        if (!user) {
            throw new Error('用户名不存在');
        }
        if (user.status === 0) {
            throw new Error('账号已被禁用');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('密码错误');
        }
        const token = createToken({id: user._id, username: user.username});
        return {token};
    }
}

module.exports = new AuthService();