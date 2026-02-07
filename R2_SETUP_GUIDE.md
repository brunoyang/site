# Cloudflare R2 缓存配置指南

## 什么是 R2 缓存？

Cloudflare R2 是一个对象存储服务，类似于 AWS S3。在 Next.js 应用中，R2 用于存储增量静态再生成（ISR）的缓存数据，可以大幅提升性能。

## R2 免费套餐

**完全免费用于学习和小型项目！**

- ✅ 10 GB 存储空间/月
- ✅ 100 万次 Class A 操作/月（写入、列表）
- ✅ 1000 万次 Class B 操作/月（读取）
- ✅ 零出口费用（数据下载完全免费）

## 配置步骤

### 第一步：创建 R2 存储桶

1. **登录 Cloudflare Dashboard**
   访问：https://dash.cloudflare.com/

2. **进入 R2 页面**
   - 左侧菜单选择 "R2"
   - 如果是首次使用，点击 "Purchase R2 Plan"
   - 选择 **"Free"** 计划（完全免费）

3. **创建存储桶（Bucket）**
   - 点击 "Create bucket" 按钮
   - 输入存储桶名称：`cf-demo-cache`
   - 选择位置：
     - **自动（Automatic）**：推荐，让 Cloudflare 自动选择最优位置
     - 或选择离你最近的区域（如 APAC 亚太地区）
   - 点击 "Create bucket"

### 第二步：配置 Wrangler

我已经在 `wrangler.toml` 中添加了 R2 配置：

```toml
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "cf-demo-cache"
```

这会将 R2 存储桶绑定到你的 Pages 项目。

### 第三步：部署项目

现在可以使用完整的部署命令（包含 R2 缓存）：

```bash
# 确保已登录
pnpm exec wrangler login

# 构建
pnpm pages:build

# 部署（使用 opennextjs-cloudflare deploy，会自动配置 R2）
pnpm exec opennextjs-cloudflare deploy
```

**首次部署时的交互提示：**

```
? Enter the production branch name: (main)
```
直接回车或输入 `main`

```
? Enter the name of your Pages project:
```
输入：`cf-demo`（或你想要的项目名称）

### 第四步：更新 package.json 脚本

如果你想让部署命令更简单，可以更新 package.json：

```json
{
  "scripts": {
    "deploy": "pnpm pages:build && pnpm exec opennextjs-cloudflare deploy",
    "deploy:simple": "pnpm pages:build && wrangler pages deploy .worker-next"
  }
}
```

- `pnpm deploy`：使用 R2 缓存部署（推荐）
- `pnpm deploy:simple`：不使用 R2 缓存的简单部署

## 验证 R2 配置

部署成功后，可以验证 R2 是否正常工作：

1. **查看 R2 存储桶**
   - 在 Cloudflare Dashboard 中进入 R2
   - 点击 `cf-demo-cache` 存储桶
   - 应该能看到缓存文件

2. **检查缓存使用情况**
   - 在 R2 Dashboard 中可以看到：
     - 存储使用量
     - 操作次数
     - 全部在免费额度内

## 性能优势

使用 R2 缓存后，你的 Next.js 应用会获得：

1. **更快的页面加载速度**
   - ISR 页面会被缓存到 R2
   - 全球用户都能快速访问

2. **减少服务器负载**
   - 缓存的页面不需要重新生成
   - 节省计算资源

3. **更好的用户体验**
   - 首次访问后的页面加载极快
   - 支持渐进式更新

## 管理 R2 存储桶

### 查看存储桶内容

```bash
# 列出存储桶中的文件
pnpm exec wrangler r2 object list cf-demo-cache
```

### 清空缓存（如果需要）

```bash
# 删除所有对象（慎用！）
pnpm exec wrangler r2 object delete cf-demo-cache --file <文件名>
```

### 查看 R2 使用统计

在 Cloudflare Dashboard 的 R2 页面可以看到：
- 存储使用量（GB）
- Class A/B 操作次数
- 成本估算（免费套餐内为 $0）

## 常见问题

### Q1：R2 缓存是必需的吗？

**不是必需的。** 你可以选择：

- **使用 R2**：更好的性能，支持 ISR
- **不使用 R2**：简单部署，使用 `wrangler pages deploy`

对于静态页面或不需要 ISR 的应用，可以不用 R2。

### Q2：免费额度用完了怎么办？

**不用担心！** 对于学习项目：
- 10 GB 存储空间很大，足够存储大量缓存
- 操作次数非常多，正常使用不会超
- 即使超出，费用也很低：$0.015/GB/月

### Q3：如何监控 R2 使用情况？

在 Cloudflare Dashboard > R2 > Analytics 可以查看：
- 实时存储使用量
- 操作次数统计
- 成本预估

### Q4：部署时提示 "No R2 binding found"

**解决方案：**
1. 确保在 Cloudflare Dashboard 创建了 R2 存储桶
2. 检查 `wrangler.toml` 中的配置是否正确
3. 确保 `bucket_name` 与创建的存储桶名称一致

### Q5：可以在本地预览时使用 R2 吗？

可以，但需要额外配置：

```bash
# 本地预览（会使用本地模拟的 R2）
pnpm preview
```

本地预览时，R2 会被模拟，不会真正连接到 Cloudflare R2。

## 进阶配置

### 为不同环境配置不同的存储桶

```toml
# wrangler.toml

# 生产环境
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "cf-demo-cache"

# 预览环境
[env.preview]
[[env.preview.r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "cf-demo-cache-preview"
```

### 设置缓存过期时间

在 Next.js 页面中配置 ISR：

```tsx
// app/page.tsx
export const revalidate = 3600; // 1 小时后重新验证

export default function Page() {
  return <div>Cached content</div>;
}
```

## 成本估算

对于一个学习项目：

| 项目 | 免费额度 | 预估使用 | 成本 |
|------|---------|---------|------|
| 存储 | 10 GB | < 0.1 GB | $0 |
| Class A 操作 | 100 万/月 | < 1000 | $0 |
| Class B 操作 | 1000 万/月 | < 10000 | $0 |
| 出口流量 | 无限 | 任意 | $0 |
| **总计** | - | - | **$0** |

## 有用的链接

- **R2 文档**: https://developers.cloudflare.com/r2/
- **R2 定价**: https://developers.cloudflare.com/r2/pricing/
- **R2 计算器**: https://r2-calculator.cloudflare.com/
- **OpenNext Cloudflare 文档**: https://opennext.js.org/cloudflare

---

**总结：R2 缓存完全免费用于学习，配置简单，性能提升明显！**
