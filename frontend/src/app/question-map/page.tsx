/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import Xarrow from 'react-xarrows';
import Image from 'next/image';
import styles from './adventure-map.module.css'
import ENDPOINT from '@/helpers/endpoint';
import Cookies from 'js-cookie';
import { Sections, TeamDetailed } from '@/models/Team';

const CustomConnection = ({ start, end } : { start: string, end: string }) => (
  <Xarrow
    start={start}
    end={end}
    color="#ffffff50"
    strokeWidth={20}
    path="smooth"
    dashness={{ animation: 2 }}  
    headSize={0}
    tailSize={0}
    curveness={0.4}

    />
);

export default function AdventureMap() {

  const islandsXL = [
    { id: 'island1', x: 1, y: 1 , image: '/island-1.png', href: '/questions/1'},
    { id: 'island2', x: 2, y: 3 , image: '/island-2.png', href: '/questions/2'},
    { id: 'island3', x: 3, y: 1 , image: '/island-3.png', href: '/questions/3'},
    { id: 'island4', x: 4, y: 3 , image: '/island-4.png', href: '/questions/4'},
    { id: 'island5', x: 5, y: 1 , image: '/island-5.png', href: '/questions/5'},
    { id: 'island6', x: 6, y: 3 , image: '/island-6.png', href: '/questions/6'},
  ];

  const islandsMobile = [
    { id: 'island1', x: 1, y: 1 , image: '/island-1.png', href: '/questions/1'},
    { id: 'island2', x: 1, y: 3 , image: '/island-2.png', href: '/questions/2'},
    { id: 'island3', x: 1, y: 5 , image: '/island-3.png', href: '/questions/3'},
    { id: 'island4', x: 1, y: 7 , image: '/island-4.png', href: '/questions/4'},
    { id: 'island5', x: 1, y: 9 , image: '/island-5.png', href: '/questions/5'},
    { id: 'island6', x: 1, y: 11 , image: '/island-6.png', href: '/questions/6'},
  ];

  const islandsTablet = [
    { id: 'island1', x: 1, y: 1 , image: '/island-1.png', href: '/questions/1'},
    { id: 'island2', x: 2, y: 3 , image: '/island-2.png', href: '/questions/2'},
    { id: 'island3', x: 1, y: 5 , image: '/island-3.png', href: '/questions/3'},
    { id: 'island4', x: 2, y: 7 , image: '/island-4.png' , href: '/questions/4'},
    { id: 'island5', x: 1, y: 9 , image: '/island-5.png', href: '/questions/5'},
    { id: 'island6', x: 2, y: 11 , image: '/island-6.png', href: '/questions/6'},
  ];

  const islandsDesktop = [
    { id: 'island1', x: 1, y: 1 , image: '/island-1.png', href: '/questions/1'},
    { id: 'island2', x: 1, y: 3 , image: '/island-2.png', href: '/questions/2'},
    { id: 'island3', x: 2, y: 1 , image: '/island-3.png', href: '/questions/3'},
    { id: 'island4', x: 2, y: 3 , image: '/island-4.png', href: '/questions/4'},
    { id: 'island5', x: 3, y: 1 , image: '/island-5.png', href: '/questions/5'},
    { id: 'island6', x: 3, y: 3 , image: '/island-6.png', href: '/questions/6'},
  ];

  const [islandsList, setIslandsList] = React.useState(islandsDesktop);
  const [maxWidth, setMaxWidth] = React.useState('250px');
  const [teamData, setTeamData] = React.useState<TeamDetailed>();
  const [sectionsData, setSectionsData] = React.useState<Sections[]>();
  const accessToken = Cookies.get('access_token');

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIslandsList(islandsTablet);
        setMaxWidth('150px');
      }
      if (window.innerWidth >= 1024 && window.innerWidth < 1440) {
        setIslandsList(islandsDesktop);
        setMaxWidth('200px');
      }
      if (window.innerWidth >= 1440) {
        setIslandsList(islandsXL);
        setMaxWidth('300px');
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
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
    async function fetchSectionsData() {
      try {
        const response = await fetch(ENDPOINT + '/sections/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          next: { revalidate: 0 }
        });
        if (response.ok) {
          const data = await response.json();
          setSectionsData(data);
        } else {
          console.error('Failed to fetch sections data');
        }
    }
    catch (err) {
      console.error(err);
    }
  }

    fetchTeamData();
    fetchSectionsData();
  }, [accessToken]);

  return (
    <>
      <div className={styles.mapContainer}>
        {islandsList.map((island, key) => (
          <div
            key={island.id}
            id={island.id}
            className={
              (sectionsData?.[key]?.points_threshold ?? 0) <= (teamData?.score ?? 0) ? styles.island : styles.islandLocked
            }
            style={{
              gridColumn: island.x,
              gridRow: island.y,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <img src={island.image} alt={island.id} 
              onClick={() => {
                if ((sectionsData?.[key]?.points_threshold ?? 0) <= (teamData?.score ?? 0))
                  window.location.href = island.href
              }}
                style={{ 
                  maxWidth: maxWidth,
                  cursor: ((sectionsData?.[key]?.points_threshold ?? 0) <= (teamData?.score ?? 0)) ? 'pointer' : 'not-allowed',
                }}
            />
            {(sectionsData?.[key]?.points_threshold ?? 0) > (teamData?.score ?? 0) && (
              <>
              <div className={styles.lockOverlay}>
                <img src='/lock.svg' alt="lock" className={styles.lockIcon} />
                {/* x score required to unlock */}

              </div>
              <p className={styles.pointsOverlay}>
                Unlocks at {sectionsData?.[key]?.points_threshold ?? ''}
              </p>
              </>
            )}
          </div>
        ))}
        <CustomConnection start="island1" end="island2" />
        <CustomConnection start="island2" end="island3" />
        <CustomConnection start="island3" end="island4" />
        <CustomConnection start="island4" end="island5" />
        <CustomConnection start="island5" end="island6" />
      </div>
    </>
  );
};
