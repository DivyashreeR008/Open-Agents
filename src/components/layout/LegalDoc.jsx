import { ArrowLeft } from 'lucide-react'
import PageHeader from './PageHeader'

/**
 * LegalDoc — the reading layout shared by the Privacy Policy and Terms of
 * Service. A single measured column, hairline-divided sections and no
 * decorative chrome, because legal text should read like documentation.
 */
export default function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  footerTitle,
  footerBody,
}) {
  const handleBack = () => {
    if (typeof window !== 'undefined') window.history.back()
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl">
      <button
        onClick={handleBack}
        className="mb-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        Back
      </button>

      <PageHeader eyebrow={eyebrow} title={title} meta={updated} />

      <p className="text-[13px] leading-7 text-zinc-600 dark:text-text-secondary">{intro}</p>

      <div className="mt-8 divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-border dark:border-border">
        {sections.map(({ icon: Icon, title: sectionTitle, content }) => (
          <section key={sectionTitle} className="py-5">
            <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-text-primary">
              <Icon
                size={14}
                className="shrink-0 text-zinc-600 dark:text-zinc-300"
                aria-hidden="true"
              />
              {sectionTitle}
            </h2>
            <p className="mt-2 text-[13px] leading-7 text-zinc-600 dark:text-text-secondary">
              {content}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 border border-zinc-200 bg-zinc-50/60 p-4 dark:border-border dark:bg-surface-card">
        <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
          {footerTitle}
        </h2>
        <p className="mt-1.5 text-[13px] leading-7 text-zinc-600 dark:text-text-secondary">
          {footerBody}
        </p>
      </div>
    </div>
  )
}
