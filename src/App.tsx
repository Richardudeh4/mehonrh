import { useEffect, useId, useState } from 'react'
import demoVideo from './assets/demo.mp4'
import dexscreenerLogo from './assets/dexscreener.png'
import easterEgg from './assets/easteregg.svg'
import robinhoodLogo from './assets/robinhood.png'
import './App.css'

/* Swap these when the real links land. */
const LINKS = {
  buy: '#',
  x: 'https://x.com/Mehonrh',
  dexscreener: 'https://dexscreener.com/robinhood/0x36b6711be94aa5dcd7ddd528d14dbe33043659b0',
  robinhood: '#',
} as const

const MEH_TWEET_URL =
  'https://x.com/elonmusk/status/2034947266822471988?s=20'

const CONTRACT_ADDRESS = '0x36b6711be94aa5dcd7ddd528d14dbe33043659b0'
const EGG_SIZE = 48
const HASH_MS = 700
const HASH_MS_REDUCED = 80

type EggPos = { x: number; y: number }

function pickSafeEggPosition(): EggPos {
  const margin = 16
  const topSafe = 72
  const bottomSafe = 280
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxX = Math.max(margin, vw - EGG_SIZE - margin)
  const minY = topSafe
  const maxY = Math.max(minY, vh - bottomSafe - EGG_SIZE)

  for (let i = 0; i < 48; i++) {
    const x = margin + Math.random() * Math.max(1, maxX - margin)
    const y = minY + Math.random() * Math.max(1, maxY - minY)
    if (y + EGG_SIZE <= vh - bottomSafe + 8) {
      return { x, y }
    }
  }

  return {
    x: Math.min(maxX, Math.max(margin, vw * 0.72)),
    y: Math.min(maxY, Math.max(minY, vh * 0.28)),
  }
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = value
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.left = '-9999px'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(field)
    return ok
  }
}

function shortAddress(address: string) {
  if (address.length <= 14) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function App() {
  const [copied, setCopied] = useState(false)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const liveId = useId()
  const disclaimerId = useId()

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!disclaimerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDisclaimerOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [disclaimerOpen])

  async function handleCopy() {
    const ok = await copyText(CONTRACT_ADDRESS)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="page">
      <div className="stage-media" aria-hidden="true">
        {reduceMotion ? (
          <div className="hero-fallback" />
        ) : (
          <video autoPlay muted loop playsInline preload="metadata">
            <source src={demoVideo} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="stage-scrim" aria-hidden="true" />
      <div className="stage-scan" aria-hidden="true" />

      <main className="stage">
        <header className="stage-top">
          {/* <h1 className="brand">$MEH</h1> */}
          {/* <div className="cta-row">
            <a className="btn btn-buy" href={LINKS.buy}>
              Buy $MEH
            </a>
            <button className="btn btn-ghost" type="button" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy CA'}
            </button>
          </div> */}
        </header>
      </main>

      <EasterEgg reduceMotion={reduceMotion} />

      <div className="bottom-stack">
        <nav className="dock" aria-label="Social and charts">
          <a
            href={LINKS.x}
            aria-label="X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconX />
          </a>
          <a
            href={LINKS.dexscreener}
            aria-label="Dexscreener"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dexscreenerLogo} alt="" className="dock-logo" />
          </a>
          <a
            href={LINKS.robinhood}
            aria-label="Robinhood"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={robinhoodLogo} alt="" className="dock-logo" />
          </a>
        </nav>

        <button
          className="disclaimer-toggle"
          type="button"
          aria-expanded={disclaimerOpen}
          aria-haspopup="dialog"
          aria-controls={disclaimerId}
          onClick={() => setDisclaimerOpen(true)}
        >
          Disclaimer
        </button>

        <button
          className="ca"
          type="button"
          onClick={handleCopy}
          aria-describedby={liveId}
        >
          <span className="ca-full">{CONTRACT_ADDRESS}</span>
          <span className="ca-short">{shortAddress(CONTRACT_ADDRESS)}</span>
          <span className="ca-hint">{copied ? 'copied' : 'copy'}</span>
        </button>
        <span className="sr-only" id={liveId} aria-live="polite">
          {copied ? 'Contract address copied' : ''}
        </span>

        <p className="tagline">a meme. nothing more. nothing less.</p>
      </div>

      {disclaimerOpen ? (
        <div
          className="disclaimer-modal"
          role="presentation"
          onClick={() => setDisclaimerOpen(false)}
        >
          <div
            className="disclaimer-dialog"
            id={disclaimerId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${disclaimerId}-title`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="disclaimer-dialog-head">
              <h2
                className="disclaimer-dialog-title"
                id={`${disclaimerId}-title`}
              >
                Disclaimer
              </h2>
              <button
                className="disclaimer-close"
                type="button"
                aria-label="Close disclaimer"
                onClick={() => setDisclaimerOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="disclaimer-dialog-body">
              <p className="agree">by buying $MEH, you agree that:</p>
              <p className="line line-lead">
                $MEH is a meme. nothing more. nothing less.
              </p>
              <p className="line">
                no utility. no guaranteed value. no financial advice.
              </p>
              <p className="line">
                buy it because you get the joke. not because you expect anything
                from it.
              </p>
              <p className="line line-split">
                you might win. you might lose.
                <br />
                we honestly don’t care.
              </p>
              <p className="line line-end">this is $MEH.</p>
            </div>
          </div>
        </div>
      ) : null}

      {copied ? (
        <div className="toast" role="status">
          Copied.
        </div>
      ) : null}

      <div className="grain" aria-hidden="true" />
    </div>
  )
}

function EasterEgg({ reduceMotion }: { reduceMotion: boolean }) {
  const [pos, setPos] = useState<EggPos | null>(() =>
    typeof window === 'undefined' ? null : pickSafeEggPosition(),
  )
  const [phase, setPhase] = useState<'idle' | 'hashing' | 'done'>('idle')

  useEffect(() => {
    if (phase !== 'idle') return
    const onResize = () => setPos(pickSafeEggPosition())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phase])

  function handleCrack() {
    if (phase !== 'idle') return
    setPhase('hashing')
    const tab = window.open('about:blank', '_blank')
    window.setTimeout(
      () => {
        setPhase('done')
        if (tab) {
          tab.opener = null
          tab.location.href = MEH_TWEET_URL
        } else {
          window.open(MEH_TWEET_URL, '_blank', 'noopener,noreferrer')
        }
      },
      reduceMotion ? HASH_MS_REDUCED : HASH_MS,
    )
  }

  if (!pos || phase === 'done') return null

  return (
    <button
      type="button"
      className={`easter-egg${phase === 'hashing' ? ' is-hashing' : ''}${reduceMotion ? ' is-static' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: EGG_SIZE,
        height: EGG_SIZE,
      }}
      aria-label="easter egg"
      disabled={phase !== 'idle'}
      onClick={handleCrack}
    >
      <img src={easterEgg} alt="" draggable={false} />
    </button>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 10.3 22 2h-2.2l-6.3 7.1L8.2 2H2l7.7 11.1L2 22h2.2l6.8-7.7L15.8 22H22l-7.3-11.7Zm-2.4 2.7-.8-1.1-6.2-8.7h2.7l5 7 6.2 8.8h-2.7l-5-7Z"
      />
    </svg>
  )
}
