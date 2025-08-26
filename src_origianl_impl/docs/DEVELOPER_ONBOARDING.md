# 开发者入门指南

## 🚀 **快速开始**

### 环境要求
- **Node.js**: 18.0.0 或更高版本
- **Git**: 2.30.0 或更高版本
- **包管理器**: npm 或 yarn
- **编辑器**: VS Code (推荐)

### 1. 克隆项目
```bash
git clone https://github.com/Rothschild888/legacy-guardians.git
cd legacy-guardians
```

### 2. 安装依赖
```bash
npm install
# 或者使用 yarn
yarn install
```

### 3. 启动开发服务器
```bash
npm run dev
# 或者使用 yarn
yarn dev
```

项目将在 `http://localhost:5173` 启动

## 📚 **项目结构概览**

```
legacy-guardians/
├── src/
│   ├── components/          # React组件
│   │   ├── TopBar.tsx      # 顶部状态栏
│   │   ├── Sidebar.tsx     # 侧边栏
│   │   ├── GameArea.tsx    # 主游戏区域
│   │   ├── FloatingButtons.tsx # 浮动按钮
│   │   ├── Modals.tsx      # 弹窗组件
│   │   ├── GameLayout.tsx  # 游戏布局整合
│   │   └── index.ts        # 组件导出
│   ├── hooks/              # 自定义Hooks
│   │   └── useGameState.ts # 游戏状态管理
│   ├── constants/          # 常量和配置
│   │   ├── game-config.ts  # 游戏配置
│   │   ├── tasks.json      # 任务配置
│   │   ├── artifacts.json  # 神器配置
│   │   └── ai-personalities.json # AI伙伴配置
│   ├── modules/            # 游戏数据模块
│   │   ├── assets.ts       # 资产定义
│   │   ├── badges.ts       # 徽章定义
│   │   ├── events.ts       # 事件定义
│   │   ├── dilemmas.ts     # 困境问题
│   │   └── spinWheel.ts    # 幸运转盘
│   ├── utils/              # 工具函数
│   │   └── game-logic.ts   # 游戏逻辑
│   ├── types/              # TypeScript类型
│   │   └── index.ts        # 类型定义
│   ├── styles/             # 样式文件
│   │   ├── legacy-ui.css   # 基础样式
│   │   ├── legacy-cyberpunk.css # 赛博朋克主题
│   │   └── index.ts        # 样式管理
│   ├── rules/              # 开发规则
│   ├── docs/               # 项目文档
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── .github/                 # GitHub配置
│   └── workflows/          # GitHub Actions
├── public/                  # 静态资源
├── package.json             # 项目配置
├── vite.config.ts           # Vite配置
├── tsconfig.json            # TypeScript配置
└── README.md                # 项目说明
```

## 🎯 **核心概念理解**

### 游戏架构
Legacy Guardians 是一个财富管理教育游戏，包含：

1. **资产分配系统**: 玩家分配资金到不同资产类别
2. **任务系统**: 完成各种投资任务获得奖励
3. **市场事件**: 随机事件影响资产收益
4. **AI伙伴**: 提供投资建议和指导
5. **成就系统**: 收集徽章记录学习进度

### 技术架构
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: 自定义Hook + React Context
- **样式方案**: CSS + CSS变量
- **部署平台**: GitHub Pages

## 🔧 **开发工作流**

### 1. 了解开发规则
在开始开发前，请阅读以下文档：
- `src/rules/COLLABORATION_GUIDE.md` - 协作开发指南
- `src/rules/AI_CODING_RULES.md` - AI编码规则
- `src/rules/TYPESCRIPT_CODING_STANDARDS.md` - TypeScript规范

### 2. 选择开发模块
根据你的技能和兴趣，选择要开发的模块：
- **游戏核心**: 资产管理、任务系统、市场事件
- **用户界面**: 组件优化、响应式设计、动画效果
- **AI系统**: AI伙伴、决策训练、智能建议
- **数据管理**: 状态管理、存储缓存、数据同步
- **工具配置**: 配置管理、工具函数、测试系统

### 3. 创建功能分支
```bash
# 更新开发分支
git checkout develop
git pull origin develop

# 创建功能分支
git checkout -b feature/your-feature-name
```

### 4. 开发功能
- 遵循代码规范和架构设计
- 编写清晰的组件和函数
- 添加必要的类型定义
- 实现错误处理和边界情况

### 5. 测试和验证
```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check

# 构建测试
npm run build

# 本地预览
npm run preview
```

### 6. 更新文档
- 更新相关组件文档
- 添加使用示例
- 记录API变更
- 更新变更记录

### 7. 提交代码
```bash
# 添加文件
git add .

# 提交代码
git commit -m "feat(模块): 功能描述"

# 推送分支
git push origin feature/your-feature-name
```

### 8. 创建Pull Request
1. 在GitHub上创建PR
2. 填写PR模板
3. 等待代码审查
4. 根据反馈修改代码
5. 审查通过后合并

## 📖 **学习资源**

### 必读文档
1. **项目概述**: `conversation_summary.md`
2. **架构设计**: `PROJECT_STRUCTURE.md`
3. **开发规则**: `src/rules/README.md`
4. **模块划分**: `src/docs/REQUIREMENTS_MODULES.md`

### 技术文档
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [GitHub Pages 文档](https://pages.github.com/)

### 代码示例
- `src/components/` - 查看现有组件实现
- `src/hooks/useGameState.ts` - 学习状态管理
- `src/utils/game-logic.ts` - 了解游戏逻辑

## 🚨 **常见问题**

### Q: 如何添加新的资产类型？
A: 修改 `src/modules/assets.ts` 和相关的组件逻辑

### Q: 如何实现新的游戏功能？
A: 在 `src/hooks/useGameState.ts` 中添加状态，在相应组件中实现UI

### Q: 如何优化组件性能？
A: 使用 React.memo、useMemo、useCallback 等优化技术

### Q: 如何添加新的主题？
A: 在 `src/styles/` 目录下创建新主题文件，更新主题切换逻辑

### Q: 如何调试游戏状态？
A: 使用 React DevTools 查看组件状态，在控制台查看游戏状态变化

## 📞 **获取帮助**

### 团队沟通
- **GitHub Issues**: 报告bug和功能需求
- **GitHub Discussions**: 技术讨论和决策
- **Pull Request**: 代码审查和讨论

### 紧急联系
- **Security Issues**: 安全相关问题
- **Critical Bugs**: 影响核心功能的严重bug
- **Production Issues**: 生产环境问题

## ✅ **入门检查清单**

- [ ] 环境配置完成
- [ ] 项目成功启动
- [ ] 阅读核心文档
- [ ] 理解项目架构
- [ ] 选择开发模块
- [ ] 创建功能分支
- [ ] 熟悉开发工作流
- [ ] 了解团队协作规范

## 🎯 **下一步行动**

1. **深入阅读**: 仔细阅读相关模块的文档
2. **代码探索**: 查看现有代码实现
3. **小试身手**: 尝试修改一些简单的功能
4. **团队沟通**: 与团队成员讨论开发计划
5. **开始开发**: 按照工作流开始功能开发

---

*最后更新: 2024-12-19*
*更新原因: 创建开发者入门指南，帮助新开发者快速上手*
