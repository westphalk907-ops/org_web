# =====================================================================
# AI Organization 后端 - 生产镜像
#
# 多阶段构建：
#   deps   → 安装全部依赖（带 prisma CLI，用于生成 Client）
#   runner → 最小运行时（用 deps 的 node_modules）
#
# 为什么不用 --prod 装 deps？
#   Prisma Client 在 deps 阶段就需要 `prisma generate` 命令生成二进制。
#   prisma CLI 本身是 devDependency，--prod 装会漏掉，
#   导致运行时找不到 @prisma/client 的二进制。
#   权衡：多装几个 dev 包换来构建/部署可靠性，可接受。
#
# 用法：
#   docker build -t ai-org-server .
#   docker run --rm -p 4000:4000 \
#     -e DATABASE_URL=... \
#     -e JWT_SECRET=... \
#     -v $(pwd)/uploads:/app/uploads \
#     ai-org-server
# =====================================================================

# ---- 阶段 1: 依赖 + Prisma Client 生成 ----
FROM node:20-alpine AS deps
WORKDIR /app

# 通过 npm 全局装 pnpm（避免 corepack 在 alpine 上的签名问题）
RUN npm install -g pnpm@9

# 先 copy 锁文件，最大化 Docker 层缓存
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# 安装全部依赖（含 devDependencies）
RUN pnpm install --frozen-lockfile

# 生成 Prisma Client（运行时强依赖）
RUN pnpm db:generate

# ---- 阶段 2: 构建 TS ----
FROM node:20-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@9

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# 编译 TS → dist/
RUN pnpm build

# ---- 阶段 3: 运行 ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# 非 root 运行（最小权限原则）
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 拷贝 node_modules（含 Prisma Client 生成物）
COPY --from=deps /app/node_modules ./node_modules

# 拷贝编译产物 + 必要运行时文件
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/tsconfig.json ./tsconfig.json

# uploads 目录（运行时挂载卷）
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

# 健康检查（用 node 而非 curl，alpine 默认无 curl）
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# 启动前先跑 prisma migrate deploy（生产环境推荐做法）
#   - 已迁移则跳过
#   - 首次启动会自动建表
# 用本地 node_modules 里的 prisma CLI（避免 PATH 找不到）
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node dist/index.js"]