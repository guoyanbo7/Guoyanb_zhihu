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

---

### 8. 知识库文件上传（RAG）
- 接口路径：`/api/kb/upload`
- HTTP 方法：POST
- 请求参数：`multipart/form-data`，文件字段名 `Guoyanb_file`，支持 .txt/.pdf/.doc/.docx/.ppt/.pptx，单文件 ≤20MB；后端自动解析、分块、向量化并存储
- 响应示例（成功）：
```json
{
  "code": 0,
  "msg": "知识库文件上传并构建成功",
  "data": {
    "id": "kb_xxx", "originalName": "云栖智行产品手册.docx", "ext": ".docx",
    "size": 37683, "charCount": 516, "chunkCount": 2, "uploadTime": "2026-11-23T12:49:00.000Z"
  }
}
```
- 响应示例（失败）：`{ "code": 4002, "msg": "知识库构建失败：...", "data": {} }`
- 修改时间：2026-11-23

---

### 9. 知识库文件列表
- 接口路径：`/api/kb/files`
- HTTP 方法：GET
- 请求参数：无
- 响应示例：
```json
{ "code": 0, "msg": "知识库列表获取成功", "data": { "total": 2, "list": [ { "id": "kb_xxx", "originalName": "...", "chunkCount": 2, "uploadTime": "..." } ] } }
```
- 修改时间：2026-11-23

---

### 10. 知识库文件详情（含分块文本）
- 接口路径：`/api/kb/files/:id`
- HTTP 方法：GET
- 请求参数：路径参数 id（示例如 `/api/kb/files/kb_xxx`）
- 响应格式：`{ "code": 0, "msg": "知识库详情获取成功", "data": { "meta": { ... }, "chunks": [ { "index": 0, "text": "..." } ] } }`
- 修改时间：2026-11-23

---

### 11. 删除知识库文件
- 接口路径：`/api/kb/files/:id`
- HTTP 方法：DELETE
- 请求参数：路径参数 id
- 响应示例：`{ "code": 0, "msg": "知识库文件已删除", "data": { "id": "kb_xxx" } }`
- 修改时间：2026-11-23

---

### 12. 基于知识库的问答（RAG）
- 接口路径：`/api/kb/ask`
- HTTP 方法：POST
- 请求参数（JSON）：
```json
{ "question": "智行 Pro 智能手表卖多少钱？", "topK": 4 }
```
- 响应示例（成功）：
```json
{
  "code": 0,
  "msg": "知识库问答成功",
  "data": {
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "answer": "根据参考资料1，智行 Pro 智能手表的售价为899元。",
    "usage": { "prompt_tokens": 600, "completion_tokens": 20, "total_tokens": 620 },
    "refs": [
      { "fileName": "云栖智行产品手册.docx", "chunkIndex": 0, "score": 0.6949, "text": "..." }
    ]
  }
}
```
- 响应示例（失败）：`{ "code": 4004, "msg": "知识库问答失败：...", "data": {} }`
- 修改时间：2026-11-23

---

### 补充：知识库存储与 MySQL 同步说明（2026-11-23）
- 接口路径与参数（第 8–12 项）保持不变；本次按实验指导书数据层要求新增 MySQL 文档元数据表 `Guoyanb_kb_docs`（建表 SQL 见 `backend/sql/Guoyanb_kb_docs.sql` 与 `Guoyanb_database.md`）。
- 上传（`/api/kb/upload`）成功后，后端在本地文件分块/向量化的同时，自动向 `Guoyanb_kb_docs` 登记一条文档元数据；删除（`DELETE /api/kb/files/:id`）时同步从该表删除。
- 文档的分块文本与 1024 维向量仍存于 `backend/kb_data` 本地文件（运行时数据，已加入 .gitignore），检索逻辑不变；MySQL 表负责文档元数据的持久化与可重建。
- 修改时间：2026-11-23
