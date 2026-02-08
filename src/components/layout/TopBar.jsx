import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/finances': 'Financial Planning',
  '/requirements': 'Requirements & Wishlist',
  '/timeline': 'Timeline & Milestones',
  '/locations': 'Location Research',
  '/chat': 'AI Assistant',
  '/settings': 'Settings',
}

export default function TopBar({ onMenuClick }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'HomeForge'

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--bg-card)]/80 backdrop-blur-sm border-b border-[var(--border-color)] flex items-center px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <h1 className="font-serif text-xl font-semibold">{title}</h1>
    </header>
  )
}
