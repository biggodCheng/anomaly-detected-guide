import { setRequestLocale } from 'next-intl/server'
import { SidebarNav } from '@/components/layout/sidebar-nav'

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <SidebarNav />
      </aside>
      <main id="main-content" data-pagefind-body className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}
