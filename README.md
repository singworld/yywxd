# 业余无线电C类考试记忆助手

纯静态前端网页应用，帮助学习和记忆中国业余无线电C类考试的1283道题目。

## 🎯 核心特性

- ✅ **纯静态前端** - 无需后端服务器，所有数据在浏览器加载
- 📚 **1283道题目** - 完整的C类考试题库
- 🧠 **32条记忆口诀** - 自动匹配记忆技巧
- 📱 **响应式设计** - 支持手机、平板、电脑
- 🎯 **分类学习** - 按5大类别组织题目
- 🚀 **一键部署** - 可部署到任何静态托管平台

## 📂 项目结构

```
/srv/projects/yywxd/
├── src/
│   ├── services/
│   │   └── dataService.ts    # CSV加载和口诀匹配
│   ├── pages/
│   │   ├── IndexPage.vue     # 首页
│   │   ├── CategoryPage.vue  # 分类页
│   │   └── StudyPage.vue     # 学习页
│   └── router/index.ts       # 路由配置
├── public/
│   └── C类题库_extracted.csv # 题库数据
├── dist/                      # 构建输出
├── Remember.md                # 记忆口诀原文
├── CLAUDE.md                  # 开发者文档
├── 使用说明.md                # 用户手册
└── 部署指南.md                # 部署说明
```

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
# 访问 http://localhost:9000
```

### 构建生产版本
```bash
pnpm build
# 输出到 dist/
```

### 本地预览
```bash
# 直接用浏览器打开
dist/index.html

# 或使用HTTP服务器
cd dist
python3 -m http.server 8080
```

## 📦 部署

### GitHub Pages
```bash
pnpm deploy
```

### Netlify
拖拽 `dist/` 目录到 Netlify

### Vercel
```bash
vercel --prod
```

### 其他平台
上传 `dist/` 目录到任何静态托管服务

## 🛠 技术栈

- **Vue 3** - 现代前端框架
- **Quasar** - Material Design UI组件库
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **PapaParse** - CSV解析

## 📝 开发说明

### 添加记忆口诀
编辑 `src/services/dataService.ts`：
```typescript
{ pattern: /关键词/g, aid: '你的记忆口诀' }
```

### 更新题库
替换 `public/C类题库_extracted.csv` 文件

### 可用命令
```bash
pnpm dev     # 开发服务器
pnpm build   # 构建生产版本
pnpm deploy  # 部署到GitHub Pages
pnpm test    # 运行测试
pnpm lint    # 代码检查
```

## 📋 文档

- [使用说明](./使用说明.md) - 详细使用指南
- [部署指南](./部署指南.md) - 部署步骤说明
- [CLAUDE.md](./CLAUDE.md) - Claude Code开发文档

## 📄 许可证

MIT License

## 🙏 致谢

题库来源于中国业余无线电C类考试官方题库。