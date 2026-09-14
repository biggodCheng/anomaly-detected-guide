# Game Guide Template

游戏攻略站模板：clone → 换皮 → 三绿 → 上线。占位内容是虚构游戏 **Ember Quest**（奇幻动作 RPG）——构建本模板的过程就是一次完整的换皮演练，所有"游戏特定"的东西都集中在配置层与内容层。

## 技术栈

Next.js 15（静态导出）· next-intl（单语言 en，多语言基础设施已就绪）· Tailwind CSS 4 · Pagefind 静态搜索 · Vitest · shadcn/Base UI 组件

## 快速开始（三步）

### 1. 换配置层（30 分钟）

| 文件 | 改什么 |
|---|---|
| `config/site.config.json` | siteId / url / siteName / ogImage / heroImage（文件名带 siteId，见 SOP 4.1）/ brandTokens / theme（3 个 hex）/ gaId |
| `config/site.config.ts` | links（official/wiki/steam）/ game（name/developer/platforms/officialUrl）/ schemaType |
| `app/globals.css` | `:root` 三主色 + `--ring`（与 site.config.json theme 完全一致，site.test 校验）、`.dark` 亮变体、`@theme` 品牌浅底 |
| `config/navigation.config.ts` | NAV_SECTIONS（导航树）+ NAV_HUBS（面包屑中间层） |
| `app/not-found.tsx` | POPULAR 六链接 + 背景色值 |

详细操作见 `docs/换皮SOP.md`。

### 2. 换内容层（内容量的时间）

| 目录 | 改什么 |
|---|---|
| `data/` | 实体域（monsters/regions/bosses）+ topic 域 + guides/faq/achievements + homepage.ts + content-dates.ts |
| `messages/en.json` | 全部文案（namespace 结构不变；注意 `Home.intro+explore ≥600 词` 与 `metaDescription 全站唯一` 两条测试） |
| `data/content-registry.ts` | 注册你的动态内容域 |
| `public/` | hero/OG/favicon/实体头图（占位图可用 ffmpeg 纯色生成，命令见 SOP） |

### 3. 三绿验证

```bash
npm run check:swap   # 框架层零品牌残留 → 退出码 0
npm run test:run     # 全部守护测试通过（裸 `npm run test` 是 watch 模式）
npm run build        # 静态导出成功
npm run validate     # = typecheck + lint + test:run + check:swap
```

## 部署

**生产环境仅在 Vercel 上验证过。** `vercel.json` 里的 cleanUrls（无 `.html` 后缀）、自定义 headers（缓存策略/X-Robots-Tag 等）、404 应答均依赖 Vercel 行为；`out/` 产物部署到 Netlify/OSS/自建 CDN 时这些行为**未经验证**，已知差异需自行适配（如 cleanUrls 对应 Netlify 的 pretty_urls、404 页对应各平台的 error page 配置）。本地预览生产行为用 `npm run preview`（serve-out.mjs 模拟 cleanUrls 与 headers）。

## 目录结构

```
app/          页面路由（框架层——换皮基本不动）
components/   UI 组件（框架层）
lib/ i18n/    工具与国际化（框架层）
config/       配置层（换皮必改）
data/         内容数据（换皮必改）
messages/     文案（换皮必改）
scripts/      check-swap / make-hero-avif / serve-out / promote-default-locale / prune-pagefind
docs/         换皮SOP.md
```

## 守护测试一览

| 测试 | 守护什么 |
|---|---|
| `scripts/check-swap.mjs` | 框架层（app/components/lib/i18n）零品牌词泄漏 |
| `config/site.test.ts` | 配置自洽性校验：theme↔globals.css 同步、ogImage 存在、brandTokens 无残留，及 URL / siteName / siteId / schemaType 等合法性 |
| `messages/messages.test.ts` | 文案结构一致、Home 词数 ≥600、metaDescription 唯一、命名空间无死键 |
| `config/navigation.config.test.ts` | nav href ↔ 真实路由双向覆盖、Sidebar.sections 分节文案镜像 |
| `data/internal-links.test.ts` | data/ 硬编码内链全部指向真实页面（含 404 页 POPULAR） |
| `data/content-dates.test.ts` | 全站内容日期 ≤ 今天（含 "Month D, YYYY" 散文明文形态）、topicDates ↔ TopicPage 路由双向镜像 |
| `lib/date.test.ts` | formatHumanDate 月名映射与边界（全站日期渲染唯一实现） |
| `app/sitemap.test.ts` | sitemap 生成逻辑（URL 全集 × 语言、hreflang、priority） |
| `app/pagefind-coverage.test.ts` | 站内搜索索引覆盖：(main) 路由组外每个内容页必须自带 `data-pagefind-body`（漏标记 = 整页静默搜不到） |
| `data/llms-txt.test.ts` | llms.txt 的 URL/域名/实体计数/品牌词与 config 及数据域一致 |
| 各域 `*.test.ts` | 实体数据闭包（区域↔魔物↔Boss 互引一致，含 m.region 指回断言；区域显示走数据层真实名、guide title 去双品牌且 SERP 长度受守护） |

换皮时测试就是检查清单——先改断言到新事实（跑红），再改数据（跑绿）。
