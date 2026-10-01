# AI Organization Solution Hub

> 企业 AI 组织变革的知识与解决方案中心
> From AI Adoption to AI Organization.

---

## 项目简介

这是一个 **内容型解决方案网站 + 互动体验 + Lead Generation + 咨询转化** 的前端项目，
定位为面向企业的 **AI Organization Solution Hub**。

## 技术栈

- **框架**：Vue 3.5+ (Composition API + `<script setup>`)
- **构建**：Vite 6.x
- **语言**：TypeScript 5.6+ (strict)
- **样式**：Tailwind CSS 3.4 + Sass（纯 Tailwind 自研组件）
- **状态管理**：Pinia 2.x
- **路由**：Vue Router 4
- **HTTP**：Axios
- **图表**：ECharts（Assessment 可视化）
- **动画**：GSAP（高端动效）
- **工具**：VueUse、dayjs、marked、DOMPurify

## 设计方向

- ✅ 黑底背景（Ink）
- ✅ 米金色调（Gold accent）
- ✅ 克制美学
- ✅ 未来感视觉

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建生产
pnpm build

# 预览构建
pnpm preview
```

## 目录结构

```
ai-org-web/
├── src/
│   ├── api/                # API 接口封装
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   │   ├── layout/         # 布局组件
│   │   ├── content/        # 内容卡片
│   │   ├── interactive/    # 互动体验组件
│   │   └── ui/             # 基础 UI 组件
│   ├── composables/        # 组合式函数
│   ├── data/               # 静态数据（内容、地图、测评题库）
│   ├── router/             # 路由
│   ├── stores/             # Pinia stores
│   ├── styles/             # 全局样式
│   ├── types/              # TypeScript 类型
│   ├── utils/              # 工具函数
│   ├── views/              # 页面
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── public/
├── tests/
└── ...
```

## 更多信息

详见项目根目录下的设计文档：
- `AI组织解决方案网站_建设方案.md` - 完整建设方案

---

> v1.0 · 2026-09-29
