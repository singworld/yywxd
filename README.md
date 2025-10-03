# 业余无线电C类考试记忆助手

一个纯静态的前端网页应用，用于学习和记忆中国业余无线电C类考试题目。

## ✨ 功能特点

- 📚 **1282道完整题库** - 覆盖所有C类考试题目
- 🎯 **智能记忆口诀** - 每道题都有专属记忆技巧
- 📊 **分类学习** - 按5大类别组织（法规、技术基础、收发机、天线、安全）
- ✅ **多选题支持** - 完整支持单选和多选题
- 💡 **基于内容的口诀** - 不依赖选项位置，适合真正背题
- 📱 **响应式设计** - 支持手机、平板、电脑

## 🚀 快速开始

### 在线访问

**部署到Vercel**（最简单）：
1. Fork本项目到GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入项目并部署
4. 完成！

详见：[Vercel部署指南.md](Vercel部署指南.md)

### 本地运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:9000
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📖 使用说明

### 学习流程

1. **首页** - 查看题库统计信息
2. **分类页** - 选择学习分类
3. **学习页** - 逐题练习，查看答案和记忆口诀

### 记忆口诀示例

```
罚款类："罚款选最大3w/5k，拒不改正加倍罚"
时间类："北京超前8小时，UTC往回减"
频率类："A类30-3000MHz，25瓦管VHF/UHF"
技术类："长距离弱信号SSB，窄带省功率"
管理类："条例院军委，办法工信部"
```

**特点**：
- ✅ 简洁有力（15字左右）
- ✅ 口语化、好记
- ✅ 不依赖选项ABCD位置
- ✅ 基于实际答案内容

更多口诀见 [Remember.md](Remember.md)

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI组件**: Quasar Framework
- **构建工具**: Vite
- **数据解析**: PapaParse
- **路由**: Vue Router
- **状态管理**: Pinia

## 📁 项目结构

```
├── src/
│   ├── pages/              # 页面组件
│   │   ├── IndexPage.vue   # 首页
│   │   ├── CategoryPage.vue # 分类页
│   │   └── StudyPage.vue   # 学习页
│   ├── services/           # 核心服务
│   │   ├── dataService.ts  # 数据加载
│   │   └── memoryAidsContentBased.ts # 记忆口诀系统
│   └── router/             # 路由配置
├── public/
│   └── C类题库_extracted.csv # 题库数据
└── dist/                   # 构建输出
```

## 🚢 部署指南

### Vercel（推荐）

最简单的部署方式，详见 [Vercel部署指南.md](Vercel部署指南.md)

**快速步骤**：
1. 推送代码到GitHub
2. 在Vercel导入项目
3. 点击Deploy
4. 完成！

### 其他平台

- **GitHub Pages**: 运行 `pnpm deploy`
- **Netlify**: 连接Git仓库自动部署
- **Cloudflare Pages**: 连接Git仓库自动部署

所有平台都支持开箱即用，无需额外配置！

## 📝 开发说明

### 添加新题目

替换 `public/C类题库_extracted.csv` 文件即可。

CSV格式：
```csv
J,P,I,Q,T,A,B,C,D
LY0001,1.1.1,MC2-0001,题目内容,AC,选项A,选项B,选项C,选项D
```

### 修改记忆口诀

编辑 `src/services/memoryAidsContentBased.ts`：

```typescript
{
  questionPattern: /你的关键词/,
  priority: 90,
  generateAid: (question, correctAnswers) => {
    return '你的记忆口诀'
  }
}
```

## 📄 文档

- [CLAUDE.md](CLAUDE.md) - 项目技术文档
- [Vercel部署指南.md](Vercel部署指南.md) - 详细部署步骤
- [记忆口诀优化总结.md](记忆口诀优化总结.md) - 口诀系统说明
- [Remember.md](Remember.md) - 原版记忆口诀集合

## 🎯 项目特点

### 纯前端 + 零配置

- ✅ 无需后端服务器
- ✅ 无需数据库
- ✅ 无需环境变量
- ✅ 开箱即用

### 记忆口诀系统 v2.0

**2025年优化**：
- 删除了所有"答案关键词：..."无效口诀
- 参考原版Remember.md风格，更简洁易记
- 100%覆盖所有题目
- 基于内容而非选项位置

**示例对比**：
```
❌ 旧："A类频段：30-3000MHz，功率≤25瓦（VHF/UHF）"
✅ 新："A类30-3000MHz，25瓦管VHF/UHF"

❌ 旧："答案关键词：共基极放大器、共发射极放大器..."
✅ 新："电路记：电压并，电流串"
```

## 📊 题库统计

- **总题数**: 1282道
- **单选题**: 83.6% (1072道)
- **多选题**: 16.4% (210道)
- **分类**:
  - 无线电管理法规: 181道
  - 无线电技术基础: 325道
  - 发射机和接收机: 324道
  - 天线和馈线: 421道
  - 安全防护: 31道

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📜 许可证

MIT License

## 🙏 致谢

- 题库数据来源于中国业余无线电C类考试官方题库
- UI框架使用Quasar Framework
- 记忆口诀参考了业余无线电爱好者的学习经验

---

**Happy Learning! 73!** 📻
