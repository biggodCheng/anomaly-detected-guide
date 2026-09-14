// llms.txt 守护:它是给 AI 爬虫的全站导览(robots.ts 主动邀请抓取),
// 但内容手写 —— 域名/实体计数/品牌词与 config、数据域漂移时,AI 检索
// 会引用错误事实。可机械校验的部分在此钉死。
// (构建期从数据生成 llms.txt 记入审计报告后续项,当前先守护手写版)
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sitemapStaticPaths } from '@/config/navigation.config'
import { siteConfig } from '@/config/site.config'
import { guideSlugs } from '@/data/guides'
import { contentDomains } from '@/data/content-registry'
import { getAllCodex } from '@/data/codex'
import { getTimelineEvents } from '@/data/milestones'
import { getAllRegions } from '@/data/regions'
import { enAchievements } from '@/data/achievements/en'

const txt = readFileSync(resolve(process.cwd(), 'public', 'llms.txt'), 'utf8')

const validPaths = new Set([
  ...sitemapStaticPaths(),
  ...guideSlugs.map((s) => `/guides/${s}`),
  ...contentDomains.flatMap((d) => d.slugs().map((s) => `${d.pathPrefix}/${s}`)),
])

describe('public/llms.txt', () => {
  // 只认 https 会漏掉 http:// 形态的链接 —— 坏链整体隐身出校验范围
  const urls = [...txt.matchAll(/https?:\/\/[^\s)\]]+/g)].map((m) => m[0])

  it('提取到了 URL(守护自身没失明)', () => {
    expect(urls.length).toBeGreaterThan(10)
  })

  it('无裸 URL(每个 URL 都以 [锚文本](URL) markdown 链接形态出现)', () => {
    // 换皮整体替换 llms.txt 时守住格式契约:markdown 链接内 URL 集合
    // 应覆盖全量 URL 提取结果 —— 差集非空即混入了裸 URL
    const linked = new Set(
      [...txt.matchAll(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g)].map((m) => m[1]),
    )
    const naked = [...new Set(urls)].filter((u) => !linked.has(u))
    expect(naked, `裸 URL:${naked.join(' | ')}`).toEqual([])
  })

  it('全部 URL 都指向本站域名且为 https(origin 等值,协议降级在此红)', () => {
    // siteConfig.url 已被守护为无尾斜杠的 https 域名,origin 恰等于它本身
    for (const u of urls) expect(new URL(u).origin, u).toBe(siteConfig.url)
  })

  it('全部 URL 路径都是真实页面(与内链守护同一 validPaths 基准)', () => {
    for (const u of urls) {
      const p = new URL(u).pathname
      expect(validPaths, `${u} 的 ${p} 不是真实页面`).toContain(p)
    }
  })

  it('实体计数与数据域一致(加怪物漏改 llms.txt 则红)', () => {
    // ANOMAL: codex entries (cases), timeline events (not bosses), eras (not regions)
    const line = `Content: ${getAllCodex().length} cases, ${getTimelineEvents().length} timeline events, ${getAllRegions().length} eras, ${enAchievements.length} achievements`
    expect(txt.includes(line), `应包含准确的统计行:${line}`).toBe(true)
  })

  it('品牌事实跟随 config(换站漏改 llms.txt 则红)', () => {
    expect(txt).toContain(siteConfig.game.name)
    expect(txt).toContain(siteConfig.game.developer)
  })
})
