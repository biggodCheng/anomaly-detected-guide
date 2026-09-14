import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { routing } from './i18n/routing'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const DEF = routing.defaultLocale
const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  // dev 不声明 output: 'export' —— 它会把 dev 也锁进静态导出语义
  // (generateStaticParams 强校验,动态渲染一律 500),且 rewrites 被忽略。
  // 静态导出是 build 目标,生产构建才声明。
  ...(isDev ? {} : { output: 'export' as const }),
  images: { unoptimized: true },
  // dev-only:把无前缀路径重写到默认语言路由。生产 URL 规则(默认语言无前缀)
  // 由 scripts/promote-default-locale.mjs 在构建期落地,dev 的路由空间却是
  // /<def>/* —— 不补这层,dev 下点任何导航内链都是 404。afterFiles(数组返回
  // 形式)保证 public/ 资产与 app/page.tsx(根 redirect)先行命中,不进重写。
  // rewrites 与 output 一样只在 dev 声明:Next 的导出检查是声明级的 ——
  // config 只看 rewrites 键是否存在,不 await 运行时返回值;生产 config 含
  // 该键,每次 build/typegen 都打 "will not automatically work with
  // output: export" 警告。
  ...(isDev
    ? {
        rewrites: async () => [
          { source: `/:path((?!${DEF}/|${DEF}$|_next/).*)`, destination: `/${DEF}/:path` },
        ],
      }
    : {}),
}

export default withNextIntl(nextConfig)
