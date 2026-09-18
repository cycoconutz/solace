import { useState } from 'react'
import BreatheView from './views/BreatheView'
import HomeView from './views/HomeView'
import JournalView from './views/JournalView'

type View = 'home' | 'breathe' | 'journal'

export default function App() {
  const [view, setView] = useState<View>('home')

  return (
    <div className="app">
      <header className="header">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setView('home')
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            🌷
          </span>
          <span>
            solace<small>breathe &amp; reflect</small>
          </span>
        </a>
        {view !== 'home' && (
          <button type="button" className="back-link" onClick={() => setView('home')}>
            ← Home
          </button>
        )}
      </header>

      {view === 'home' && (
        <HomeView onBreathe={() => setView('breathe')} onJournal={() => setView('journal')} />
      )}
      {view === 'breathe' && <BreatheView onHome={() => setView('home')} />}
      {view === 'journal' && <JournalView />}
    </div>
  )
}