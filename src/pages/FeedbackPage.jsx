import { Bug, Lightbulb, MessageSquare, ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const GITHUB_ISSUES_URL = 'https://github.com/DivyashreeR008/Open-Agents/issues/new'
const SECURITY_REPORT_URL =
  'https://github.com/DivyashreeR008/Open-Agents/security/advisories/new'

const feedbackOptions = [
  {
    title: 'Report a bug',
    description: "Something isn't working as expected? Tell us what went wrong.",
    icon: Bug,
    url: `${GITHUB_ISSUES_URL}?template=bug_report.yml`,
  },
  {
    title: 'Suggest a feature',
    description: 'Have an idea that would make OpenAgents better? Share it.',
    icon: Lightbulb,
    url: `${GITHUB_ISSUES_URL}?template=feature_request.yml`,
  },
  {
    title: 'General feedback',
    description: 'Thoughts, experience, or anything else you want us to know.',
    icon: MessageSquare,
    url: `${GITHUB_ISSUES_URL}?template=general_feedback.yml`,
  },
]

export default function FeedbackPage() {
  useDocumentTitle('Feedback')

  return (
    <div className="animate-fade-in max-w-5xl">
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Feedback"
        description="Report an issue, suggest a feature, or share your experience."
      />

      <div className="grid gap-2.5 md:grid-cols-3">
        {feedbackOptions.map(({ title, description, icon: Icon, url }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-border dark:bg-surface-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
                <Icon size={16} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={15}
                className="text-zinc-300 transition-colors group-hover:text-black dark:group-hover:text-white dark:text-text-muted"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
              {title}
              <span className="sr-only"> (opens in new tab)</span>
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
              {description}
            </p>
          </a>
        ))}
      </div>

      <p className="mt-6 font-mono text-[11px] text-zinc-400 dark:text-text-muted">
        Opens GitHub so the maintainers can review and respond.
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-text-secondary">
        Found a security vulnerability? Do not post it publicly.{' '}
        <a
          href={SECURITY_REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-black dark:hover:text-white"
        >
          Report it privately
          <span className="sr-only"> (opens in new tab)</span>
        </a>
        .
      </p>
    </div>
  )
}
