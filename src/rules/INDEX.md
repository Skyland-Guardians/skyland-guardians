# 开发规则快速索引

## 🚀 快速开始
- **缩进规范**: 先读 `AI_CODING_RULES.md` 了解缩进和项目规范
- **新项目**: 再读 `cursorrules.mdc` 了解技术栈
- **TypeScript**: 参考 `typescript.mdc` 的语法规范
- **代码风格**: 遵循 `code-style.mdc` 的26条规范
- **AI助手**: 使用 `cursor-ai.mdc` 的工作原则

## 📋 规则分类

### 🔧 技术实现
| 文件 | 重点 | 适用场景 |
|------|------|----------|
| `AI_CODING_RULES.md` | 缩进规范、项目常量、文件结构 | 代码风格、项目规范、编辑器配置 |
| `cursorrules.mdc` | 技术栈、架构模式 | 项目架构、组件设计 |
| `typescript.mdc` | TypeScript最佳实践 | 类型定义、接口设计 |

### 🎨 代码质量
| 文件 | 重点 | 适用场景 |
|------|------|----------|
| `code-style.mdc` | 代码规范、质量保证 | 代码审查、重构 |
| `cursor-ai.mdc` | AI助手工作原则 | 代码生成、问题解决 |

## 🎯 常用规则速查

### 命名约定
- **目录**: 小写连字符 (`components/auth-wizard`)
- **组件**: PascalCase (`SurveyDetailView`)
- **函数**: camelCase (`handleSubmit`)
- **变量**: camelCase (`isLoading`, `hasError`)
- **常量**: SCREAMING_SNAKE_CASE (`SURVEY_TYPE`)

### 代码结构
```typescript
// 文件结构顺序
1. 导出的组件
2. 子组件
3. 辅助函数
4. 静态内容
5. 类型定义
```

### 错误处理
```typescript
// 早期返回模式
function processData(data: unknown) {
    if (!data) return { error: 'No data provided' };
    if (!isValid(data)) return { error: 'Invalid data' };
    
    // 快乐路径放在最后
    return { success: true, data: process(data) };
}
```

### React最佳实践
```typescript
// 使用function关键字
function Component({ prop1, prop2 }: ComponentProps) {
    // 优先使用RSC，最小化use client
    // 使用Suspense包装客户端组件
    // 实现响应式设计（移动优先）
}
```

## ⚡ 性能优化要点
1. **React Server Components优先**
2. **最小化use client使用**
3. **Suspense包装客户端组件**
4. **动态加载非关键组件**
5. **WebP图片格式 + 懒加载**
6. **Web Vitals优化 (LCP, CLS, FID)**

## 🛡️ 安全与质量
1. **安全第一**: 考虑所有安全影响
2. **测试覆盖**: 包含单元测试
3. **错误边界**: 实现错误边界组件
4. **边缘情况**: 处理所有可能的边界情况
5. **断言**: 验证假设和早期错误捕获

## 📚 相关资源
- [Next.js 14 文档](https://nextjs.org/docs)
- [React 18 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Shadcn UI 文档](https://ui.shadcn.com/)

## 🔄 规则更新
- 规则文件会定期更新
- 关注技术栈的最新最佳实践
- 团队讨论后更新规则内容
- 保持与项目发展同步

---

**记住**: 这些规则不是限制，而是帮助你写出更好代码的指南！
