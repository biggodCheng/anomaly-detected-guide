import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { SearchDialog } from './search-dialog'
import en from '@/messages/en.json'
import type { PagefindModule, PagefindResultData } from './load-pagefind'

const pagefind = vi.hoisted(() => ({
  init: vi.fn(async () => {}),
  destroy: vi.fn(async () => {}),
  preload: vi.fn(),
  search: vi.fn(),
}))

vi.mock('./load-pagefind', () => ({
  loadPagefind: vi.fn(() => Promise.resolve(pagefind as unknown as PagefindModule)),
}))

function results(...data: Array<Partial<PagefindResultData>>) {
  return {
    results: data.map((d, i) => ({
      data: async () => ({ id: d.id ?? String(i), url: d.url ?? '/', meta: d.meta ?? {}, excerpt: d.excerpt ?? '' }),
    })),
  }
}

function ui() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SearchDialog open onOpenChange={() => {}} />
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  pagefind.init.mockClear()
  pagefind.destroy.mockClear()
  pagefind.preload.mockClear()
  pagefind.search.mockReset()
})

describe('SearchDialog', () => {
  it('inits the pagefind index once on mount', async () => {
    pagefind.search.mockResolvedValue(results())
    ui()
    await waitFor(() => expect(pagefind.init).toHaveBeenCalledTimes(1))
  })

  it('does not load the pagefind index while closed (~225KB saved per pageview)', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <SearchDialog open={false} onOpenChange={() => {}} />
      </NextIntlClientProvider>
    )
    await new Promise((r) => setTimeout(r, 20))
    expect(pagefind.init).not.toHaveBeenCalled()
    expect(pagefind.destroy).not.toHaveBeenCalled()
  })

  it('searches pagefind and renders results with cleaned hrefs, dropping junk urls', async () => {
    const user = userEvent.setup()
    // 单语收缩后 otherLocalePrefixes 由 routing.locales 派生为空:/zh 前缀伪影不再被
    // 过滤,但真实 en-only 索引不可能含它,无需防御 —— 过滤分支改用非根相对路径的
    // 垃圾 URL 覆盖(r.url.startsWith('/') 守卫)。
    pagefind.search.mockResolvedValue(
      results(
        { id: '1', url: '/monsters/ember-bat.html', meta: { title: 'Ember Bat' } },
        { id: '2', url: 'attachments/junk.html', meta: { title: 'Junk' } }
      )
    )
    ui()
    const input = await screen.findByPlaceholderText(en.Search.placeholder)
    await user.type(input, 'ember')
    // 300ms 防抖:逐键输入只在停顿后触发一次 search(此前 mock 立即兑现掩盖了真实频次)
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledWith('ember'), { timeout: 1500 })
    expect(pagefind.search).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Ember Bat')).toBeInTheDocument()
    // pagefind 索引的是 .html 文件路径,生产环境是 clean URL —— 直出不剥后缀会 404
    expect(screen.getByRole('link', { name: 'Ember Bat' })).toHaveAttribute('href', '/monsters/ember-bat')
    expect(screen.queryByText('Junk')).not.toBeInTheDocument()
  })
})
