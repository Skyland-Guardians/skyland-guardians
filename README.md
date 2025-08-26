# 🏰 Skyland Guardians - 家庭财商教育游戏平台

> **Legacy Guardians – Family Wealth Academy**  
> 零风险模拟投资体验，帮助12-18岁青少年学习财商知识

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=flat-square)](https://Skyland-Guardians.github.io/skyland-guardians/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=flat-square)](https://vitejs.dev/)

## 🎯 项目概述

**Skyland Guardians** 是一个创新的家庭财商教育游戏平台，通过游戏化的方式帮助青少年学习投资组合管理、风险控制和资产配置等金融知识。

### 🌟 核心特色

- **🎮 零风险模拟**: 完全模拟的投资体验，无真实交易风险
- **👨‍👩‍👧‍👦 家庭互动**: 家长设定边界，孩子安全探索
- **🤖 AI陪伴教练**: 友好的AI伙伴，用故事化语言解释金融概念
- **🏆 游戏化学习**: 任务卡、徽章、等级系统，让学习变得有趣
- **📊 真实数据**: 基于历史市场数据的模拟体验

### 🎲 游戏世界观

- **传奇空岛**: 象征财富与智慧的世界
- **七大神器**: 对应不同的资产类别
  - 🗡️ 敏捷之剑 (科技股/ETF)
  - 🛡️ 稳固之盾 (债券)
  - 🌱 绿色森林 (ESG环保)
  - 🏛️ 黄金圣殿 (黄金)
  - 💧 稳定之泉 (稳定币)
  - ⛩️ 收益神庙 (收益类资产)
  - 💎 神秘水晶 (加密资产)

## 🏗️ 项目结构

```
skyland-guardians/
├── 📁 .github/workflows/          # GitHub Actions 工作流
│   └── deploy.yml                 # 自动部署配置
├── 📁 public/                     # 静态资源
│   ├── 404.html                   # 404页面（SPA路由支持）
│   ├── index.html                 # 主页面（SPA路由支持）
│   └── vite.svg                   # Vite图标
├── 📁 src/                        # 源代码
│   ├── 📁 assets/                 # 游戏资源
│   │   ├── 主界面1资源/           # 主界面图标和背景
│   │   ├── 主界面2 资源/          # 市场界面资源
│   │   └── 主页面1设计.png        # 设计稿
│   ├── 📁 components/             # React组件
│   ├── 📁 docs/                   # 游戏设计文档
│   │   ├── PRD.md                 # 产品需求文档
│   │   ├── NuWealth – Legacy Guardians - 游戏设计及计划.md  # 游戏设计文档
│   │   └── *.png                  # 界面设计图
│   ├── 📁 rules/                  # 开发规则和编码规范
│   │   ├── README.md              # 规则概览
│   │   ├── AI_CODING_RULES.md     # AI编码规则（最高优先级）
│   │   ├── code-style.mdc         # 代码风格规范
│   │   ├── cursorrules.mdc        # 主要技术栈规则
│   │   ├── typescript.mdc         # TypeScript专用规则
│   │   ├── cursor-ai.mdc          # AI编程助手规则
│   │   ├── DOCUMENTATION_RULES.md # 文档更新规则
│   │   ├── COLLABORATION_GUIDE.md # 协作开发指南
│   │   ├── SOLID_PRINCIPLES.md    # SOLID原则实现
│   │   ├── TYPESCRIPT_CODING_STANDARDS.md      # TypeScript编码规范
│   │   ├── TYPESCRIPT_CODING_STANDARDS_CLIENT.md # 客户端TypeScript规范
│   │   ├── example-usage.tsx      # 规则应用示例
│   │   ├── loader.ts              # 规则加载器
│   │   ├── rules.config.json      # 规则配置
│   │   ├── INDEX.md               # 快速索引
│   │   └── PERSISTENCE.md         # 规则持久化说明
│   ├── App.tsx                    # 主应用组件
│   ├── App.css                    # 应用样式
│   ├── main.tsx                   # 应用入口
│   ├── index.css                  # 全局样式
│   └── vite-env.d.ts              # Vite类型定义
├── 📁 dist/                       # 构建输出（自动生成）
├── 📄 .gitignore                  # Git忽略文件
├── 📄 package.json                # 项目依赖和脚本
├── 📄 package-lock.json           # 依赖锁定文件
├── 📄 README.md                   # 项目说明文档
├── 📄 GITHUB_PAGES_SETUP.md      # GitHub Pages设置指南
├── 📄 vite.config.ts              # Vite构建配置
├── 📄 tsconfig.json               # TypeScript配置
├── 📄 tsconfig.app.json           # 应用TypeScript配置
├── 📄 tsconfig.node.json          # Node.js TypeScript配置
└── 📄 eslint.config.js            # ESLint代码检查配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **Git**: 2.30.0 或更高版本

### 安装和运行

```bash
# 1. 克隆项目
git clone https://github.com/Skyland-Guardians/skyland-guardians.git
cd skyland-guardians

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本
npm run build

# 5. 预览构建结果
npm run preview
```

### 开发脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
npm run lint         # 运行代码检查
```

## 🎮 游戏玩法

### 核心游戏循环

1. **🎯 任务卡**: 抽取情境与目标
2. **⚖️ 资产调整**: 分配多资产权重（总计100%）
3. **🌪️ 市场模拟**: 结合历史数据与随机事件
4. **🤖 AI反馈**: 观察→鼓励→建议→提问
5. **🏆 结算成长**: 发放星星徽章，推进空岛进度

### 家庭互动玩法

- **👶 孩子端**: 使用"探险币"操作神器，追求空岛修复
- **👨‍👩‍👧‍👦 家长端**: 设定边界主题，审批探险额度，查看旅程回顾

### 成就系统

- **⭐ 守护者之星**: 日常任务和挑战
- **🏅 神器徽章**: 分散者、冷静智者、长远目光等
- **🏰 空岛修复**: 25%/50%/75%/100%里程碑进度

## 🛠️ 技术架构

### 核心技术栈

- **前端框架**: React 19.1.1 + TypeScript 5.8.3
- **构建工具**: Vite 7.1.2
- **样式框架**: Tailwind CSS 4.1.12
- **代码质量**: ESLint 9.33.0 + TypeScript ESLint
- **部署平台**: GitHub Pages + GitHub Actions

### 架构特点

- **🎯 零风险模拟**: 完全隔离的真实交易系统
- **📱 响应式设计**: 移动优先的用户体验
- **🚀 性能优化**: 代码分割、懒加载、Web Vitals优化
- **🔒 安全合规**: 教育用途标识、数据加密保护

## 📚 开发规则

### 🎯 规则优先级

1. **最高优先级**: `AI_CODING_RULES.md` - 缩进规范（强制使用TAB，大小4字符）
2. **高优先级**: `code-style.mdc` - 代码风格规范（26条规则）
3. **高优先级**: `DOCUMENTATION_RULES.md` - 文档更新规则
4. **中优先级**: `cursorrules.mdc` - 主要技术栈规则
5. **中优先级**: `typescript.mdc` - TypeScript专用规则
6. **基础优先级**: `cursor-ai.mdc` - AI编程助手规则

### 🔧 核心编码规范

- **缩进**: 强制使用TAB，大小4字符，绝对不要使用空格
- **命名约定**: 小写连字符目录，PascalCase组件，camelCase函数
- **代码结构**: 导出组件 → 子组件 → 辅助函数 → 静态内容 → 类型定义
- **错误处理**: 早期返回、保护子句、用户友好错误消息
- **性能优化**: React Server Components优先，最小化use client

### 📖 规则使用方法

1. **开发者**: 在开始编码前阅读相关规则文件
2. **AI助手**: 始终遵循这些规则进行代码生成
3. **代码审查**: 使用规则进行代码质量检查

## 🌐 部署和访问

### GitHub Pages 自动部署

- **部署地址**: https://Skyland-Guardians.github.io/skyland-guardians/
- **自动触发**: 推送到 `master` 分支时自动构建和部署
- **部署状态**: 查看 [Actions](https://github.com/Skyland-Guardians/skyland-guardians/actions) 标签

### 手动部署

```bash
# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 🤝 贡献指南

### 开发流程

1. **Fork** 项目仓库
2. **创建** 功能分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 代码规范

- 遵循项目的编码规范和开发规则
- 确保代码通过所有检查 (`npm run lint`, `npm run build`)
- 更新相关文档和测试用例

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **项目地址**: https://github.com/Skyland-Guardians/skyland-guardians
- **问题反馈**: [Issues](https://github.com/Skyland-Guardians/skyland-guardians/issues)
- **讨论交流**: [Discussions](https://github.com/Skyland-Guardians/skyland-guardians/discussions)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

**记住**: 这是一个教育项目，所有投资体验都是模拟的，旨在帮助青少年学习财商知识，不涉及真实交易。

<div align="center">

**🏰 加入我们，一起守护财富智慧！ 🏰**

</div>
