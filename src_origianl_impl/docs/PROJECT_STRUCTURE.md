# Legacy Guardians - 项目结构规范

## 📁 **规范化后的项目结构**

```
legacy-guardians/
├── 📁 src/
│   ├── 📁 components/          # React组件
│   ├── 📁 hooks/              # 自定义Hooks
│   ├── 📁 types/              # TypeScript类型定义
│   ├── 📁 utils/              # 工具函数
│   ├── 📁 constants/          # 常量和配置
│   ├── 📁 modules/            # 游戏数据模块
│   ├── 📁 styles/             # 样式文件
│   ├── 📁 assets/             # 静态资源
│   ├── 📁 services/           # 服务层
│   ├── 📁 pages/              # 页面组件
│   ├── 📁 rules/              # 开发规则
│   ├── 📁 docs/               # 项目文档
│   ├── 📄 App.tsx             # 主应用组件
│   ├── 📄 main.tsx            # 应用入口
│   └── 📄 declarations.d.ts   # 类型声明
├── 📄 package.json            # 项目配置
├── 📄 tsconfig.json           # TypeScript配置
├── 📄 vite.config.ts          # Vite配置
├── 📄 index.html              # HTML模板
└── 📄 README.md               # 项目说明
```

## 🏗️ **目录职责说明**

### **`src/components/` - React组件**
- 可复用的UI组件
- 业务逻辑组件
- 布局组件
- 表单组件

### **`src/hooks/` - 自定义Hooks**
- 游戏状态管理 (`useGameState`)
- 数据获取 (`useDataFetch`)
- 主题管理 (`useTheme`)
- 其他业务逻辑Hooks

### **`src/types/` - 类型定义**
- 接口定义 (`index.ts`)
- 类型别名
- 枚举类型
- 联合类型

### **`src/utils/` - 工具函数**
- 游戏逻辑 (`game-logic.ts`)
- 数据处理
- 格式化函数
- 验证函数

### **`src/constants/` - 常量和配置**
- 游戏配置 (`game-config.ts`)
- 任务/神器等静态JSON
- 环境变量
- 静态配置

### **`src/modules/` - 游戏数据模块**
- 资产定义 (`assets.ts`)
- 徽章定义 (`badges.ts`)
- 事件定义 (`events.ts`)
- 困境问题 (`dilemmas.ts`)
- 幸运转盘 (`spinWheel.ts`)

### **`src/styles/` - 样式文件**
- CSS样式表
- 主题配置
- 样式工具函数
- 样式索引

### **`src/assets/` - 静态资源**
- 图片文件
- 图标文件
- 字体文件
- 其他媒体文件

### **`src/services/` - 服务层**
- API调用
- 数据服务
- 外部服务集成
- 业务逻辑服务

### **`src/pages/` - 页面组件**
- 路由页面
- 页面级组件
- 页面布局

## 🔄 **文件移动记录**

### **已移动的文件**
- `legacy-ui.css` → `src/styles/`
- `legacy-cyberpunk.css` → `src/styles/`
- `badges.json` → `src/modules/badges.ts`
- `events.json` → `src/modules/events.ts`
- `assets.json` → `src/modules/assets.ts`
- `ai-personalities.json` → `src/constants/`
- `artifacts.json` → `src/constants/`

### **新创建的文件**
- `src/types/index.ts` - 类型定义
- `src/constants/game-config.ts` - 游戏配置
- `src/utils/game-logic.ts` - 游戏逻辑
- `src/hooks/useGameState.ts` - 游戏状态Hook
- `src/styles/index.ts` - 样式索引
- `src/modules/dilemmas.ts` - 困境问题
- `src/modules/spinWheel.ts` - 幸运转盘逻辑

## 📋 **导入路径更新**

### **样式导入**
```typescript
// 旧方式
import './legacy-ui.css';
import './legacy-cyberpunk.css';

// 新方式
import './styles/index';
```

### **数据导入**
```typescript
// 旧方式
import artifactsData from './artifacts.json';
import badgesData from './badges.json';

// 新方式
import artifactsData from './constants/artifacts.json';
import { badges } from './modules/badges';
import { events } from './modules/events';
import { dilemmas } from './modules/dilemmas';
import { handleSpinWheel } from './modules/spinWheel';
```

### **类型导入**
```typescript
// 新方式
import { GameState, Asset, Badge } from './types';
import { GAME_CONFIG } from './constants/game-config';
import { calculateDailyReturns } from './utils/game-logic';
```

## 🎯 **规范化原则**

### **1. 关注点分离**
- 组件只负责UI渲染
- 业务逻辑放在Hooks和工具函数中
- 数据配置集中在constants和modules目录

### **2. 可维护性**
- 清晰的目录结构
- 一致的命名规范
- 模块化的代码组织

### **3. 可扩展性**
- 易于添加新功能
- 组件可复用
- 配置可调整

### **4. 类型安全**
- 完整的TypeScript类型定义
- 接口约束
- 类型检查

## 🚀 **下一步开发建议**

1. **组件拆分**: 将App.tsx中的大组件拆分为小组件
2. **状态管理**: 使用useGameState Hook管理游戏状态
3. **类型安全**: 为所有数据添加TypeScript类型
4. **样式优化**: 使用CSS变量实现主题切换
5. **测试覆盖**: 为工具函数和Hooks添加单元测试

## 📚 **相关文档**

- [开发规则](./src/rules/README.md)
- [游戏设计文档](./src/docs/Legacy_Guardians_Game_Design_Document_EN.md)
- [技术架构说明](./src/docs/README.md)

---

**注意**: 项目结构规范化后，请确保所有导入路径都已更新，避免运行时错误。
