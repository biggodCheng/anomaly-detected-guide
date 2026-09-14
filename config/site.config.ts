// 站点身份配置 —— 换游戏时必改的文件之一。
// 纯可序列化字段在 site.config.json(供 .mjs 构建脚本读取);
// 这里补充不适合 JSON 的外链与游戏实体信息。
import raw from './site.config.json'

export type SiteConfig = {
  /** 短 slug,用于 localStorage key 等站点级命名空间 */
  siteId: string
  /** 生产域名,无尾斜杠 */
  url: string
  /** 必须与 i18n/routing.ts 的 defaultLocale 一致(config/site.test.ts 守护) */
  defaultLocale: string
  /** 每语言站名(key 对应 routing.locales) */
  siteName: Record<string, string>
  ogImage: { path: string; width: number; height: number; alt: string }
  /** Hero 大图路径(public/ 相对)—— 换站时随品牌资源一起改 */
  heroImage: string
  /** /codex 域头图路径(public/ 相对)—— 换站时随品牌资产一起改(site.test 守护存在) */
  codexHeader: string
  /**
   * 七个内容域的 URL 段 —— 全站路由/导航/sitemap/llms.txt 的唯一来源。
   * 默认 monsters/bosses/regions/equipment/achievements/economy/multiplayer;
   * 无此概念的游戏改成实际概念(如 upgrades/endings/zones/gear/trophies/currency/modes)
   * 详见 docs/superpowers/specs/2026-09-11-configurable-domains-design.md
   */
  domains: {
    codex: { slug: string }
    milestones: { slug: string }
    regions: { slug: string }
    equipment: { slug: string }
    achievements: { slug: string }
    economy: { slug: string }
    multiplayer: { slug: string }
  }
  /** 游戏专有名词 —— check-swap 扫描 token,换站时随本文件一起改(新游戏品牌词自动进扫描) */
  brandTokens: string[]
  /** Google Analytics ID(gtag.js) — env NEXT_PUBLIC_GA_ID 优先,此处兜底;留空则全站不加载 */
  gaId?: string
  /** 三主色 —— 与 app/globals.css :root 同步(site.test 守护一致,换站漏改配色在此红) */
  theme: { primary: string; secondary: string; accent: string }
  /** 官方外链 —— footer 第三列、about 页等处消费 */
  links: { official?: string; wiki?: string; steam?: string; repo?: string }
  /** 游戏实体 —— WebSite JSON-LD 的 about.VideoGame 与页面 meta 文案消费 */
  game: {
    name: string
    nameZh: string
    developer: string
    platforms: string[]
    officialUrl: string
    /** 发售日 ISO 日期(YYYY-MM-DD) —— VideoGame JSON-LD 的 datePublished */
    releaseDate?: string
    /**
     * 本站展示的真实评分(如自建评分系统或明确标注来源的汇总)。
     * 评分必须与页面可见内容一致;无真实数据请留空 —— 缺省时不输出
     * aggregateRating,凭空标评分违反 Google 评论摘要垃圾政策,会导致整站丢富摘要。
     */
    rating?: { value: number; count: number }
  }
  /** JSON-LD 结构化数据的 @type —— 游戏站用 VideoGame，其他站按需改 */
  schemaType: string
}

export const siteConfig: SiteConfig = {
  ...raw,
  links: {
    official: 'https://store.steampowered.com/app/4899900/ANOMAL/',
    steam: 'https://store.steampowered.com/app/4899900/ANOMAL/',
  },
  game: {
    name: 'ANOMAL',
    nameZh: 'ANOMAL',
    developer: 'Alexis Roumier',
    platforms: ['Windows'],
    officialUrl: 'https://store.steampowered.com/app/4899900/ANOMAL/',
    // 游戏尚未发布，发售日待定
  },
  schemaType: 'VideoGame',
}
