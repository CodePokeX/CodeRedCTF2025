'use client'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import s from './logout.module.css'

export default function Logout() {
  const [cookies, , removeCookie] = useCookies(['access_token', 'refresh_token', 'username'])
  const router = useRouter()

  useEffect(() => {
    removeCookie('access_token', { path: '/' })
    removeCookie('refresh_token', { path: '/' })
    removeCookie('username', { path: '/' })
    
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [removeCookie, router])

  return (
    <main className={s.logout}>
      <div className={s.backgroundElements}>
        <div className={s.imfLogo}>
          <img src="/imf.png" alt="IMF Logo" />
        </div>
        <div className={s.scanlines}></div>
      </div>

      <div className={s.container}>
        <div className={s.messageCard}>
          <h1 className={s.title}>Mission Terminated</h1>
          <p className={s.subtitle}>You have been safely logged out.</p>
          <p className={s.redirect}>Redirecting to headquarters...</p>
        </div>
      </div>
    </main>
  )
}
