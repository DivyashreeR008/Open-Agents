import { Users, Handshake, Trophy, MessageSquare, Star } from 'lucide-react'

export default function AboutCommunity() {
  return (
    <section aria-labelledby="about-community-title" className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <Users className="text-zinc-600 dark:text-zinc-300" size={22} />
        <h2
          id="about-community-title"
          className="text-2xl sm:text-3xl font-bold dark:text-text-primary text-gray-900 tracking-tight"
        >
          Community & Contributor Appreciation
        </h2>
      </div>

      <p className="text-sm dark:text-text-secondary text-gray-600 mb-8 max-w-3xl leading-relaxed">
        OpenAgents thrives on collective intelligence. Every contributor who submits an agent, fixes
        a typo, optimizes CSS, or reviews code is an essential builder of this platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400">
          <div className="p-3 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 w-fit mb-4">
            <Handshake size={22} />
          </div>
          <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-2">
            Contributor First
          </h3>
          <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
            We value your time. Our contribution guide is designed to get your first PR merged in
            under 15 minutes with clear feedback and zero bureaucracy.
          </p>
        </div>

        <div className="panel p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400">
          <div className="p-3 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 w-fit mb-4">
            <Trophy size={22} />
          </div>
          <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-2">
            Hall of Fame
          </h3>
          <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
            All contributors are permanently celebrated in our repository's Hall of Fame. Your name
            and agent contributions leave a lasting mark.
          </p>
        </div>

        <div className="panel p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400">
          <div className="p-3 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 w-fit mb-4">
            <MessageSquare size={22} />
          </div>
          <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-2">
            Open Collaboration
          </h3>
          <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
            Have an idea for a new agent category or workflow feature? Join GitHub Discussions to
            brainstorm with maintainers and fellow developers.
          </p>
        </div>
      </div>
    </section>
  )
}
