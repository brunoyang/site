CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  excerpt_zh TEXT NOT NULL,
  content TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL
);

INSERT INTO posts (id, title, title_zh, excerpt, excerpt_zh, content, content_zh, author, date) VALUES
(
  '1',
  'Getting Started with Cloudflare Workers',
  '开始使用 Cloudflare Workers',
  'Learn how to deploy your first Worker in minutes.',
  '了解如何在几分钟内部署您的第一个 Worker。',
  'Cloudflare Workers provides a serverless execution environment that allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure.

Workers run on Cloudflare''s global network in over 330 cities, which means your code runs close to your users no matter where they are.

## Getting Started

1. Install Wrangler CLI
2. Create a new project
3. Write your Worker code
4. Deploy with `wrangler deploy`',
  'Cloudflare Workers 提供了一个无服务器执行环境，让您可以创建全新的应用程序或增强现有应用程序，无需配置或维护基础设施。

Workers 在 Cloudflare 遍布 330 多个城市的全球网络上运行，这意味着无论您的用户在哪里，您的代码都会在靠近他们的地方运行。

## 快速开始

1. 安装 Wrangler CLI
2. 创建新项目
3. 编写 Worker 代码
4. 使用 `wrangler deploy` 部署',
  'Bruno Yang',
  '2026-01-15'
),
(
  '2',
  'Next.js on the Edge',
  'Next.js 在边缘运行',
  'Why edge runtime beats traditional server-side rendering.',
  '为什么边缘运行时优于传统服务端渲染。',
  'The edge runtime in Next.js allows you to run server-side code closer to your users, reducing latency and improving performance.

Unlike traditional Node.js servers, edge functions start up instantly with no cold start delays. They run in V8 isolates, which are lightweight sandboxes that share resources efficiently.

## Key Benefits

- Zero cold starts
- Global distribution
- Reduced latency
- Lower costs',
  'Next.js 中的边缘运行时允许您在更靠近用户的地方运行服务端代码，从而减少延迟并提高性能。

与传统的 Node.js 服务器不同，边缘函数启动几乎没有冷启动延迟。它们运行在 V8 isolates 中，这是一种轻量级的沙箱，可以高效地共享资源。

## 主要优势

- 零冷启动
- 全球分布
- 低延迟
- 更低成本',
  'Bruno Yang',
  '2026-01-28'
),
(
  '3',
  'R2 Storage for Incremental Cache',
  'R2 存储与增量缓存',
  'How to use Cloudflare R2 as a cache backend for Next.js ISR.',
  '如何将 Cloudflare R2 用作 Next.js ISR 的缓存后端。',
  'Incremental Static Regeneration (ISR) allows you to update static pages after they''ve been built. With Cloudflare R2 as the cache backend, your cached pages persist across deployments.

Configure it in your `open-next.config.ts`:

```ts
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```',
  '增量静态再生（ISR）允许您在构建后更新静态页面。使用 Cloudflare R2 作为缓存后端，您的缓存页面在部署之间保持持久。

在 `open-next.config.ts` 中配置：

```ts
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```',
  'Bruno Yang',
  '2026-02-05'
);
