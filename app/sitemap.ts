import type { MetadataRoute } from 'next'
import { execSync } from 'node:child_process'
import { guideSlugs } from '@/data/guides'
import { contentDomains } from '@/data/content-registry'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site.config'
import { sitemapStaticPaths } from '@/config/navigation.config'
import { localePath } from '@/lib/site'

export const dynamic = 'force-static'

const BASE = siteConfig.url

function gitLastModified(paths: string[]): Date | undefined {
  try {
    const out = execSync(`git log -1 --format=%cI -- ${paths.join(' ')}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out ? new Date(out) : undefined
  } catch {
    return undefined
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales
  const staticPaths = sitemapStaticPaths()
  const guidePaths = guideSlugs.map((slug) => `/guides/${slug}`)

  // 从注册表动态发现所有实体路径
  const entityPaths: string[] = []
  for (const domain of contentDomains) {
    for (const slug of domain.slugs()) {
      entityPaths.push(`${domain.pathPrefix}/${slug}`)
    }
  }

  const lastMod = {
    static: gitLastModified(['messages/', 'config/', 'data/']),
    guides: gitLastModified(['data/guides/']),
    entities: gitLastModified(['data/']),
  }

  const entries: MetadataRoute.Sitemap = []
  for (const path of [...new Set([...staticPaths, ...guidePaths, ...entityPaths])]) {
    for (const locale of locales) {
      const isGuide = guidePaths.includes(path)
      const isEntity = entityPaths.includes(path)
      const lastModified = isGuide ? lastMod.guides : isEntity ? lastMod.entities : lastMod.static
      entries.push({
        url: `${BASE}${localePath(locale, path)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((l) => [l, `${BASE}${localePath(l, path)}`]),
            ['x-default', `${BASE}${localePath(routing.defaultLocale, path)}`],
          ]),
        },
      })
    }
  }
  return entries
}
