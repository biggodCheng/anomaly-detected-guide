// 本地静态服务:支持 cleanUrls(/x → /x.html),供 Lighthouse/交互回归对 out/ 产物测试。
// 用法: node scripts/serve-out.mjs [port]  (默认 4173)
// MIME 需与生产(Vercel)对齐——尤其 .avif:image/avif。错误的 content-type 会污染
// Lighthouse 对 <picture type="image/avif"> + preload 匹配行为的测量。
import { createServer } from 'node:http'
import { readFile, readFileSync, statSync } from 'node:fs'
import { join, extname, normalize, sep } from 'node:path'

const root = join(process.cwd(), 'out')
const port = Number(process.argv[2]) || 4173
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm' }
const isFile = (p) => { try { return statSync(p).isFile() } catch { return false } }

const cspLite = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://i.ytimg.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-src https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'self'; upgrade-insecure-requests"
const baseHeaders = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'content-security-policy': cspLite,
}
createServer((req, res) => {
  let path = req.url.split('?')[0].split('#')[0]
  if (path.endsWith('/')) path += 'index.html'
  let file
  try {
    file = join(root, decodeURIComponent(path))
  } catch {
    res.writeHead(400); res.end('400'); return // 畸形百分号编码(decodeURIComponent 抛 URIError)
  }
  // 目录穿越防护:解析后必须仍落在 root 内
  if (!normalize(file + sep).startsWith(normalize(root + sep))) { res.writeHead(403); res.end('403'); return }
  // 解析顺序:精确文件 → 目录 index.html → path+'.html'(cleanUrls,含与目录同名的情况如 /fish)
  const candidates = (() => {
    try {
      return statSync(file).isDirectory() ? [join(file, 'index.html'), file + '.html'] : [file]
    } catch {
      return [file, file + '.html']
    }
  })().filter(isFile)
  if (candidates.length === 0) {
    // 与生产(Vercel)对齐:404 应答回退到自定义 404 页而非裸文本
    const notFound = join(root, '404.html')
    if (isFile(notFound)) {
      res.writeHead(404, { ...baseHeaders, 'content-type': 'text/html' }); res.end(readFileSync(notFound)); return
    }
    res.writeHead(404); res.end('404'); return
  }
  readFile(candidates[0], (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return }
    res.writeHead(200, { ...baseHeaders, 'content-type': mime[extname(candidates[0])] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}`))
