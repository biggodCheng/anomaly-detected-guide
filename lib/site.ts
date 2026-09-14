// 站点身份的统一入口 —— 全站唯一的域名/站名来源(替代此前散落 5 处的常量)。
// 纯数据 + 纯函数,client 组件可安全 import。
import { siteConfig } from '@/config/site.config'
import { routing } from '@/i18n/routing'

export { siteConfig }

export function siteNameFor(locale: string): string {
  return siteConfig.siteName[locale] ?? siteConfig.siteName[siteConfig.defaultLocale]
}

/** 默认语言无前缀、其他语言带前缀 —— 全站 URL 拼接的唯一规则。
 *  空串与 '/' 等价(首页两种调用形态都存在)。静态导出下由
 *  scripts/promote-default-locale.mjs 在构建期把默认语言页面提升到
 *  out/ 根,与本地内链的这份规则保持一致。 */
export function localePath(locale: string, path: string): string {
  if (path === '') path = '/'
  if (locale === routing.defaultLocale) return path
  return `/${locale}${path === '/' ? '' : path}`
}

/** 剥掉 locale 前缀得裸路径(默认语言本就无前缀,原样返回)。
 *  usePathname() 的值取决于进入方式:客户端导航后是 promote 后的无前缀 URL,
 *  但直接加载/刷新静态导出页时是构建期路由(/<locale>/…)。与 localePath 的
 *  输出做相等比较前必须先经过本函数归一,否则直接加载时高亮永不命中。 */
export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(new RegExp(`^/(${routing.locales.join('|')})(/|$)`), '/')
}

/** 绝对 URL;path 为空时输出站点根。 */
export function absoluteUrl(locale: string, path = ''): string {
  return `${siteConfig.url}${localePath(locale, path === '' ? '/' : path)}`
}

/** hero 图的宽度变体路径(heroImage 派生,如 hero-<siteId>-header-768.webp)。
 *  hero 资产文件名约定携带 siteId —— 换站时 siteId 必改、文件名必变,
 *  vercel.json 对 /images/hero-* 的一年 immutable 缓存随之自动失效,
 *  不会把上一款游戏的 hero 图喂给回访者。变体存在性由 site.test 守护。 */
export function heroImageVariant(width: number): string {
  return siteConfig.heroImage.replace(/(\.\w+)$/, `-${width}$1`)
}

/** game 页 <picture> 的 avif 档位(make-hero-avif.mjs 产出,同带 siteId)。 */
export function heroAvif(width: number): string {
  return `/images/hero-${siteConfig.siteId}-${width}.avif`
}

/** 首页 hero <picture> 的 avif 档位(heroImage 源直出,make-hero-avif.mjs 产出,同带 siteId)。
 *  与 heroAvif()(ogImage 源)是两张构图不同的图,禁止互串;命名与
 *  heroImageVariant 同构(hero-<siteId>-header-<width>.avif)。 */
export function heroHeaderAvif(width: number): string {
  return siteConfig.heroImage.replace(/(\.\w+)$/, `-${width}.avif`)
}

/** 根路径 WebSite + VideoGame JSON-LD(自 app/[locale]/layout.tsx 迁入,内容不变)。 */
export function websiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteNameFor(locale),
    url: `${siteConfig.url}/`,
    inLanguage: locale,
    about: {
      '@type': siteConfig.schemaType,
      name: siteConfig.game.name,
      applicationCategory: 'Game',
      operatingSystem: siteConfig.game.platforms.join(', '),
      author: { '@type': 'Organization', name: siteConfig.game.developer },
      url: siteConfig.game.officialUrl,
    },
  }
}
