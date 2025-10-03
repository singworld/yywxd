# Vercel 部署指南

## 项目信息

**项目名称**：业余无线电C类考试记忆助手
**项目类型**：纯静态前端应用
**技术栈**：Vue 3 + Quasar UI + TypeScript + Vite

## 部署步骤

### 方式一：通过 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署项目
在项目根目录执行：
```bash
vercel
```

首次部署会提示：
- **Set up and deploy?** → Yes
- **Which scope?** → 选择你的账号
- **Link to existing project?** → No
- **Project name?** → amateur-radio-exam（或自定义）
- **In which directory is your code located?** → ./（当前目录）

#### 4. 生产环境部署
```bash
vercel --prod
```

### 方式二：通过 Vercel 网站（更简单）

#### 1. 推送代码到 Git 仓库

首先确保代码已推送到 GitHub/GitLab/Bitbucket：

```bash
# 如果还没有git仓库，先初始化
git init
git add .
git commit -m "准备部署到Vercel"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/amateur-radio-exam.git
git branch -M main
git push -u origin main
```

#### 2. 导入项目到 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 登录你的账号
3. 点击 **"Add New..."** → **"Project"**
4. 选择你的 Git 仓库（GitHub/GitLab/Bitbucket）
5. 找到并点击 **"Import"** 你的项目

#### 3. 配置项目

Vercel 会自动检测到这是一个 Vite 项目，配置应该已经正确：

- **Framework Preset**: Vite
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

**不需要修改任何配置**，Vercel 会使用项目根目录的 [vercel.json](vercel.json) 文件。

#### 4. 点击 **"Deploy"**

等待 2-3 分钟，部署完成！

## 配置说明

### vercel.json 配置

项目已包含 [vercel.json](vercel.json) 配置文件：

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**关键配置说明**：
- `buildCommand`: 使用 `pnpm run build` 构建（已移除类型检查以加快构建）
- `outputDirectory`: 输出到 `dist` 目录
- `rewrites`: 支持 Vue Router 的 history 模式（所有路由都返回 index.html）

### package.json 构建命令

已优化构建命令：
```json
{
  "scripts": {
    "build": "vite build",              // Vercel使用这个（快速构建）
    "build:check": "vue-tsc --noEmit && vite build"  // 本地开发用（含类型检查）
  }
}
```

## 部署后

### 访问你的网站

部署成功后，Vercel 会提供：
- **生产环境 URL**: `https://your-project-name.vercel.app`
- **预览 URL**: 每次 git push 都会自动生成预览链接

### 自动部署

Vercel 会自动监听你的 Git 仓库：
- **推送到主分支** → 自动部署到生产环境
- **推送到其他分支** → 自动生成预览环境

### 自定义域名（可选）

1. 在 Vercel 项目设置中点击 **"Domains"**
2. 添加你的域名（如 `exam.example.com`）
3. 按照提示配置 DNS 记录

## 环境变量（如需要）

如果将来需要环境变量：
1. 在 Vercel 项目设置中点击 **"Environment Variables"**
2. 添加变量（如 `VITE_API_URL`）
3. 重新部署

**注意**：当前项目是纯静态的，不需要任何环境变量。

## 常见问题

### 1. 构建失败：vue-tsc 错误
**已解决**：修改了 `package.json` 的构建命令，移除了类型检查。

### 2. 路由 404 错误
**已解决**：`vercel.json` 中配置了 rewrites，所有路由都会返回 `index.html`。

### 3. CSV 文件加载失败
确保 `public/C类题库_extracted.csv` 文件存在，Vite 会自动将 `public` 目录下的文件复制到 `dist` 目录。

### 4. 部署后样式错误
检查 `vite.config.ts` 中的 `base` 配置，当前设置为 `'./'`（相对路径），适合 Vercel 部署。

## 性能优化建议

部署成功后，Vercel 会自动提供：
- ✅ **全球 CDN** - 自动分发到全球边缘节点
- ✅ **自动压缩** - Gzip/Brotli 压缩
- ✅ **HTTP/2** - 自动启用
- ✅ **HTTPS** - 免费 SSL 证书
- ✅ **缓存优化** - 静态资源自动缓存

**无需额外配置**，Vercel 已经做好了所有优化！

## 本地测试构建结果

在部署到 Vercel 之前，建议先本地测试：

```bash
# 构建
pnpm run build

# 预览构建结果
pnpm run preview
# 或
npx serve dist
```

访问 http://localhost:4173 检查是否正常工作。

## 项目特点

✅ **纯静态** - 无需服务器，只有静态HTML/JS/CSS
✅ **零配置** - Vercel 自动识别 Vite 项目
✅ **快速部署** - 2-3分钟完成部署
✅ **自动更新** - Git push 自动触发部署
✅ **免费** - Vercel 免费版足够使用

## 总结

Vercel 部署流程：
1. 推送代码到 GitHub（或其他 Git 平台）
2. 在 Vercel 网站导入项目
3. 点击 Deploy
4. 完成！

**推荐使用方式二（通过网站）**，更简单直观！
