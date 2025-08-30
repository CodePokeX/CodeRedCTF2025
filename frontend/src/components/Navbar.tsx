"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa'; // Using Font Awesome icons for the menu button
import Cookies from 'js-cookie';
import ENDPOINT from '@/helpers/endpoint';
import { TeamDetailed } from '@/models/Team';


export const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [teamData, setTeamData] = React.useState<TeamDetailed>();
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const response = await fetch(ENDPOINT + '/team/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          next: { revalidate: 0 }
        });

        if (response.ok) {
          const data = await response.json();
          setTeamData(data);
        } else {
          console.error('Failed to fetch team data');
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchTeamData();

  }, [accessToken]);

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
          {teamData && <li className='navTeamScore'>
                  SCORE: <span style={{ fontWeight: '700' }}>{teamData.score}</span>
          </li>}
        </ul>
      </nav>
    </header>
  );
};
