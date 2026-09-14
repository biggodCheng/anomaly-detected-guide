import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CodexHub } from '@/components/codex/codex-hub'
import { MilestonesHub } from '@/components/milestones/milestones-hub'
import { RegionsHub } from '@/components/regions/regions-hub'
import { AchievementsHub } from '@/components/achievements/achievements-hub'
import { mechanicsHub } from '@/data/equipment'
import { guideHub } from '@/data/milestones'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'
import { codexSlug, codexPath, milestoneSlug, milestonePath, regionSlug, regionPath, equipmentSlug, equipmentPath, achievementSlug, achievementPath, economySlug, economyPath, multiplayerSlug, multiplayerPath } from '@/lib/domain-slugs'

// 只导出枚举的域;其余一级路径 404
export const dynamicParams = false

export function generateStaticParams() {
  return [
    { domain: codexSlug() },
    { domain: milestoneSlug() },
    { domain: regionSlug() },
    { domain: equipmentSlug() },
    { domain: achievementSlug() },
    { domain: economySlug() },
    { domain: multiplayerSlug() },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; domain: string }>
}): Promise<Metadata> {
  const { locale, domain } = await params
  const isCodex = domain === codexSlug()
  const isMilestones = domain === milestoneSlug()
  const isRegions = domain === regionSlug()
  const isEquipment = domain === equipmentSlug()
  const isAchievements = domain === achievementSlug()
  const isEconomy = domain === economySlug()
  const isMultiplayer = domain === multiplayerSlug()
  if (!isCodex && !isMilestones && !isRegions && !isEquipment && !isAchievements && !isEconomy && !isMultiplayer) return {}

  if (isCodex || isMilestones) {
    // 两域消息同形:namespace 根 + index.metaTitle/metaDescription
    // (Codex.index.* / Milestones.index.*)
    const t = await getTranslations({ locale, namespace: isCodex ? 'Codex' : 'Milestones' })
    const title = t('index.metaTitle')
    const description = t('index.metaDescription')
    const path = isCodex ? codexPath() : milestonePath()
    return {
      alternates: alternatesFor(locale, path),
      title,
      description,
      openGraph: buildOpenGraph({ locale, path, title, description }),
      twitter: buildTwitterCard({ title, description }),
    }
  }

  if (isRegions || isAchievements) {
    const namespace = isRegions ? 'Regions.index' : 'Achievements.index'
    const t = await getTranslations({ locale, namespace })
    const title = t('metaTitle')
    const description = t('metaDescription')
    const path = isRegions ? regionPath() : achievementPath()
    return {
      alternates: alternatesFor(locale, path),
      title,
      description,
      openGraph: buildOpenGraph({ locale, path, title, description }),
      twitter: buildTwitterCard({ title, description }),
    }
  }

  if (isEquipment) return topicMetadata(locale, equipmentPath(), 'Equipment')
  if (isEconomy) return topicMetadata(locale, economyPath(), 'Economy')
  if (isMultiplayer) return topicMetadata(locale, multiplayerPath(), 'Multiplayer')
  return {}
}

export default async function DomainHubPage({
  params,
}: {
  params: Promise<{ locale: string; domain: string }>
}) {
  const { locale, domain } = await params
  if (domain === codexSlug()) return <CodexHub locale={locale} />
  if (domain === milestoneSlug()) return <MilestonesHub locale={locale} />
  if (domain === regionSlug()) return <RegionsHub locale={locale} />
  if (domain === equipmentSlug()) {
    return (
      <TopicPage
        locale={locale}
        path={equipmentPath()}
        namespace="Equipment"
        icon="⚔️"
        data={mechanicsHub}
        showBreadcrumb
      />
    )
  }
  if (domain === achievementSlug()) return <AchievementsHub locale={locale} />
  if (domain === economySlug()) {
    return (
      <TopicPage
        locale={locale}
        path={economyPath()}
        namespace="Economy"
        icon="💰"
        data={mechanicsHub}
        showBreadcrumb
      />
    )
  }
  if (domain === multiplayerSlug()) {
    return (
      <TopicPage
        locale={locale}
        path={multiplayerPath()}
        namespace="Multiplayer"
        icon="👥"
        data={guideHub}
        showBreadcrumb
      />
    )
  }
  notFound()
}
