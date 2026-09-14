import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { popularQuestions } from '@/data/homepage'
import { localePath } from '@/lib/site'

export async function PopularQuestions() {
  const locale = await getLocale()
  const t = await getTranslations('Home')
  return (
    <section>
      <h2 className="section-title mb-4 text-xl font-bold tracking-tight">{t('popularQuestionsTitle')}</h2>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {popularQuestions.map((q) => (
          <li key={q.href}>
            <Link
              href={localePath(locale, q.href)}
              className="ember-glow block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-sm shadow-sm"
            >
              {t(q.questionKey)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
