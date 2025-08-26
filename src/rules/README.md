# Legacy Guardians - 开发规则

这个目录包含了项目的所有开发规则和代码规范，确保代码质量和一致性。

## 规则文件概览

### 1. `AI_CODING_RULES.md` - AI编码规则（最高优先级）
- **缩进规范**: 强制使用TAB缩进，绝对不要使用空格，Tab大小4字符
- **项目常量**: 使用项目常量而非硬编码字符串
- **文件结构**: 统一的目录结构和组件组织
- **配置支持**: 完整的编辑器配置（EditorConfig、Prettier、ESLint）

### 2. `cursorrules.mdc` - 主要技术栈规则
- **技术领域**: Solidity, TypeScript, Node.js, Next.js 14 App Router, React, Vite, Viem v2, Wagmi v2, Shadcn UI, Radix UI, Tailwind Aria
- **核心原则**: 函数式编程、声明式编程、模块化设计
- **错误处理**: 早期返回、保护子句、用户友好错误消息
- **Next.js最佳实践**: RSC优先、最小化use client、Web Vitals优化

### 2. `typescript.mdc` - TypeScript专用规则
- **代码风格**: 简洁、技术性、准确的TypeScript示例
- **命名约定**: 小写连字符目录、命名导出组件
- **性能优化**: RSC优先、Suspense包装、动态加载
- **响应式设计**: 移动优先、Tailwind CSS

### 3. `cursor-ai.mdc` - AI编程助手规则
- **核心定位**: 专业的React和TypeScript代码生成
- **技术栈**: 最新稳定版本的TypeScript、React、Next.js、Shadcn UI、Tailwind CSS
- **工作原则**: 不懒惰、完整实现所有请求的功能

### 4. `code-style.mdc` - 代码风格规范
- **信息验证**: 始终验证信息，不做假设
- **代码保护**: 保护现有代码和功能
- **编辑规范**: 单块编辑、逐文件更改
- **质量保证**: 性能优先、安全第一、测试覆盖、边缘情况处理

### 5. `DOCUMENTATION_RULES.md` - 文档更新规则
- **核心原则**: 每次更新项目文件结构后，都必须同步更新相关文档
- **更新要求**: 文件结构、组件、配置变更时立即更新文档
- **更新流程**: 立即更新、版本记录、验证更新
- **检查清单**: 确保文档与代码保持同步

### 6. `COLLABORATION_GUIDE.md` - 协作开发指南
- **团队协作**: 分支管理、代码提交、协作流程
- **开发规范**: 代码质量、测试要求、文档同步
- **沟通渠道**: GitHub Issues、PR、Discussions
- **协作检查清单**: 确保团队协作顺畅

## 使用方法

### 对于开发者
1. 在开始编码前，阅读相关规则文件
2. 遵循命名约定和代码结构规范
3. 使用函数式组件和TypeScript接口
4. 优先使用React Server Components
5. 实现健壮的错误处理和日志记录

### 对于AI助手
1. 始终遵循这些规则进行代码生成
2. 使用描述性变量名和辅助动词
3. 实现完整的错误处理和边界情况
4. 优先考虑性能和安全性
5. 提供完整的代码实现，不要懒惰

## 规则优先级

1. **最高优先级**: AI编码规则 (`AI_CODING_RULES.md`) - 包含缩进规范
2. **高优先级**: 代码风格规范 (`code-style.mdc`)
3. **高优先级**: 文档更新规则 (`DOCUMENTATION_RULES.md`) - 确保文档时效性
4. **中优先级**: 主要技术栈规则 (`cursorrules.mdc`)
5. **中优先级**: TypeScript专用规则 (`typescript.mdc`)
6. **基础优先级**: AI编程助手规则 (`cursor-ai.mdc`)

## 技术栈要求

- **前端**: React 18+, TypeScript 5+, Next.js 14 App Router
- **样式**: Tailwind CSS, Shadcn UI, Radix UI
- **状态管理**: React Server Components, 最小化客户端状态
- **表单验证**: Zod
- **错误处理**: next-safe-action, 错误边界
- **性能**: Web Vitals优化, 图片优化, 动态加载

## 注意事项

- 所有规则文件都使用Markdown格式，便于阅读和维护
- 规则会定期更新以反映最新的最佳实践
- 如有疑问，请参考相关技术文档或咨询团队
- 这些规则适用于所有新代码和现有代码的修改
