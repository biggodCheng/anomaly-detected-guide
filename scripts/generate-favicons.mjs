// Favicon 全套生成脚本(换皮最后一步,产物入库)。
// 输入 1 张 ≥512×512 正方形源图(SVG/PNG/webp),派生浏览器约定全套 6 件:
//   favicon.ico(16/32/48 多尺寸) / favicon-16x16 / favicon-32x32 /
//   apple-touch-icon(180) / android-chrome-192 / android-chrome-512
// 文件名固定不带 siteId:/favicon.ico 等路径是浏览器/爬虫的默认请求约定,
// 缓存由 HTML <link> 与 ETag 控制,与 /images/* 的 siteId 失效机制无关
// (site.test.ts 守护 favicon.ico 只存在于 public/,勿放 app/)。
// ICO 容器手写:目录项 + 内嵌 PNG(Vista+ 标准),sharp 不直接输出 .ico。
// 无源图时可 --color "#rrggbb" 纯色占位(对应换皮流程的 fallback 档)。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const colorArg = readFlag('--color')
const outDir = resolve(__dirname, '..', readFlag('--out') ?? 'public')
const source = args.find((a) => !a.startsWith('--'))

function readFlag(name) {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}

// 源图:命令行路径,或 --color 纯色 SVG 占位
async function loadSource() {
  if (source) return readFile(resolve(process.cwd(), source))
  if (colorArg) {
    if (!/^#[0-9a-fA-F]{6}$/.test(colorArg)) throw new Error(`--color 需 6 位 hex,收到 ${colorArg}`)
    return Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="${colorArg}"/></svg>`,
    )
  }
  throw new Error('用法: node scripts/generate-favicons.mjs <源图.svg|.png> [--out public] [--color "#rrggbb"]')
}

// Vista+ ICO:6 字节头 + 每尺寸 16 字节目录项 + 顺序拼接的 PNG 数据
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)
  const dir = Buffer.alloc(16 * entries.length)
  let offset = header.length + dir.length
  const blobs = []
  entries.forEach(({ size, png }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o)
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1)
    dir.writeUInt8(0, o + 2) // palette
    dir.writeUInt8(0, o + 3)
    dir.writeUInt16LE(1, o + 4) // planes
    dir.writeUInt16LE(32, o + 6) // bpp
    dir.writeUInt32LE(png.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += png.length
    blobs.push(png)
  })
  return Buffer.concat([header, dir, ...blobs])
}

const src = await loadSource()

// 源图契约:正方形且 ≥512 —— 小图放大会糊,非方形裁切会切掉图形
const meta = await sharp(src).metadata()
if (meta.width !== meta.height || meta.width < 512) {
  throw new Error(`源图需为 ≥512×512 正方形,收到 ${meta.width}×${meta.height}`)
}

await mkdir(outDir, { recursive: true })
const png = (size) => sharp(src).resize(size, size).png().toBuffer()

const outputs = [
  ['favicon-16x16.png', await png(16)],
  ['favicon-32x32.png', await png(32)],
  ['apple-touch-icon.png', await png(180)],
  ['android-chrome-192x192.png', await png(192)],
  ['android-chrome-512x512.png', await png(512)],
  ['favicon.ico', buildIco([
    { size: 16, png: await png(16) },
    { size: 32, png: await png(32) },
    { size: 48, png: await png(48) },
  ])],
]

for (const [name, buf] of outputs) {
  await writeFile(resolve(outDir, name), buf)
  console.log(`✓ ${name} (${buf.length} bytes)`)
}
console.log(`done → ${outDir}`)
