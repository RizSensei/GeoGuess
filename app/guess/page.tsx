"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AtlasHeader from "../components/AtlasHeader";
import Image from "next/image";
import { useLocation, type LocationData } from "../hooks/useLocation";

const RandomStreetView = ({ location }: { location: LocationData }) => {
  if (!location.photoUrl) {
    return <>Photo unavailable for this field report</>;
  }

  return (
    <Image
      src={location.photoUrl}
      alt={location.photoAlt}
      fill
      sizes="(max-width: 560px) 100vw, 590px"
      className="street-view-image"
      priority
    />
  );
};

function getStoredNumber(key: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  const value = Number.parseInt(localStorage.getItem(key) ?? "0", 10);
  return Number.isNaN(value) ? 0 : value;
}

export default function Guess() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(() => getStoredNumber("geo-streak-current"));
  const [personalBest, setPersonalBest] = useState(() => getStoredNumber("geo-streak-best"));
  const [roundKey, setRoundKey] = useState(() => Math.random().toString(36).slice(2));
  const { data: location, isLoading, isError } = useLocation(roundKey);

  function chooseCity(city: string, index: number) {
    if (!location || selectedCity || feedback) {
      return;
    }

    setSelectedCity(city);
    const selectedChoice = location.choices[index];
    const isCorrect = selectedChoice.city === location.city && selectedChoice.country === location.country;

    if (isCorrect) {
      const nextStreak = streak + 1;
      const nextBest = Math.max(personalBest, nextStreak);

      setFeedback("correct");
      setStreak(nextStreak);
      setPersonalBest(nextBest);
      localStorage.setItem("geo-streak-current", String(nextStreak));
      localStorage.setItem("geo-streak-best", String(nextBest));

      window.setTimeout(() => {
        setFeedback(null);
        setSelectedCity(null);
        setRoundKey(Math.random().toString(36).slice(2));
      }, 2500);
      return;
    }

    setFeedback("wrong");
    localStorage.setItem("geo-streak-best", String(personalBest));
    localStorage.setItem("geo-streak-current", "0");

    window.setTimeout(() => {
      router.push(
        `/journey-end?city=${encodeURIComponent(`${location.city}, ${location.country}`)}&streak=${streak}&best=${personalBest}`,
      );
    }, 2500);
  }

  return (
    <main className="site-shell">
      <AtlasHeader />
      <section className="guess-stage" aria-labelledby="guess-title">
        <div className="guess-meta">
          <div className="streak-card">
            <span className="card-label">Current streak</span>
            <strong className="streak-number">{streak}</strong>
            <span className="card-note">Verified field data</span>
          </div>
          <div className="record">
            <span className="card-label">Historical record</span>
            <strong>Personal Best: {personalBest}</strong>
          </div>
        </div>

        <div className="photo-board">
          <div
            className="photo-placeholder"
            role="img"
            aria-label={location ? `${location.city}, ${location.country}` : "Random city photo"}
          >
            {isLoading ? (
              "Finding a new city..."
            ) : location ? (
              <RandomStreetView location={location} />
            ) : isError ? (
              "The field report could not load. Please try again."
            ) : (
              "Photo could not load. Please try again."
            )}
          </div>
          <div className="location-label">Location identification</div>
          <h1 className="location-title" id="guess-title">
            Classify this territory.
          </h1>
          <p className="photo-credit">Image and city reference: Wikipedia</p>
        </div>

        <div className="answers" aria-label="City choices">
          {location?.choices?.map((choice, index) => {
            const city = `${choice.city}, ${choice.country}`;
            const isSelected = selectedCity === city;
            const isCorrectChoice = location.city === choice.city && location.country === choice.country;
            const feedbackClass = feedback && (isSelected || (feedback === "wrong" && isCorrectChoice))
              ? feedback === "correct" || isCorrectChoice
                ? " answer-correct"
                : " answer-wrong"
              : "";

            return (
            <button
              className={`answer-button${feedbackClass}`}
              key={city}
              type="button"
              onClick={() => chooseCity(city, index)}
              disabled={selectedCity !== null || isLoading || isError}
            >
              <span className="answer-number">0{index + 1}</span>
              <span>{city}</span>
              <span className="radio-dot" aria-hidden="true" />
            </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
