// Minimal shape of the pagefind module (generated at build time into /pagefind/).
export type PagefindResultData = {
  id: string
  url: string
  meta: { title?: string }
  excerpt: string
}

export type PagefindModule = {
  init: () => void | Promise<void>
  destroy: () => void | Promise<void>
  preload: (query: string) => void
  search: (
    query: string
  ) => Promise<{ results: Array<{ data: () => Promise<PagefindResultData> }> }>
}

// pagefind.js is an ES module generated at build time into /pagefind/ and
// served at the site root; it is absent in dev. `turbopackIgnore`(对齐
// webpackIgnore 语义)让构建器跳过解析这个动态 import,只有浏览器的原生
// import() 在运行时执行 —— 之前用 new Function 达成同样效果,但 Function
// 构造器属 CSP eval 类,会把严格 CSP 的 script-src 逼出 'unsafe-eval'。
export function loadPagefind(): Promise<PagefindModule> {
  // @ts-expect-error pagefind.js 是构建期产物,无类型声明 —— 运行时形状由上方 PagefindModule 手写
  return import(/* turbopackIgnore: true */ '/pagefind/pagefind.js') as Promise<PagefindModule>
}
