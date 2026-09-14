// 域 slug 派生 —— 全站 URL 段的唯一出口。
// 页面/导航/注册表/sitemap 一律 import 这里的函数,禁止手写 '/monsters' 字面量。
import { siteConfig } from '@/config/site.config'

export const codexSlug = (): string => siteConfig.domains.codex.slug
export const milestoneSlug = (): string => siteConfig.domains.milestones.slug
export const regionSlug = (): string => siteConfig.domains.regions.slug
export const equipmentSlug = (): string => siteConfig.domains.equipment.slug
export const achievementSlug = (): string => siteConfig.domains.achievements.slug
export const economySlug = (): string => siteConfig.domains.economy.slug
export const multiplayerSlug = (): string => siteConfig.domains.multiplayer.slug

export const codexPath = (): string => `/${codexSlug()}`
export const milestonePath = (): string => `/${milestoneSlug()}`
export const regionPath = (): string => `/${regionSlug()}`
export const equipmentPath = (): string => `/${equipmentSlug()}`
export const achievementPath = (): string => `/${achievementSlug()}`
export const economyPath = (): string => `/${economySlug()}`
export const multiplayerPath = (): string => `/${multiplayerSlug()}`

export const codexEntryPath = (slug: string): string => `/${codexSlug()}/${slug}`
export const milestoneEntryPath = (slug: string): string => `/${milestoneSlug()}/${slug}`
export const regionEntryPath = (slug: string): string => `/${regionSlug()}/${slug}`
// equipment 无动态实体页,子页是固定结构(armor/potions 等)
export const equipmentSubPath = (sub: string): string => `/${equipmentSlug()}/${sub}`
// economy 子页:money/trading
export const economySubPath = (sub: string): string => `/${economySlug()}/${sub}`
// multiplayer 子页:co-op
export const multiplayerSubPath = (sub: string): string => `/${multiplayerSlug()}/${sub}`
