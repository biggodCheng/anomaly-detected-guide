// milestones (timeline 域) + guide topic re-export。
import { timelineEvents, reconstructionGuide, crossEraThread } from './en'
import { guideHub, guideBeginner, guideCrossReference } from './guide'

export type { TimelineEvent, TimelineData } from './en'

export const getTimelineEvents = () => timelineEvents
export const getTimelineEvent = (order: number) =>
  timelineEvents.find((e) => e.order === order)
export const getEventsByEra = (era: string) =>
  timelineEvents.filter((e) => e.era === era)

export { reconstructionGuide, crossEraThread }
export { guideHub, guideBeginner, guideCrossReference }

