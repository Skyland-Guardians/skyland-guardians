# Development Rules Quick Index

## 🚀 Quick Start
- **Indentation Rules**: Read `AI_CODING_RULES.md` first to understand indentation and project standards
- **New Project**: Then read `cursorrules.mdc` to understand the tech stack
- **TypeScript**: Refer to `typescript.mdc` for syntax standards
- **Code Style**: Follow the 26 rules in `code-style.mdc`
- **AI Assistant**: Use the working principles in `cursor-ai.mdc`

## 📋 Rule Categories

### 🔧 Technical Implementation
| File | Focus | Use Cases |
|------|------|----------|
| `AI_CODING_RULES.md` | Indentation rules, project constants, file structure | Code style, project standards, editor configuration |
| `cursorrules.mdc` | Tech stack, architectural patterns | Project architecture, component design |
| `typescript.mdc` | TypeScript best practices | Type definitions, interface design |

### 🎨 Code Quality
| File | Focus | Use Cases |
|------|------|----------|
| `code-style.mdc` | Code standards, quality assurance | Code review, refactoring |
| `cursor-ai.mdc` | AI assistant working principles | Code generation, problem solving |

## 🎯 Common Rules Quick Reference

### Naming Conventions
- **Directories**: lowercase with hyphens (`components/auth-wizard`)
- **Components**: PascalCase (`SurveyDetailView`)
- **Functions**: camelCase (`handleSubmit`)
- **Variables**: camelCase (`isLoading`, `hasError`)
- **Constants**: SCREAMING_SNAKE_CASE (`SURVEY_TYPE`)

### Code Structure
```typescript
// File structure order
1. Exported components
2. Sub-components
3. Helper functions
4. Static content
5. Type definitions
```

### Error Handling
```typescript
// Early return pattern
function processData(data: unknown) {
    if (!data) return { error: 'No data provided' };
    if (!isValid(data)) return { error: 'Invalid data' };
    
    // Happy path at the end
    return { success: true, data: process(data) };
}
```

### React Best Practices
```typescript
// Use function keyword
function Component({ prop1, prop2 }: ComponentProps) {
    // Prioritize RSC, minimize use client
    // Use Suspense to wrap client components
    // Implement responsive design (mobile first)
}
```

## ⚡ Performance Optimization Points
1. **React Server Components first**
2. **Minimize use client usage**
3. **Suspense wraps client components**
4. **Dynamic loading for non-critical components**
5. **WebP image format + lazy loading**
6. **Web Vitals optimization (LCP, CLS, FID)**

## 🛡️ Security & Quality
1. **Security first**: Consider all security implications
2. **Test coverage**: Include unit tests
3. **Error boundaries**: Implement error boundary components
4. **Edge cases**: Handle all possible boundary cases
5. **Assertions**: Verify assumptions and early error catching

## 📚 Related Resources
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## 🔄 Rule Updates
- Rule files are updated regularly
- Focus on latest best practices for the tech stack
- Update rule content after team discussions
- Keep in sync with project development

---

**Remember**: These rules are not restrictions, but guides to help you write better code!
