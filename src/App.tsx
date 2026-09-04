import { useEffect, useId, useState } from 'react'
import demoVideo from './assets/demo.mp4'
import dexscreenerLogo from './assets/dexscreener.png'
import robinhoodLogo from './assets/robinhood.png'
import './App.css'

/* Swap these when the real links land. */
const LINKS = {
  buy: '#',
  x: '#',
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
  const [reduceMotion, setReduceMotion] = useState(false)
  const liveId = useId()

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
          <h1 className="brand">$MEH</h1>
         
          <div className="cta-row">
            <a className="btn btn-buy" href={LINKS.buy}>
              Buy $MEH
            </a>
            <button className="btn btn-ghost" type="button" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy CA'}
            </button>
          </div>
        </header>

        <section className="manifesto" aria-label="Agreement">
          <p className="agree">By buying $MEH, you agree that:</p>
          <p className="line line-lead">
            $MEH is a meme. Nothing more. Nothing less.
          </p>
          <p className="line">
            No utility. No guaranteed value. No financial advice.
          </p>
          <p className="line">
            Buy it because you get the joke. Not because you expect anything from
            it.
          </p>
          <p className="line line-split">
            You might win. You might lose.
            <br />
            We honestly don’t care.
          </p>
          <p className="line line-end">This is $MEH.</p>
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
        </section>
      </main>

      <nav className="dock" aria-label="Social and charts">
        <a href={LINKS.x} aria-label="X">
          <IconX />
        </a>
        <a href={LINKS.dexscreener} aria-label="Dexscreener">
          <img src={dexscreenerLogo} alt="" className="dock-logo" />
        </a>
        <a href={LINKS.robinhood} aria-label="Robinhood">
          <img src={robinhoodLogo} alt="" className="dock-logo" />
        </a>
      </nav>
      <p className="line line-lead">
            $MEH is a meme. Nothing more. Nothing less.
          </p>

      <p className="tagline">A meme. Nothing more. Nothing less.</p>

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


