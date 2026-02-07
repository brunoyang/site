# Cloudflare + Next.js 部署教程

这是一个 Next.js 16 应用，配置为部署在 Cloudflare Pages 上。本项目使用 `@opennextjs/cloudflare` 适配器。

## Cloudflare 免费功能介绍

### Cloudflare Pages（推荐用于学习）

**免费套餐包含：**
- ✅ 每天 100,000 次请求
- ✅ 每月 500 分钟构建时间
- ✅ 无限静态带宽
- ✅ 无限站点数量
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速

### Cloudflare Workers

**免费套餐包含：**
- ✅ 每天 100,000 次请求
- ✅ 10ms CPU 时间限制
- ✅ 适合 API 路由和服务端渲染

### 其他免费功能

- **Cloudflare DNS**：免费 DNS 托管
- **Cloudflare CDN**：全球内容分发网络
- **DDoS 保护**：基础 DDoS 防护
- **SSL/TLS 证书**：自动化 SSL 证书管理
- **Web Analytics**：基础网站分析

## 快速开始

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 2. 构建项目

```bash
# 构建生产版本
npm run build

# 构建 Cloudflare Pages 版本
npm run pages:build
```

### 3. 本地预览 Cloudflare 部署

```bash
# 需要先登录 Cloudflare 账号
npx wrangler login

# 本地预览
npm run preview
```

## 部署到 Cloudflare Pages

### 方法一：使用 Wrangler CLI（推荐）

1. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

2. **部署到 Cloudflare Pages**
   ```bash
   npm run deploy
   ```

3. **首次部署**会提示创建新项目，按照提示操作即可。

### 方法二：通过 Cloudflare Dashboard

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 注册/登录账号（完全免费）

2. **连接 Git 仓库**
   - 进入 "Workers & Pages" 页面
   - 点击 "Create application"
   - 选择 "Pages" > "Connect to Git"
   - 授权 GitHub/GitLab 并选择仓库

3. **配置构建设置**
   ```
   构建命令：npm run pages:build
   构建输出目录：.worker-next
   环境变量：无需设置（可选）
   ```

4. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（通常 2-5 分钟）
   - 获得 `*.pages.dev` 域名

### 方法三：通过 GitHub Actions（自动化）

在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run pages:build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: cf-demo
          directory: .worker-next
```

需要在 GitHub 仓库设置中添加以下 Secrets：
- `CLOUDFLARE_API_TOKEN`：在 Cloudflare Dashboard > Profile > API Tokens 创建
- `CLOUDFLARE_ACCOUNT_ID`：在 Cloudflare Dashboard 的 URL 中找到

## 项目结构

```
cf-demo/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── public/                # 静态资源（如需要）
├── next.config.ts         # Next.js 配置
├── wrangler.toml          # Cloudflare Workers 配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.ts     # Tailwind CSS 配置
└── package.json           # 项目依赖
```

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器（本地）
npm run lint             # 代码检查

# Cloudflare 部署
npm run pages:build      # 构建 Cloudflare Pages 版本
npm run preview          # 本地预览 Cloudflare 版本
npm run deploy           # 部署到 Cloudflare Pages
```

## 技术栈

- **Next.js 16**：React 框架
- **React 19**：UI 库
- **TypeScript**：类型安全
- **Tailwind CSS**：样式框架
- **Cloudflare Pages**：托管平台
- **@opennextjs/cloudflare**：Cloudflare 适配器

## 注意事项

### Next.js 版本兼容性

- ✅ 支持 Next.js 14、15、16
- ❌ Next.js 14 将在 2026 年 Q1 停止支持

### Cloudflare Workers Runtime

本项目使用 Node.js 运行时（而非 Edge Runtime），支持：
- ✅ Server Components
- ✅ API Routes
- ✅ Server Actions
- ✅ 中间件（Middleware）
- ✅ 大部分 Node.js API

### 限制

1. **CPU 时间**：免费套餐单次请求最多 10ms CPU 时间
2. **内存**：Worker 有内存限制，避免大型数据处理
3. **文件系统**：不支持文件系统操作，使用 KV/R2/D1 替代

## 学习资源

### 官方文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [OpenNext Cloudflare 文档](https://opennext.js.org/cloudflare)

### 进阶功能（免费）

1. **环境变量**：在 Cloudflare Dashboard 中设置
2. **自定义域名**：可以绑定自己的域名（免费）
3. **预览部署**：每个分支自动创建预览 URL
4. **回滚**：可以快速回滚到之前的部署

## 故障排除

### 构建失败

```bash
# 清理缓存并重新构建
rm -rf .next node_modules .worker-next
npm install
npm run pages:build
```

### 部署失败

1. 检查 `wrangler.toml` 配置
2. 确保 `compatibility_date` 为 2024-09-23 或更新
3. 确保 `compatibility_flags` 包含 `nodejs_compat`

### 本地预览不工作

```bash
# 重新登录 Wrangler
npx wrangler logout
npx wrangler login
npm run preview
```

## 下一步

- [ ] 添加 API 路由示例
- [ ] 集成 Cloudflare KV 存储
- [ ] 添加表单处理
- [ ] 实现用户认证
- [ ] 添加数据库（Cloudflare D1）

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！
