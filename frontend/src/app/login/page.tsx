'use client'
import { useState, useEffect, useRef } from 'react'
import s from './login.module.css'
import ENDPOINT from '@/helpers/endpoint'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'

const NAMES = ["Akshat", "Sahil", "Shubhro", "Dinesh", "Varun", "Nishant", "IEEE"]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'username'])
  const router = useRouter()
  const activeEasterEgg = useRef<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(ENDPOINT + '/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })
      if (res.status === 401) {
        setError('Invalid credentials')
        setTimeout(() => setError(''), 5000)
      } else if (res.ok) {
        const data = await res.json()
        setCookie('access_token', data.access, { path: '/' })
        setCookie('refresh_token', data.refresh, { path: '/' })
        setCookie('username', email, { path: '/' })
        window.location.href = '/question-map'
      }
    } catch {
      setError('Backend down, try again later')
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  /** Digital Rain setup **/
  useEffect(() => {
    const rainContainer = document.getElementById('digitalRain')
    if (!rainContainer) return

    const columnSpacing = 60
    const columns = Math.floor(window.innerWidth / columnSpacing)
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div')
      column.classList.add(s.rainColumn)
      column.style.left = `${i * columnSpacing}px`
      column.style.animationDuration = `${Math.random() * 7 + 8}s`
      column.style.animationDelay = `${Math.random() * 5}s`

      const charCount = Math.ceil(window.innerHeight / 18) + 15

      // Random chance to embed a glowing name inside this column
      const insertName = Math.random() < 0.15
      let name = ''
      let insertIndex = -1
      if (insertName) {
        name = NAMES[Math.floor(Math.random() * NAMES.length)].toUpperCase()
        insertIndex = Math.floor(Math.random() * (charCount - name.length))
      }

      for (let j = 0; j < charCount; j++) {
        const span = document.createElement('span')

        if (insertName && j >= insertIndex && j < insertIndex + name.length) {
          span.innerText = name[j - insertIndex]
          span.classList.add(s.nameChar)
        } else {
          span.innerText = chars[Math.floor(Math.random() * chars.length)]
          span.style.setProperty('--angle', `${Math.random() * 60 - 30}deg`)
        }

        column.appendChild(span)
      }

      rainContainer.appendChild(column)
    }

    return () => {
      rainContainer.innerHTML = ''
    }
  }, [])



  /** Easter Egg Manager **/
  useEffect(() => {
    function triggerEasterEgg() {
      if (activeEasterEgg.current) return

      const eggs = ['rain', 'radar', 'circuit', 'crosshair', 'bgName']
      const chosen = eggs[Math.floor(Math.random() * eggs.length)]
      activeEasterEgg.current = chosen

      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)]

      if (chosen === 'rain') {
        const columns = document.querySelectorAll(`.${s.rainColumn}`)
        if (columns.length > 0) {
          const col = columns[Math.floor(Math.random() * columns.length)]
          const special = document.createElement('span')
          special.innerText = randomName
          special.style.color = 'rgba(255,80,80,0.85)'
          special.style.fontWeight = 'bold'
          special.style.textShadow = '0 0 3px rgba(255,70,70,0.6), 0 0 6px rgba(255,0,0,0.4)'
          col.appendChild(special)
          setTimeout(() => col.removeChild(special), 5000)
        }
      }

      if (chosen === 'radar') {
        const radar = document.querySelector(`.${s.radarContainer}`)
        if (radar) {
          const label = document.createElement('div')
          label.innerText = randomName
          label.style.position = 'absolute'
          label.style.top = '50%'
          label.style.left = '50%'
          label.style.transform = 'translate(-50%, -50%)'
          label.style.color = 'rgba(255,60,60,0.6)'
          label.style.fontSize = '16px'
          label.style.fontWeight = 'bold'
          label.style.textShadow = '0 0 3px rgba(255,50,50,0.5), 0 0 5px rgba(255,0,0,0.3)'
          radar.appendChild(label)
          setTimeout(() => radar.removeChild(label), 4000)
        }
      }

      if (chosen === 'circuit') {
        const circuit = document.querySelector(`.${s.circuitPattern}`) as HTMLElement
        if (circuit) {
          circuit.style.opacity = '0.15'
          setTimeout(() => (circuit.style.opacity = '0.07'), 4000)
        }
      }

      if (chosen === 'crosshair') {
        const cross = document.querySelector(`.${s.crosshairOne}`) as HTMLElement
        if (cross) {
          const tag = document.createElement('div')
          tag.innerText = randomName
          tag.style.position = 'absolute'
          tag.style.top = '110%'
          tag.style.left = '50%'
          tag.style.transform = 'translateX(-50%)'
          tag.style.color = 'rgba(255,80,80,0.7)'
          tag.style.fontSize = '14px'
          tag.style.textShadow = '0 0 3px rgba(255,70,70,0.5), 0 0 6px rgba(255,0,0,0.3)'
          cross.appendChild(tag)
          setTimeout(() => cross.removeChild(tag), 4000)
        }
      }

      if (chosen === 'bgName') {
      const bg = document.querySelector(`.${s.backgroundElements}`)
      if (bg) {
        const ghost = document.createElement('div')
        ghost.innerText = randomName
        ghost.classList.add(s.bgNameGhost)
        ghost.style.top = `${Math.random() * 95}%`
        ghost.style.left = `${Math.random() * 95}%`
        ghost.style.fontSize = `${Math.floor(Math.random() * 36) + 18}px`
        ghost.style.setProperty('--angle', `${Math.random() * 360}deg`)
        bg.appendChild(ghost)
        setTimeout(() => ghost.remove(), 8000)
      }
    }

      setTimeout(() => {
        activeEasterEgg.current = null
      }, 6000)
    }

    const timer = setInterval(() => {
      if (Math.random() < 0.1) triggerEasterEgg() // ~10% chance every 5s
    }, 5000)

    return () => clearInterval(timer)
  }, [])



  return (
    <main className={s.login}>
      <div className={s.backgroundElements}>
        <div className={s.imfLogo}><img src="/imf.png" alt="IMF Logo" /></div>
        <div className={s.circuitPattern}></div>
        <div className={s.radarContainer}><div className={s.radarSweep}></div></div>
        <div className={s.crosshairOne}></div>
        <div className={s.crosshairTwo}></div>
        <div className={s.digitalRain} id="digitalRain"></div>
      </div>

      <div className={s.container}>
        <div className={s.authCard}>
          <div className={s.logoSection}>
            <h1 className={s.logo}>CODE RED</h1>
            <p className={s.tagline}>Mission: Impossible</p>
          </div>

          <form onSubmit={submit}>
            <div className={s.formGroup}>
              <input type="text" className={s.formInput} placeholder="Username"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={s.formGroup}>
              <input type="password" className={s.formInput} placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Loading...' : 'LOGIN'}
            </button>
          </form>

          {error && (
            <div style={{ textAlign: 'center', marginTop: '10px', color: 'red' }}>{error}</div>
          )}
        </div>
      </div>
    </main>
  )
}
