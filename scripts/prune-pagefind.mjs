// Static-export pagefind prune
//
// pagefind 默认输出 UI 组件包（pagefind-ui / component-ui / modular-ui /
// highlight，合计 ~370KB），但本站搜索用的是原生 /pagefind/pagefind.js API
// （见 components/search/load-pagefind.ts），产物 HTML 对 UI 包零引用——
// 纯死重。此脚本在 pagefind 构建后删除它们。保留 pagefind.js（API 入口）、
// pagefind-worker.js（pagefind.js 的运行时依赖）、wasm 与 index/ 索引分片。
import { rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGEFIND_DIR = resolve(__dirname, '..', 'out', 'pagefind')

const DEAD_UI_FILES = [
  'pagefind-ui.js',
  'pagefind-ui.css',
  'pagefind-component-ui.js',
  'pagefind-component-ui.css',
  'pagefind-modular-ui.js',
  'pagefind-modular-ui.css',
  'pagefind-highlight.js',
]

for (const f of DEAD_UI_FILES) {
  await rm(resolve(PAGEFIND_DIR, f), { force: true })
}
console.log(`pruned ${DEAD_UI_FILES.length} unused pagefind UI files`)
