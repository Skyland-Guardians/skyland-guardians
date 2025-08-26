# GitHub Pages 设置指南

## 🚀 自动部署设置

### 1. 启用 GitHub Pages

1. 进入你的GitHub仓库
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`

### 2. 推送代码触发部署

当你推送代码到 `master` 或 `main` 分支时，GitHub Actions会自动：

1. 构建项目 (`npm run build`)
2. 部署到 `gh-pages` 分支
3. 发布到 GitHub Pages

### 3. 访问你的网站

部署完成后，你的网站将在以下地址可用：
```
https://[你的用户名].github.io/skyland-guardians/
```

## 🔧 手动部署（可选）

如果你想手动部署：

```bash
# 安装 gh-pages 包
npm install --save-dev gh-pages

# 添加部署脚本到 package.json
# "deploy": "gh-pages -d dist"

# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 📁 项目结构

```
skyland-guardians/
├── .github/workflows/     # GitHub Actions 工作流
├── public/                # 静态资源
│   ├── 404.html          # 404页面（SPA路由支持）
│   └── index.html        # 主页面（SPA路由支持）
├── src/                   # 源代码
├── dist/                  # 构建输出（自动生成）
└── vite.config.ts         # Vite配置（已配置GitHub Pages支持）
```

## 🌐 自定义域名

如果你想使用自定义域名：

1. 在 `Settings` > `Pages` 中设置自定义域名
2. 更新 `.github/workflows/deploy.yml` 中的 `cname` 字段
3. 在 `public/` 目录下创建 `CNAME` 文件

## 📝 注意事项

- 确保仓库是公开的（或你有GitHub Pro）
- 第一次部署可能需要几分钟时间
- 如果遇到问题，检查 `Actions` 标签中的工作流状态
- 确保所有依赖都正确安装

## 🔍 故障排除

### 构建失败
- 检查 `package.json` 中的脚本
- 确保所有依赖都已安装
- 查看GitHub Actions日志

### 页面无法访问
- 等待几分钟让部署完成
- 检查 `gh-pages` 分支是否存在
- 确认GitHub Pages已启用

### 路由问题
- 确保 `public/404.html` 和 `public/index.html` 存在
- 检查Vite配置中的 `base` 路径设置

## 📚 相关资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [SPA GitHub Pages 解决方案](https://github.com/rafgraph/spa-github-pages)
