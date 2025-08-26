# GitHub Pages 部署指南

## 🚀 **自动部署（推荐）**

### 1. 启用 GitHub Pages
1. 进入你的 GitHub 仓库
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `Deploy from a branch`
5. 选择 `gh-pages` 分支
6. 点击 `Save`

### 2. 配置 GitHub Actions
项目已配置自动部署工作流：
- 文件位置：`.github/workflows/deploy.yml`
- 触发条件：推送到 `main` 分支时自动部署
- 部署分支：`gh-pages`

### 3. 自动部署流程
1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建
3. 构建完成后自动部署到 `gh-pages` 分支
4. GitHub Pages 自动更新网站

## 🛠️ **手动部署**

### 1. 构建项目
```bash
npm run build
```

### 2. 部署到 GitHub Pages
```bash
npm run deploy
```

## ⚙️ **配置说明**

### Vite 配置
- `base: '/legacy-guardians/'` - 设置正确的base路径
- `outDir: 'dist'` - 构建输出目录
- 优化了代码分割和资源管理

### 构建优化
- 禁用了 sourcemap 以减小文件大小
- 配置了手动代码分割
- 优化了资源目录结构

## 🌐 **访问地址**

部署成功后，你的项目将在以下地址访问：
```
https://[你的用户名].github.io/legacy-guardians/
```

## 🔧 **故障排除**

### 常见问题

#### 1. 页面显示 404
- 检查 `vite.config.ts` 中的 `base` 路径是否正确
- 确保仓库名称与配置中的路径一致

#### 2. 资源加载失败
- 检查构建后的 `dist` 目录结构
- 确保所有静态资源路径正确

#### 3. 部署失败
- 检查 GitHub Actions 日志
- 确保仓库有足够的权限
- 检查 Node.js 版本兼容性

### 调试步骤
1. 本地构建测试：`npm run build`
2. 本地预览测试：`npm run preview`
3. 检查构建输出目录
4. 查看 GitHub Actions 执行日志

## 📝 **更新记录**

### 2024-12-19
- 配置 GitHub Pages 部署
- 创建自动部署工作流
- 优化 Vite 构建配置
- 添加部署脚本和依赖

## 🎯 **下一步**

1. **推送代码**：将配置推送到仓库
2. **启用 Pages**：在 GitHub 设置中启用 Pages
3. **测试部署**：推送代码测试自动部署
4. **访问网站**：确认部署成功

---

*最后更新: 2024-12-19*
*更新原因: 配置GitHub Pages部署*
