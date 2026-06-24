# API 接口文档

## 1. 基本约定

开发环境：

```text
前端访问前缀：http://localhost:3000/api
后端实际地址：http://localhost:5000
Content-Type：application/json
```

统一成功响应：

```json
{
  "success": true,
  "data": {},
  "message": "可选提示"
}
```

统一失败响应：

```json
{
  "success": false,
  "data": null,
  "message": "错误说明"
}
```

当前前端的 `ApiResponse<T>` 将 `data` 定义为必填。为了让失败响应类型更准确，后续可改为：

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}
```

## 2. 文章数据结构

```ts
interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `_id` | string | 后端生成 | MongoDB 文档 ID |
| `title` | string | 是 | 建议 1 至 100 个字符 |
| `content` | string | 是 | Markdown 原文 |
| `author` | string | 是 | 当前阶段使用作者名称 |
| `tags` | string[] | 否 | 标签列表 |
| `createdAt` | ISO 8601 string | 后端生成 | 创建时间 |

时间统一使用 ISO 8601，例如：

```text
2026-06-13T08:00:00.000Z
```

前端展示时再转换为用户所在时区和目标格式。

## 3. 获取文章列表

```http
GET /posts
```

前端调用：

```ts
const result = await getPosts();
```

成功响应 `200`：

```json
{
  "success": true,
  "data": [
    {
      "_id": "665c0d36f38d2e3f6c780001",
      "title": "React 与 Express 联调",
      "content": "# 正文",
      "author": "张三",
      "tags": ["React", "Express"],
      "createdAt": "2026-06-13T08:00:00.000Z"
    }
  ]
}
```

第一版可以直接返回数组。数据变多后建议支持分页：

```http
GET /posts?page=1&pageSize=10&keyword=react
```

分页响应建议改为：

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 10,
    "total": 0
  }
}
```

分页会改变当前前端的返回类型，需要前后端一起修改。

## 4. 获取文章详情

```http
GET /posts/:id
```

路径参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | MongoDB 文档 ID |

成功响应 `200`：

```json
{
  "success": true,
  "data": {
    "_id": "665c0d36f38d2e3f6c780001",
    "title": "React 与 Express 联调",
    "content": "# 正文",
    "author": "张三",
    "tags": ["React", "Express"],
    "createdAt": "2026-06-13T08:00:00.000Z"
  }
}
```

ID 格式错误，响应 `400`：

```json
{
  "success": false,
  "data": null,
  "message": "文章 ID 格式错误"
}
```

文章不存在，响应 `404`：

```json
{
  "success": false,
  "data": null,
  "message": "文章不存在"
}
```

## 5. 创建文章

```http
POST /posts
Content-Type: application/json
```

请求体：

```json
{
  "title": "React 与 Express 联调",
  "content": "# 正文",
  "author": "张三",
  "tags": ["React", "Express"]
}
```

成功响应 `201`：

```json
{
  "success": true,
  "data": {
    "_id": "665c0d36f38d2e3f6c780001",
    "title": "React 与 Express 联调",
    "content": "# 正文",
    "author": "张三",
    "tags": ["React", "Express"],
    "createdAt": "2026-06-13T08:00:00.000Z"
  },
  "message": "文章创建成功"
}
```

参数错误，响应 `400`：

```json
{
  "success": false,
  "data": null,
  "message": "标题不能为空"
}
```

建议校验规则：

- `title`：必填，去除首尾空格，最长 100。
- `content`：必填，不能只有空白字符。
- `author`：必填，最长 50。
- `tags`：可选，必须是字符串数组，限制数量和单项长度。

## 6. 后续可增加的接口

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| PATCH | `/posts/:id` | 修改文章 |
| DELETE | `/posts/:id` | 删除文章 |
| POST | `/auth/login` | 登录 |
| GET | `/users/me` | 获取当前用户 |
| POST | `/posts/:id/comments` | 发表评论 |

删除、修改和发布操作最终应增加登录鉴权，不能只依靠前端隐藏按钮。

