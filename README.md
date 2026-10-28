# 暮色之间 DUSK

围绕日落影像、慢生活阅读和个人心情记录的中文多页面网站。此项目仅保留源码和素材，由 GitHub Actions 自动构建并发布到 GitHub Pages。

## 发布到 GitHub

1. 将本目录的源码更新到 allan-qiu/Between-the-Twilight 仓库的 main 分支。必须包含 .github/workflows/deploy-pages.yml、src、public、scripts、tests、package.json、package-lock.json、index.html、tsconfig.json、vite.config.ts。
2. 在仓库 Settings → Pages 中，将 Source 选择为 GitHub Actions。无需选择 /docs。
3. 提交到 main 后，在 Actions 中查看 Deploy DUSK to GitHub Pages，等待 build、deploy 两个任务成功。也可以在工作流页面点击 Run workflow 手动运行。
4. 发布成功后访问：https://allan-qiu.github.io/Between-the-Twilight/

以后修改源码并提交到 main，会自动重新发布，不需要手动上传编译文件。

## 构建流程

GitHub Actions 使用 Node.js 22，依次执行 npm ci、npm run build、npm test，然后上传构建产物并发布。dist 只在构建时生成，不需要提交到仓库。

Vite 已配置 /Between-the-Twilight/ 前缀，视频、图片、图标和 React Router 均使用同一前缀。构建脚本为九个路由生成独立 HTML 入口，支持页面与文章详情直接访问、刷新。

网站包含首页、日落放映室、暮色色谱、暮色手记、写给黄昏、关于以及三篇文章详情页。

## 素材与交互

视频位于 public/media/sunset.mp4，21 秒、1920 × 1080，带音轨。四张截图来自第 3、7、12、18 秒；颜色采样记录在 src/frames.json。原始来源、创作者、拍摄地点与授权未独立核实，关于页明确标记待补充。

心情草稿保存在当前浏览器的 localStorage，不发送到服务器。心情卡片使用 Canvas 生成 PNG。网站不需要后台、登录或数据库。

本目录已移除旧的本地启动脚本、服务器、VS Code 本地预览配置及生成文件。不要直接用浏览器双击源码 index.html；GitHub Actions 会将它编译为网页。
