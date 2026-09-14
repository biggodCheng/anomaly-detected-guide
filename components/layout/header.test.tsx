import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider, createTranslator } from 'next-intl'
import { Header } from './header'
import en from '@/messages/en.json'

// Header 是 server 组件:先 await 拿到 ui 再渲染;mock getTranslations 用 next-intl
// 自带的 createTranslator(真实取词语义,含 t.raw),避免测试依赖 request context。
vi.mock('next-intl/server', () => ({
  getTranslations: async ({ namespace }: { namespace: string }) =>
    // namespace 是 Messages key 联合,mock 入参是运行时 string——as never 收窄(与
    // layout.tsx 的 locale as never 同款),只影响测试类型不做运行时校验。
    createTranslator({ locale: 'en', messages: en, namespace: namespace as never }),
}))

// 树内 client 岛(NavTree 等)仍调 usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
}))

async function renderHeader() {
  const ui = await Header({ locale: 'en' })
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
  )
}

describe('Header', () => {
  it('renders nav links; hides the language switcher in single-locale builds', async () => {
    await renderHeader()
    expect(screen.getByRole('link', { name: 'Cases' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Eras' })).toBeInTheDocument()
    // 单语收缩:locales>1 才渲染语言下拉(组件交互断言见 language-switcher.test.tsx)
    expect(screen.queryByRole('button', { name: /English/ })).not.toBeInTheDocument()
    // 移动端导航抽屉的汉堡按钮(交互断言见 mobile-nav.test.tsx)
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument() // SearchTrigger aria-label
  })
})
