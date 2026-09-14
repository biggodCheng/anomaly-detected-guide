export function FAQItem({ item }: { item: { question: string; answer: string } }) {
  return (
    <details className="group py-3.5">
      <summary className="flex cursor-pointer items-center justify-between font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]">
        {item.question}
        <svg className="ml-2 h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </summary>
      <p className="mt-2.5 pr-6 text-sm leading-7 text-[var(--color-muted-foreground)]">{item.answer}</p>
    </details>
  )
}
