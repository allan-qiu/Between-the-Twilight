# GitHub 发布步骤

本项目已经改为只提交源码、由 GitHub 自动构建。

1. 将所有更新文件提交到仓库 main 分支，包含 .github/workflows/deploy-pages.yml。
2. Settings → Pages → Source：选择 GitHub Actions（不要选择 Deploy from a branch 或 /docs）。
3. 等待 Actions 中 Deploy DUSK to GitHub Pages 成功。
4. 打开 https://allan-qiu.github.io/Between-the-Twilight/ 。

以后只修改源码、提交即可。无需本地启动，也无需手动上传 dist。

此次只修改本地文件，没有提交、推送或修改远程 GitHub 设置。
