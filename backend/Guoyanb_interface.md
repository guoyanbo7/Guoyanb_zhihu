<!--
  姓名：郭彦伯 | 学号：24002060710 | 大模型：豆包 Doubao
  本文件一律追加写入，禁止覆盖。记录：接口路径 | HTTP 方法 | 请求参数 | 响应格式 | 修改时间
-->

---

### 1. 健康检查
- 接口路径：`/api/health`
- HTTP 方法：GET
- 请求参数：无
- 响应示例：
```json
{ "code": 0, "msg": "服务运行中", "data": { "time": "2026-11-23T06:12:00.000Z" } }
```
- 修改时间：2026-11-23

---

### 2. 数据库连接测试
- 接口路径：`/api/db/test`
- HTTP 方法：POST
- 请求参数（JSON，含示例）：
```json
{ "user": "root", "password": "123456", "host": "localhost" }
```
- 响应示例（成功）：
```json
{ "code": 0, "msg": "数据库连接成功", "data": { "version": "8.0.30", "user": "root@localhost", "time": "2026-11-23T06:12:17.000Z" } }
```
- 响应示例（失败）：
```json
{ "code": 1001, "msg": "数据库连接失败：Access denied ...", "data": {} }
```
- 修改时间：2026-11-23

---

### 3. 科技新闻列表
- 接口路径：`/api/news`
- HTTP 方法：GET
- 请求参数：无
- 响应示例：
```json
{ "code": 0, "msg": "新闻列表获取成功", "data": { "total": 8, "list": [ { "Guoyanb_id": 1, "Guoyanb_title": "...", "Guoyanb_source": "...", "Guoyanb_summary": "...", "Guoyanb_url": "...", "Guoyanb_publish_time": "...", "Guoyanb_view_count": 15280 } ] } }
```
- 修改时间：2026-11-23

---

### 4. 科技新闻详情
- 接口路径：`/api/news/:id`
- HTTP 方法：GET
- 请求参数：路径参数 id（示例如 `/api/news/1`）
- 响应格式：`{ "code": 0, "msg": "新闻详情获取成功", "data": { ...单条新闻完整字段 } }`
- 修改时间：2026-11-23

---

### 5. 图文列表
- 接口路径：`/api/gallery`
- HTTP 方法：GET
- 请求参数：无
- 响应示例：
```json
{ "code": 0, "msg": "图文列表获取成功", "data": { "total": 8, "list": [ { "Guoyanb_id": 1, "Guoyanb_title": "...", "Guoyanb_description": "...", "Guoyanb_image_url": "https://picsum.photos/seed/gyb01/480/300", "Guoyanb_category": "...", "Guoyanb_author": "...", "Guoyanb_like_count": 1286 } ] } }
```
- 修改时间：2026-11-23

---

### 6. 图文详情
- 接口路径：`/api/gallery/:id`
- HTTP 方法：GET
- 请求参数：路径参数 id（示例如 `/api/gallery/1`）
- 响应格式：`{ "code": 0, "msg": "图文详情获取成功", "data": { ...单条图文完整字段 } }`
- 修改时间：2026-11-23

---

### 7. AI 聊天（硅基流动）
- 接口路径：`/api/chat`
- HTTP 方法：POST
- 说明：后端代理转发硅基流动 chat/completions，密钥仅存于 backend/.env，不向前端暴露
- 请求参数（JSON，messages 为完整对话历史）：
```json
{
  "messages": [
    { "role": "system", "content": "你是一个有用、友好的中文助手" },
    { "role": "user", "content": "你好" }
  ]
}
```
- 响应示例（成功）：
```json
{
  "code": 0,
  "msg": "AI 回复成功",
  "data": {
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "message": { "role": "assistant", "content": "你好，请问有什么可以帮你？" },
    "content": "你好，请问有什么可以帮你？",
    "usage": { "prompt_tokens": 15, "completion_tokens": 10, "total_tokens": 25 },
    "raw": { "...大模型完整原始响应": "" }
  }
}
```
- 响应示例（失败）：
```json
{ "code": 3002, "msg": "AI 回复失败：...", "data": {} }
```
- 修改时间：2026-11-23
