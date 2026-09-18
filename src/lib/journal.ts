export interface Mood {
  id: string
  emoji: string
  label: string
  color: string
}

export const MOODS: Mood[] = [
  { id: 'serene', emoji: '🌿', label: 'Serene', color: '#c3eedd' },
  { id: 'good', emoji: '😊', label: 'Good', color: '#c8e0ff' },
  { id: 'steady', emoji: '😌', label: 'Steady', color: '#d6c8ff' },
  { id: 'low', emoji: '😔', label: 'Low', color: '#ffdcc7' },
  { id: 'heavy', emoji: '😢', label: 'Heavy', color: '#ffd0dd' },
]

export interface JournalEntry {
  id: string
  moodId: string
  text: string
  gratitude: string
  createdAt: string
}

const STORAGE_KEY = 'solace:entries'

export function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as JournalEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    )
  } catch {
    return []
  }
}

function persist(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* storage unavailable — app still works in-memory */
  }
}

export function addEntry(
  moodId: string,
  text: string,
  gratitude: string,
): JournalEntry[] {
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    moodId,
    text: text.trim(),
    gratitude: gratitude.trim(),
    createdAt: new Date().toISOString(),
  }
  const next = [entry, ...loadEntries()]
  persist(next)
  return next
}

export function removeEntry(id: string): JournalEntry[] {
  const next = loadEntries().filter((e) => e.id !== id)
  persist(next)
  return next
}

function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function streakCount(entries: JournalEntry[]): number {
  const days = new Set(entries.map((e) => dateKey(new Date(e.createdAt))))
  if (days.size === 0) return 0

  let streak = 0
  let cursor = new Date()
  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (days.has(dateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function formatWhen(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }) + ` · ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
}