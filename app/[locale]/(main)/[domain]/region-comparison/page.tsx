import { notFound } from 'next/navigation'
import { eraComparison } from '@/data/regions'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'
import { regionSlug, regionPath } from '@/lib/domain-slugs'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ domain: regionSlug() }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; domain: string }> }) {
  const { locale, domain } = await params
  if (domain !== regionSlug()) return {}
  return topicMetadata(locale, `${regionPath()}/region-comparison`, 'Regions.comparison')
}

export default async function RegionComparisonPage({ params }: { params: Promise<{ locale: string; domain: string }> }) {
  const { locale, domain } = await params
  if (domain !== regionSlug()) notFound()
  return (
    <TopicPage
      locale={locale}
      path={`${regionPath()}/region-comparison`}
      namespace="Regions.comparison"
      icon="🗺️"
      data={eraComparison}
      hubKey="eras"
    />
  )
}
