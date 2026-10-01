# 🚀 免费部署指南（Vercel + Render + Neon）

本指南面向**个人品牌站**场景，全部使用免费服务。整体耗时约 45-60 分钟（含账号注册）。

---

## 📊 部署架构

```
用户浏览器
   │
   ▼
Vercel (前端 Vue 静态站)
   │  HTTPS 调用
   ▼
Render (后端 Express API)
   │  Prisma 连接
   ▼
Neon (PostgreSQL 0.5GB 免费)
   │
   └─── 文件上传 → 本地 /tmp（Render 免费版磁盘会清空，见文末说明）
```

---

## ⚠️ 重要前提

### 必须先做的 3 件事

1. ✅ **代码必须先推到 GitHub**（所有平台都用 GitHub 登录）
2. ✅ **不要把 `.env` 推上去**（已在 `.gitignore`，部署前确认）
3. ✅ **记住你的 3 个密钥**（之前生成过）

```
JWT_SECRET=Z4NL6SNXlHWodRzJ2qIrex9rKKH9vEzBIlBYnb8xKpgAR6j5PSoduyKwpOgA35xW
ADMIN_PASSWORD=WANGhui2010149  ← ⚠️ 部署后立即改成自己的强密码
```

---

## 🎯 部署流程

### Step 0：注册账号（10 分钟）

打开以下网站，用 GitHub 一键登录：

- [github.com](https://github.com) — 存代码
- [vercel.com](https://vercel.com) — 前端
- [render.com](https://render.com) — 后端
- [neon.tech](https://neon.tech) — 数据库

---

### Step 1：推送代码到 GitHub（10 分钟）

#### 推荐方式：GitHub Desktop（图形界面）

1. 下载安装 [GitHub Desktop](https://desktop.github.com)
2. 登录 GitHub 账号
3. `File` → `Add Local Repository` → 选择 `c:\Users\86133\Desktop\网站`
4. 如果提示"不是一个 git 仓库"→ 点 `create a repository`
5. 填写：
   - Name: `ai-org`
   - Description: `AI Organization Solution Hub`
   - Git Ignore: `Node`
   - License: MIT
6. 点 `Create Repository`
7. 在底部输入 commit message：`initial commit`
8. 点 `Commit to main`
10. 点顶部 `Publish repository` → `Publish`

#### 验证 `.env` 没被推送

在 GitHub 网页上打开你的仓库，**确认根目录没有 `.env` 文件**。

如果出现了，立刻删掉并 `git push --force`（已经泄露的密钥必须重生成）。

---

### Step 2：创建数据库（Neon）（5 分钟）

1. 登录 [neon.tech](https://neon.tech)
2. 点 `Create a project`
   - Name: `ai-org`
   - Region: **Singapore** 或 **Tokyo**（离国内近）
   - Postgres version: 16
3. 创建后等 30 秒初始化
4. 在 Dashboard 找到 `Connection Details`
5. 复制 **Pooled connection string**，形如：
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
6. **保存这个字符串**（粘到记事本），待会儿要用

---

### Step 3：部署后端（Render）（15 分钟）

1. 登录 [render.com](https://render.com)
2. 点 `New +` → `Web Service`
3. 选 `Build and deploy from a Git repository`
4. 找到你的 `ai-org` 仓库，点 `Connect`
5. 填写配置：

| 字段 | 值 |
|---|---|
| Name | `ai-org-server` |
| Region | `Singapore` |
| Branch | `main` |
| Root Directory | `ai-org-server` |
| Runtime | `Node` |
| Build Command | `pnpm install && pnpm db:generate && pnpm build` |
| Start Command | `node dist/index.js` |
| Instance Type | `Free` |

6. **往下滚到 Environment Variables**，逐个添加：

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `DATABASE_URL` | （Step 2 复制的字符串） |
| `JWT_SECRET` | `Z4NL6SNXlHWodRzJ2qIrex9rKKH9vEzBIlBYnb8xKpgAR6j5PSoduyKwpOgA35xW` |
| `JWT_EXPIRES_IN` | `7d` |
| `UPLOAD_DIR` | `/tmp/uploads-ai-org` |
| `MAX_FILE_SIZE_MB` | `20` |
| `CORS_ORIGINS` | （先填占位，下一步改） |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `WANGhui2010149` |
| `ADMIN_EMAIL` | `admin@your-domain.com` |

7. 点 `Create Web Service`
8. 等 5-10 分钟，看日志（`Logs` 标签）
9. 看到 `Server running on port 4000` → 成功
10. **复制后端 URL**（形如 `https://ai-org-server.onrender.com`）

#### ⚠️ Render 免费版特性

- ✅ 永久免费
- ⚠️ 15 分钟无访问会**自动休眠**
- ⚠️ 首次访问要等 10-30 秒**冷启动**
- ⚠️ 磁盘是临时的，**重启后上传的文件就没了**（见文末解决方案）

---

### Step 4：初始化数据库（5 分钟）

后端跑起来后，数据库还是空的。需要建表 + 创建默认 admin。

#### 方案 A：用 Render Shell（推荐）

1. 在 Render 控制台 → 你的服务 → 顶部点 `Shell`
2. 在打开的 shell 中执行：

```bash
pnpm db:migrate deploy
pnpm db:seed
```

看到 `Database seeded successfully` → 成功。

#### 方案 B：在本地连接 Neon 执行

在 `ai-org-server` 目录打开终端：

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://...neon字符串..."
pnpm db:migrate deploy
pnpm db:seed
```

---

### Step 5：部署前端（Vercel）（10 分钟）

1. 登录 [vercel.com](https://vercel.com)
2. 点 `Add New → Project`
3. 选 `ai-org` 仓库 → `Import`
4. 填写配置：

| 字段 | 值 |
|---|---|
| Project Name | `ai-org-web` |
| Framework Preset | `Vite` |
| Root Directory | `ai-org-web` |
| Build Command | （留空，用默认） |
| Output Directory | `dist` |
| Install Command | （留空，用默认） |

5. **展开 Environment Variables**，添加：

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | （Step 3 复制的后端 URL） |

6. 点 `Deploy`
7. 等 2-3 分钟，构建完成后会显示 🎉 界面
9. **复制前端 URL**（形如 `https://ai-org-web.vercel.app`）

---

### Step 6：让前后端能通信（2 分钟）

#### 6.1 让后端允许前端域名（解决 CORS）

1. 回到 Render 控制台
2. 你的服务 → `Environment` → 找到 `CORS_ORIGINS`
3. 改成：`` `https://ai-org-web.vercel.app` ``
4. 点 `Save Changes` → Render 会自动重新部署

#### 6.2 让前端可以走后端地址

如果前端 `VITE_API_BASE_URL` 已经是 `https://ai-org-server.onrender.com`，**直接生效**。

如果填错了，回到 Vercel → 你的项目 → `Environment Variables` → 修改 → `Deployments` 标签 → 最新一次 → `Redeploy`。

---

## ✅ 验证部署成功

打开前端 URL（`https://ai-org-web.vercel.app`）：

- [ ] 首页能正常打开
- [ ] 测评页面能正常打开
- [ ] 资源页面能正常加载数据（如果有 seed 数据）
- [ ] 打开浏览器 DevTools → Network → 确认有请求发到 `ai-org-server.onrender.com`
- [ ] 访问 `https://ai-org-server.onrender.com/api/resources` 应该返回 JSON

---

## 🔐 安全提醒（部署后必做）

### 立即改 ADMIN_PASSWORD

1. 改本地 `.env` 里的密码
2. 改 Render 环境变量里的 `ADMIN_PASSWORD`
3. **重新跑 db:seed**（因为数据库里的 hash 是用旧密码生成的）
4. 用新密码登录 admin 测试一次

### 检查 JWT_SECRET 没泄露

打开 GitHub 仓库，**搜索 JWT_SECRET 字符串**，确认只在 commit 里、没出现在 README 或 issues。

如果泄露了：在 Render 重新生成 + 重启服务，所有 admin 都要重新登录。

---

## 📁 文件上传：临时方案

Render 免费版磁盘重启就清空。如果你的站文件不多（< 50 个），可以接受：

### 临时方案（推荐先用这个）

- 上传到 Render 的文件**只是临时存储**
- Render 重启后图片 404，但**数据库记录还在**
- 手动重新上传一次就好（每次重启后）
- 对个人品牌站够用

### 永久方案：接 Cloudinary（2 小时改造）

如果发现这个方案经常出问题，再做改造：

1. 注册 [cloudinary.com](https://cloudinary.com)（免费 25GB）
2. 安装 `pnpm add cloudinary @types/multer`
3. 改造 `ai-org-server/src/middleware/upload.ts`：用 memoryStorage → 转 Cloudinary
4. Render 添加环境变量 `CLOUDINARY_URL=cloudinary://...`
5. 重新部署

---

## 💡 后续优化（可选）

| 时间 | 优化 | 估时 |
|---|---|---|
| 立即 | 绑定自定义域名 | 30 分钟 |
| 一周 | 加 sitemap.xml + OG 图 | 2 小时 |
| 一周 | 接入 Cloudinary | 2 小时 |
| 一月 | 重写 DEPLOYMENT.md | 1 小时 |
| 一月 | 加邮件自动化 | 2 小时 |

---

## 🆘 常见问题

### Q1：Render 服务部署失败

看 Logs：
- `pnpm not found` → 改 Build Command 为 `npm install -g pnpm && pnpm install && pnpm db:generate && pnpm build`
- `prisma generate failed` → 检查 `DATABASE_URL` 格式正确
- `Cannot find module` → `pnpm install` 没跑完，重试

### Q2：前端打开报错

- `Failed to fetch` → 后端没起来或 CORS 没配
- 打开 DevTools Network → 看请求是不是发到对的地址
- VITE_API_BASE_URL 在构建时**就已经固化**，改环境变量后必须重新部署

### Q3：数据库连不上

- 检查 `DATABASE_URL` 包含 `?sslmode=require`
- 检查 Neon 数据库没被暂停（免费版 7 天无活动会暂停，去 Dashboard 点醒）

### Q4：第一次访问很慢

- Render 冷启动 10-30 秒，**正常**
- 解决方案：升级到 7$/月 Render Starter（无休眠）

---

## 📝 部署记录模板

部署完成后，复制填写：

```
部署日期：__________
前端 URL：__________
后端 URL：__________
数据库 Region：__________
自定义域名：__________
CORS_ORIGINS：__________
ADMIN_USERNAME：__________
```

---

**最后更新**：2026-09-30