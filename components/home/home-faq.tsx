import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { getFaqData } from '@/data/faq'
import { FAQItem } from '@/components/faq/faq-item'
import { localePath } from '@/lib/site'

export async function HomeFaq() {
  const locale = await getLocale()
  const t = await getTranslations('Home')
  const items = getFaqData().slice(0, 6)
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl font-bold tracking-tight">{t('faqTitle')}</h2>
        <Link href={localePath(locale, '/faq')} className="text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80">{t('faqMore')}</Link>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden">
        <div className="divide-y divide-[var(--color-border)] px-5">
          {items.map((item, i) => (
            <FAQItem key={i} item={{ question: item.q, answer: item.a }} />
          ))}
        </div>
      </div>
    </section>
  )
}
