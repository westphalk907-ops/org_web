# AI Organization Hub - 后端

基于 FastAPI + Supabase 的后端 API。

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn main:app --reload --port 8000

# 访问文档
# http://localhost:8000/docs
```

## 依赖

```
fastapi
uvicorn
supabase
pydantic[email]
python-dotenv
```

## API 列表

### Lead 留资
- `POST /api/lead` - 提交留资
- `POST /api/lead/download` - 下载资料（带留资）

### Assessment 测评
- `POST /api/assessment/submit` - 提交测评并获取结果

### 内容 CMS
- `GET /api/content` - 列表内容
- `GET /api/content/{slug}` - 内容详情
- `GET /api/content/{id}/related` - 相关内容

### 其他
- `GET /api/health` - 健康检查

## Supabase Schema

需要创建以下表：

### leads
```sql
create table leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  company text not null,
  position text,
  email text not null,
  phone text,
  source text,
  topic text,
  message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index leads_email_idx on leads (email);
create index leads_created_at_idx on leads (created_at desc);
```

### contents
```sql
create table contents (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  type text not null,  -- insight / research / framework / playbook / case / checklist / tool
  title text not null,
  subtitle text,
  summary text not null,
  content text,  -- markdown
  thumbnail text,
  author text,
  published_at timestamp with time zone default now(),
  tags text[] default '{}',
  topic text,
  audience text[] default '{}',
  industry text[] default '{}',
  related_services text[] default '{}',
  cta_label text,
  cta_href text,
  seo_title text,
  seo_description text,
  seo_keywords text[]
);
```

### assessments
```sql
create table assessments (
  id uuid default uuid_generate_v4() primary key,
  user_email text,
  user_name text,
  user_company text,
  answers jsonb not null,
  result jsonb not null,
  created_at timestamp with time zone default now()
);
```

### resource_downloads
```sql
create table resource_downloads (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references leads(id),
  resource_id text not null,
  resource_title text,
  downloaded_at timestamp with time zone default now()
);
```

## 部署

### Railway
```bash
railway init
railway up
```

### Fly.io
```bash
fly launch
fly deploy
```

### Docker
```bash
docker build -t ai-org-api .
docker run -p 8000:8000 ai-org-api
```

## 环境变量

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```
