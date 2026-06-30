const { verifyToken }  = require('../utils/jwt');
const AdminUser = require('../models/AdminUser');
const { fail } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(fail('请先登录'));
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await AdminUser.findById(decoded.id);
        if (!user) {
            return res.status(401).json(fail('用户不存在'));
        }

        return user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json(fail('登录已过期'));
        }
        return res.json(fail('token无效'));
    }
}

module.exports = authMiddleware;