# ===== AI Organization 项目根目录 =====

## 目录结构

```
网站/
├── ai-org-web/          # 前端（Vue 3 + Vite）
├── ai-org-server/       # 后端（Express + Prisma）
└── docs/                # 项目文档
    └── DEPLOY-FREE.md   # 免费部署指南（推荐）
```

## 快速开始

### 本地开发

```bash
# 后端
cd ai-org-server
docker compose up -d        # 启动 postgres
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev

# 前端
cd ai-org-web
pnpm install
pnpm dev
```

### 部署到生产环境

详见 [docs/DEPLOY-FREE.md](docs/DEPLOY-FREE.md)

**免费方案**：
- 前端：Vercel
- 后端：Render
- 数据库：Neon
- 总费用：0 元

---

## 文档

- [免费部署（Vercel + Render + Neon）](docs/DEPLOY-FREE.md) — 适合海外用户，0 元
- [国内服务器一键部署](docs/DEPLOY-CN.md) — 适合中国大陆用户，约 38-100 元/年
- [一键部署脚本](docs/deploy-cn.sh) — 国内服务器直接运行的 bash 脚本

## 国内 vs 海外方案对比

| 用户主要在国内 | 用户主要在海外 |
|---|---|
| ✅ 用 **国内服务器**（38 元/年起） | ✅ 用 **Vercel + Render**（0 元） |
| 详见 [DEPLOY-CN.md](docs/DEPLOY-CN.md) | 详见 [DEPLOY-FREE.md](docs/DEPLOY-FREE.md) |
