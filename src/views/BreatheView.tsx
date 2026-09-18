import { useState } from 'react'
import {
  PATTERNS,
  PHASE_LABELS,
  formatDuration,
  phaseClass,
  useBreathing,
} from '../hooks/useBreathing'

const RING_R = 150
const RING_C = 2 * Math.PI * RING_R

interface BreatheViewProps {
  onHome: () => void
}

type Step = 'setup' | 'session'

export default function BreatheView({ onHome }: BreatheViewProps) {
  const [patternId, setPatternId] = useState('box')
  const [cycles, setCycles] = useState(5)
  const [step, setStep] = useState<Step>('setup')
  const [sessionKey, setSessionKey] = useState(0)

  const startSession = () => {
    setSessionKey((k) => k + 1)
    setStep('session')
  }

  return (
    <div className="view">
      {step === 'setup' && (
        <>
          <h1 className="section-title">Breathe with me</h1>
          <p className="section-sub">
            Pick a rhythm and how many rounds feel right today.
          </p>

          <div className="patterns" role="radiogroup" aria-label="Breathing pattern">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={patternId === p.id}
                className={`pattern-card ${patternId === p.id ? 'selected' : ''}`}
                onClick={() => setPatternId(p.id)}
              >
                <span className="pattern-name">{p.name}</span>
                <span className="pattern-hint">{p.hint} seconds</span>
              </button>
            ))}
          </div>

          <div className="cycles-row">
            <button
              type="button"
              className="step-btn"
              aria-label="Fewer cycles"
              disabled={cycles <= 1}
              onClick={() => setCycles((c) => Math.max(1, c - 1))}
            >
              −
            </button>
            <span className="home-stats" style={{ margin: 0 }}>
              <span>
                {cycles} {cycles === 1 ? 'cycle' : 'cycles'}
              </span>
            </span>
            <button
              type="button"
              className="step-btn"
              aria-label="More cycles"
              disabled={cycles >= 12}
              onClick={() => setCycles((c) => Math.min(12, c + 1))}
            >
              +
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={startSession}>
              Begin 🌿
            </button>
          </div>
        </>
      )}

      {step === 'session' && (
        <BreathingSession key={sessionKey} patternId={patternId} cycles={cycles} onHome={onHome} />
      )}
    </div>
  )
}

function BreathingSession({
  patternId,
  cycles,
  onHome,
}: {
  patternId: string
  cycles: number
  onHome: () => void
}) {
  const breath = useBreathing(patternId, cycles)

  if (breath.complete) {
    const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0]
    return (
      <div className="glass done-card">
        <span className="done-emoji">🌷</span>
        <h2>That was lovely.</h2>
        <p>
          {cycles} {cycles === 1 ? 'round' : 'rounds'} of {pattern.name.toLowerCase()} breathing —
          you showed up for yourself. Carry the calm with you for a little while.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => breath.start()}
          >
            Breathe again
          </button>
          <button type="button" className="btn" onClick={onHome}>
            Back home
          </button>
        </div>
      </div>
    )
  }

  const { info, running, remaining, total } = breath
  const started = breath.elapsed > 0 || running
  const scale = started ? info.scale : 0.55
  const label = PHASE_LABELS[info.phase]
  const progress = 1 - remaining / total
  const dashOffset = RING_C * (1 - progress)

  return (
    <>
      <h1 className="section-title" style={{ textAlign: 'center' }}>
        {breath.pattern.name} breathing
      </h1>
      <p className="section-sub" style={{ textAlign: 'center' }}>
        find a comfortable seat. soften your shoulders.
      </p>

      <div className="breathe-canvas">
        <svg className="ring" viewBox="0 0 320 320" aria-hidden="true">
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffb8da" />
              <stop offset=".5" stopColor="#c7b9ff" />
              <stop offset="1" stopColor="#8fd8b8" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="160" cy="160" r={RING_R} />
          <circle
            className="ring-progress"
            cx="160"
            cy="160"
            r={RING_R}
            style={{ strokeDasharray: RING_C, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div
          className={`breath ${phaseClass(info.phase)}`}
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            transition: running
              ? `transform ${info.phaseDuration}s cubic-bezier(0.5, 0, 0.4, 1)`
              : 'transform 0.4s ease',
          }}
        >
          <span className="label">
            {label}
            <span className="sub">
              {info.phaseRemaining} {info.phaseRemaining === 1 ? 'second' : 'seconds'}
            </span>
          </span>
        </div>
      </div>

      <div className="session-meta">
        {formatDuration(remaining)} left · round {info.cycle} of {cycles}
      </div>

      <div className="cycle-dots" aria-label="Progress through cycles">
        {Array.from({ length: cycles }, (_, i) => (
          <span key={i} className={`cycle-dot ${i < info.cycle - 1 ? 'done' : ''}`} />
        ))}
      </div>

      <div className="session-actions">
        {running ? (
          <button type="button" className="btn" onClick={breath.pause}>
            Pause
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={breath.start}>
            {breath.elapsed === 0 ? 'Start' : 'Resume'}
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={onHome}>
          End session
        </button>
      </div>
    </>
  )
}