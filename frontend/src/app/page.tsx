'use client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import s from './home.module.css';
import { Lexend } from 'next/font/google';
import Design from '@/components/Design';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingAnimation from '@/components/loading.json'; // Ensure you have a Lottie animation file

const lexend = Lexend({ subsets: ['latin'] });

export default function Home() {
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cookieUsername = Cookies.get('username');
    setUsername(cookieUsername);
  }, []);

  return (
    <div className='font-orbitron'>
      <main className={s.home}>
        <Suspense fallback={<Lottie animationData={loadingAnimation} loop={true} />}>
          <div className={s.content}>
            <h1 className={s.title}>IEEE Code-Red 2025</h1>
            <p className={s.subtitle}>Your mission awaits!</p>
            {username && (
              <h2 className={s.welcomeTeam}>
                Its a <span style={{ color: '#e50914' }}>Code-Red</span>, Team <span>{username}</span>!
              </h2>
            )}

            <div className={s.buttons}>
              {!username && (
                <Link href="/login" className={s.button}>Login</Link>
              )}
              {username && (
                <>
                  <Link href="/question-map" className={s.button}>Questions</Link>
                  <Link href="/logout" className={s.button}>Logout</Link>
                </>
              )}
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
