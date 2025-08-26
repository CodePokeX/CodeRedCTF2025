"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa'; // Using Font Awesome icons for the menu button

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <header style={{
      zIndex: 1000,
    }}>
      <Link href="/">
        <Image className="logo" src="/assets/images/logo.png" alt="Logo" width={160} height={40} />
      </Link>
      <button className="menu-toggle" onClick={toggleNavbar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={isOpen ? 'nav-open' : ''}>
        <ul>
          <li><Link href="/" onClick={closeNavbar}>HOME</Link></li>
          <li><Link href="/teams" onClick={closeNavbar}>TEAMS</Link></li>
          <li><Link href="/question-map" onClick={closeNavbar}>QUESTIONS</Link></li>
          <li><Link href="/scoreboard" onClick={closeNavbar}>SCOREBOARD</Link></li>
        </ul>
      </nav>
    </header>
  );
};
