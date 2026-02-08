const prompts = [
  {
    label: 'Budget Review',
    text: 'Review my current budget breakdown and suggest any adjustments based on current market conditions for custom home builds in rural Texas.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Location Research',
    text: 'What are good areas to look for 5-20 acres of land within 1-2 hours of Houston, TX? Consider factors like internet availability, flood zones, and land costs.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: 'Timeline Check',
    text: 'Based on my current timeline and milestones, am I on track? What should I be focusing on right now?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Requirements Help',
    text: 'Given my must-have requirements (especially 10-gig networking and a home theater), what should I consider during the design phase? Any requirements I might be missing?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
]

export default function QuickPrompts({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="w-12 h-12 text-[var(--accent)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
      <h3 className="font-serif text-lg font-semibold mb-2">HomeForge AI Assistant</h3>
      <p className="text-sm text-[var(--text-muted)] text-center max-w-md mb-8">
        Ask me anything about your home build — budget advice, location research,
        timeline planning, or requirements review.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {prompts.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => onSelect(prompt.text)}
            className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent)]/30 transition-all text-left cursor-pointer"
          >
            <div className="text-[var(--accent)] mt-0.5">{prompt.icon}</div>
            <div>
              <p className="text-sm font-medium">{prompt.label}</p>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                {prompt.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
