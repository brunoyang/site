# 完整部署指南：从零到上线

你已经在 Cloudflare 购买了域名，现在让我们把网站部署上线！

## 第一步：部署项目到 Cloudflare Pages

### 方法 A：使用 CLI 命令（最快速）

1. **登录 Cloudflare 账号**
   ```bash
   npx wrangler login
   ```
   这会打开浏览器，授权 Wrangler 访问你的 Cloudflare 账号。

2. **一键部署**
   ```bash
   npm run deploy
   ```

   这个命令会自动：
   - 构建 Next.js 应用（`next build`）
   - 转换为 Cloudflare Workers 格式
   - 上传到 Cloudflare Pages

   **首次部署时的交互提示：**

   ```
   ? Enter the production branch name: (main)
   ```
   直接回车使用默认的 `main`，或输入你的主分支名称。

   ```
   ? Enter the name of your Pages project:
   ```
   输入项目名称，比如：`my-nextjs-site`（建议使用小写字母和连字符）

3. **等待部署完成**

   部署成功后，你会看到类似输出：
   ```
   ✨ Deployment complete! Take a peek over at
   https://xxxxxxxx.my-nextjs-site.pages.dev
   ```

4. **访问你的网站**

   打开提供的 `*.pages.dev` URL，确认网站正常运行。

**分步骤部署（可选）：**

如果你想分步骤执行，可以：

```bash
# 步骤 1: 仅构建（不部署）
npm run pages:build

# 步骤 2: 使用 wrangler 手动部署
npx wrangler pages deploy .worker-next
```

### 方法 B：通过 Cloudflare Dashboard（推荐初学者）

如果你想通过 GitHub 自动部署：

1. **初始化 Git 仓库并推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <你的GitHub仓库地址>
   git push -u origin main
   ```

2. **在 Cloudflare Dashboard 创建 Pages 项目**

   - 访问：https://dash.cloudflare.com/
   - 左侧菜单选择 "Workers & Pages"
   - 点击 "Create application"
   - 选择 "Pages" 标签
   - 点击 "Connect to Git"

3. **连接 GitHub 仓库**

   - 授权 Cloudflare 访问 GitHub
   - 选择你的仓库 `cf-demo`
   - 点击 "Begin setup"

4. **配置构建设置**

   ```
   项目名称：my-nextjs-site（或你想要的名称）
   生产分支：main
   框架预设：None（选择无）
   构建命令：npm run pages:build
   构建输出目录：.worker-next
   ```

5. **保存并部署**

   - 点击 "Save and Deploy"
   - 等待 2-5 分钟，首次构建会稍慢
   - 部署成功后会显示 `*.pages.dev` URL

## 第二步：绑定你的自定义域名

现在你的网站已经部署到 `*.pages.dev`，让我们绑定你购买的域名。

### 在 Cloudflare Dashboard 绑定域名

1. **进入 Pages 项目设置**

   - 在 Cloudflare Dashboard 中
   - 导航到 "Workers & Pages"
   - 点击你的项目（比如 `my-nextjs-site`）

2. **添加自定义域名**

   - 点击 "Custom domains" 标签
   - 点击 "Set up a custom domain" 按钮

3. **选择域名配置方式**

   **情况 A：使用根域名（推荐）**

   如果你想用 `yourdomain.com` 访问：

   - 输入：`yourdomain.com`
   - Cloudflare 会自动配置 DNS 记录
   - 点击 "Activate domain"

   **情况 B：使用子域名**

   如果你想用 `www.yourdomain.com` 或 `blog.yourdomain.com` 访问：

   - 输入：`www.yourdomain.com`（或其他子域名）
   - Cloudflare 会自动配置 CNAME 记录
   - 点击 "Activate domain"

   **情况 C：同时支持根域名和 www**

   - 先添加 `yourdomain.com`
   - 再添加 `www.yourdomain.com`
   - Cloudflare 会自动处理重定向

4. **等待 DNS 生效**

   - 通常 5-10 分钟内生效
   - 最多可能需要 24 小时（罕见）
   - Cloudflare 会自动配置 SSL 证书

5. **验证域名**

   打开浏览器，访问 `https://yourdomain.com`，确认网站正常显示。

### 手动配置 DNS（如果自动配置失败）

如果自动配置没有成功，可以手动添加 DNS 记录：

1. **进入 DNS 设置**

   - Cloudflare Dashboard
   - 选择你的域名
   - 点击 "DNS" > "Records"

2. **添加记录**

   **对于根域名（`yourdomain.com`）：**
   ```
   类型：CNAME
   名称：@
   目标：my-nextjs-site.pages.dev
   代理状态：已代理（橙色云朵）
   ```

   **对于 www 子域名：**
   ```
   类型：CNAME
   名称：www
   目标：my-nextjs-site.pages.dev
   代理状态：已代理（橙色云朵）
   ```

3. **保存并等待生效**

## 第三步：配置 HTTPS 和安全设置

Cloudflare 会自动为你的域名配置 SSL 证书，但你可以优化设置：

1. **SSL/TLS 设置**

   - 进入域名的 "SSL/TLS" 设置
   - 选择 "Full (strict)" 模式（推荐）
   - 启用 "Always Use HTTPS"（强制 HTTPS）

2. **启用 HSTS（可选但推荐）**

   - 在 "SSL/TLS" > "Edge Certificates"
   - 启用 "HSTS"
   - 这会强制浏览器始终使用 HTTPS

## 第四步：后续更新和部署

### 如果使用 CLI 命令

每次更新代码后，只需运行：
```bash
npm run deploy
```

这会自动构建最新代码并部署到 Cloudflare Pages。

**提示：** 如果只想测试构建但不部署：
```bash
npm run pages:build
npm run preview  # 本地预览
```

### 如果使用 Git 连接

只需推送代码到 GitHub：
```bash
git add .
git commit -m "Update website"
git push
```

Cloudflare Pages 会自动：
1. 检测到代码变更
2. 自动构建新版本
3. 自动部署到生产环境

**查看构建状态：**
- 在 Cloudflare Dashboard > Workers & Pages > 你的项目 > Deployments
- 或访问：https://dash.cloudflare.com

## 常见问题

### Q1：运行 `npm run deploy` 报错："缺少 non-option 参数"

**原因：** `@opennextjs/cloudflare` 命令需要指定子命令（如 `build`、`deploy`）。

**解决方案：**
确保 package.json 中的脚本正确：
```json
"scripts": {
  "pages:build": "npx @opennextjs/cloudflare build",
  "deploy": "npx @opennextjs/cloudflare deploy"
}
```

如果还有问题，手动运行：
```bash
npx @opennextjs/cloudflare build
npx wrangler pages deploy .worker-next
```

### Q2：域名已经生效，但显示 "This site can't be reached"

**解决方案：**
1. 等待 5-10 分钟，DNS 可能还在传播
2. 清除浏览器缓存或使用无痕模式
3. 检查 DNS 记录是否正确配置
4. 使用 `dig yourdomain.com` 或 `nslookup yourdomain.com` 检查 DNS

### Q2：网站显示 "522 Connection timed out"

**解决方案：**
1. 检查 Pages 项目是否部署成功
2. 访问 `*.pages.dev` URL 确认应用正常
3. 等待几分钟后重试

### Q3：CSS 样式没有加载

**解决方案：**
1. 清除浏览器缓存
2. 检查控制台是否有错误
3. 确保 `npm run pages:build` 构建成功
4. 重新部署：`npm run deploy`

### Q4：如何回滚到之前的版本？

**解决方案：**
1. 在 Cloudflare Dashboard
2. 进入你的 Pages 项目
3. 点击 "Deployments" 标签
4. 找到之前的部署
5. 点击 "Rollback to this deployment"

### Q5：如何设置环境变量？

**解决方案：**
1. 在 Cloudflare Dashboard 中进入项目
2. 点击 "Settings" > "Environment variables"
3. 添加变量（生产环境和预览环境可以分开设置）
4. 重新部署项目

### Q6：如何查看部署日志？

**解决方案：**
1. 在 Pages 项目中点击 "Deployments"
2. 点击具体的部署记录
3. 点击 "View build log" 查看详细日志

## 性能优化建议

1. **启用 Auto Minify**
   - 在域名设置中
   - "Speed" > "Optimization"
   - 启用 JavaScript、CSS、HTML 压缩

2. **启用 Brotli 压缩**
   - 在 "Speed" > "Optimization"
   - 启用 Brotli 压缩

3. **配置缓存规则**
   - 在 "Rules" > "Page Rules"
   - 为静态资源设置长期缓存

4. **使用 Cloudflare Images**（如果需要）
   - 优化图片加载
   - 自动格式转换（WebP、AVIF）

## 下一步探索

现在你的网站已经上线了！可以探索：

- [ ] 添加自定义 404 页面
- [ ] 集成 Cloudflare Analytics（免费）
- [ ] 使用 Cloudflare KV 存储数据
- [ ] 添加 API 路由
- [ ] 配置邮件转发（如果域名支持）
- [ ] 设置 Cloudflare Workers 函数

## 有用的链接

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Pages 文档**: https://developers.cloudflare.com/pages/
- **DNS 检查工具**: https://dnschecker.org/
- **SSL 检查工具**: https://www.ssllabs.com/ssltest/

## 需要帮助？

如果遇到问题：
1. 检查 Cloudflare Dashboard 的部署日志
2. 查看浏览器控制台的错误信息
3. 使用 `npx wrangler pages deployment list` 查看部署历史
4. 访问 Cloudflare 社区：https://community.cloudflare.com/

---

**恭喜！🎉 你的网站现在已经上线了！**
