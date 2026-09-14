// 构建期提升默认语言到根路径 —— 静态导出下的"默认语言无前缀"实现。
//
// next build 产物是 /<locale>/* 双前缀结构(路由 app/[locale] 决定,无法改);
// 本脚本在 build 后、pagefind 前把默认语言页面提升到 out/ 根并删除其前缀目录。
// 页面内链已由 lib/site.ts 的 localePath() 按同一规则生成,提升后零死链 ——
// 末尾的指向 /<def>/ 的链接残留校验是漏网兜底(非零 exit 1)。
import { cpSync, readFileSync, readdirSync, rmSync, lstatSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'out')
const site = JSON.parse(
  await readFile(resolve(__dirname, '..', 'config', 'site.config.json'), 'utf8'),
)
const DEF = site.defaultLocale

// 1. 提升默认语言: 目录内容铺到根 + 首页 flat 文件复制为 index.html
//    (连同 RSC flight payload en.txt → index.txt,否则客户端导航到 / 时
//     prefetch /index.txt 404,控制台报错且退化为硬跳转)
cpSync(join(OUT, DEF), OUT, { recursive: true })
cpSync(join(OUT, `${DEF}.html`), join(OUT, 'index.html'))
cpSync(join(OUT, `${DEF}.txt`), join(OUT, 'index.txt'))
rmSync(join(OUT, DEF), { recursive: true, force: true })
rmSync(join(OUT, `${DEF}.html`), { force: true })
rmSync(join(OUT, `${DEF}.txt`), { force: true })

// 2. 校验: 产物 HTML 不得残留指向 /<def>/ 的内部链接
const needle = `href="/${DEF}/`
const bad = []
const scan = (dir) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    if (lstatSync(abs).isDirectory()) {
      scan(abs)
    } else if (name.endsWith('.html')) {
      const html = readFileSync(abs, 'utf8')
      if (html.includes(needle)) {
        bad.push(relative(OUT, abs).replace(/\\/g, '/'))
      }
    }
  }
}
scan(OUT)

if (bad.length > 0) {
  console.error(`✗ promote 校验失败 —— ${bad.length} 个文件仍含 "${needle}" 内链:\n`)
  for (const f of bad) console.error(`  ${f}`)
  console.error(`\n这些页面仍在用 /${DEF}/ 前缀拼链接,应改用 lib/site.ts 的 localePath()。`)
  process.exit(1)
}
console.log(`✓ promote: 默认语言(${DEF})已提升到 out/ 根;产物零 "/${DEF}/" 内链残留。`)
