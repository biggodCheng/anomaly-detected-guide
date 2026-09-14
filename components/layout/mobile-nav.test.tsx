import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { MobileNav } from './mobile-nav'
import en from '@/messages/en.json'

function ui() {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <MobileNav />
    </NextIntlClientProvider>
  )
}

/** base-ui 弹层由 pointer 事件序列打开(jsdom 需 polyfill + 完整序列) */
function openDrawer() {
  const trigger = screen.getByRole('button', { name: 'Menu' })
  fireEvent.pointerDown(trigger, { button: 0 })
  fireEvent.pointerUp(trigger, { button: 0 })
  fireEvent.click(trigger, { button: 0, detail: 1 })
}

describe('MobileNav', () => {
  it('renders a hamburger trigger visible only below lg (侧栏断点)', () => {
    ui()
    const trigger = screen.getByRole('button', { name: 'Menu' })
    expect(trigger.className).toContain('lg:hidden')
  })

  it('opens a drawer listing sidebar sections and representative links', async () => {
    ui()
    openDrawer()
    // 分节标题(Sidebar.sections 的 en 文案;标题文本不得与链接文本撞车,否则 getByText 多匹配)
    expect(screen.getByText(en.Sidebar.sections.explore)).toBeInTheDocument()
    expect(screen.getByText(en.Sidebar.sections.guides)).toBeInTheDocument()
    // 代表链接(en 无前缀形态)
    for (const href of ['/cases', '/eras', '/clues', '/guides', '/faq']) {
      expect(screen.getAllByRole('link').find((a) => a.getAttribute('href') === href)).toBeTruthy()
    }
  })

  it('closes the drawer after clicking a nav link', async () => {
    ui()
    openDrawer()
    const link = screen.getAllByRole('link').find((a) => a.getAttribute('href') === '/guides')
    expect(link).toBeTruthy()
    fireEvent.click(link!)
    // 受控 close 后 Portal 卸载,抽屉内容不再在文档中
    expect(screen.queryByText(en.Sidebar.sections.guides)).toBeNull()
  })
})
