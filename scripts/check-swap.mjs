// 换站守护 —— 校验"core 目录零游戏品牌残留"。
//   npm run check:swap
// 换游戏完成后运行;任何命中都会列出 file:line 并 exit 1。
//
// 豁免区域:
//   - config/          —— 品牌身份的唯一合法存放地(待换)
//   - data/ messages/  —— 内容层,换站时整体替换
//   - public/          —— 图像资产
//   - docs/            —— 文档
// 扫描 token 来自 config/site.config.json(域名/站名)+ 游戏专有名词清单。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const site = JSON.parse(readFileSync(join(ROOT, 'config', 'site.config.json'), 'utf8'))
const siteConfigTs = readFileSync(join(ROOT, 'config', 'site.config.ts'), 'utf8')

// 品牌 token:域名、站名、游戏名(从 config 派生,防止换 config 后守护失焦)
// + site.config.ts 里 links/game 段的专有 URL。
const tokens = new Set([
  site.url.replace(/^https?:\/\//, ''),
  ...Object.values(site.siteName),
  site.ogImage.alt,
])
for (const m of siteConfigTs.matchAll(/https?:\/\/[^\s'"]+/g)) {
  const u = new URL(m[0])
  // 例外的通用域名(GitHub/Steam 首页等)不算品牌;站内域名在 config 有记录
  if (!['github.com', 'store.steampowered.com', 'example.com'].includes(u.hostname) || m[0].includes(site.url)) {
    tokens.add(u.hostname)
  }
}
// 游戏专有名词(config 声明 —— 换站时随 site.config.json 一起改,新游戏品牌词自动进扫描)
for (const t of site.brandTokens ?? []) tokens.add(t)

const SCAN_DIRS = ['app', 'components', 'lib', 'i18n']
const SKIP_FILES = new Set(['.DS_Store'])

const isExcluded = (abs) => {
  const rel = relative(ROOT, abs).replace(/\\/g, '/')
  if (rel.startsWith('data/') || rel.startsWith('messages/') || rel.startsWith('public/')) return true
  if (rel.startsWith('docs/') || rel.startsWith('config/') || rel.startsWith('scripts/')) return true
  return false
}

const findings = []
const scanFile = (abs) => {
  if (isExcluded(abs)) return
  const content = readFileSync(abs, 'utf8')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    const lower = line.toLowerCase()
    for (const token of tokens) {
      if (token && lower.includes(String(token).toLowerCase())) {
        findings.push({ file: relative(ROOT, abs).replace(/\\/g, '/'), line: i + 1, token, text: line.trim().slice(0, 100) })
        break
      }
    }
  })
}

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP_FILES.has(name)) continue
    const abs = join(dir, name)
    const st = statSync(abs)
    if (st.isDirectory()) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/')
      if (rel.startsWith('data') || rel.startsWith('messages') || rel.startsWith('public') || rel.startsWith('docs')) continue
      walk(abs)
    } else if (/\.(ts|tsx|mjs|cjs|json|css)$/.test(name)) {
      scanFile(abs)
    }
  }
}

for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d)
  if (existsSync(abs)) walk(abs)
}

// ogImage 资产存在性(换站常忘换图)
const ogPath = join(ROOT, 'public', site.ogImage.path.replace(/^\//, ''))
if (!existsSync(ogPath)) {
  findings.push({ file: 'public' + site.ogImage.path, line: 0, token: 'ogImage missing', text: `config 指向的 ${site.ogImage.path} 不存在` })
}

if (findings.length > 0) {
  console.error(`✗ check:swap 发现 ${findings.length} 处品牌残留(core 目录应零游戏痕迹):\n`)
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.token}]`)
    console.error(`    ${f.text}`)
  }
  console.error(`
处理方式:
  - 属于站点身份 → 移入 config/site.config.{json,ts}
  - 属于内容 → 移入 data/ 或 messages/`)
  process.exit(1)
}
console.log(`✓ check:swap 通过 —— core 目录(app/components/lib/i18n)零品牌残留;ogImage 存在。`)
