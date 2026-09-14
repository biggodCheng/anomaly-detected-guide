import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
})

export type Locale = (typeof routing.locales)[number]

// 每语言元数据。Record<Locale,…>:locales 扩展时 TS 编译报错,强制补齐新语言映射。
export const localeMeta: Record<Locale, { og: string; name: string }> = {
  en: { og: 'en_US', name: 'English' },
}

// 允许注入 client bundle 的 messages namespace(其余仅 server 消费,注入是死重)。
// 单一事实源:layout.tsx 注入与 messages.test.ts 守护测试共用此常量。
// 纪律:新增 client 组件用了新 namespace 时必须同步,messages 守护测试会强制。
export const CLIENT_NAMESPACES = ['Header', 'Sidebar', 'Search', 'Theme', 'Codex', 'Achievements', 'Error'] as const
