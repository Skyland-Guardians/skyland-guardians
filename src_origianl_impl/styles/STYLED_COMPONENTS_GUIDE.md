# Styled Components 使用指南

## 🎯 **概述**

本项目使用 **styled-components** 来替代内联样式，提高代码可读性和维护性。

## 🚀 **优势**

- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **主题系统** - 统一的颜色和样式管理
- ✅ **可读性强** - 样式与逻辑分离，代码更清晰
- ✅ **动态样式** - 支持 props 和主题切换
- ✅ **性能优化** - 自动生成唯一的 CSS 类名

## 🎨 **主题系统**

### 颜色定义
```typescript
// 赛博朋克主题
cyber: {
  primary: '#00fff7',      // 霓虹蓝
  secondary: '#ff00cc',    // 霓虹粉
  accent: '#e67e22',       // 橙色
  bg: '#1a1a2e',          // 深蓝背景
  text: '#fff',            // 白色文字
}
```

### 间距系统
```typescript
spacing: {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
}
```

## 📝 **使用方式**

### 1. 基础样式组件
```typescript
const Button = styled.button`
  background: ${theme.colors.cyber.primary};
  color: ${theme.colors.cyber.dark};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.cyber.secondary};
    transform: translateY(-2px);
  }
`;
```

### 2. 条件样式（基于 props）
```typescript
const StatusBadge = styled.span<{ $type: 'success' | 'error' | 'warning' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: bold;
  
  background: ${({ $type }) => 
    $type === 'success' ? theme.colors.cyber.success :
    $type === 'error' ? theme.colors.cyber.error :
    theme.colors.cyber.accent
  };
  
  color: ${({ $type }) => 
    $type === 'success' ? theme.colors.cyber.dark :
    theme.colors.cyber.text
  };
`;
```

### 3. 继承样式
```typescript
const PrimaryButton = styled.button`
  background: ${theme.colors.cyber.primary};
  color: ${theme.colors.cyber.dark};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
`;

const SecondaryButton = styled(PrimaryButton)`
  background: ${theme.colors.cyber.secondary};
  color: ${theme.colors.cyber.text};
`;
```

### 4. 响应式设计
```typescript
const Container = styled.div`
  padding: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    padding: ${theme.spacing.xl};
  }
`;
```

## 🔧 **最佳实践**

### 1. 命名规范
- 使用 PascalCase 命名样式组件
- 使用 `$` 前缀标识 props（避免 DOM 属性冲突）
- 描述性命名，如 `PrimaryButton`、`StatusBadge`

### 2. 样式组织
- 将相关样式组件放在一起
- 使用注释分组样式
- 保持样式组件的单一职责

### 3. 性能优化
- 避免在渲染函数中创建样式组件
- 使用 `React.memo` 包装纯组件
- 合理使用 `useMemo` 缓存复杂样式

### 4. 主题切换
```typescript
const ThemedContainer = styled.div<{ $theme: string }>`
  background: ${({ $theme }) => 
    $theme === 'cyberpunk' ? theme.colors.cyber.bg :
    $theme === 'classic' ? theme.colors.classic.bg :
    theme.colors.meme.primary
  };
`;
```

## 📁 **文件结构**

```
src/styles/
├── theme.ts              # 主题配置
├── GlobalStyles.ts       # 全局样式
└── STYLED_COMPONENTS_GUIDE.md  # 本指南
```

## 🎨 **迁移进度**

- ✅ **TopBar** - 已完成迁移
- ✅ **Sidebar** - 已完成迁移
- ✅ **GameArea** - 已完成迁移
- ✅ **FloatingButtons** - 已完成迁移
- ✅ **Modals** - 已完成迁移

## 🎉 **迁移完成！**

所有组件的内联样式已成功迁移到 styled-components！
