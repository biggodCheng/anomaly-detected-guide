import { gameSteam } from '@/data/game'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return topicMetadata(locale, '/game/steam', 'Game.steam')
}

export default async function SteamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <TopicPage
      locale={locale}
      path="/game/steam"
      namespace="Game.steam"
      icon="🕹️"
      data={gameSteam}
    />
  )
}
