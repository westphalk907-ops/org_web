# 部署指南

## 推荐架构

```
Cloudflare Pages (前端静态)
   ↓ API
Railway / Fly.io (FastAPI 后端)
   ↓
Supabase (数据库 + Auth)
   ↓
Resend / Postmark (邮件自动化)
```

## 1. 前端部署（Cloudflare Pages）

### 通过 Git 自动部署
1. 推送代码到 GitHub
2. Cloudflare Dashboard → Pages → Connect to Git
3. 选择仓库，配置：
   - Build command: `pnpm build`
   - Build output: `dist`
   - Environment variables: `VITE_API_BASE_URL=...`

### 通过 Wrangler CLI
```bash
pnpm build
npx wrangler pages deploy dist --project-name=ai-org-web
```

## 2. 后端部署

### Railway
```bash
cd backend
railway init
railway up
```

### Fly.io
```bash
cd backend
fly launch
fly deploy
```

## 3. 数据库（Supabase）

1. 创建项目：https://supabase.com
2. SQL Editor 执行 `backend/README.md` 中的建表语句
3. 在 Cloudflare Pages 配置：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`（仅后端用）

## 4. 邮件自动化

使用 Resend（推荐）或 Postmark：

```python
# backend/main.py
import resend
resend.api_key = os.getenv("RESEND_API_KEY")

def send_email(to, subject, html):
    resend.Emails.send({
        "from": "AI Org Hub <hello@your-domain.com>",
        "to": to,
        "subject": subject,
        "html": html
    })
```

### 自动化推送流程

用户下载《企业 AI 组织成熟度报告》后：

| 时间 | 内容 |
|------|------|
| 立即 | 发送报告 |
| 2 天 | 推送"AI 组织阶段"内容 |
| 5 天 | 推荐 Assessment |
| 8 天 | 推送案例 |
| 12 天 | 邀请咨询 |

可以使用：
- Resend Audiences
- Loops.so
- 或自建 Celery Beat

## 5. 域名

1. Cloudflare Pages → Custom domain
2. DNS：CNAME 到 `<project>.pages.dev`
3. SSL 自动配置

## 6. SEO

### sitemap.xml
在 Cloudflare Pages Functions 或构建时生成。

### robots.txt
放在 `public/robots.txt`，已默认配置。

### 结构化数据
在 `index.html` 和各页面添加 JSON-LD：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Organization Hub",
  "url": "https://your-domain.com",
  "logo": "https://your-domain.com/favicon.svg"
}
</script>
```

## 7. 埋点（可选）

接入 Plausible / PostHog：

```typescript
// src/main.ts
if (import.meta.env.PROD) {
  // Plausible
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://plausible.io/js/script.js'
  script.dataset.domain = 'your-domain.com'
  document.head.appendChild(script)
}
```

## 8. 监控

- Cloudflare Analytics
- Sentry（前端错误）
- Resend Logs（邮件）

## 9. CI/CD

建议使用 GitHub Actions：

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ai-org-web
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## 10. 备份与恢复

- Supabase：每日自动备份
- Cloudflare Pages：构建历史可回滚
- 后端：Docker 镜像版本化

## 故障排查

### CORS 错误
后端 `main.py` 已配置 CORS，确认前端域名已加入 `allow_origins`。

### API 404
确认 Cloudflare Pages 代理设置：`/api/*` 应代理到后端。

### 构建失败
本地先 `pnpm build` 通过再推送。
