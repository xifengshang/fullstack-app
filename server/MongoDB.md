线上mongodb：https://cloud.mongodb.com/
Username: ruihan211_db_user
Password: GIpT6Chclo9fCQ0R

npm install mongodb

mongodb+srv://ruihan211_db_user:GIpT6Chclo9fCQ0R@learnmongodb.ac5ivvz.mongodb.net/?appName=learnMongoDB

# express 框架 + mongodb 官方驱动 + dotenv 管理环境变量
npm install express mongodb dotenv
# 开发热更新工具（可选）
npm install -D nodemon

# 后端四层分工
路由 -> 控制器 -> 服务层 -> 模型
只能从上往下调用，绝不反向调用

文件夹：routes、controllers、services、models
文件名：xxx.routes.js、xxx.controller.js、xxx.service.js、xxx.js
xxx.routes.js：只分发URL地址，不写任何业务；接受请求，把请求转给控制器
xxx.controller.js：接收参数、校验、调用服务、返回结果；
xxx.service.js：数据库操作，业务逻辑所在；
xxx.js：定义表结构、字段、校验、索引；只描述数据是什么样子的
