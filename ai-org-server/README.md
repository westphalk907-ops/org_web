# AI Organization 后端服务

后端 API + 文件上传 + 管理后台认证服务。

## 技术栈

- **Node.js 20+** + **Express 5** + **TypeScript 5**
- **PostgreSQL 16** + **Prisma 6**（类型安全 ORM）
- **JWT** + **bcrypt**（认证）
- **Multer**（文件上传）
- **Zod**（请求校验）
- **Docker Compose**（一键启动数据库）

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动 PostgreSQL（Docker）
docker compose up -d

# 3. 初始化数据库 + 种子数据
pnpm db:migrate
pnpm db:seed

# 4. 启动开发服务器
pnpm dev
```

服务跑在 **http://localhost:4000**，健康检查 `/api/health`。

## 项目结构

```
ai-org-server/
├── src/
│   ├── config/        # 环境变量、配置常量
│   ├── db/            # Prisma client 单例
│   ├── middleware/    # auth、error、cors
│   ├── routes/        # 路由声明（薄）
│   ├── controllers/   # 请求处理（薄）
│   ├── services/      # 业务逻辑（厚）
│   ├── utils/         # 工具函数
│   └── types/         # TS 类型
├── prisma/
│   ├── schema.prisma  # 数据模型
│   └── seed.ts        # 种子数据
├── uploads/           # 上传文件存储（git ignore）
├── docker-compose.yml
└── .env               # 本地环境变量
```

## 阶段进度

- [x] **阶段 1** 项目骨架 + Prisma + JWT 鉴权
- [ ] **阶段 2** Resources 模块（资料库 CRUD + 文件上传）
- [ ] **阶段 3** Articles / Contents 模块
- [ ] **阶段 4** Cases / Home 模块
- [ ] **阶段 5** 管理后台 UI
- [ ] **阶段 6** 主站前端对接
- [ ] **阶段 7** 部署文档 + Docker 一键启动
