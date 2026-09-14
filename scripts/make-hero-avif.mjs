// Hero 图 AVIF 阶梯生成脚本(一次性产物入库,换 hero 图时重跑)。
// 源与产物路径均从 config/site.config.json 派生(ogImage.path / heroImage / siteId),
// 换站改配置即可、无需改本脚本。
// 两条互不相同的阶梯(源图不同、构图不同,禁止互串):
// - game 页 <picture>:源 ogImage(og-<siteId>.jpg) → hero-<siteId>-<width>.avif
// - 首页 hero(真 LCP):源 heroImage(hero-<siteId>-header.webp) → hero-<siteId>-header-<width>.avif,
//   档位对齐首页 webp srcSet 的 768/1730 —— 1730 档 = 原图直转不缩放,
//   只到 1200 会让 2x DPR 桌面屏欠采样(比现状 1730w webp 更糊)。
// 产物文件名均携带 siteId —— 换站时必变,/images/* 的 immutable 一年缓存(vercel.json)
// 随之自动失效;lib/site.ts 的 heroAvif()/heroHeaderAvif() 与 config/site.test.ts 的
// 存在性守护使用同一派生规则。
// crf36 是视觉评估推荐区间(34-38)内体积最省的档。
// 注意:og jpg 现为有损压缩版——重跑本脚本会二次有损累积;换 hero 时优先从
// 未压缩原图(如 284KB 原始导出)生成,质量显著优于从 104KB jpg 再压。
import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { siteId, ogImage, heroImage } = JSON.parse(
  await readFile(resolve(__dirname, '..', 'config', 'site.config.json'), 'utf8'),
)

const encodeAvif = (src, out, width) => {
  const vf = width ? ['-vf', `scale=${width}:-2`] : []
  execFileSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-i', src, ...vf, '-c:v', 'libaom-av1', '-crf', '36', '-still-picture', '1', out],
    { stdio: 'inherit' },
  )
  console.log(out, `${Math.round(statSync(out).size / 1024)}KB`)
}

// 梯一:game 页 <picture>,源 ogImage;1200 档 = 原图直转(无上采样),不缩放
const OUT = [
  [`public/images/hero-${siteId}-768.avif`, 768],
  [`public/images/hero-${siteId}-1200.avif`, null],
]
// 梯二:首页 hero,源 heroImage webp(1730×909);命名与 webp 变体
// (hero-<siteId>-header-<w>.webp)同构,-header- 段与梯一产物名不冲突
const HERO_OUT = [
  [`public/images/hero-${siteId}-header-768.avif`, 768],
  [`public/images/hero-${siteId}-header-1730.avif`, null],
]

for (const [out, width] of OUT) encodeAvif(`public${ogImage.path}`, out, width)
for (const [out, width] of HERO_OUT) encodeAvif(`public${heroImage}`, out, width)
