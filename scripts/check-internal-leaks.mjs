// 内部内容泄漏扫描 —— 校验公开构建产物(out/)零内部术语/工程标记残留。
//   npm run check:leaks
// 已挂入 build 链末尾;任何命中都会列出 file:line 并 exit 1,阻断发布。
// (与 Cyberpunk2077 / Krillion Guide / Fields of Mistria / howtofish 四站同款;
//  各站 clone 后请按站内 docs/gsc-review-*、docs/audits/* 增补站内专用词。)
//
// 词表三类;新增内部术语时同步维护:
//   PHRASES_CI  内部流程短语(不区分大小写,子串匹配)
//   WORDS_CI    内部缩写(区分大小写,整词匹配)
//   MARKERS_CS  工程标记(区分大小写 —— 全大写形式才是开发痕迹)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = join(ROOT, 'out')

// ── 内部流程短语(不区分大小写,子串匹配) ──
const PHRASES_CI = [
  // SEO 复盘术语 —— 来自 docs/gsc-review-*, docs/audits/*
  'gsc demand',            // GSC 需求复盘(internal workflow)
  'expansion queue',       // 页面扩展队列
  'required fields',       // PRD 字段清单
  'content pipeline',      // 内容管线
  'demand score',          // 需求评分(GSC 复盘指标)
  'search intent',         // 搜索意图分析 —— 内部策略术语
  'keyword cluster',       // 关键词集群
  'word cluster',          // 词簇
  // 自动化/构建流程
  'daily dive automation', // 自动化流程名称
  'daily dive retry',      // 重试机制名称
  'evening refresh',       // 晚间刷新流程
  // GA4 内部分析
  'ga4 data',              // GA4 数据引用
  'analytics p4',          // 内部分析编号
  'analytics p0',          // 内部分析编号
  // 模板内部词(本仓库 docs/ 为内部 SOP,不得出现在公开页)
  '换皮',                  // 换皮 SOP —— 内部流程词
  '模板审计',              // docs/模板审计报告.md —— 内部文档名
]

// ── 内部缩写(区分大小写整词匹配:GSC 命中、gsc 不命中) ──
const WORDS_CI = [
  'GSC',      // Google Search Console —— 内部工具缩写
  'GA4',      // Google Analytics 4 —— 内部分析缩写
  'CTR',      // click-through rate —— 内部 SEO 指标(注意:不匹配 HTML 属性里的小写 ctr)
  'SERP',     // search engine results page —— 内部 SEO 术语
]

// ── 工程标记(区分大小写) ──
const MARKERS_CS = [
  'TODO',        // 开发待办
  'FIXME',       // 开发修复标记
  'PLACEHOLDER', // 占位符
  'HACK',        // 临时方案标记
  '{{',          // 未渲染的模板插值(Next.js/React 不使用)
  '{%',          // 模板引擎标签
]

if (!existsSync(OUT)) {
  console.error('✗ check:leaks 失败:out/ 不存在 —— 请先 npm run build。')
  process.exit(1)
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const RULES = [
  ...PHRASES_CI.map((p) => ({ re: new RegExp(escape(p), 'i'), label: p })),
  ...WORDS_CI.map((w) => ({ re: new RegExp(`\\b${escape(w)}\\b`), label: `\\b${w}\\b` })),
  ...MARKERS_CS.map((m) => ({ re: new RegExp(escape(m)), label: m })),
]

// 豁免:Next.js 框架注入(这些是合法的框架产物,不是内容泄漏)。
// 粒度是"片段级"而非"行级" —— 静态导出的 HTML 是单行 minified 产物,
// 行级豁免会让整页(含真实 DOM 内容)被一次命中整体跳过,守卫形同虚设。
//   - RSC payload(self.__next_f.push 起到行尾):内容与 DOM 同源,DOM 段已扫描
//   - 其余框架标记:仅从行内抹掉标记本身,前后内容继续参与匹配
const stripFramework = (line) => {
  const domPart = line.split('self.__next_f.push(')[0]
  return domPart
    .replace(/__NEXT_DATA__/g, '')
    .replace(/suppressHydrationWarning/g, '')
    .replace(/data-precedence="[^"]*"/g, '')
    .replace(/\$Sreact\.[a-z0-9]+/g, '')
}

const findings = []
const scanFile = (abs) => {
  let content
  try {
    content = readFileSync(abs, 'utf8')
  } catch {
    console.error(`  ⚠ 跳过非 UTF-8 文件: ${relative(OUT, abs)}`)
    return
  }
  const lines = content.split('\n')
  lines.forEach((rawLine, i) => {
    const line = stripFramework(rawLine)
    for (const { re, label } of RULES) {
      if (re.test(line)) {
        findings.push({
          file: relative(OUT, abs).replace(/\\/g, '/'),
          line: i + 1,
          token: label,
          text: line.trim().slice(0, 120),
        })
        break // 一行只报一个 token,避免刷屏
      }
    }
  })
}

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    if (statSync(abs).isDirectory()) walk(abs)
    else if (name.endsWith('.html')) scanFile(abs)
  }
}
walk(OUT)

if (findings.length > 0) {
  console.error(`✗ check:leaks 发现 ${findings.length} 处内部内容泄漏:\n`)
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.token}]`)
    console.error(`    ${f.text}`)
  }
  console.error(`\n处理方式:\n  - 属于正文内容 → 从 data/ messages/ 源头删除或改写\n  - 属于误报 → 调整词表并注明原因\n  - 属于框架注入 → 调整 stripFramework 剥离逻辑`)
  process.exit(1)
}
console.log('✓ check:leaks 通过 —— 公开产物零内部术语残留。')
