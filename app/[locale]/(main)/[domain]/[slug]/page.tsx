import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CodexDetail, codexDetailMetadata } from '@/components/codex/codex-detail'
import { RegionDetail, regionDetailMetadata } from '@/components/regions/region-detail'
import { getDetailedCodex } from '@/data/codex'
import { getAllRegions } from '@/data/regions'
import { codexSlug, regionSlug } from '@/lib/domain-slugs'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    ...getDetailedCodex().map((e) => ({ domain: codexSlug(), slug: e.slug })),
    ...getAllRegions().map((r) => ({ domain: regionSlug(), slug: r.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; domain: string; slug: string }>
}): Promise<Metadata> {
  const { locale, domain, slug } = await params
  if (domain === codexSlug()) return codexDetailMetadata(locale, slug)
  if (domain === regionSlug()) return regionDetailMetadata(locale, slug)
  return {}
}

export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ locale: string; domain: string; slug: string }>
}) {
  const { locale, domain, slug } = await params
  if (domain === codexSlug()) return <CodexDetail locale={locale} slug={slug} />
  if (domain === regionSlug()) return <RegionDetail locale={locale} slug={slug} />
  notFound()
}
