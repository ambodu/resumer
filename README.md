# Resume Builder - 专业简历制作工具

一个现代化的专业简历制作工具，基于 Next.js 14、TypeScript 和 Tailwind CSS 构建，支持多语言国际化。

## ✨ 主要功能

- 🎨 **精美模板** - 多种专业设计的简历模板可供选择
- ✏️ **智能编辑器** - 直观的简历编辑界面，实时预览
- 🌍 **多语言支持** - 支持中文和英文界面切换
- 📱 **响应式设计** - 完美适配桌面、平板和移动设备
- 📄 **PDF 导出** - 一键导出高质量 PDF 简历
- 💾 **自动保存** - 编辑内容自动保存，不丢失数据
- 🔍 **实时预览** - 所见即所得的编辑体验
- 🎯 **ATS 友好** - 模板针对求职系统优化
- ⚡ **性能优化** - 快速加载，流畅体验
- 🔒 **数据安全** - 本地存储，保护隐私

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: 自定义组件 + Radix UI
- **状态管理**: Zustand
- **国际化**: Next.js i18n
- **图标**: Lucide React
- **部署**: Vercel Ready

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 安装步骤

1. 克隆项目：

```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

2. 安装依赖：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
├── app/                      # Next.js 14 应用目录
│   ├── [locale]/            # 国际化路由
│   │   ├── editor/          # 编辑器页面
│   │   ├── templates/       # 模板页面
│   │   ├── user/           # 用户页面
│   │   └── page.tsx        # 首页
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx           # 根页面（重定向）
├── components/             # 可复用组件
│   ├── ui/                # 基础UI组件
│   ├── editor/            # 编辑器组件
│   ├── templates/         # 模板组件
│   ├── navbar.tsx         # 导航栏
│   ├── language-switcher.tsx # 语言切换
│   └── user-dashboard.tsx # 用户面板
├── lib/                   # 工具函数和配置
│   ├── store.ts          # Zustand状态管理
│   ├── types.ts          # TypeScript类型定义
│   ├── i18n.ts           # 国际化配置
│   ├── translations.ts   # 翻译工具
│   └── utils.ts          # 工具函数
├── messages/             # 多语言文件
│   ├── zh.json          # 中文翻译
│   └── en.json          # 英文翻译
├── config/              # 配置文件
│   └── site.ts         # 网站配置
├── middleware.ts        # Next.js中间件（语言检测）
└── public/             # 静态资源
```

## 🎯 使用指南

### 基本流程

1. **选择模板** - 浏览专业模板库，选择适合的设计
2. **填写信息** - 使用编辑器添加个人信息、工作经历、教育背景等
3. **实时预览** - 查看简历效果，随时调整内容
4. **保存管理** - 保存多份简历，随时编辑
5. **导出下载** - 一键导出 PDF 格式简历

### 多语言支持

- 支持中文（zh）和英文（en）
- 自动检测浏览器语言
- 可手动切换界面语言
- URL 路径包含语言标识：`/zh/editor` 或 `/en/editor`

### 路由结构

- `/` - 自动重定向到默认语言首页
- `/zh` - 中文首页
- `/en` - 英文首页
- `/zh/templates` - 中文模板页
- `/zh/editor` - 中文编辑器
- `/zh/user` - 中文用户页面

## 🌟 核心特性

### 国际化路由

- 基于文件系统的动态路由
- 自动语言检测和重定向
- SEO 友好的多语言 URL

### 响应式设计

- 移动优先的设计理念
- 适配各种屏幕尺寸
- 触摸友好的交互体验

### 性能优化

- 代码分割和懒加载
- 图片优化
- 缓存策略
- 性能监控

## 🤝 贡献指南

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 💬 支持与反馈

如有问题或需要帮助，请：

- 在 GitHub 上提交 Issue
- 发送邮件至 support@resume-builder.com
- 访问帮助文档

## 🗺️ 发展路线

- [x] 多语言国际化支持
- [x] 响应式设计优化
- [x] 用户简历管理
- [ ] AI 智能内容建议
- [ ] 更多模板设计
- [ ] 多格式导出（Word、HTML）
- [ ] 协作功能
- [ ] 求职网站集成
- [ ] 高级自定义选项

## 📊 项目状态

- ✅ 核心功能完成
- ✅ 多语言支持
- ✅ 响应式设计
- ✅ 性能优化
- 🚧 持续改进中

---

**Resume Builder** - 让简历制作变得简单而专业 🚀
