import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site.config'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    // /pagefind/ 是客户端搜索索引资产(JS/wasm/分片),无需被抓取;
    // .txt(RSC payload)不在 Disallow 里——交给 vercel.json 的 X-Robots-Tag: noindex
    // (Disallow 会阻止爬虫读到 noindex 头,两者不可同时用)
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/pagefind/'] },
      // AI crawlers - allow for citation in AI answers (ChatGPT, Claude, Perplexity, etc.)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
