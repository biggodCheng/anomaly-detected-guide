// 内容日期守护 + topicDates ↔ 实际路由的双向镜像。
// 未来日期的代价:Article schema 的 datePublished 晚于当天,搜索引擎视为
// 定时发布占位;页头 "Last updated" 行对用户说谎 —— 模板占位数据统一用历史日期。
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { topicDates } from './content-dates'
import { enGuides } from './guides/en'
import { formatHumanDate } from '@/lib/date'

// 基准时钟取 UTC 明日(容差一天):纯本地日期在西侧 runner(CI=UTC)上会把
// 东八区 0-8 点写的当天 modified 打红;纯 UTC 日期又反向漏/误红。
// +1 天对东西两侧都容忍一个日历偏移,仍拦截 ≥2 天的真正未来日期。
const todayIso = new Date(Date.now() + 864e5).toISOString().slice(0, 10)

function collectDates(): { where: string; iso: string }[] {
  const out: { where: string; iso: string }[] = []
  const push = (where: string, iso?: string) => {
    if (iso) out.push({ where, iso })
  }
  for (const [p, d] of Object.entries(topicDates)) {
    push(`topicDates[${p}].published`, d.published)
    push(`topicDates[${p}].modified`, d.modified)
  }
  for (const g of enGuides) {
    push(`guides/${g.slug}.published`, g.published)
    push(`guides/${g.slug}.lastUpdated`, g.lastUpdated)
  }
  // ANOMAL: codex entries (cases), milestones (timeline events), and regions (eras) don't have date fields
  // in the new structure. They are timeless puzzle content, not dated guides.
  // Skip date collection for these domains as they don't have published/modified dates.
  return out
}

describe('content dates', () => {
  it('日期均为 YYYY-MM-DD 形态(字典序比较的前提)', () => {
    for (const { where, iso } of collectDates()) {
      expect(iso, where).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
  it('全站内容日期均不晚于今天(新增内容写了未来日期在此红)', () => {
    const dates = collectDates()
    // 守护自身没失明:模板当前数据量下收集到的日期远超该阈值
    expect(dates.length).toBeGreaterThan(20)
    for (const { where, iso } of dates) {
      expect(iso <= todayIso, `${where}=${iso} 晚于今天 ${todayIso}`).toBe(true)
    }
  })
})

// --- 散文日期("August 12, 2026" 形态)同一纪律 ---
// 上面的守护只收结构化 published/modified 字段;正文散文里的日期漏改时
// (实测:发售日改了 llms.txt 漏改 /game 页正文与首页文案)页面与爬虫读到
// 未来日期,结构化守护全绿。内容源统一扫描;docs/ 历史记述不含在内。
const PROSE_RE =
  /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})/g
// 月名 → 月号从 formatHumanDate 派生(单一来源,月名映射错了 date.test 同时红)
const monthIso = new Map(
  Array.from({ length: 12 }, (_, i) => {
    const name = formatHumanDate(`2026-${String(i + 1).padStart(2, '0')}-01`).split(' ')[0]
    return [name, String(i + 1).padStart(2, '0')] as const
  }),
)
function collectContentFiles(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) collectContentFiles(full, out)
    else if ((name.endsWith('.ts') && !name.endsWith('.test.ts')) || name.endsWith('.json')) out.push(full)
  }
}

describe('prose dates(散文明文日期不许是未来)', () => {
  const files: string[] = [join(__dirname, '..', 'public', 'llms.txt')]
  collectContentFiles(join(__dirname, '..', 'data'), files)
  collectContentFiles(join(__dirname, '..', 'messages'), files)

  const hits: { file: string; prose: string; iso: string }[] = []
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(PROSE_RE)) {
      hits.push({ file: f, prose: m[0], iso: `${m[3]}-${monthIso.get(m[1])}-${m[2].padStart(2, '0')}` })
    }
  }

  it('扫描到了散文日期(守护自身没失明)', () => {
    expect(hits.length).toBeGreaterThanOrEqual(2)
  })
  it('散文日期均不晚于今天', () => {
    for (const h of hits) {
      expect(h.iso <= todayIso, `${h.file}: "${h.prose}" 是未来日期`).toBe(true)
    }
  })
})

// --- topicDates ↔ TopicPage 渲染点双向镜像 ---
// 新增 TopicPage 页面忘了登记 topicDates:页面拿到 undefined 日期;
// 裁剪页面后 topicDates 残留死 key:无人消费、静默漂移。两侧都拦。
// (achievements 域无日期字段、guides 域自带日期,均不在 topicDates 范围)
//
// 域可配置化后,部分页面使用动态路径函数(如 equipmentSubPath('armor'))
// 测试需要同时扫描字面量路径和动态路径函数调用
import { equipmentPath, equipmentSubPath, regionSlug, economyPath, economySubPath, multiplayerPath, multiplayerSubPath } from '@/lib/domain-slugs'

function collectTopicPagePaths(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) collectTopicPagePaths(full, out)
    else if (/\.(tsx|ts)$/.test(name) && !name.includes('.test.')) {
      const src = readFileSync(full, 'utf8')
      // 扫描字面量路径: path="/equipment/armor"
      for (const m of src.matchAll(/<TopicPage[\s\S]*?\bpath="([^"]+)"/g)) out.push(m[1])
      // 扫描动态路径函数调用: path={equipmentSubPath('armor')} 或 path={`${regionPath()}/region-comparison`}
      // 支持匹配包含 ${...} 的模板字符串
      for (const m of src.matchAll(/\bpath=\{(`[^`]*`|[^}]+)\}/g)) {
        const expr = m[1]
        // 尝试解析函数调用
        if (expr.includes('equipmentSubPath(')) {
          const match = expr.match(/equipmentSubPath\(['"]([^'"]+)['"]\)/)
          if (match) out.push(equipmentSubPath(match[1]))
        } else if (expr.includes('equipmentPath()')) {
          out.push(equipmentPath())
        } else if (expr.includes('regionPath()') && expr.includes('region-comparison')) {
          // 模板字符串: `${regionPath()}/region-comparison`
          out.push(`/${regionSlug()}/region-comparison`)
        } else if (expr.includes('economySubPath(')) {
          const match = expr.match(/economySubPath\(['"]([^'"]+)['"]\)/)
          if (match) out.push(economySubPath(match[1]))
        } else if (expr.includes('economyPath()')) {
          out.push(economyPath())
        } else if (expr.includes('multiplayerSubPath(')) {
          const match = expr.match(/multiplayerSubPath\(['"]([^'"]+)['"]\)/)
          if (match) out.push(multiplayerSubPath(match[1]))
        } else if (expr.includes('multiplayerPath()')) {
          out.push(multiplayerPath())
        }
      }
    }
  }
}

describe('topicDates ↔ TopicPage routes', () => {
  const paths: string[] = []
  collectTopicPagePaths(join(__dirname, '..', 'app'), paths)
  const rendered = new Set(paths)
  const registered = new Set(Object.keys(topicDates))

  it('扫描到了 TopicPage 使用点(守护自身没失明)', () => {
    expect(rendered.size).toBeGreaterThanOrEqual(8)
  })
  it('每个 TopicPage 的 path 都登记在 topicDates', () => {
    const missing = [...rendered].filter((p) => !registered.has(p))
    expect(missing.join(', '), 'topicDates 缺登记').toBe('')
  })
  it('topicDates 的每个 key 都有真实 TopicPage 消费(死 key 残留)', () => {
    const dead = [...registered].filter((p) => !rendered.has(p))
    expect(dead.join(', '), 'topicDates 死 key').toBe('')
  })
})
