# 🚀 国内服务器一键部署指南（阿里云/腾讯云）

本指南适合**中国大陆用户**作为主要访问对象的个人品牌站。
**总成本**：阿里云/腾讯云秒杀约 **38-100 元/年**（约 3-8 元/月）。

---

## 📊 架构

```
用户浏览器（国内）
   │
   ▼
Nginx（80/443）         ← HTTPS + 静态文件
   │
   ├── /          → Vue 静态文件（dist/）
   ├── /api/      → 反代到 127.0.0.1:4000
   └── /uploads/  → 反代到 127.0.0.1:4000
        │
        ▼
   Node.js（PM2 守护）  ← ai-org-server
        │
        ▼
   PostgreSQL（Docker） ← 同机容器
```

---

## 🎯 部署前提

### 你需要准备的

| 项目 | 说明 |
|---|---|
| **阿里云/腾讯云账号** | 已实名认证 |
| **轻量应用服务器** | 秒杀价 38 元/年起 |
| **域名**（可选） | 备案后用 `.com`；免备案用 `.cn/.online/.club` |
| **SSH 工具** | Windows 用 PowerShell 自带，或装 [Termius](https://termius.com) |

### 服务器最低配置

| 项目 | 最低 | 推荐 |
|---|---|---|
| CPU | 1 核 | 2 核 |
| 内存 | 1 GB | 2 GB |
| 硬盘 | 40 GB | 50 GB SSD |
| 带宽 | 1 Mbps | 3-5 Mbps |
| 系统 | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

---

## 🛠️ 完整部署步骤

### Step 1：购买服务器（10 分钟）

#### 阿里云

1. 访问 [轻量应用服务器](https://developer.aliyun.com/plan/light-server-seckill)
2. 选 **Ubuntu 22.04**
3. 区域选 **上海** 或 **广州**（覆盖全国）
4. 付款

#### 腾讯云

1. 访问 [轻量应用服务器秒杀](https://cloud.tencent.com/product/lighthouse)
2. 同样选 **Ubuntu 22.04** + **上海/广州**

#### 拿到服务器后

1. 控制台 → 你的服务器 → **重置密码**（设一个强密码）
2. 防火墙放通：**22（SSH）/80（HTTP）/443（HTTPS）/4000（后端）**
3. 复制**公网 IP**（形如 `123.45.67.89`）

---

### Step 2：SSH 连接服务器（5 分钟）

打开 PowerShell：

```powershell
ssh root@你的服务器IP
# 输入刚才设的密码
```

第一次连接会问"是否信任主机"，输入 `yes`。

---

### Step 3：一键安装环境（10 分钟）

连接成功后，**逐条执行**下面的命令（每段都要等前一段跑完）。

```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y curl wget git ufw software-properties-common

# 安装 Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 验证 Node.js
node -v    # 应该显示 v20.x.x
npm -v

# 安装 pnpm
npm install -g pnpm

# 安装 Docker（用于跑 PostgreSQL）
apt install -y docker.io
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
apt install -y docker-compose

# 安装 Nginx
apt install -y nginx

# 安装 PM2（守护 Node.js 进程）
npm install -g pm2

# 安装 Certbot（HTTPS 证书）
apt install -y certbot python3-certbot-nginx
```

---

### Step 4：配置防火墙（3 分钟）

阿里云/腾讯云默认只放通 22 和 80/443，需要手动确认：

```bash
# 本地防火墙
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 4000/tcp
ufw enable
```

⚠️ **额外重要**：去云厂商控制台 → **安全组/防火墙** → 放通 80/443/4000 端口
（ufw 只管服务器内部，云厂商还有一层安全组）

---

### Step 5：部署 PostgreSQL（5 分钟）

```bash
mkdir -p /root/ai-org && cd /root/ai-org

# 创建 docker-compose.yml
cat > docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ai-org-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: aiorg
      # ⚠️ 改成你自己的强密码
      POSTGRES_PASSWORD: CHANGEME_POSTGRES_PASSWORD_HERE
      POSTGRES_DB: aiorg
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    shm_size: 256mb
COMPOSE_EOF

# 启动
docker compose up -d

# 验证
docker ps
# 应该看到 ai-org-postgres 在运行
```

---

### Step 6：推代码到 GitHub（在本地操作）

回到你本地电脑：

```bash
cd c:\Users\86133\Desktop\网站

# 如果还没初始化 git
git init
git add .
git commit -m "initial commit for deployment"

# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/ai-org.git
git branch -M main
git push -u origin main
```

---

### Step 7：部署后端（在服务器上）

回到服务器 SSH：

```bash
cd /root/ai-org

# 克隆代码
git clone https://github.com/你的用户名/ai-org.git app

# ⚠️ 建议用 SSH key 而不是密码，否则每次 push 都要输密码
# 配置 SSH key 见：https://docs.github.com/zh/authentication/connecting-to-github-with-ssh

cd app/ai-org-server

# 创建 .env
cat > .env << 'ENV_EOF'
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://aiorg:CHANGEME_POSTGRES_PASSWORD_HERE@127.0.0.1:5432/aiorg?schema=public
JWT_SECRET=Z4NL6SNXlHWodRzJ2qIrex9rKKH9vEzBIlBYnb8xKpgAR6j5PSoduyKwpOgA35xW
JWT_EXPIRES_IN=7d
UPLOAD_DIR=/root/ai-org/app/ai-org-server/uploads
MAX_FILE_SIZE_MB=20
# ⚠️ 暂时先用 * 或服务器 IP，最后换成真实域名
CORS_ORIGINS=*
ADMIN_USERNAME=admin
ADMIN_PASSWORD=WANGhui2010149
ADMIN_EMAIL=admin@your-domain.com
ENV_EOF

# ⚠️ 重要：把上面 3 处 CHANGEME 改成你自己的强密码
# 然后：JWT_SECRET、ADMIN_PASSWORD 建议自己重新生成

# 安装依赖
pnpm install

# 生成 Prisma client
pnpm db:generate

# 跑数据库迁移
pnpm db:migrate deploy

# 创建默认 admin 账号
pnpm db:seed

# 构建
pnpm build

# 用 PM2 守护进程
pm2 start dist/index.js --name ai-org-server
pm2 save

# 设置开机自启（PM2 会打印一行命令，复制执行）
pm2 startup
```

#### 验证后端

```bash
# 看进程状态
pm2 status
# 应该看到 ai-org-server: online

# 看日志
pm2 logs ai-org-server --lines 50

# 测健康检查
curl http://127.0.0.1:4000/api/health
# 应该返回 {"status":"ok",...}
```

---

### Step 8：部署前端（在服务器上）

```bash
cd /root/ai-org/app/ai-org-web

# 创建 .env.production
cat > .env.production << 'WEB_EOF'
# 用真实域名（如果有）或服务器 IP
VITE_API_BASE_URL=http://你的服务器IP:4000
WEB_EOF

# 安装 + 构建
pnpm install
pnpm build

# 产物在 dist/ 目录
ls -la dist/
# 应该能看到 index.html 和 assets/ 目录
```

---

### Step 9：配置 Nginx（10 分钟）

```bash
cat > /etc/nginx/sites-available/ai-org << 'NGINX_EOF'
server {
    listen 80;
    server_name 你的服务器IP _;   # 临时用 IP，有域名后改

    # 前端静态文件
    root /root/ai-org/app/ai-org-web/dist;
    index index.html;
    charset utf-8;

    # Vue Router history 模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 后端 API 反代
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # 上传文件
    location /uploads/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
NGINX_EOF

# 启用站点
ln -sf /etc/nginx/sites-available/ai-org /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启
systemctl reload nginx
```

---

### Step 10：验证部署（5 分钟）

打开浏览器访问 `http://你的服务器IP`：

- [ ] 看到首页
- [ ] 测评页能打开
- [ ] 资源页能加载数据
- [ ] 没有 CORS 报错

如果一切正常 → **部署完成！**

---

### Step 11（可选）：绑定域名 + HTTPS（30 分钟）

#### 11.1 买域名

- 国内便宜域名：`yourname.online`（8 元/年）
- 好记的 `.com`：50-80 元/年

#### 11.2 域名解析

到域名服务商控制台 → DNS 解析：

| 主机记录 | 记录类型 | 记录值 |
|---|---|---|
| @ | A | 你的服务器 IP |
| www | A | 你的服务器 IP |

#### 11.3 ICP 备案（仅 `.com/.cn` 需要）

- `.com/.cn/.net`：必须备案，工信部审核 7-20 天，**免费**
- `.online/.club/.top/.xyz`：**免备案**，直接可用

#### 11.4 申请 HTTPS 证书

```bash
certbot --nginx -d 你的域名 -d www.你的域名
```

按提示输入邮箱、同意条款。Certbot 会自动：
- 申请 Let's Encrypt 免费证书
- 修改 Nginx 配置
- 设置自动续期

#### 11.5 修改 Nginx 配置

```bash
nano /etc/nginx/sites-available/ai-org
# 把 server_name 改成你的域名
systemctl reload nginx
```

#### 11.6 修改后端 CORS

```bash
cd /root/ai-org/app/ai-org-server

# 编辑 .env，把 CORS_ORIGINS 从 * 改成域名
nano .env

# 重启后端
pm2 restart ai-org-server
```

---

## 🔄 日常运维

### 更新代码

```bash
cd /root/ai-org/app

# 拉最新代码
git pull origin main

# 如果后端改了
cd ai-org-server
pnpm install
pnpm db:migrate deploy    # 如果有新的 migration
pnpm build
pm2 restart ai-org-server

# 如果前端改了
cd ../ai-org-web
pnpm install
pnpm build
```

### 看日志

```bash
# 后端日志
pm2 logs ai-org-server

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 系统日志
journalctl -u nginx -f
```

### 备份数据库（重要）

```bash
# 每周跑一次（可以加到 cron）
docker exec ai-org-postgres pg_dump -U aiorg aiorg | gzip > /root/ai-org/backups/db-$(date +%Y%m%d).sql.gz

# 恢复
gunzip < /root/ai-org/backups/db-20261001.sql.gz | docker exec -i ai-org-postgres psql -U aiorg aiorg
```

### 添加自动备份（crontab）

```bash
crontab -e

# 添加一行（每周日凌晨 3 点备份）
0 3 * * 0 docker exec ai-org-postgres pg_dump -U aiorg aiorg | gzip > /root/ai-org/backups/db-$(date +\%Y\%m\%d).sql.gz

# 同时清理 30 天前的备份
0 4 * * 0 find /root/ai-org/backups/ -name "*.sql.gz" -mtime +30 -delete
```

---

## 🔐 安全检查清单

部署完后**立即**做的事：

- [ ] **改 SSH 密码**（不要用 root 跑，改用普通用户 + sudo）
- [ ] **改 ADMIN_PASSWORD**（.env 里的密码）
- [ ] **改 PostgreSQL 密码**（docker-compose.yml 里）
- [ ] **改 JWT_SECRET**（重新生成）
- [ ] **禁用 root 登录**（改用 SSH key）

### SSH key 登录（推荐）

本地：
```powershell
ssh-keygen -t ed25519
# 生成的公钥在 C:\Users\86133\.ssh\id_ed25519.pub
type C:\Users\86133\.ssh\id_ed25519.pub
```

服务器：
```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys   # 粘贴公钥
chmod 600 ~/.ssh/authorized_keys
```

然后禁用密码登录：
```bash
nano /etc/ssh/sshd_config
# 改：PasswordAuthentication no
systemctl restart sshd
```

---

## 💰 成本清单

| 项目 | 一次性 | 年度 |
|---|---|---|
| 阿里云/腾讯云服务器 | - | 38-100 元 |
| 域名（可选） | 8-80 元 | 8-80 元 |
| HTTPS 证书 | 0 | 0（Let's Encrypt 免费） |
| **合计** | - | **46-180 元/年** |

平均每天 **0.13-0.5 元**。

---

## 🆘 故障排查

### Q1：打不开网站

```bash
# 1. 看 Nginx 状态
systemctl status nginx

# 2. 看 Nginx 错误日志
tail -50 /var/log/nginx/error.log

# 3. 看后端状态
pm2 status
pm2 logs ai-org-server

# 4. 直接测后端
curl http://127.0.0.1:4000/api/health
```

### Q2：前端加载但 API 报错

- 浏览器 DevTools → Network → 看 `/api/...` 请求
- 看是不是 404（路径错了）或 CORS 报错
- 检查后端 `.env` 里的 `CORS_ORIGINS`

### Q3：数据库连不上

```bash
docker ps              # 看 postgres 容器在不在
docker logs ai-org-postgres
docker exec -it ai-org-postgres psql -U aiorg -d aiorg
```

### Q4：磁盘空间不够

```bash
# 看磁盘使用
df -h
du -sh /root/ai-org/*

# 清理 Docker 缓存
docker system prune -a
```

### Q5：服务器被攻击

```bash
# 看异常登录
last -50
cat /var/log/auth.log | grep -i "failed"

# 看当前连接
netstat -ant | grep ESTABLISHED
```

---

## 📝 部署记录模板

部署完成后填写：

```
部署日期：__________
云厂商：阿里云 / 腾讯云
服务器区域：__________
公网 IP：__________
域名：__________
备案状态：已备案 / 免备案 / 不需要
SSL 证书：Let's Encrypt / 其他
PostgreSQL 密码：__________（保存在密码管理器）
ADMIN 账号：__________（保存在密码管理器）
```

---

**最后更新**：2026-10-01
**预计部署时间**：2-4 小时（含备案时间不计入）
