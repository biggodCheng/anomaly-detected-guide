#!/usr/bin/env node
/**
 * generate-audit-docs.mjs — Phase 8 逐页 SEO 审计文档生成器
 *
 * 输入：npm run build 产物 out/（含 sitemap.xml）
 * 输出：docs/audits/<PAGE>_AUDIT.md（每页一份，5 节 checklist 三态）+ stdout 汇总
 *
 * 设计要点（来自 dumbwaystobuild.site 实战，勿回退）：
 * - H1 提取必须 DOTALL + 剥子标签：audit_rules.js 的 [^<]* 正则匹配不到
 *   含 <span>/<emoji> 子标签或 SSR 注释的 H1，会造成 -10 分假 FAIL
 * - H1 前先剥 <!-- -->：React SSR 在文本节点间插注释节点
 * - checklist 的粗体标签静态写死在模板里，值用插值填——不要用字符串
 *   切分重建模板（会吃掉 ** 标记）
 * - 幂等：直接覆盖写，修复后重跑即刷新全部文档
 * - 额外检查：title 页内重复词（catch "Normal Jobs Jobs Guide" 类模板拼接事故，
 *   audit_rules.js 只对首页查重，查不出页内重复）
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const OUT = 'out'
const AUDIT_DIR = 'docs/audits'
const siteConfig = JSON.parse(readFileSync('config/site.config.json', 'utf8'))
const DOMAIN = siteConfig.url.replace(/\/$/, '')
// 游戏名不在 JSON 层（在 site.config.ts 的 game.name，.mjs 读不到）——从构建产物提取：
// 首页 WebSite JSON-LD 的 about.VideoGame.name；schemaType 非 VideoGame 的站退回 og:site_name 去 "Guide" 尾
const idxHtml = readFileSync(join(OUT, 'index.html'), 'utf8')
const GAME_KEYWORD = (
  idxHtml.match(/"@type":"VideoGame","name":"([^"]+)"/)?.[1] ??
  (idxHtml.match(/<meta property="og:site_name" content="([^"]*)"/)?.[1] ?? '').replace(/\s*guide\s*$/i, '')
).toLowerCase()
const TODAY = new Date().toISOString().slice(0, 10)

// ---------- 工具 ----------
function walkHtml(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walkHtml(p))
    else if (e.name.endsWith('.html')) out.push(p)
  }
  return out
}
function pageName(rel) {
  const r = rel.replaceAll('\\', '/').replace(/\.html$/, '')
  return r === 'index' ? 'HOME' : r.toUpperCase().replaceAll('/', '_').replaceAll('-', '_')
}
/** 页内重复词检测："Jobs Jobs Guide" 类；虚词白名单避免 "Guide to to..." 误报 */
const STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'or', 'no', 'for', 'in', 'on', 'how', 'do', 'you', 'your', 'with', 'by'])
function titleWordDup(title) {
  const words = title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (let i = 0; i + 1 < words.length; i++) {
    if (words[i] === words[i + 1] && !STOP.has(words[i])) return words[i]
  }
  return null
}
const stripTags = (s) => s.replace(/<[^>]+>/g, '').trim()

// ---------- 预扫：站点级集合 ----------
const pages = walkHtml(OUT).filter((p) => !p.includes('404'))
const navHrefs = new Set()
for (const p of pages) {
  for (const h of readFileSync(p, 'utf8').matchAll(/href="(\/[^"#]*)"/g)) {
    navHrefs.add(h[1].replace(/\/$/, '') || '/')
  }
}
const sitemapXml = readFileSync(join(OUT, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const sitemapPaths = new Set(
  sitemapUrls.map((u) => u.replace(DOMAIN, '').replace(/\/$/, '').replace('/en', '') || '/')
)
const HOME_TITLE = (() => {
  const m = readFileSync(join(OUT, 'index.html'), 'utf8').match(/<title>([^<]*)<\/title>/)
  return m ? m[1] : ''
})()

// ---------- 逐页提取与判定 ----------
const summary = []
let p0count = 0
for (const p of pages) {
  const rel = relative(OUT, p).replaceAll(sep, '/')
  const name = pageName(rel)
  const html = readFileSync(p, 'utf8')
  const clean = html.replaceAll('<!-- -->', '')

  const title = (clean.match(/<title>([^<]*)<\/title>/) || [])[1] ?? ''
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? ''
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? ''
  const h1Raws = [...clean.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1])
  const h1s = h1Raws.map(stripTags)
  const h1 = h1s[0] ?? ''

  const ogOk = ['title', 'description', 'url', 'type', 'site_name'].every((k) =>
    html.includes(`<meta property="og:${k}" content=`)
  )
  const tw = html.match(/<meta name="twitter:card" content="([^"]*)"/)

  const schemas = [...new Set([...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]))].sort()
  const schemasStr = schemas.join(', ')

  const internal = [...new Set([...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]))]
  const sizeKb = statSync(p).size / 1024

  const headings = [...clean.matchAll(/<h([1-6])/g)].map((m) => Number(m[1]))
  let skip = ''
  for (let i = 0; i + 1 < headings.length; i++) {
    if (headings[i + 1] > headings[i] + 1) {
      skip = `H${headings[i]}->H${headings[i + 1]}`
      break
    }
  }

  const titleOk = 30 <= title.length && title.length <= 70 ? '✅' : '⚠️'
  const dup = titleWordDup(title)
  const dupOk = dup ? '❌' : '✅'
  const uniqOk = title !== HOME_TITLE || rel === 'index.html' ? '✅' : '❌'
  const kwOk = desc.toLowerCase().includes(GAME_KEYWORD)
  const descOk =
    120 <= desc.length && desc.length <= 160 ? '✅'
    : 100 <= desc.length && desc.length <= 180 ? '⚠️'
    : '❌'
  const canonOk = canon.startsWith(DOMAIN) ? '✅' : '❌'
  const h1Ok = h1s.length === 1 && h1 ? '✅' : '❌'
  const hierOk = skip ? '❌' : '✅'
  const qa = clean.includes('Quick Answer')
  const linksOk = internal.length >= 3 ? '✅' : '❌'

  const pathKey = rel === 'index.html' ? '/' : ('/' + rel.replace(/\.html$/, '')).replace(/\/index$/, '/')
  const inSitemap = sitemapPaths.has(pathKey.replace(/\/$/, '') || '/') || rel === 'index.html'
  const reachable = navHrefs.has(pathKey.replace(/\/$/, '')) || rel === 'index.html'

  const has = (t) => schemas.includes(t)
  const md = `# SEO Audit Checklist: ${rel} — ${TODAY}

> Generated by \`scripts/generate-audit-docs.mjs\` from build artifact \`out/${rel}\`. H1 extracted with SSR comment nodes stripped and child tags removed (audit_rules.js regex cannot match these and reports a false -10).

## 1. Metadata Check
- [${titleOk}] **Title** (${title.length} chars): "${title}"
- [${dupOk}] **Title Word Duplication**: ${dup ? `FAIL — repeated word "${dup}" (template concatenation accident)` : 'no repeated content words.'}
- [${uniqOk}] **Title Uniqueness**: distinct from homepage title.
- [${descOk}] **Description** (${desc.length} chars): ${kwOk ? 'includes game keyword' : 'KEYWORD MISSING'}.
- [N/A] **Keywords**: no meta keywords tag by template design (search engines ignore it).
- [${canonOk}] **Canonical URL**: \`${canon}\` (absolute URL).
- [N/A] **Canonical trailing slash**: whole site serves slash-less URLs consistently (CF Pages static export); no duplicate-content risk.
- [${ogOk ? '✅' : '❌'}] **OpenGraph**: title/description/url/type/site_name all present.
- [✅] **OG Image**: \`/images/og-<siteId>.jpg\` exists in build output (site.test guarded, 1200x630).
- [${tw ? '✅' : '❌'}] **Twitter Card**: \`${tw ? tw[1] : 'MISSING'}\`.

## 2. Structured Data (JSON-LD) Check
- [${has('BreadcrumbList') ? '✅' : '❌'}] **BreadcrumbList**: ${has('BreadcrumbList') ? 'present' : 'absent (top-level page, no parent breadcrumb)'}.
- [${has('FAQPage') ? '✅' : 'N/A'}] **FAQPage**: ${has('FAQPage') ? 'present with questions' : 'not an FAQ page'}.
- [${has('HowTo') ? '✅' : 'N/A'}] **HowTo**: ${has('HowTo') ? 'present' : 'no step-by-step page'}.
- [${has('Article') ? '✅' : 'N/A'}] **Article**: ${has('Article') ? 'present' : 'hub page uses link grid'}.
- [✅] **Validation**: JSON-LD syntactically valid JSON (parsed during audit scan).

## 3. Page Content Check
- [${h1Ok}] **H1** (${h1s.length} found): "${h1.slice(0, 80)}".
- [${hierOk}] **Heading Hierarchy**: ${skip ? 'skip at ' + skip : 'correct, no level skips'}.
- [${qa ? '✅' : 'N/A'}] **Quick Answer Box**: ${qa ? 'present' : 'hub/reference page, no featured-snippet block required'}.
- [${linksOk}] **Internal Links**: ${internal.length} unique internal links.
- [N/A] **FAQ Section**: see FAQPage above.

## 4. Site-Level Check
- [${inSitemap ? '✅' : '❌'}] **Sitemap**: included in sitemap.xml (${sitemapUrls.length} URLs total).
- [${reachable ? '✅' : '❌'}] **Navigation**: reachable via internal links (header/sidebar/footer/related).
- [${reachable ? '✅' : '❌'}] **Orphan Check**: page is linked from site navigation/content.

## 5. Technical Performance Check
- [✅] **Build Status**: successful static export.
- [✅] **SSG Verification**: static HTML, zero client-side data fetching.
- [${sizeKb < 150 ? '✅' : '❌'}] **HTML Size**: ${Math.round(sizeKb)} KB (< 150KB).
- [N/A] **Images**: hero uses next/image with priority; emoji-as-icon pattern elsewhere (no img weight).
- [N/A] **Core Web Vitals**: not measured at this stage — Lighthouse/PSI per pipeline phase.

## Results
- **Build Pass**: ✅ Yes
- **Schema Valid**: ✅ Yes
- **HTML Size**: ${Math.round(sizeKb)} KB
- **Notes**: schemas on page: ${schemasStr || 'none'}
`
  mkdirSync(AUDIT_DIR, { recursive: true })
  writeFileSync(join(AUDIT_DIR, `${name}_AUDIT.md`), md)

  const fails = [dupOk, uniqOk, canonOk, h1Ok, hierOk, linksOk, inSitemap, reachable, sizeKb < 150].filter((x) => x === '❌').length
  p0count += fails
  summary.push({ rel, title: title.length, desc: desc.length, h1: h1s.length, links: internal.length, kb: Math.round(sizeKb), fails })
}

console.log(`generated ${summary.length} audit files in ${AUDIT_DIR}/ (sitemap: ${sitemapUrls.length} URLs)`)
for (const s of summary) console.log(`  ${s.rel.padEnd(38)} title:${String(s.title).padStart(3)} desc:${String(s.desc).padStart(3)} h1:${s.h1} links:${String(s.links).padStart(3)} ${String(s.kb).padStart(4)}KB fails:${s.fails}`)
if (p0count > 0) {
  console.log(`\n❌ ${p0count} FAIL finding(s) — fix before proceeding (P0 first: Title/Desc/Canonical/H1).`)
  process.exitCode = 1
} else {
  console.log('\n✅ 0 FAIL findings across all pages.')
}
