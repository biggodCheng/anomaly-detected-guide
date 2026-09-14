import { gameControls } from '@/data/game'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return topicMetadata(locale, '/game/controls', 'Game.controls')
}

export default async function ControlsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <TopicPage
      locale={locale}
      path="/game/controls"
      namespace="Game.controls"
      icon="⌨️"
      data={gameControls}
    />
  )
}
