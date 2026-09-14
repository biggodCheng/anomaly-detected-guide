import Link from 'next/link'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { codexPath, milestonePath, regionPath, economyPath, achievementPath } from '@/lib/domain-slugs'
import { siteConfig } from '@/lib/site'

// 根级 not-found 不在 [locale] 段内（无 intl context，英文硬编码）。
// 根 layout 是 pass-through（<html> 由 [locale]/layout 渲染），所以这里
// 自带完整文档结构，否则静态导出的 404.html 是无 <head>/<title> 的片段。

// 导出供 data/internal-links.test.ts 守护:href 必须指向真实页面
// (此处硬编码在 app/ 层,不在内链主扫描范围,漏改时 404 页会产出 404 链接)。
export const POPULAR = [
  { href: '/guides/beginner-guide', label: 'Beginner Guide' },
  { href: codexPath(), label: 'All Monsters' },
  { href: regionPath(), label: 'Regions' },
  { href: milestonePath(), label: 'Boss Guides' },
  { href: economyPath(), label: 'Gold & Economy' },
  { href: achievementPath(), label: 'Achievements' },
]

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="description" content={`The page you are looking for does not exist. Browse the ${siteConfig.siteName.en} for cases, eras, clues, timeline and game mechanics.`} />
        <meta property="og:title" content={`404 - Page Not Found | ${siteConfig.siteName.en}`} />
        <meta property="og:description" content={`The page you are looking for does not exist. Browse the ${siteConfig.siteName.en} for cases, eras, clues, timeline and game mechanics.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <title>404 - Page not found</title>
        <link rel="icon" href="/favicon.ico" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --bg: #fafafa; --fg: #1a2332; --muted: #64748b; --border: #e2e8f0; --primary: #c2410c; --primary-fg: #ffffff; --card: #ffffff; }
          .dark { --bg: #0c0f14; --fg: #f1f5f9; --muted: #94a3b8; --border: rgba(255,255,255,0.08); --primary: #fb923c; --primary-fg: #0c0f14; --card: #161b24; }
          body { background: var(--bg); color: var(--fg); margin: 0; font-family: system-ui, sans-serif; }
        ` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var p=localStorage.getItem('theme');if(p==='dark'||(p==null&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()` }} />
        <GoogleAnalytics />
      </head>
      <body>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>404</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>This page could not be found</h1>
          <p style={{ marginTop: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            The page you are looking for doesn&apos;t exist or has moved.
          </p>
          <div style={{ marginTop: '2rem', display: 'grid', gap: '0.5rem', textAlign: 'left' }}>
            {POPULAR.map((l) => (
              <Link key={l.href} href={l.href} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '0.625rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: 'var(--primary)', background: 'var(--card)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/" style={{ marginTop: '2rem', display: 'inline-block', background: 'var(--primary)', color: 'var(--primary-fg)', borderRadius: '10px', padding: '0.625rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            🏠 Home
          </Link>
        </div>
      </body>
    </html>
  )
}
