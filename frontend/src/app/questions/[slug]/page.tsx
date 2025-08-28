"use client";

import React, { Suspense, useEffect, useState } from "react";
import ENDPOINT from "@/helpers/endpoint";
import styles from "../questions.module.css";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "@/components/loading.json";

import { useCookies } from "react-cookie";
import Question from "@/models/Question";
import QuestionsGrid from "../_components/QuestionsGrid";
import { Sections } from "@/models/Team";
import QuestionResponse from "@/models/Responses";

export default function Page({ params }: { params: { slug: string } }) {


  const [cookies] = useCookies(["access_token"]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sectionsData, setSectionsData] = useState<Sections[]>();

  const fetchData = async () => {
    try {
      const access_token = cookies.access_token;
      const res = await fetch(
        `${ENDPOINT}/questions/?category=${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          next: { revalidate: 0 },
        }
      );

      if ([402, 403, 400].includes(res.status)) {
        setError(res.status.toString());
        return;
      }

      const data = await res.json();
      console.log(data);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchSectionsData = async () => {
    try {
      const access_token = cookies.access_token;
      const res = await fetch(`${ENDPOINT}/sections/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 0 },
      });

      if (res.ok) {
        const data = await res.json();
        setSectionsData(data);
      } else {
        console.error("Failed to fetch sections data");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchQuestionAttempts = async () => {
    try {
      const access_token = cookies.access_token;
      const res = await fetch(`${ENDPOINT}/attempts/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 0 },
      });

      if (res.ok) {
        const data = await res.json();
        setResponses(data);
      } else {
        console.error("Failed to fetch attempts data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSectionsData();
    fetchQuestionAttempts();
  }, [cookies.access_token, params.slug]);

  if (!params.slug || error) {
    return notFound();
  }

  const sectionsMeta = [
    {
      name: "Russian Resilience",
      src: "https://static.vecteezy.com/system/resources/thumbnails/029/163/619/small_2x/russia-map-in-white-color-map-of-russia-in-administrative-regions-png.png",
    },
    {
      name: "American Apocalypse",
      src: "https://static.vecteezy.com/system/resources/thumbnails/023/264/311/small/usa-map-america-map-united-states-of-america-map-isolated-on-white-color-png.png",
    },
    {
      name: "Chinese Catastrophe",
      src: "https://static.vecteezy.com/system/resources/thumbnails/022/826/930/small_2x/china-map-on-white-color-png.png",
    },
    {
      name: "Japanese Judgment",
      src: "https://www.mappng.com/png-country-maps/2021-07-13574Japan-map-white.png",
    },
    {
      name: "European Exodus",
      src: "https://www.clker.com//cliparts/q/6/2/Y/A/K/european-map-blank-white-hi.png",
    },
    {
      name: "Indian Infiltration",
      src: "https://raw.githubusercontent.com/gist/iashris/1b806cb925dcdb05c1b3ae756d6c76cc/raw/b9a1642fe66ac0fdb84118dfb34663da7d1ed81e/india.svg",
    },
  ];
  const sectionNumber = parseInt(params.slug);
  if (sectionNumber < 1 || sectionNumber > sectionsMeta.length) {
    return notFound();
  }
  const { name: sectionNameText, src: sectionImageSrc } =
    sectionsMeta[sectionNumber - 1];

  return (
    <main className={styles.questions}>
      {/* back button to go to question-map */}
      <div className={styles.backButtonContainer}>
        <a href="/question-map" className={styles.backButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather-arrow-left feather"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Adventure Map
        </a>
        <div style={{ textAlign: "end" }}>
          <img
            src={sectionImageSrc}
            alt=""
            style={{
              position: "absolute",
              height: "600px",
              top: "10%",
              right: "20%",
              opacity: "0.1",
            }}
          />
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Mission_Impossible_-_film_logo.svg/512px-Mission_Impossible_-_film_logo.svg.png"
            }
            alt={sectionNameText || "Mission Logo"}
            style={{ height: "100px" }}
          />
          <p
            style={{
              fontSize: "40px",
              fontStyle: "italic",
              fontFamily: "sans-serif",
              fontWeight: "600",
            }}
          >
            {"Mission " + sectionNumber} :{sectionNameText.toUpperCase()}
          </p>
        </div>
      </div>

      <h1>{sectionsData?.[sectionNumber - 1]?.title}</h1>
      <p>{sectionsData && sectionsData[sectionNumber - 1]?.description}</p>
      <br />
      <br />
      <Suspense
        fallback={<Lottie animationData={loadingAnimation} loop={true} />}
      >
        <QuestionsGrid
          questions={questions}
          fetchData={fetchData}
          fetchResponses={fetchQuestionAttempts}
          responses={responses}
        />
      </Suspense>
    </main>
  );
}
