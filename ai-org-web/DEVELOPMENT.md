# 开发指南

## 项目结构说明

### `src/data/` - 静态数据
项目核心数据资产都在这里，包括：

- `assessment-questions.ts` - 测评题库（15 题 × 4 选项）
- `maps.ts` - 个体/组织 5 阶段地图数据
- `workflows.ts` - 5 个工作流场景对比
- `home.ts` - 首页痛点、资源、案例

修改这些文件即可调整内容，无需改组件代码。

### `src/views/` - 页面
- `home/Index.vue` - 首页（9 大模块组合）
- `understand/` - 认知
- `learn/` - 学习
- `experience/` - 体验（核心互动）
- `act/` - 行动
- `resources/` - 资料
- `cases/` - 案例
- `about/` - 关于
- `contact/` - 联系

### `src/components/` - 组件
- `ui/` - 基础 UI（按钮、标签、标题等）
- `layout/` - 全局布局（Header、Footer）
- `home/` - 首页 9 大模块

## 添加新内容

### 1. 添加一篇新文章
1. 在 `src/data/home.ts` 或新建数据文件
2. 创建对应的 `Detail.vue` 页面
3. 在 `src/router/routes.ts` 添加路由

### 2. 修改测评题
编辑 `src/data/assessment-questions.ts`，然后无需改动其他代码。

### 3. 修改地图阶段
编辑 `src/data/maps.ts`。

### 4. 修改工作流场景
编辑 `src/data/workflows.ts`。

## 调整主题色

编辑 `tailwind.config.ts` 中的 `colors.ink` 和 `colors.gold`。

## 调试技巧

### 查看 5 阶段地图
访问 `/experience/organization-map`

### 测评调试
访问 `/experience/assessment`，可以实时查看阶段、Top 3 Gaps、下一步

### Lead 留资
表单提交会调用 `src/api/lead.ts` 的 `submit()`。
后端示例代码在 `backend/main.py`，可直接运行。

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/main.ts` | 入口 |
| `src/App.vue` | 根组件（含 RouterView 过渡） |
| `src/router/routes.ts` | 所有路由 |
| `tailwind.config.ts` | 主题配置（黑底+米金） |
| `src/styles/index.scss` | 全局样式（Tailwind + 组件类） |

## 部署前清单

- [ ] 替换 `index.html` 的 meta
- [ ] 替换 `public/favicon.svg`
- [ ] 配置 `VITE_API_BASE_URL`
- [ ] 配置后端域名
- [ ] 上线后设置 sitemap.xml
- [ ] 配置 Cloudflare CDN
- [ ] 接入埋点
