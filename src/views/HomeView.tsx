import { MOODS, loadEntries, streakCount } from '../lib/journal'

const QUOTES = [
  'Softness is a kind of strength.',
  'Breathe in the day, let the noise settle.',
  'Small steps still move you forward.',
  'Be gentle with the hours you are given.',
  'Still water runs deep — so do you.',
  'There is time. There is always time.',
]

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Night owl'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

interface HomeViewProps {
  onBreathe: () => void
  onJournal: () => void
}

export default function HomeView({ onBreathe, onJournal }: HomeViewProps) {
  const entries = loadEntries()
  const streak = streakCount(entries)
  const quote = QUOTES[dayOfYear() % QUOTES.length]

  return (
    <div className="view">
      <div className="home-greeting">
        <p className="eyebrow">{greeting()} ✦</p>
        <h1 className="home-title">take a soft moment</h1>
        <p className="home-quote">“{quote}”</p>
      </div>

      <div className="home-cards">
        <button type="button" className="home-card" onClick={onBreathe}>
          <span className="card-icon">🌊</span>
          <h2>Breathe</h2>
          <p>A guided breathing session to settle your nerves and slow the clock.</p>
        </button>
        <button type="button" className="home-card" onClick={onJournal}>
          <span className="card-icon">🪶</span>
          <h2>Reflect</h2>
          <p>Whisper how you feel and what you're grateful for. Kept only on your device.</p>
        </button>
      </div>

      <div className="home-stats">
        <span>🔥 {streak}-day streak</span>
        <span>
          ✍️ {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
        <span>🧘 {MOODS.length} moods</span>
      </div>
    </div>
  )
}