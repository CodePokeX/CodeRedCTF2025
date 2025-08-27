'use client'
import { useState, useEffect } from 'react'
import s from './login.module.css'
import ENDPOINT from '@/helpers/endpoint'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'username'])
  const router = useRouter()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(ENDPOINT + '/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password,
        }),
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
    } catch (err) {
      setError('Backend down, try again later')
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

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

            for (let j = 0; j < charCount; j++) {
            const span = document.createElement('span')
            span.innerText = chars[Math.floor(Math.random() * chars.length)]
            span.style.setProperty('--angle', `${Math.random() * 60 - 30}deg`)
            column.appendChild(span)
            }

            rainContainer.appendChild(column)
        }

        return () => {
            if (rainContainer) rainContainer.innerHTML = ''
        }
    }, [])

  return (
    <main className={s.login}>
      <div className={s.backgroundElements}>
        {/* ✅ replaced with image */}
        <div className={s.imfLogo}>
          <img src="/imf.png" alt="IMF Logo" />
        </div>

        <div className={s.circuitPattern}></div>
        <div className={s.radarContainer}>
          <div className={s.radarSweep}></div>
        </div>
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
              <input
                type="text"
                className={s.formInput}
                placeholder="Agent ID / Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={s.formGroup}>
              <input
                type="password"
                className={s.formInput}
                placeholder="Access Code / Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Loading...' : 'INITIATE MISSION'}
            </button>
          </form>

          {error && (
            <div style={{ textAlign: 'center', marginTop: '10px', color: 'red' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}