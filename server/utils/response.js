// 成功返回
exports.success = (data, message = '成功') => {
  return {
    code: 200,
    message,
    data,
  };
};

// 失败返回
exports.fail = (message = '失败') => {
  return {
    code: 400,
    message,
  };
};