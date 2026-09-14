'use client'

import { useEffect, useState, type RefObject } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTranslations, useLocale } from 'next-intl'
import { loadPagefind, type PagefindModule } from './load-pagefind'
import { routing } from '@/i18n/routing'
import { localePath } from '@/lib/site'

type SearchResult = {
  id: string
  url: string
  meta: { title?: string }
  excerpt: string
}

/**
 * Sanitize pagefind excerpts: allow only <mark> tags (used by pagefind for
 * query-term highlighting), escape everything else. Pagefind excerpts are
 * generated from indexed HTML and may carry over tags from source content;
 * without sanitization, a crafted source could inject <img onerror=…> etc.
 */
function sanitizeExcerpt(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;mark&gt;/g, '<mark>')
    .replace(/&lt;\/mark&gt;/g, '</mark>')
}

export function SearchDialog({ open, onOpenChange, finalFocus }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const t = useTranslations('Search')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [pf, setPf] = useState<PagefindModule | null>(null)
  // 索引三态:loading(索引加载中)/ ready / error(dev 或加载失败)——
  // 不区分时故障会被伪装成 "No results" 误报
  const [indexState, setIndexState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    // Lazy-load: the pagefind bundle (~225KB js+wasm+index shard) is only fetched
    // when the dialog actually opens, not on every pageview. Re-running on locale
    // change while open keeps the per-<html lang> index rebuild below correct.
    if (!open) return
    let disposed = false
    setIndexState('loading')
    loadPagefind()
      .then(async (mod) => {
        // pagefind builds one index per <html lang> and locks onto it at first
        // init; the module is a singleton across client-side locale navigation.
        // Re-init per locale (destroy is a no-op before the first init) so every
        // locale resolves — otherwise the second locale searched stays empty.
        try {
          await mod.destroy()
        } catch {
          /* teardown failed — init below still re-reads the current lang */
        }
        try {
          await mod.init()
        } catch {
          /* index unavailable — keep pf null, search stays inert */
          if (!disposed) setIndexState('error')
          return
        }
        // fresh object ref so the search effect re-runs after the rebuild
        if (!disposed) {
          setPf({ ...mod })
          setIndexState('ready')
        }
      })
      .catch(() => {
        /* not available in dev */
        if (!disposed) setIndexState('error')
      })
    return () => {
      disposed = true
    }
  }, [open, locale])

  useEffect(() => {
    if (!pf || !query.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    // 300ms 防抖:IME 组合中间态与快速连击不再逐键触发 preload+search+
    // 最多 8 个并行 data() 分片请求(pagefind 官方 debouncedSearch 同款默认值)。
    const handle = setTimeout(() => {
      if (cancelled) return
      pf.preload(query)
      pf.search(query).then((res) => {
        if (cancelled) return
        Promise.all(res.results.slice(0, 8).map((r) => r.data())).then((datas) => {
          if (cancelled) return
          const prefix = localePath(locale, '/')
          const otherLocalePrefixes = routing.locales
            .filter((l) => l !== routing.defaultLocale)
            .map((l) => `/${l}/`)
          setResults(
            datas
              .map((d) => {
                // pagefind indexes file paths (.html); production serves clean URLs — strip the suffix so results don't 404.
                const url = d.url.replace(/\.html$/, '')
                return {
                  id: d.id,
                  url,
                  meta: d.meta ?? {},
                  excerpt: d.excerpt,
                }
              })
              // Locale guard: only results under the current locale can render, so a
              // click can never cross languages (also drops prefix-less junk like /404 — 无 body 标记不入索引).
              // 默认语言页面在根路径(无前缀) —— 排除其他语言前缀即为本语言集合。
              .filter((r) => {
                if (locale === routing.defaultLocale) {
                  return r.url.startsWith('/') && !otherLocalePrefixes.some((p) => r.url.startsWith(p))
                }
                return r.url === prefix || r.url.startsWith(`${prefix}/`)
              })
          )
        })
      })
      .catch(() => { /* index not ready / query failed — keep previous results */ })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [pf, query, locale])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('close')} finalFocus={finalFocus}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="sr-only">{t('placeholder')}</DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          aria-label={t('title')}
        />
        <ul className="max-h-80 space-y-1 overflow-auto">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.url}
                onClick={() => onOpenChange(false)}
                className="block rounded-lg p-2.5 transition-colors hover:bg-[var(--color-muted)]"
              >
                <div className="font-medium">{r.meta.title ?? r.url}</div>
                {r.excerpt && (
                  <div
                    className="mt-0.5 text-xs leading-5 text-[var(--color-muted-foreground)]"
                    dangerouslySetInnerHTML={{ __html: sanitizeExcerpt(r.excerpt) }}
                  />
                )}
              </Link>
            </li>
          ))}
          {query.trim() && indexState !== 'ready' && (
            <li className="py-6 text-center text-sm text-[var(--color-muted-foreground)]" role="status">
              {indexState === 'loading' ? t('indexLoading') : t('indexError')}
            </li>
          )}
          {query.trim() && indexState === 'ready' && results.length === 0 && (
            <li className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
              <div className="text-lg">🔍</div>
              <p className="mt-1">{t('empty')}</p>
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
