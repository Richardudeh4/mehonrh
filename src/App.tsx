import { useEffect, useId, useState } from 'react'
import demoStill from './assets/demoImage.JPG'
import demoVideo from './assets/demo.mp4'
import './App.css'

/* Swap these when the real links land. */
const LINKS = {
  buy: '#',
  x: '#',
  telegram: '#',
  dexscreener: '#',
  dextools: '#',
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
      <a className="skip" href="#manifesto">
        Skip to the agreement
      </a>

      <section className="hero" aria-label="$MEH">
        <div className="hero-media" aria-hidden="true">
          {reduceMotion ? (
            <img src={demoStill} alt="" />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={demoStill}
              preload="metadata"
            >
              <source src={demoVideo} type="video/mp4" />
            </video>
          )}
        </div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-scan" aria-hidden="true" />

        <div className="hero-copy">
          <h1 className="brand">$MEH</h1>
          <p className="tagline">A meme. Nothing more. Nothing less.</p>
          <div className="cta-row">
            <a className="btn btn-buy" href={LINKS.buy}>
              Buy $MEH
            </a>
            <button className="btn btn-ghost" type="button" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy CA'}
            </button>
          </div>
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="manifesto-bg" aria-hidden="true">
          <img src={demoStill} alt="" />
        </div>
        <div className="manifesto-inner">
          <p className="agree">By buying $MEH, you agree that:</p>

          <p className="line line-lead">
            $MEH is a meme. Nothing more. Nothing less.
          </p>

          <p className="line">
            No utility. No guaranteed value. No financial advice.
          </p>

          <p className="line">
            Buy it because you get the joke. Not because you expect anything
            from it.
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
        </div>
      </section>

      <footer className="closer">
        <p>still here? meh.</p>
        <button className="ca ca-mini" type="button" onClick={handleCopy}>
          <span className="ca-full">{CONTRACT_ADDRESS}</span>
          <span className="ca-short">{shortAddress(CONTRACT_ADDRESS)}</span>
        </button>
      </footer>

      <nav className="dock" aria-label="Social and charts">
        <a href={LINKS.x} aria-label="X">
          <IconX />
        </a>
        <a href={LINKS.telegram} aria-label="Telegram">
          <IconTelegram />
        </a>
        <a href={LINKS.dexscreener} aria-label="Dexscreener">
          <IconChart />
        </a>
        <a href={LINKS.dextools} aria-label="Dextools">
          <IconLoop />
        </a>
        <a className="dock-meh" href={LINKS.buy} aria-label="Buy $MEH">
          <IconFlame />
        </a>
      </nav>

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

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.5 4.3 18.2 20c-.2 1-1.3 1.4-2.2.8l-5.3-3.9-2.6 2.5c-.3.3-.8.1-.9-.3l-.7-4.6L3 12.3c-1-.3-.9-1.7.1-2l17.2-6.4c.9-.3 1.7.5 1.2 1.4ZM8.7 13.6l.5 3.3 1.5-1.5 4.8-4.6c.2-.2 0-.5-.2-.4l-6.6 3.2Z"
      />
    </svg>
  )
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 4h2v16H5V4Zm6 6h2v10h-2V10Zm6-4h2v14h-2V6Z"
      />
    </svg>
  )
}

function IconLoop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5V2L8 6l4 4V7a5 5 0 1 1-4.9 6H5a7 7 0 1 0 7-8Zm0 14v3l4-4-4-4v3a5 5 0 0 1-4.9-6H5a7 7 0 0 0 7 8Z"
      />
    </svg>
  )
}

function IconFlame() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2s3 3.2 3 6.2c0 1.4-.6 2.6-1.5 3.5.2-.8.3-1.6.2-2.4-.8 1.4-2.2 2.4-2.7 3.9C9.5 10.6 7 9.4 7 6.8 7 4.6 9.1 2.8 12 2Zm0 10c3.2 0 6 2.2 6 5.4C18 20.4 15.3 22 12 22s-6-1.6-6-4.6c0-2.1 1.4-3.8 3.4-4.7.4 1.6 1.5 2.8 2.6 3.5-.4-1.5-.4-3.2 0-4.2Z"
      />
    </svg>
  )
}
