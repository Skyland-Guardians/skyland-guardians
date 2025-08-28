# 事件系统 (Event System)

这个事件系统为 Skyland Guardians 游戏提供了完整的任务和事件管理功能。

## 功能特性

### 🎯 随机任务系统
- **触发条件**: APPLY资产配置或下一天时随机触发
- **任务类型**: 基于不同投资策略的挑战任务
- **奖励机制**: 完成任务获得星星奖励，提升玩家等级
- **状态管理**: 任务可以被接受、拒绝或完成

### ⚡ 市场事件系统
- **随机触发**: 在资产配置或下一天时随机出现
- **市场影响**: 事件会影响资产的表现和收益
- **持续时间**: 事件有不同的持续时间
- **选择机制**: 玩家可以选择接受或忽略事件

### 📦 卡包收集系统
- **卡片收集**: 所有触发的事件和任务都会以卡片形式存储
- **状态追踪**: 显示卡片的状态（进行中、已完成、已拒绝）
- **历史记录**: 保存玩家的所有卡片历史

### 🏆 成就系统
- **任务完成**: 完成任务后弹出庆祝动画
- **星星奖励**: 获得的星星会存储在徽章系统中
- **进度追踪**: 跟踪玩家的成就进度

## 技术实现

### 核心组件

#### EventManager
主要的事件管理组件，负责：
- 处理卡片选择对话框
- 显示任务完成庆祝
- 管理卡包界面
- 显示悬浮通知

#### CardChoiceModal
卡片选择对话框，用于：
- 展示新触发的任务或事件
- 提供接受/拒绝选项
- 显示详细信息和奖励

#### MyCards
卡包管理界面，功能包括：
- 展示所有收集的卡片
- 按类型分组显示（任务/事件）
- 显示卡片状态和进度

#### MissionCompletedModal
任务完成庆祝界面，特性：
- 动画庆祝效果
- 星星奖励展示
- 自动关闭功能

### 服务层

#### EventManager Service
事件管理服务，提供：
- 随机事件和任务生成
- 触发条件检查
- 卡片状态管理
- 任务完成检查

### 数据结构

#### PlayerCard
```typescript
interface PlayerCard {
  id: string;
  type: 'mission' | 'event';
  data: Mission | EventCard;
  obtainedAt: number; // 获得的天数
  isNew?: boolean;
}
```

#### Mission (扩展)
```typescript
interface Mission {
  id: number;
  title: string;
  background: string;
  tip: string;
  focus: string;
  rewardStars: number;
  status?: 'pending' | 'active' | 'completed' | 'declined';
  acceptedAt?: number;
  completedAt?: number;
  targetAssets?: string[];
  targetAllocation?: number;
}
```

#### EventCard (扩展)
```typescript
interface EventCard {
  id: number;
  title: string;
  description: string;
  status?: 'pending' | 'active' | 'declined';
  acceptedAt?: number;
  duration?: number;
  effects?: {
    type: 'add' | 'mul' | 'volatility';
    value: number;
    targets: string[];
  };
}
```

## 使用方法

### 集成到应用
```tsx
import { EventManager } from './components/EventManager';

function App() {
  return (
    <GameProvider>
      <MainScreen />
      <EventManager />
    </GameProvider>
  );
}
```

### 触发事件
```typescript
const { triggerNewCards } = useGameState();

// 在资产配置后触发
triggerNewCards('apply');

// 在下一天触发
triggerNewCards('nextDay');

// 初始化触发
triggerNewCards('init');
```

### 管理卡片
```typescript
const { acceptCard, declineCard, gameState } = useGameState();

// 接受卡片
acceptCard(playerCard);

// 拒绝卡片
declineCard(playerCard);

// 查看待处理卡片
const pendingCards = gameState.pendingCards;
```

## 触发概率配置

### 任务触发概率
- APPLY 操作: 30%
- 下一天: 20%
- 初始化: 10%

### 事件触发概率
- APPLY 操作: 25%
- 下一天: 15%
- 初始化: 5%

## 任务完成条件

每个任务都有特定的完成条件：

### 风险集中 (Concentration Risk)
- 目标资产: 高风险资产 (sword, crystal)
- 要求: 单一资产分配不超过40%

### ESG投资 (ESG Investing)
- 目标资产: ESG资产 (forest)
- 要求: ESG资产分配15-25%

### 避险资产 (Safe Haven Assets)
- 目标资产: 避险资产 (golden, shield)
- 要求: 避险资产分配30-50%

### 流动性管理 (Liquidity Management)
- 目标资产: 流动性资产 (fountain)
- 要求: 流动性资产分配10-20%

### 收益策略 (Yield Strategy)
- 目标资产: 收益资产 (yield)
- 要求: 收益资产分配20-35%

## 样式定制

所有组件都包含完整的CSS样式，支持：
- 响应式设计
- 深色主题
- 动画效果
- 悬停交互

可以通过修改对应的CSS文件来自定义外观。

## 扩展指南

### 添加新的任务类型
1. 在 `MISSIONS` 数据中添加新任务
2. 在 `generateMissionTargets` 中定义目标资产
3. 在 `generateTargetAllocation` 中设置目标分配

### 添加新的事件类型
1. 在 `SAMPLE_EVENTS` 中添加新事件
2. 定义事件效果和持续时间
3. 在 `generateRandomEvent` 中处理新事件逻辑

### 自定义触发条件
1. 修改 `TRIGGER_RATES` 配置
2. 在 `checkForNewCards` 中添加新的触发逻辑
3. 扩展 `EventTriggerContext` 类型定义