import { useEffect, useMemo, useState } from 'react'

export type BreathPhase = 'inhale' | 'hold' | 'exhale'

export interface PhaseSpec {
  phase: BreathPhase
  duration: number
}

export interface BreathPattern {
  id: string
  name: string
  hint: string
  phases: PhaseSpec[]
}

export const PATTERNS: BreathPattern[] = [
  {
    id: 'box',
    name: 'Box',
    hint: '4 · 4 · 4 · 4',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold', duration: 4 },
      { phase: 'exhale', duration: 4 },
      { phase: 'hold', duration: 4 },
    ],
  },
  {
    id: '478',
    name: '4 · 7 · 8',
    hint: '4 · 7 · 8',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold', duration: 7 },
      { phase: 'exhale', duration: 8 },
    ],
  },
  {
    id: 'calm',
    name: 'Calm',
    hint: '5 · 5',
    phases: [
      { phase: 'inhale', duration: 5 },
      { phase: 'exhale', duration: 5 },
    ],
  },
]

export interface BreathInfo {
  phase: BreathPhase
  phaseDuration: number
  phaseElapsed: number
  phaseRemaining: number
  cycle: number
}

function phaseAt(
  elapsed: number,
  pattern: BreathPattern,
  cycles: number,
): BreathInfo {
  const unit = pattern.phases.reduce((sum, p) => sum + p.duration, 0)
  const cycle = Math.min(Math.floor(elapsed / unit) + 1, cycles)
  const pos = elapsed % unit

  let acc = 0
  let current: PhaseSpec = pattern.phases[pattern.phases.length - 1]
  for (const phase of pattern.phases) {
    if (pos < acc + phase.duration) {
      current = phase
      break
    }
    acc += phase.duration
  }
  const phaseElapsed = Math.min(pos - acc, current.duration)

  return {
    phase: current.phase,
    phaseDuration: current.duration,
    phaseElapsed,
    phaseRemaining: current.duration - phaseElapsed,
    cycle,
  }
}

export function useBreathing(patternId: string, cycles: number) {
  const pattern =
    PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0]
  const total = cycles * pattern.phases.reduce((s, p) => s + p.duration, 0)

  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const complete = elapsed >= total

  useEffect(() => {
    if (!running || complete) return
    const id = setInterval(
      () => setElapsed((e) => (e < total ? e + 1 : e)),
      1000,
    )
    return () => clearInterval(id)
  }, [running, complete, total])

  const info = useMemo(
    () => phaseAt(elapsed, pattern, cycles),
    [elapsed, pattern, cycles],
  )

  const start = () => {
    setElapsed(0)
    setRunning(true)
  }
  const pause = () => setRunning(false)
  const reset = () => {
    setElapsed(0)
    setRunning(false)
  }

  return {
    pattern,
    total,
    elapsed,
    remaining: Math.max(0, total - elapsed),
    info,
    running,
    complete,
    start,
    pause,
    reset,
  }
}

export const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Let it out',
}

export function phaseScale(phase: BreathPhase, started: boolean): number {
  if (!started) return 0.55
  if (phase === 'inhale') return 1
  if (phase === 'exhale') return 0.55
  return 1
}

export function phaseClass(phase: BreathPhase): string {
  if (phase === 'inhale') return 'ph-inhale'
  if (phase === 'exhale') return 'ph-exhale'
  return 'ph-hold'
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
}