import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageSwitcher } from './language-switcher'
import en from '@/messages/en.json'
import { routing, localeMeta, type Locale } from '@/i18n/routing'

// LanguageSwitcher 现为 client 岛:pathname 由 usePathname 自取
vi.mock('next/navigation', () => ({
  usePathname: () => '/guides',
}))

function ui(locale: Locale) {
  return render(
    <NextIntlClientProvider locale={locale} messages={en}>
      <LanguageSwitcher />
    </NextIntlClientProvider>
  )
}

/** base-ui 菜单由 floating-ui 的 pointer 事件序列打开(jsdom 需 polyfill + 完整序列) */
async function openMenu(locale: Locale) {
  const trigger = screen.getByRole('button', { name: new RegExp(localeMeta[locale].name) })
  fireEvent.pointerDown(trigger, { button: 0 })
  fireEvent.pointerUp(trigger, { button: 0 })
  fireEvent.click(trigger, { button: 0, detail: 1 })
}

describe('LanguageSwitcher(下拉)', () => {
  it('renders a trigger labelled with the current locale name', () => {
    ui('en')
    const trigger = screen.getByRole('button', { name: new RegExp(localeMeta.en.name) })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('lists every routing locale as a menu item, current one highlighted', async () => {
    ui('en')
    await openMenu('en')
    for (const l of routing.locales) {
      const item = screen.getByRole('menuitem', { name: new RegExp(localeMeta[l].name) })
      if (l === 'en') expect(item).toHaveAttribute('aria-current', 'true')
      else expect(item).not.toHaveAttribute('aria-current', 'true')
    }
  })
})
