## 在 VS Code 中预览

按 F5 选择“打开暮色之间（本地服务）”，会先启动本地服务，再打开 http://localhost:5188/。如果仍停在旧的 file:/// 调试页面，请先停止旧调试，再重新按 F5。

## 桌面版一键打开

双击 **启动网站.cmd** 即可打开网站，无需 npm install。启动窗口需要保持开启；不要直接双击 index.html。

固定地址：http://localhost:5188/。如网站已经在运行，直接访问此地址即可。

# 暮色之间 DUSK

中文多页面日落网站。React 19 + TypeScript + React Router + Vite，无后台，草稿保存在浏览器。

## 启动

需要 Node.js 20.19+ 或 22.12+。

```powershell
cd "C:\Users\Administrator\Desktop\Between the Twilight"
npm install
npm run dev
```

打开终端显示的地址（默认 http://localhost:5173）。

```powershell
npm run build
npm run preview
```

生产文件输出到 `dist/`。请通过 HTTP 服务访问，不要直接双击 index.html。

## 路由

- `/` 首页
- `/cinema` 日落放映室
- `/palette` 暮色色谱
- `/journal` 暮色手记
- `/journal/a-slow-ending`
- `/journal/the-colors-of-dusk`
- `/journal/a-moment-to-do-nothing`
- `/letters` 写给黄昏
- `/about` 关于暮色

Vite 开发和预览服务器已支持直接访问与刷新。部署到其他静态服务器时，需要将非资源请求回退到 `/index.html`。附带 `public/_redirects` 用于支持该格式的静态托管；Nginx 可设置 `try_files $uri $uri/ /index.html;`。

## 素材与色谱

实际提供的视频已复制为 `public/media/sunset.mp4`，前端统一使用 `/media/` 路径，不依赖原始中文文件系统路径。原始视频：`C:/web前端/media/dusk_sunset_21s.mp4`。

4 张截图来自第 3、7、12、18 秒。色谱在原始分辨率帧中采样对应区域，使用 Pillow 中位切分量化为 5 色，结果保存于 `src/frames.json`。第 7 秒针对太阳区域采样，其他区域分别为天空、水面与远岸。网页截图缩小至 1280 宽，颜色基于原始帧提取，JPEG 编码可能产生轻微色差。

可选重新提取：安装 Python 包 `pillow`、`imageio-ffmpeg` 后运行 `python scripts/extract_frames.py`。正常启动网站不需要 Python。

影片为 21 秒、1920 × 1080，包含音轨。首页以第 3 秒封面先行，视频定位到第 3 秒后静音播放；如浏览器禁止自动播放，可手动播放。减少动态效果设置下不自动播放背景。放映室保留完整视频和完整画幅。

原始来源、拍摄地点、创作者与授权均未独立核实，关于页已标明待补充；不根据文件内标注虚构来源或授权结论。

## 交互

放映室：播放/暂停、进度、声音、重播、全屏、循环、静静看模式（移动/触摸恢复控制，Esc 退出）。

色谱：4 组切换，键盘左右箭头切换，点击复制 HEX；剪贴板功能需要 localhost 或 HTTPS。

心情卡片：5 种心情、200 字（按 Unicode 码点计数）、4 帧背景、自动保存草稿。Canvas 实时预览与导出共用画布，输出 1080 × 1350 PNG。文字自动换行，过长时缩小字号。清空重写会同步覆盖本地草稿。

字体：优先加载 Noto Serif SC，网络不可用时使用系统宋体；正文使用系统黑体。PNG 使用浏览器字体绘制，等待字体就绪，不依赖服务端接口。

修改源码后：npm run build；运行生产网站：npm start；执行回归测试：npm test。

