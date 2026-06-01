# 吞食蛇小游戏

一个零构建依赖的浏览器吞食蛇小游戏，包含键盘和触屏控制、当前分数、最高分记录、暂停和重新开始功能。

## 在当前云端环境启动

```bash
npm start
```

`npm start` 会在 `5173` 端口启动静态文件服务，并显式绑定到 `0.0.0.0`，方便云端 IDE / 代码托管平台把端口转成浏览器可打开的预览地址。

如果你的平台提供 “Ports / 端口 / Preview / Open in Browser” 面板，请选择 `5173` 端口并打开平台生成的 HTTPS 预览链接。停止服务时，在运行 `npm start` 的终端按 <kbd>Ctrl</kbd> + <kbd>C</kbd>。

> 注意：当前 Codex 会话没有暴露可公网访问的端口转发 URL，所以我可以在容器里启动并验证服务，但不能直接生成一个外部浏览器可访问的 Codex 预览链接。

## 不本地运行的浏览器预览方式

### 方式一：StackBlitz

1. 把代码推送到 GitHub 仓库。
2. 在浏览器打开 `https://stackblitz.com/github/<你的 GitHub 用户名>/<仓库名>`。
3. StackBlitz 导入项目后，在终端运行 `npm start`。
4. 打开 StackBlitz 自动弹出的 Preview 面板或它生成的外部预览链接。

### 方式二：GitHub Pages

1. 把代码推送到 GitHub 仓库。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. Branch 选择你的分支，目录选择 `/ (root)`，保存。
5. 部署完成后，访问 `https://<你的 GitHub 用户名>.github.io/<仓库名>/`。

## 检查

```bash
npm run check
```
