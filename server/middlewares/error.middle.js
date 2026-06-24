// 全局统一异常处理
module.exports = (err, req, res, next) => {
  console.error(err);
  res.json({
    code: 500,
    msg: "服务器异常：" + err.message,
    data: null
  });
};
