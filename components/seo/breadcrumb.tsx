import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { StructuredData, breadcrumbSchema } from './structured-data'
import { NAV_HUBS, type NavHubKey } from '@/config/navigation.config'
import { absoluteUrl, localePath } from '@/lib/site'

/**
 * 可见面包屑导航 + 同步的 BreadcrumbList JSON-LD（Google 推荐结构化数据
 * 与页面可见内容一致）。parents 是中间层 hub，leaf/path 是当前页；
 * 层级文案取 Breadcrumbs namespace（messages/{locale}.json）。
 */
export async function Breadcrumb({
  locale,
  parents = [],
  leaf,
  path,
}: {
  locale: string
  parents?: NavHubKey[]
  leaf: string
  path: string
}) {
  const t = await getTranslations({ locale, namespace: 'Breadcrumbs' })
  const trail = [
    { name: t('home'), path: '' },
    ...parents.map((p) => ({ name: t(p), path: NAV_HUBS[p] })),
    { name: leaf, path },
  ]
  return (
    <>
      <nav className="mb-5 text-sm text-[var(--color-muted-foreground)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((it, i) => (
            <li key={it.path} className="flex items-center">
              {i > 0 && <span className="mx-1.5 text-[var(--color-border)]">/</span>}
              {i < trail.length - 1 ? (
                <Link href={localePath(locale, it.path)} className="transition-colors duration-200 hover:text-[var(--color-primary)]">
                  {it.name}
                </Link>
              ) : (
                <span className="font-medium text-[var(--color-foreground)]" aria-current="page">{it.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <StructuredData
        schema={breadcrumbSchema(
          // absoluteUrl:默认语言(en)无前缀,此前 `${url}/${locale}` 会产出 /en 前缀的
          // 错误 JSON-LD URL(与 promote-default-locale 的根路径提升不一致)。
          trail.map((it) => ({ name: it.name, url: absoluteUrl(locale, it.path || '/') }))
        )}
      />
    </>
  )
}
