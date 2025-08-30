/* eslint-disable @next/next/no-page-custom-font */
import { Navbar } from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { League_Spartan } from 'next/font/google'
import { Oswald } from 'next/font/google'
import { Orbitron } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'] })
const oswald = Oswald({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin']})


export const metadata: Metadata = {
	title: 'Codered | IEEE',
	description: 'Capture the Flag - IEEE NITK',
}

export default function RootLayout({
	
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional" />
			</head>
			<body className={orbitron.className}>
				<Navbar/>
				{children}
				<footer>
					<nav className='foot'>
						Made with <span style={{ color: 'white' }}>❤</span> by <span style={{ fontWeight: 600 }}>IEEE NITK</span>
					</nav>
				</footer>
			</body>
		</html>
	)
}
