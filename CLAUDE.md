# cf-demo

Next.js 项目，通过 `@opennextjs/cloudflare` 部署到 Cloudflare Workers。

## 技术栈

- **框架**：Next.js 16（App Router）
- **样式**：Tailwind CSS 4
- **运行时**：Cloudflare Workers（V8 Isolates）
- **包管理**：pnpm
- **语言**：TypeScript
- **i18n**：next-intl（中文 zh + 英文 en，默认英文）

## 重要概念

- 静态文件通过 **Cloudflare Assets** 提供（`[assets]` binding）
- ISR 增量缓存存储在 **R2**（`NEXT_INC_CACHE_R2_BUCKET` binding）
- 标准 `next build` 只生成 `.next/`，**不能直接部署**到 Cloudflare
- 必须先运行 `pnpm run pages:build`（调用 `opennextjs-cloudflare`）生成 `.open-next/`

## 常用命令

```bash
pnpm run dev          # 本地开发（Node.js 模式）
pnpm run preview      # 本地预览（Cloudflare Workers 模式）
pnpm run deploy       # 构建 + 部署到 Cloudflare
```

## 部署流程

```
pnpm run pages:build   →  .open-next/ 生成
npx wrangler deploy    →  上传到 Cloudflare Workers
```

**Cloudflare 控制台构建命令应设置为 `pnpm run pages:build`，而非 `pnpm run build`。**

## i18n 结构

- URL：`/en/...`（默认）和 `/zh/...`
- 翻译文件：`messages/en.json`、`messages/zh.json`
- 路由配置：`i18n/routing.ts`
- 请求配置：`i18n/request.ts`
- 中间件：`middleware.ts`（纯 Web API 实现语言重定向）
- **注意**：虽然 Next.js 16 推荐用 `proxy.ts`，但 `@opennextjs/cloudflare` 读取的是旧的 middleware manifest 格式，`proxy.ts` 会被误判为 Node.js middleware 导致构建失败。在 opennextjs-cloudflare 修复前，必须保留 `middleware.ts` + `export default function middleware`
- 页面路由：`app/[locale]/page.tsx`

## 关键配置文件

- [wrangler.toml](wrangler.toml) - Worker 名称、入口、Assets、R2、自定义域名
- [open-next.config.ts](open-next.config.ts) - 增量缓存使用 R2 (`r2IncrementalCache`)
- [next.config.ts](next.config.ts) - Next.js 配置（含 next-intl 插件）

## 数据库

- ORM：Drizzle ORM（SQLite，通过 Cloudflare D1）
- Schema：[db/schema.ts](db/schema.ts)
- 查询封装：[lib/posts.ts](lib/posts.ts)
- **避免 `select *`**：列表查询用 `summaryColumns`（排除大字段 `content`/`contentZh`），详情查询明确列出所有字段

## Turnstile 人机验证

- 实现：[lib/turnstile.ts](lib/turnstile.ts)，联系表单 [app/[locale]/contact/](app/[locale]/contact/)
- 后端验证密钥：`TURNSTILE_SECRET_KEY`（Cloudflare Workers Secret）
- 本地开发：`.env.local` 设置真实 secret，`.dev.vars` 用于 `pnpm preview` 模式
- **sitekey 和 secret 必须配对**：真实 sitekey 对应真实 secret，测试 key 对应测试 secret
- 迁移：`migrations/0004_create_contact_messages.sql`

## 认证

- 实现：[lib/auth.ts](lib/auth.ts)，自实现 JWT（HMAC-SHA256）
- 密钥：环境变量 `SESSION_SECRET`（Cloudflare Workers Secret）
- **注意**：密码哈希用 SHA-256（Workers 不支持 bcrypt/argon2），生产环境需额外防护（限制登录尝试次数）

## Cloudflare Queues

- 联系表单提交后异步通知，producer binding：`CONTACT_QUEUE`（`Queue` 类型）
- queue 名称：`contact-notifications`，创建时须加 `--message-retention-period-secs 86400`
- **OpenNext 编译的 worker.js 只导出 `fetch`，不能内嵌 `queue()` 消费者**
- 消费者是独立 Worker：[workers/queue-consumer.ts](workers/queue-consumer.ts)，配置：[wrangler.consumer.toml](wrangler.consumer.toml)
- 部署消费者：`npx wrangler deploy --config wrangler.consumer.toml`
- 主 Worker 和消费者 Worker 通过**队列名**解耦，互不感知

## Node.js API 兼容性

已启用 `nodejs_compat` 标志，支持 `Buffer`、`crypto`、`path` 等常用模块。
不支持：`fs`（文件系统）、`child_process`、原始 `http`/`net` socket。
不支持的场景改用：Cloudflare R2/KV 替代文件系统，`fetch()` 替代 `http`。
