# Cloudflare 能力调研计划

## 目标
在 cf-demo 项目中逐步集成 Cloudflare 各项服务，尽可能覆盖免费能力，作为调研和学习用途。

## 当前技术栈
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Cloudflare Workers (V8 Isolates)
- R2（ISR 增量缓存）✅
- Assets（静态文件）✅

---

## 调研计划

### Phase 1：数据层
- [x] **D1 — Edge SQLite 数据库**
  - 目标：将 `lib/posts.ts` 中的硬编码数据迁移到 D1 数据库
  - 新增功能：管理页面（新增/编辑/删除文章）
  - binding 名称：`DB`
  - 免费额度：5GB 存储 / 500万 reads/天 / 10万 writes/天

### Phase 2：缓存 & 状态
- [x] **KV — 全球分布式键值存储**
  - 目标：实现页面访问计数器（每篇文章的阅读量）
  - binding 名称：`KV`
  - 免费额度：10万 reads/天 / 1000 writes/天

### Phase 3：AI 推理
- [x] **Workers AI — 边缘 LLM 推理**
  - 目标：为文章生成 AI 摘要，或实现中英翻译辅助
  - 模型候选：`@cf/meta/llama-3.1-8b-instruct`（文本生成）
  - binding 名称：`AI`
  - 免费额度：每日 neurons 限额

### Phase 4：安全 & 表单
- [x] **Turnstile — 免费验证码替代**
  - 目标：加入评论/联系表单，集成 Turnstile 人机验证
  - 完全免费，无额度限制

### Phase 5：异步处理
- [x] **Queues — 消息队列**
  - 目标：表单提交后异步处理（如记录新评论事件）
  - 免费额度：100万 operations/月

### Phase 6：实时功能（可选）
- [ ] **Durable Objects — 有状态边缘对象**
  - 目标：实时在线人数统计（WebSocket）
  - 需要 Paid plan 或 Workers Paid（$5/月），酌情考虑

### Phase 7：自定义分析（可选）
- [x] **Analytics Engine**
  - 目标：记录自定义事件（文章阅读、按钮点击）
  - 完全免费

---

## 进度记录

| 服务 | 状态 | 完成日期 | 备注 |
|------|------|----------|------|
| Workers | ✅ 已集成 | — | 基础运行时 |
| R2 | ✅ 已集成 | — | ISR 缓存 |
| Assets | ✅ 已集成 | — | 静态文件 |
| D1 | ✅ 已集成 | 2026-02-08 | Edge SQLite，文章 CRUD |
| KV | ✅ 已集成 | 2026-02-08 | 文章阅读量计数器 |
| Workers AI | ✅ 已集成 | 2026-02-08 | 文章 AI 摘要（按需生成 + KV 缓存） |
| Turnstile | ✅ 已集成 | 2026-02-08 | 联系表单人机验证 + D1 存消息 |
| Queues | ✅ 已集成 | 2026-02-08 | 联系表单异步通知，独立消费者 Worker |
| Durable Objects | ⏸️ 暂缓 | — | 需付费 |
| Analytics Engine | ✅ 已集成 | 2026-02-08 | 自定义事件打点 |

---

## 实现笔记

> 记录每个 Phase 实现过程中的关键发现、坑点和参考资料。

### D1

- binding 名：`DB`，database_id：`b9f6c4dc-77a4-4ee1-bbb3-5bf9b4d8810d`
- 通过 `getCloudflareContext({ async: true })` 访问 `env.DB`
- SQL 列名用下划线（`title_zh`），在 `lib/posts.ts` 中用 `rowToPost()` 映射为驼峰
- `generateStaticParams` 已移除（D1 需要请求上下文，不兼容静态生成）
- 管理页：`/[locale]/admin`，Client Component 调用 API 路由实现 CRUD
- 迁移文件：`migrations/0001_create_posts.sql`
- `worker-configuration.d.ts` 声明 `CloudflareEnv` 接口（`DB: D1Database`）

### KV

- binding 名：`KV`，namespace_id：`e1044732b23d48e69cf4fc5b3c381b76`
- 通过 `getCloudflareContext({ async: true })` 访问 `env.KV`，失败时优雅降级返回 0
- KV key 格式：`post:views:{postId}`
- 文章详情页（`/[locale]/posts/[id]`）：每次访问 `incrementViewCount()` + 显示计数
- 文章列表页：`getViewCounts()` 批量读取所有文章计数并展示
- i18n：英文用 ICU 复数 `{count, plural, one {# view} other {# views}}`，中文直接 `{count} 次阅读`
- 本地 `pnpm dev` 模式下 KV 不可用（无 CF context），自动降级不显示计数

### Workers AI

- binding 名：`AI`，模型：`@cf/meta/llama-3.1-8b-instruct`
- 通过 `getCloudflareContext({ async: true })` 访问 `env.AI`，失败时优雅降级
- 功能：文章详情页按需生成 AI 摘要（中英分别生成）
- 缓存：摘要存储在 KV，key 格式 `post:summary:{postId}:{locale}`，TTL 7 天
- API：`POST /api/ai/summarize`，body `{ postId, locale }`
- UI：Client Component `AiSummary.tsx`，点击按钮触发生成，显示结果

### Turnstile

- sitekey：测试用 `1x00000000000000000000AA`，生产用真实 sitekey（设置 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 环境变量）
- secret：通过 `wrangler secret put TURNSTILE_SECRET_KEY` 设置，测试用 `1x0000000000000000000000000000000AA`
- 验证端点：`POST https://challenges.cloudflare.com/turnstile/v0/siteverify`
- 联系表单页：`/[locale]/contact`，消息存储到 D1 `contact_messages` 表
- 前端动态加载 Turnstile script，`data-callback` 回调获取 token
- 迁移文件：`migrations/0004_create_contact_messages.sql`

### Queues

- queue 名称：`contact-notifications`，保留时间 24h（免费账户限制 max 86400s）
- producer binding：`CONTACT_QUEUE`（`Queue` 类型），在 `wrangler.toml` 的 `[[queues.producers]]` 块配置
- OpenNext 编译的 worker.js 只导出 `fetch` 处理器，**不支持** `queue()` 导出，消费者需独立部署
- 消费者 Worker：`workers/queue-consumer.ts`，配置文件 `wrangler.consumer.toml`
- 部署消费者：`npx wrangler deploy --config wrangler.consumer.toml`
- 创建 queue 命令须加 `--message-retention-period-secs 86400`（默认 4 天超出免费限制）
- 发送消息：`env.CONTACT_QUEUE.send({ id, name, email, createdAt })`
- 联系表单 API：先保存 D1，再 enqueue（queue 失败不影响主流程）

### Analytics Engine

- binding 名：`ANALYTICS`，dataset：`site_events`
- 配置文件：`wrangler.toml` 的 `[[analytics_engine_datasets]]`
- 事件写入：`env.ANALYTICS.writeDataPoint(...)`
- 当前已打点事件：
  - `post_read`：文章详情页渲染时记录（`/[locale]/posts/[id]`）
  - `ai_summary_generate`：调用 `POST /api/ai/summarize` 成功返回摘要后记录
  - `contact_submit`：联系表单 `POST /api/contact` 通过 Turnstile 并写入 D1 后记录
- 开发模式说明：本地 `pnpm dev` 下可能没有 CF context，打点会自动静默降级

