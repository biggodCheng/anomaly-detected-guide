import { gameSystemRequirements } from '@/data/game'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return topicMetadata(locale, '/game/system-requirements', 'Game.systemRequirements')
}

export default async function SystemRequirementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <TopicPage
      locale={locale}
      path="/game/system-requirements"
      namespace="Game.systemRequirements"
      icon="🖥️"
      data={gameSystemRequirements}
    />
  )
}
