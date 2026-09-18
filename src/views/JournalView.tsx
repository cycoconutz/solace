import { useState, type FormEvent } from 'react'
import {
  MOODS,
  addEntry,
  formatWhen,
  loadEntries,
  removeEntry,
  streakCount,
  type JournalEntry,
} from '../lib/journal'

export default function JournalView() {
  const [moodId, setMoodId] = useState(MOODS[1].id)
  const [text, setText] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadEntries())
  const [saved, setSaved] = useState(false)

  const streak = streakCount(entries)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim().length < 3) return
    setEntries(addEntry(moodId, text, gratitude))
    setText('')
    setGratitude('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0]

  return (
    <div className="view">
      <h1 className="section-title">Reflect</h1>
      <p className="section-sub">Let the day set down its bags. Nothing here leaves your device.</p>

      <div className="journal-layout">
        <form className="glass journal-panel" onSubmit={submit}>
          <div className="panel-head">
            <h2 className="panel-title">How are you feeling?</h2>
          </div>

          <div className="mood-row" role="radiogroup" aria-label="Mood">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={moodId === m.id}
                className={`mood-chip ${moodId === m.id ? 'selected' : ''}`}
                style={{ ['--chip' as string]: m.color }}
                onClick={() => setMoodId(m.id)}
              >
                <span aria-hidden="true">{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>

          <label className="field-label" htmlFor="entry-text">
            What's on your mind?
          </label>
          <textarea
            id="entry-text"
            className="glass-input"
            rows={5}
            placeholder="Write a few honest lines, no matter how small…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <label className="field-label" htmlFor="entry-gratitude" style={{ marginTop: 16 }}>
            A small thing you're grateful for
          </label>
          <input
            id="entry-gratitude"
            type="text"
            className="glass-input"
            style={{ resize: 'none' }}
            placeholder="Warm sun, quiet coffee, a good song…"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
          />

          <div className="journal-actions">
            <button type="submit" className="btn btn-primary" disabled={text.trim().length < 3}>
              Save {mood.emoji}
            </button>
            <span className={`saved-hint ${saved ? 'show' : ''}`}>Saved</span>
          </div>
        </form>

        <aside className="streak-card glass">
          <div className="streak-num">{streak}</div>
          <p className="streak-label">
            {streak === 1 ? 'day' : 'days'} reflecting in a row
          </p>
          <p className="streak-label" style={{ marginTop: 8, opacity: 0.7 }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </p>
        </aside>
      </div>

      <h2 className="panel-title" style={{ margin: '34px 0 18px' }}>
        Your soft notes
      </h2>

      {entries.length === 0 ? (
        <div className="glass empty">
          No notes yet. Your first one is waiting right above 🌷
        </div>
      ) : (
        <ul className="entries" aria-label="Journal entries">
          {entries.map((entry) => {
            const m = MOODS.find((x) => x.id === entry.moodId) ?? MOODS[0]
            return (
              <li key={entry.id} className="entry">
                <div className="entry-head">
                  <span className="entry-mood" style={{ ['--chip' as string]: m.color }} aria-hidden="true">
                    {m.emoji}
                  </span>
                  <span className="entry-when">{formatWhen(entry.createdAt)}</span>
                </div>
                <p className="entry-text">{entry.text}</p>
                {entry.gratitude && (
                  <p className="entry-gratitude">grateful for {entry.gratitude} 💛</p>
                )}
                <button
                  type="button"
                  className="entry-delete"
                  aria-label="Delete entry"
                  onClick={() => setEntries(removeEntry(entry.id))}
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}