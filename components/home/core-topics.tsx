import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { coreTopics } from '@/data/homepage'
import { localePath } from '@/lib/site'

export async function CoreTopics({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return (
    <section>
      <h2 className="section-title mb-2 text-2xl font-bold tracking-tight">{t('coreHeading')}</h2>
      <p className="-mt-3 mb-5 text-sm text-[var(--color-muted-foreground)]">{t('coreSub')}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coreTopics.map((topic) => (
          <Link
            key={topic.href}
            href={localePath(locale, topic.href)}
            className="card-enhanced ember-glow group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
          >
            <h3 className="flex items-center gap-2.5 font-semibold">
              <span aria-hidden className="text-xl">{topic.emoji}</span>
              <span className="transition-colors group-hover:text-[var(--color-primary)]">{t(topic.titleKey)}</span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{t(topic.descKey)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
