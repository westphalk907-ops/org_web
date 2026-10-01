#!/bin/bash
# ============================================================
# AI Organization 一键部署脚本（国内服务器专用）
# 适用系统：Ubuntu 22.04 LTS
# 使用方法：bash deploy.sh
# ============================================================

set -e  # 任何命令失败立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# 检查是否是 root
if [ "$EUID" -ne 0 ]; then
  err "请用 root 用户运行：sudo bash deploy.sh"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  AI Organization 一键部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# ====== 1. 收集必要信息 ======
echo -e "${YELLOW}📝 请提供以下信息${NC}"
echo ""

read -p "GitHub 仓库地址（如 https://github.com/xxx/ai-org.git）: " REPO_URL
[ -z "$REPO_URL" ] && err "仓库地址不能为空"

read -p "你的服务器公网 IP 或域名（用于 CORS_ORIGINS）: " DOMAIN_OR_IP
[ -z "$DOMAIN_OR_IP" ] && err "IP/域名不能为空"

read -p "PostgreSQL 密码（强密码）: " DB_PASSWORD
[ -z "$DB_PASSWORD" ] && err "密码不能为空"

# 自动生成 JWT_SECRET
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))" 2>/dev/null || openssl rand -base64 48)
log "自动生成 JWT_SECRET: ${JWT_SECRET:0:20}..."

read -p "Admin 密码（强密码）: " ADMIN_PASSWORD
[ -z "$ADMIN_PASSWORD" ] && err "密码不能为空"

ADMIN_EMAIL="admin@${DOMAIN_OR_IP}"

echo ""
log "配置信息确认："
echo "  仓库：$REPO_URL"
echo "  域名/IP：$DOMAIN_OR_IP"
echo "  数据库密码：${DB_PASSWORD:0:3}***"
echo "  JWT_SECRET：${JWT_SECRET:0:20}..."
echo "  Admin 密码：${ADMIN_PASSWORD:0:3}***"
echo ""
read -p "确认无误？(y/n) " CONFIRM
[ "$CONFIRM" != "y" ] && err "已取消"

# ====== 2. 系统更新 ======
log "更新系统..."
apt update && apt upgrade -y

# ====== 3. 安装基础工具 ======
log "安装基础工具..."
apt install -y curl wget git ufw software-properties-common apt-transport-https ca-certificates

# ====== 4. 安装 Node.js 20 ======
if ! command -v node &> /dev/null; then
  log "安装 Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  log "Node.js 已安装：$(node -v)"
fi

# ====== 5. 安装 pnpm ======
if ! command -v pnpm &> /dev/null; then
  log "安装 pnpm..."
  npm install -g pnpm
else
  log "pnpm 已安装：$(pnpm -v)"
fi

# ====== 6. 安装 Docker ======
if ! command -v docker &> /dev/null; then
  log "安装 Docker..."
  apt install -y docker.io
  systemctl start docker
  systemctl enable docker
else
  log "Docker 已安装"
fi

# ====== 7. 安装 Docker Compose ======
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  log "安装 Docker Compose..."
  apt install -y docker-compose
fi

# ====== 8. 安装 Nginx ======
if ! command -v nginx &> /dev/null; then
  log "安装 Nginx..."
  apt install -y nginx
  systemctl start nginx
  systemctl enable nginx
fi

# ====== 9. 安装 PM2 ======
if ! command -v pm2 &> /dev/null; then
  log "安装 PM2..."
  npm install -g pm2
fi

# ====== 10. 配置防火墙 ======
log "配置防火墙..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# ====== 11. 部署 PostgreSQL ======
log "部署 PostgreSQL..."
mkdir -p /root/ai-org && cd /root/ai-org

if [ ! -f docker-compose.yml ]; then
  cat > docker-compose.yml << COMPOSE_EOF
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ai-org-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: aiorg
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: aiorg
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    shm_size: 256mb
COMPOSE_EOF
fi

docker compose up -d

# 等 postgres 启动
log "等待 PostgreSQL 启动..."
for i in {1..30}; do
  if docker exec ai-org-postgres pg_isready -U aiorg &>/dev/null; then
    log "PostgreSQL 已就绪"
    break
  fi
  sleep 1
done

# ====== 12. 拉取代码 ======
log "拉取代码..."
if [ -d app ]; then
  cd app
  git pull origin main
  cd ..
else
  git clone "$REPO_URL" app
fi

# ====== 13. 部署后端 ======
log "部署后端..."
cd /root/ai-org/app/ai-org-server

cat > .env << ENV_EOF
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://aiorg:${DB_PASSWORD}@127.0.0.1:5432/aiorg?schema=public
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
UPLOAD_DIR=/root/ai-org/app/ai-org-server/uploads
MAX_FILE_SIZE_MB=20
CORS_ORIGINS=http://${DOMAIN_OR_IP},https://${DOMAIN_OR_IP}
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ADMIN_EMAIL=${ADMIN_EMAIL}
ENV_EOF

pnpm install
pnpm db:generate
pnpm db:migrate deploy
pnpm db:seed
pnpm build

mkdir -p /root/ai-org/app/ai-org-server/uploads

# ====== 14. PM2 启动后端 ======
log "启动后端（PM2 守护）..."
pm2 delete ai-org-server 2>/dev/null || true
pm2 start dist/index.js --name ai-org-server
pm2 save

# ====== 15. 部署前端 ======
log "部署前端..."
cd /root/ai-org/app/ai-org-web

cat > .env.production << WEB_EOF
VITE_API_BASE_URL=http://${DOMAIN_OR_IP}:4000
WEB_EOF

pnpm install
pnpm build

# ====== 16. 配置 Nginx ======
log "配置 Nginx..."

cat > /etc/nginx/sites-available/ai-org << NGINX_EOF
server {
    listen 80;
    server_name ${DOMAIN_OR_IP} _;

    root /root/ai-org/app/ai-org-web/dist;
    index index.html;
    charset utf-8;

    client_max_body_size 25M;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/ai-org /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

# ====== 17. 验证 ======
log "验证部署..."
sleep 3

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🎉 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "访问地址：http://${DOMAIN_OR_IP}"
echo ""
echo "下次更新代码："
echo "  cd /root/ai-org/app && git pull"
echo "  cd ai-org-server && pnpm install && pnpm build && pm2 restart ai-org-server"
echo "  cd ../ai-org-web && pnpm install && pnpm build"
echo ""
echo "查看日志："
echo "  pm2 logs ai-org-server"
echo "  tail -f /var/log/nginx/error.log"
echo ""
echo "⚠️ 重要：记得在云厂商控制台安全组放通 80/443 端口"
echo ""