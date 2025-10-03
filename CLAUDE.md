# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**业余无线电C类考试记忆助手** - 一个纯静态的前端网页应用，用于学习和记忆中国业余无线电C类考试题目。

**重要**: 这是一个**纯前端项目**，不需要后端服务器。所有数据（题库CSV文件）在浏览器中加载。

**Tech Stack:**
- Vue 3 + Quasar UI + TypeScript + Vite
- PapaParse (CSV解析)
- 纯静态文件，可部署到任何静态托管平台

## Essential Commands

### 开发
```bash
# 启动开发服务器 (端口 9000)
pnpm dev
```

### 构建
```bash
# 构建生产版本（输出到 dist/）
pnpm build
```

### 本地预览构建结果
```bash
# 使用Vite预览
pnpm preview

# 或使用npx serve
npx serve dist
```

### 部署到Vercel
```bash
# 方式一：通过Vercel CLI
vercel

# 方式二：通过Vercel网站（推荐）
# 1. 推送代码到GitHub
# 2. 在vercel.com导入项目
# 3. 点击Deploy

# 详细步骤见：Vercel部署指南.md
```

## 项目架构

### 核心功能

1. **题库加载** - 从 `public/C类题库_extracted.csv` 加载1283道题目
2. **记忆口诀匹配** - 根据题目内容自动匹配32条记忆技巧
3. **分类学习** - 按5大类别（无线电管理法规、技术基础、发射接收机、天线馈线、安全防护）组织题目
4. **学习界面** - 逐题练习，显示选项、正确答案和记忆口诀

### 文件结构

```
frontend/
├── src/
│   ├── services/
│   │   └── dataService.ts       # 核心数据服务：CSV加载、记忆口诀匹配
│   ├── pages/
│   │   ├── IndexPage.vue        # 首页：统计信息
│   │   ├── CategoryPage.vue     # 分类页：选择题库分类
│   │   └── StudyPage.vue        # 学习页：逐题练习
│   ├── router/index.ts          # Vue Router配置
│   └── layouts/MainLayout.vue   # 主布局
├── public/
│   └── C类题库_extracted.csv   # 题库数据（1283道题）
└── dist/                         # 构建输出（Git忽略）
```

### 数据服务 (dataService.ts)

**核心功能**:
- `loadQuestions()` - 加载并解析CSV文件，返回所有题目
- `getQuestionsByCategory(categoryId)` - 获取特定分类的题目
- `getCategoryStats()` - 获取分类统计信息
- `findMemoryAid(content)` - 根据题目内容匹配记忆口诀

**记忆口诀匹配机制**:
使用正则表达式模式匹配题目关键词，例如：
```typescript
{ pattern: /罚款/g, aid: '看到罚款选最大（3w/5k），如遇拒不改正就选它' }
{ pattern: /波长|300|电离/g, aid: '计算波长300除，远距离传过来靠电离反射' }
```

### CSV数据格式

```csv
J,P,I,Q,T,A,B,C,D
LY0001,1.1.1,MC2-0001,题目内容,AC,选项A,选项B,选项C,选项D
```

字段说明：
- **J**: 题号 (如 LY0001)
- **P**: 分类代码 (如 1.1.1，第一位数字是主分类)
- **I**: 内部ID
- **Q**: 题目内容
- **T**: 正确答案 (单选如 "A"，多选如 "AC")
- **A/B/C/D**: 四个选项

## 开发注意事项

### 无后端依赖
- ❌ 不要添加任何后端API调用（axios, fetch到后端服务器）
- ✅ 所有数据从 `public/` 目录的CSV文件加载
- ✅ 使用 `fetch('/C类题库_extracted.csv')` 加载数据

### 构建配置
`vite.config.ts` 中的关键配置：
```typescript
base: './'  // 支持相对路径，可在任意目录打开
```

### 记忆口诀系统
**新版系统**（基于内容，不依赖选项位置）：
- 文件：`src/services/memoryAidsContentBased.ts`
- 特点：简洁、口语化、易记（参考Remember.md风格）
- 100%覆盖所有题目
- 详见：[记忆口诀优化总结.md](记忆口诀优化总结.md)

### 更新题库
替换 `public/C类题库_extracted.csv` 文件即可。

## 部署方式

### 推荐：Vercel（最简单）
1. 推送代码到GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 点击Deploy
4. 完成！（自动配置，无需任何设置）

**详细步骤**：见 [Vercel部署指南.md](Vercel部署指南.md)

### 其他选项
- **GitHub Pages** - 免费，自动构建
- **Netlify** - 一键部署
- **Cloudflare Pages** - CDN加速
- **直接打开** - 构建后双击 `dist/index.html`

## 记忆口诀示例

项目内置32条记忆技巧，涵盖主要考点：

1. "看到罚款选最大（3w/5k），如遇拒不改正就选它"
2. "计算波长300除，远距离传过来靠电离反射"
3. "FM对称波，频谱图，amfmpm是扶贫乡(幅频相)"
4. "电压并，电流串，完美组成电和磁，完美驻波1：1"
5. "天线增益是密度，dBi i是一点圆（点源）dBd是一半（半波）"

更多口诀见 `Remember.md` 文件。

## 技术要点

### Vue 3 Composition API
所有组件使用 `<script setup>` 语法，更简洁的代码。

### TypeScript 严格模式
- 启用严格类型检查
- 所有函数参数必须标注类型
- 避免使用 `any` 类型

### Quasar UI组件
使用Material Design风格的组件：
- `q-card` - 卡片布局
- `q-btn` - 按钮
- `q-linear-progress` - 进度条
- `q-option-group` - 选项组（单选/多选）

### 响应式设计
使用Quasar的响应式类：
```vue
<div class="col-xs-12 col-sm-6 col-md-4">
```

## 未来扩展（可选）

如果需要添加功能：
1. **本地存储** - 使用 localStorage 保存学习进度
2. **错题本** - 记录做错的题目
3. **模拟考试** - 随机抽取题目进行限时测试
4. **统计分析** - 学习时间、正确率统计
5. **PWA支持** - 离线使用能力

这些功能都可以在纯前端实现，无需后端。

## 重要提醒

- 这是一个**记忆学习工具**，不是完整的考试系统
- 重点在于**题库浏览**和**记忆口诀展示**
- 不需要用户账户、数据库、后端API
- 保持简单、轻量、易部署
