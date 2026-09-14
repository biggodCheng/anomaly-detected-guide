# 换皮 SOP：从模板仓库复制出新站

> 前提：你 clone 了本模板仓库（game-guide-template），要把它改成一个全新游戏的攻略站。
> 占位内容是虚构游戏 Ember Quest——整站所有"游戏特定"的东西都集中在配置层与内容层，框架层（app/components/lib/i18n）不动。

---

## 你需要准备的

| 材料 | 示例（Ember Quest 当前值） |
|---|---|
| 新游戏名称（英文） | `Ember Quest` |
| 新游戏名称（中文，可选） | `Ember Quest` |
| 新域名 | `https://emberquest.guide.example` |
| 站点短 slug（2-12 字符，小写字母+数字） | `emberquest` |
| 主题色（3 个 hex 色值） | primary: `#9a3412`, secondary: `#f59e0b`, accent: `#0d9488` |
| 开发商名称 | `Tinderbox Studio` |
| 支持平台 | `["Windows"]` |
| 官方链接 | official / wiki / steam URL |
| Hero 大图 | 1730×909 webp（+ 768w 变体） |
| OG 封面图 | 1200×630 jpg |
| Favicon | 16×16, 32×32, 192×192, 512×512 png |
| Apple Touch Icon | 180×180 png |
| 内容数据 | 各板块数据文件（或用 AI 批量生成） |
| Google Analytics ID（可选） | `G-XXXXXXX` |

---

## 步骤 0：项目初始化

> 🔴 **红线：模板目录只读，绝不就地换皮。** `/c/project/fox/gamesweb/game-guide-template` 是母版，新站必须 clone 到 `gamesweb/<新站目录名>` 独立目录再动手——就地换皮会消费掉母版（origin 还会被指走），dumbways 2026-09 踩过、模板被迫事后重建。
>
> clone 后做本步骤，把"模板仓库"变成"你自己的项目"，再进入配置层换皮。

```bash
# 0. 前置检查：当前不在模板目录内（在 = 停，先 cd 出去）
pwd

# 1. clone 模板（本地路径或远程 URL 都行）
git clone /c/project/fox/gamesweb/game-guide-template /c/project/fox/gamesweb/<新站目录名>
cd /c/project/fox/gamesweb/<新站目录名>
head -3 config/site.config.json   # 应为模板占位品牌 Ember Quest（emberquest.guide.example）——其他真实游戏/已上线域名 = 模板被污染，STOP

# 2. 清空模板历史，开全新记录（避免新站 git log 里出现 Ember Quest 提交）
rm -rf .git
git init

# 3. 🔴 必拷 .claude：被 .gitignore 忽略，clone 不会带过来；
#    Phase 7/8/9/12 用的 audit_rules.js / ai-seo / seo-audit / gsc_config 全在这个目录
cp -r /c/project/fox/gamesweb/game-guide-template/.claude .
```

### 改 `package.json` 的 `name` 字段

把 `name: "game-guide-template"` 改成你的项目名（如 `"emberquest-guide"`）。

```json
{
  "name": "<你的项目名>",
  ...
}
```

同步改 `package-lock.json` 里**两处** `name` 字段（文件顶部 + `packages[""].name`），否则 `npm ci` / `npm install` 会报警告。

> 这一步不影响功能，但影响：① `npm install` 输出的项目名 ② 部署平台（Vercel/Netlify）识别的项目标识 ③ 未来如果发 npm 包（通常不会）的唯一名。

---

## 步骤 1：改配置层

### 1.1 编辑 `config/site.config.json`

| 字段 | 改为 |
|---|---|
| `siteId` | 新游戏短 slug（≤12 字符，`site.test.ts` 守护，超长即红） |
| `url` | 新域名（无尾斜杠，必须 `https://` 开头） |
| `defaultLocale` | 默认语言（通常 `en`，必须与 `i18n/routing.ts` 一致） |
| `siteName` | `{ "en": "New Game Guide" }`（key 覆盖 `routing.locales` 全部语言） |
| `ogImage` | 新 OG 图路径（`/images/og-xxx.jpg`）、尺寸、alt 文案 |
| `heroImage` | 新 hero 图路径（文件名带 siteId，如 `/images/hero-<siteId>-header.webp`） |
| `brandTokens` | 新游戏品牌词列表（域名、站名、游戏名、开发商名等——`check-swap` 扫描基准，换站时一并替换） |
| `theme` | 新主题色 3 个 hex（必须 6 位小写，与 `globals.css :root` 完全一致） |
| `domains` | 七个内容域的 URL slug（codex/milestones/regions/equipment/achievements/economy/multiplayer **七键必须全写**，保持默认也要显式存在；slug 限 `^[a-z0-9-]+$` 且两两不同，`site.test.ts` 守护。改 slug 全站 URL 自动跟随——路由/导航/sitemap/llms.txt 读 `lib/domain-slugs.ts` 派生，不用动代码） |
| `gaId` | 新 GA ID（可选，**留空则全站不加载**；`.env.local` 的 `NEXT_PUBLIC_GA_ID` 优先） |

### 1.2 编辑 `config/site.config.ts`

| 字段 | 改为 |
|---|---|
| `links.official` | 新游戏官方链接 |
| `links.wiki` | 新游戏 Wiki 链接 |
| `links.steam` | Steam 链接（如有） |
| `game.name` | 新游戏英文名 |
| `game.nameZh` | 新游戏中文名 |
| `game.developer` | 开发商 |
| `game.platforms` | 平台列表 |
| `game.officialUrl` | 官方 URL |
| `schemaType` | JSON-LD 类型（游戏站用 `VideoGame`，其他按需） |

### 1.3 编辑 `app/globals.css`

- `:root` 里的 `--primary`、`--secondary`、`--accent`、`--ring` → 与 `site.config.json` 的 `theme` 值 **完全一致**（`site.test.ts` 逐色校验，不同步直接红）
- `.dark` 里的对应值 → 暗色模式适配色（取 `:root` 同色相的亮变体即可，具体值自选，测试只校验是合法 6 位 hex）
- `.dark` 里的 `--sidebar-primary`、`--sidebar-ring`、`--chart-*` → 与 `--primary` 保持一致（非测试守护，但遗漏会导致侧边栏/图表仍显旧色）
- `@theme` 里的 `--color-primary-bg`、`--color-secondary-bg`、`--color-accent-bg` → 品牌浅底（用于 tag/badge 背景）

### 1.4 编辑 `app/not-found.tsx`

- `POPULAR` 数组的六个链接 → 新站最核心的六个页面
- `:root` 内联样式里的 `--primary` → 新主题色（`<style>` 标签内，硬编码）
- `.dark` 内联样式里的 `--primary` → 暗色模式适配色（与 `globals.css .dark --primary` 一致）

### 1.5 验证

```bash
npm run test:run # site.test.ts 会校验:
                #   - theme 三主色 ↔ globals.css :root 同步
                #   - ogImage / heroImage 文件存在
                #   - brandTokens 无旧游戏残留
                #   - siteId ≤12 字符短 slug
                #   - schemaType 合法
```

---

## 步骤 2：改导航树

编辑 `config/navigation.config.ts`：

1. **重写 `NAV_SECTIONS`**：按新游戏的内容分类定义导航结构
   - 每个 section 有 `id`（sidebar 分节标题 key → `Sidebar.sections.<id>`）和 `items` 数组
   - 每个 item 需要：`href`（locale 相对路径，无尾斜杠）、`labelKey`、`surfaces`（出现在哪些面）
   - `footerColumn`：`'guides'` | `'reference'` | `'legal'`

2. **重写 `NAV_HUBS`**：面包屑中间层映射（key 是 URL 路径段，value 是 hub 页 href）

### labelKey 守护说明

`labelKey` 是消息 key（不含 namespace），渲染层按 surface 选 namespace 消费：

| surface | 消费 namespace |
|---|---|
| header | `Nav.<labelKey>` |
| footer | `Footer.links.<labelKey>` |
| sidebar | `Sidebar.links.<labelKey>` |

同一路径在不同 surface 用不同措辞时（如 `/guides` 在 sidebar 叫 `allGuides`），用 `labelKeyBySurface` 覆盖——消息文件零改动。

**守护测试**：`navigation.config.test.ts` 做 nav href ↔ 真实路由双向覆盖校验。新页面忘进导航或导航死链直接红；`labelKey` 必须存在于上述三个 namespace 的对应 key 中（`messages.test.ts` 的死键守护会兜底）。

---

## 步骤 3：替换内容层

### 3.1 替换 `data/` 目录

- 整体替换各内容域（保留 `data/types.ts` 通用类型结构）
- **七个内容域的 URL 段在 `config/site.config.json` 的 `domains.*.slug` 配**（不是改 content-registry）：codex/milestones/regions/equipment/achievements/economy/multiplayer 共用 `app/[locale]/(main)/[domain]/` 动态路由，路由、导航、sitemap、llms.txt 全部从 `lib/domain-slugs.ts` 派生函数取值，改 slug 不用动代码。`data/content-registry.ts` 的实体域 pathPrefix 已派生化，通常无需改动（新增非实体域才要注册）
- 数据域目录全部是中性名（`data/codex`、`data/milestones`、`data/regions`、`data/equipment`、`data/economy`、`data/multiplayer`、`data/achievements` 等；codex/milestones 字段也是中性名 zone/effect/stackable、trigger/triggerHow），换皮时填新游戏语义的数据即可；守护测试文件顶部 import 各域数据模块（`@/data/codex` 等），目录名不用改
- 更新 `data/homepage.ts`：heroStats、coreTopics、popularQuestions、featuredEntities
- 更新 `data/content-dates.ts`：所有 topic 页的 published/modified 日期
- **内链密度**：正文/tip 段落自然语境内链 8-10 条/页，锚文本含页面主题词，不动表格单元格（Cyberpunk 站口径：5 个页面 0-5 条 → 10-14 条；`data/internal-links.test.ts` 守护全部指向真实页面）

### 3.2 替换 `messages/en.json`

全部重写。保持相同的 namespace 结构（`Nav`、`Home`、`Header`、`Footer`、`Sidebar`、`Breadcrumbs` 等），内容换成新游戏的。

**三条硬测试提示**（换站时最容易踩的坑）：

1. **Home.intro + Home.explore ≥ 600 词**（`messages.test.ts`）—— 这两个是 SEO 长文案，由测试断言词数，不是渲染层消费。写够 600 词再跑测试。
2. **metaDescription 全站唯一**（`messages.test.ts`，PRD §20）—— 任意两个页面的 metaDescription 值不能相同。copy-paste 文案时最容易触发。
3. **重写 en.json 丢叶子 key = 线上裸 key 渲染**（`messages.test.ts` 缺 key 守护）—— namespace 在但叶子缺失时 build 不报错，next-intl 生产模式把 key 路径原样渲染上线（The Blood Of Dawnwalker 曾因此丢 38 个 key 上线）。守护扫代码里字面量 `t('x')` 引用并断言存在于 en.json，重写后跑它兜底。

### 3.3 验证

```bash
npm run test:run # internal-links.test.ts — data/ 硬编码内链全部指向真实页面
                # messages.test.ts      — 结构一致 + 词数 + 唯一 metaDescription + 命名空间无死键
                # 各域 *.test.ts        — 实体数据闭包（区域↔魔物↔Boss 互引一致）
```

---

## 步骤 4：替换品牌资源

### 4.1 图片文件清单

| 文件 | 说明 |
|---|---|
| `public/images/hero-<siteId>-header.webp` | 新 hero 大图（1730×909）。**文件名必须含 siteId**：`/images/hero-*` 配了一年 immutable 缓存（vercel.json），换站时文件名随 siteId 变化、缓存才能自动失效——漏改会把上一款游戏的 hero 喂给回访者（site.test 守护文件名规则与变体存在性） |
| `public/images/hero-<siteId>-header-768.webp` | 768w 变体（由 `heroImage` 路径派生，`lib/site.ts` 的 `heroImageVariant()`） |
| `public/images/hero-<siteId>-header-768/1730.avif` | 首页 hero AVIF 阶梯（`hero:avif` 脚本从 header.webp 直转，`lib/site.ts` 的 `heroHeaderAvif()`；首页 hero `<picture>` 的 avif source 消费，见 4.3） |
| `public/images/og-*.jpg` | 新 OG 封面（1200×630，路径与 `site.config.json` 对齐） |
| `public/favicon-16x16.png` | 16×16 图标 |
| `public/favicon-32x32.png` | 32×32 图标 |
| `public/favicon.ico` | 传统 ico（`generate-favicons.mjs` 产出的 16/32/48 多尺寸容器；浏览器/爬虫默认请求 `/favicon.ico`，404 页也直接引用它）。**只放 public/，不要放 app/**：`app/favicon.ico` 是 Next metadata 文件约定，优先级高于 public/ 版——两者并存时生产导出被 app 版遮蔽、dev 下 `/favicon.ico` 直接 500（site.test 守护 app/ 下无此文件） |
| `public/android-chrome-192x192.png` | 192×192 |
| `public/android-chrome-512x512.png` | 512×512 |
| `public/apple-touch-icon.png` | 180×180 Apple 触摸图标 |
| `public/images/*-header.jpg` | 各实体域头图（如 monsters-header.jpg，按实际内容域命名） |
| `components/home/game-trailer.tsx` 的 `TRAILER_VIDEO_ID` | 首页 YouTube trailer 视频 ID（模板占位用 BoD reveal trailer `AH1agOznQo8`，换皮时必须替换为当前游戏的官方 trailer ID；CSP 已放行 youtube-nocookie.com） |

清理旧的图片和视频文件。

### 4.2 ffmpeg 纯色占位图命令

如果暂时没有美术素材，可用 ffmpeg 生成纯色占位图（`c=` 后接 hex 色值，替换为你的主题色）。

**Windows 用户注意**：ffmpeg 通过 WinGet 安装后不在 PATH，需临时加入或用完整路径：

```bash
# Windows WinGet 安装路径（版本号可能不同，用 glob 匹配）
FF=$(ls /c/Users/$USER/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe 2>/dev/null | head -1)

# Unix/macOS 或已加入 PATH 的情况
FF=${FF:-$(command -v ffmpeg)}

# Hero（primary 色；<siteId> 替换为 site.config.json 里的 siteId，如 newgame）
"$FF" -y -loglevel error -f lavfi -i color=c=0x9a3412:s=1730x909  -frames:v 1 public/images/hero-<siteId>-header.webp
"$FF" -y -loglevel error -f lavfi -i color=c=0x9a3412:s=768x404   -frames:v 1 public/images/hero-<siteId>-header-768.webp

# OG 封面（primary 色）
"$FF" -y -loglevel error -f lavfi -i color=c=0x9a3412:s=1200x630  -frames:v 1 public/images/og-newgame.jpg

# 实体域头图（按你的内容域增减）
"$FF" -y -loglevel error -f lavfi -i color=c=0x9a3412:s=1200x400  -frames:v 1 public/images/monsters-header.jpg

# Favicon 不走 ffmpeg 纯色 —— 见 4.4（源图设计 + generate-favicons.mjs 一键全套）
```

纯色即可，模板不要求美术质量（favicon 除外——见 4.4，源图需按游戏意象设计）。

### 4.3 重生成 hero AVIF 阶梯（ogImage + heroImage 两条）

`scripts/make-hero-avif.mjs` 的源与产物路径都从 `site.config.json` 派生（`ogImage.path` / `heroImage` / `siteId`），换站改完配置直接跑、无需改脚本。产出两条阶梯、两个消费方：

| 阶梯 | 源 | 产物 | 消费方 |
|---|---|---|---|
| ogImage | OG jpg | `hero-<siteId>-768/1200.avif` | game 页 `<picture>`；OG jpg 同时承担社交 meta 兜底 |
| heroImage | 首页 hero webp 本身（1730×909） | `hero-<siteId>-header-768.avif` + `-header-1730.avif` | 首页 hero `<picture>` 的 avif source（LCP 元素，`lib/site.ts` 的 `heroHeaderAvif()`） |

- **首页 hero 源就是 `hero-<siteId>-header.webp` 本身**，AVIF 从它直转、构图零偏移；`monsters-*-header.jpg` 等实体域头图是 1200×400 横幅（codexHeader 类），**不是**首页 hero 源，禁止拿它出 AVIF
- 1730w 档位三处耦合：`hero.tsx` 的 webp srcSet 与 avif srcSet 的 `1730w` 描述符、脚本 HERO_OUT 档位——换站若 hero 源图宽不是 1730，三处同步改
- `config/site.test.ts` 守护两条阶梯全部变体的存在性，缺文件跑 `npm run hero:avif` 补齐

```bash
npm run hero:avif
ls -la public/images/hero-<siteId>-*.avif   # 4 个文件：ogImage 阶梯 2 + heroImage 阶梯 2
```

注意：hero.tsx 的 `<img>` 在 `<picture>` 内不触发 `no-img-element` 规则，故无 eslint-disable（lint 是 `--max-warnings 0`，死指令会标红）；若日后把 img 移出 picture，需恢复 disable 指令。

### 4.4 Favicon：源图 + 一键生成

favicon 的唯一输入是一张源图 `public/images/favicon-source.svg`（≥512×512 正方形），`scripts/generate-favicons.mjs` 用 sharp 派生全套 6 件（5 个 PNG + 多尺寸 favicon.ico）：

```bash
node scripts/generate-favicons.mjs public/images/favicon-source.svg
# 完全没有源图时的临时占位（后续必须补真源图）：
node scripts/generate-favicons.mjs --color "#<primary>"
```

**源图必须按当前游戏的特色设计**（游戏名意象 / 核心机制 / 世界观母题的浓缩，站点三主色映射到底色/主体/点缀），禁止拿上一站图标换色复用。写清 SVG 注释里的设计依据，方便下次换皮理解。

**小尺寸可读性法则**（浏览器 tab 里实际看到的是 16-32px）：
- 元素 ≤ 3 个，无细线条、无文字
- 线性元素线宽 ≥ 源图 1/13（40/512）——14px 高的横条在 32px 渲染下不足 1px，会被抗锯齿吞掉
- 相邻色拉开明度差：深红压深青/琥珀在 32px 下会融成一团（Dawnwalker 实测，换亮变体色才立住）
- 生成后目检 `favicon-32x32.png`，不满意改源图重跑（脚本幂等覆盖）

**验证**：`npx vitest run config/site.test.ts` 有全套守护（6 文件存在 + PNG 尺寸 + ICO 头部）。改完 favicon 记得重跑 `npm run build` 让 `out/` 同步。

---

## 步骤 5：验证

```bash
npm run check:swap   # 框架层（app/components/lib/i18n）零品牌残留 → 退出码 0
npm run test:run     # 全量测试通过（裸 `npm run test` 是 watch 模式，不会退出——当门禁会卡住）
npm run build        # 静态导出成功（SSG 到 out/ + Pagefind 索引 + 默认语言提升到根）
npm run validate     # = typecheck + test:run + check:swap 一键聚合
```

**三条全绿（check:swap + test:run + build）= 换皮完成。**

验收浏览：

```bash
npm run preview      # 本地静态服务 out/（serve-out.mjs，cleanUrls 对齐生产行为）
```

### 常见故障：Windows 小写盘符

vitest 4.1.11 在小写盘符 cwd（如 `c:\project\...`）下全部套件红（`TypeError: reading 'config'`，报错误导）。终端 cd 到大写盘符路径（如 `C:/project/...`）再跑；`--root` 覆盖无效。

逐页验收：桌面/移动、404、搜索、暗色模式。

---

## 性能与第三方脚本注意事项

### 接入第三方 / 广告脚本（换站常见需求）

模板默认只带 GA（`components/analytics/google-analytics.tsx`，`NEXT_PUBLIC_GA_ID` 未设时零渲染）。换站要接 Monetag/Adsterra 等广告或统计脚本时：

- 用 `next/script` 的 `<Script>` 组件 + `strategy="lazyOnload"`，渲染在 body 末尾——**不放 head 原生 async**（head async 在解析期立即发起请求，slow 4G 下与 LCP 图/关键 CSS 竞争带宽，Cyberpunk 站实测教训）
- **新增外部脚本域必须同步两处 CSP**：`vercel.json` 与 `scripts/serve-out.mjs` 的 baseHeaders——GA 域名遗漏曾是实战事故
- 广告脚本与隐私页文案联动，接入前自查
- GA 策略权衡（组件注释有完整版）：lazyOnload 丢 load 前早期事件（Cyberpunk 站 GSC 33 vs GA4 19，单点数据）；afterInteractive 在静态导出下会在 head 生成 preload、与 LCP 竞争（next 15.5 实测）。重数据覆盖的站可自行权衡

### 模板维护：性能改动回流 checklist

把某站点验证过的优化回流到模板前：

1. **构建期配置先验 Turbopack 支持**：模板 dev/build 均走 `--turbopack`，`experimental.optimizePackageImports` 等 webpack-only 选项会被 Turbopack 静默忽略（next 源码 `turbopack-warning.js` 明说）——Cyberpunk 站曾把 first-load JS -14KB 错误归因于该配置。回流前查 next/dist 的 unsupportedTurbopackNextConfigOptions 列表；另注意 `lucide-react` 已在 Next 内置默认列表，显式添加是冗余
2. **性能改动必须附 A/B 证据**：改动前后 `out/_next/static` chunk 体积 diff 或 PageSpeed 实测，写进 commit message——静默 no-op 的配置只有 A/B 体积对比能暴露
3. 首屏图遵循既有范式：直出 `<img>`/`<picture>` + 手工 srcSet + `fetchPriority="high"`（hero.tsx 范式）；below-fold 图 `loading="lazy"` + 显式宽高（game 页/codex-hub 范式）。勿回退 CSS background-image 型首屏视觉——preload scanner 发现晚、无法设优先级

---

## 可选：裁剪不需要的功能

如果新站不需要模板里的某些内容模块（比如 Ember Quest 示例有 `multiplayer/`、`economy/`，而你的游戏没有多人模式和经济系统），需要手动裁剪。**裁剪是六处同步删除**，漏一处测试会拦你：

### 裁剪清单（以删除一个 topic 域为例）

| # | 位置 | 改什么 |
|---|---|---|
| 1 | `app/[locale]/<domain>/page.tsx`（及子页目录） | 删除路由文件 |
| 2 | `config/navigation.config.ts` | 删除 `NAV_SECTIONS` 里对应 item + `NAV_HUBS` 里对应 key |
| 3 | `data/content-dates.ts` | 删除该域所有 key |
| 4 | `messages/en.json` | 删除对应 namespace（如 `Multiplayer`）+ `Breadcrumbs.<key>` + `Sidebar.links` / `Nav` / `Footer.links` 里的相关 key。**注意**：`Breadcrumbs` 必须同步删——`components/seo/breadcrumb.tsx` 用 `getTranslations({ namespace: 'Breadcrumbs' })` 消费 `NAV_HUBS` 的 key，漏删会渲染 `Breadcrumbs.multiplayer` 明文；且 `messages.test.ts` 死键守护按顶层命名空间粒度检测，`Breadcrumbs` 整体仍被其他 key 引用，**测试不会拦这个遗漏** |
| 5 | `data/content-registry.ts` | 如果该域有动态实体页，删除对应的 `ContentDomain` 条目 |
| 6 | `data/homepage.ts` | 删除引用该域的 featuredEntities / coreTopics 等 |

### 三组测试兜底

裁剪后跑 `npm run test:run`，三组测试会帮你发现遗漏：

- **`navigation.config.test.ts`**：nav href ↔ 真实路由双向覆盖 → 路由删了但导航没删（或反过来）会红
- **`messages/messages.test.ts`**：命名空间无死键 → 导航 key 删了但 `en.json` 没删（或反过来）会红
- **`data/internal-links.test.ts`**：data/ 硬编码内链全部指向真实页面 → 数据里还引用已删页面会红

### 如果想写裁剪脚本

本模板未附带自动裁剪脚本。可行的思路：在待裁剪文件头加注释标记（如 `// PACK: multiplayer`），脚本按标记段删除，并同步收缩 `navigation.config.ts`、`content-dates.ts`、`en.json` 的对应条目；配合 git 提交点，裁剪可逆（`git checkout` 恢复）。注意 `NavItem` 没有 pack 字段——导航条目按 href 前缀匹配删除更可靠。
