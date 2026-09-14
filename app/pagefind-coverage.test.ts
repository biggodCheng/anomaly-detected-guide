// pagefind 索引覆盖守护:站内一旦存在任何 data-pagefind-body,pagefind 就只索引
// 带标记的页面 —— 无标记页面整页静默从站内搜索出局(审计 #35:首页/About/
// Contact/Privacy 曾整页搜不到,连那份被测试强制 ≥600 词的首页介绍也搜不到)。
// (main) 路由组由组 layout 的 <main> 统一标记;组外每个产出内容的页面必须自带。
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const APP_DIR = join(process.cwd(), 'app')
// (main) 组 28 个路由的标记唯一来源 —— 它被删时组内所有 page.tsx 静默出局,
// 而下方对组内文件的豁免让扫描版守护保持全绿(对抗审查实测:删掉后 pagefind
// 索引 39→5 页,测试仍绿)。必须单独钉死。
const MAIN_LAYOUT = join(APP_DIR, '[locale]', '(main)', 'layout.tsx')

function collectPages(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...collectPages(full))
    else if (entry === 'page.tsx') out.push(full)
  }
  return out
}

describe('pagefind 索引覆盖', () => {
  const pages = collectPages(APP_DIR)

  it('找到了页面文件(守护自身没失明)', () => {
    expect(pages.length, '页面收集为空,守护已失明').toBeGreaterThan(10)
  })

  it('(main) 组 layout 确实提供 data-pagefind-body(组内页面的唯一来源)', () => {
    const src = readFileSync(MAIN_LAYOUT, 'utf8')
    expect(src, '组 layout 丢失 data-pagefind-body → 组内全部页面整页静默出局').toContain('data-pagefind-body')
  })

  it('(main) 组外每个内容页都自带 data-pagefind-body', () => {
    for (const p of pages) {
      const rel = relative(process.cwd(), p).split('\\').join('/')
      // (main) 组内由组 layout 统一标记(上一条 it 钉死);app/page.tsx 是 dev 专用
      // redirect 壳,静态导出时被 promote 脚本的默认语言真首页覆盖,不产出可索引内容
      if (rel.startsWith('app/[locale]/(main)/') || rel === 'app/page.tsx') continue
      const src = readFileSync(p, 'utf8')
      expect(src, `${rel} 缺 data-pagefind-body → 整页从站内搜索静默出局`).toContain('data-pagefind-body')
    }
  })
})
