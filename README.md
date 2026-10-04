# 云南省茶文化博物馆 · 官网 v2「一叶知山海」

双语（中/EN）单页官网 · 设计参考 Apple 官网的克制排版与世界顶级博物馆的编辑式视觉。

## 文件结构

```
省茶博官网/
├── index.html      页面结构（含 SEO / Open Graph / 结构化数据）
├── styles.css      设计系统（色彩 / 字体 / 动效 / 响应式）
├── app.js          交互层（双语切换 / 渐显 / 数字滚动 / 视差 / 移动菜单）
├── favicon.svg     茶叶徽标
├── assets/         WebP 优化图片（共约 1.1MB，原图为 18MB JPG）
├── robots.txt
└── sitemap.xml
```

## 本地预览

```bash
cd D:\省茶博官网
python -m http.server 8765
# 浏览器打开 http://localhost:8765
```

> 直接双击 index.html（file://）也能运行，但建议用本地服务器以获得正确字体加载。

## 设计要点

- **色彩**：暖纸底 `#F7F4EF` × 暖墨黑 `#0D0A07` × 焦糖茶汤 `#A4642F`，单一强调色，克制如 Apple 灰度
- **字体**：Noto Serif SC（中文标题）/ Cormorant（西文展示体）/ Noto Sans SC（正文），大标题负字距
- **动效**：入场帷幕 → 首屏逐行升起 → 宣言逐字浮现 → 数字滚动 → 滚动渐显（上移+微模糊消散）；全部使用 Apple 式缓动曲线 `cubic-bezier(.16,1,.3,1)`
- **导航**：毛玻璃吸顶导航 + 滚动章节高亮（scrollspy）+ 滑块式语言切换 + 移动端全屏菜单
- **双语**：`data-zh` / `data-en` 双份文案，一键切换，`localStorage` 记忆选择
- **无障碍**：完整 `prefers-reduced-motion` 支持、焦点可见、语义化标签、ARIA 标注
- **性能**：图片全部 WebP 并按场景裁切、首屏 `preload`、其余懒加载 + `decoding=async`

## 部署

整个文件夹为纯静态站点，上传至任意静态托管即可（Nginx / 阿里云 OSS / 腾讯云 COS / Vercel / GitHub Pages）。

上线前请把 `index.html` 中的 canonical / og:url 域名替换为正式域名。
