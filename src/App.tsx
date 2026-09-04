import { useEffect, useId, useState } from 'react'
import demoVideo from './assets/demo.mp4'
import dexscreenerLogo from './assets/dexscreener.png'
import robinhoodLogo from './assets/robinhood.png'
import './App.css'

/* Swap these when the real links land. */
const LINKS = {
  buy: '#',
  x: 'https://x.com/Mehonrh',
  dexscreener: '#',
  robinhood: '#',
} as const

const CONTRACT_ADDRESS = '0x00000000000000'

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
          <div className="cta-row">
            <a className="btn btn-buy" href={LINKS.buy}>
              Buy $MEH
            </a>
            <button className="btn btn-ghost" type="button" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy CA'}
            </button>
          </div>
        </header>
      </main>

      <div className="bottom-stack">
        <nav className="dock" aria-label="Social and charts">
          <a href={LINKS.x} aria-label="X" target="_blank" rel="noopener noreferrer">
            <IconX />
          </a>
          <a href={LINKS.dexscreener} aria-label="Dexscreener" target="_blank" rel="noopener noreferrer">
            <img src={dexscreenerLogo} alt="" className="dock-logo" />
          </a>
          <a href={LINKS.robinhood} aria-label="Robinhood" target="_blank" rel="noopener noreferrer">
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
              <h2 className="disclaimer-dialog-title" id={`${disclaimerId}-title`}>
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
