# 博客项目后端文档

这组文档面向前端开发者，用来快速理解本项目需要的后端能力。

## 建议阅读顺序

1. [01-后端快速入门.md](./01-后端快速入门.md)
2. [02-项目架构与运行流程.md](./02-项目架构与运行流程.md)
3. [03-API接口文档.md](./03-API接口文档.md)
4. [04-前后端联调指南.md](./04-前后端联调指南.md)

## 当前项目状态

`server` 目录目前只有依赖配置，还没有后端入口、路由、数据模型和数据库连接代码。

已经安装的核心依赖：

| 依赖 | 作用 |
| --- | --- |
| Express | 创建 HTTP 服务和接口 |
| Mongoose | 操作 MongoDB |
| CORS | 控制跨域访问 |
| dotenv | 从 `.env` 读取环境变量 |
| nodemon | 开发时自动重启服务 |

前端已经约定了三个接口：

- `GET /posts`：获取文章列表
- `GET /posts/:id`：获取文章详情
- `POST /posts`：创建文章

建议后端监听 `5000` 端口，前端 Vite 开发服务器监听 `3000` 端口。

## 当前需要修正的启动配置

根目录 `package.json` 使用了 `cd client && npm start`，但 client 只有 `dev` 脚本，应改为：

```json
"client": "cd client && npm run dev"
```

server 的 `package.json` 还没有 `dev` 和 `start` 脚本，后端入口建立后应增加：

```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

