"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AtlasHeader from "../components/AtlasHeader";

const cities = [
  "Rio de Janeiro, Brazil",
  "Barcelona, Spain",
  "Reykjavik, Iceland",
  "Bangkok, Thailand",
];

export default function Guess() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  function chooseCity(city: string) {
    setSelectedCity(city);
    router.push(`/journey-end?city=${encodeURIComponent(city)}`);
  }

  return (
    <main className="site-shell">
      <AtlasHeader />
      <section className="guess-stage" aria-labelledby="guess-title">
        <div className="guess-meta">
          <div className="streak-card">
            <span className="card-label">Current streak</span>
            <strong className="streak-number">0</strong>
            <span className="card-note">Verified field data</span>
          </div>
          <div className="record">
            <span className="card-label">Historical record</span>
            <strong>Personal Best: 1</strong>
          </div>
        </div>

        <div className="photo-board">
          <div className="photo-placeholder" role="img" aria-label="Street photo unavailable">
            Photo couldn&apos;t load. Skip to another place
          </div>
          <div className="location-label">Location identification</div>
          <h1 className="location-title" id="guess-title">
            Classify this territory.
          </h1>
        </div>

        <div className="answers" aria-label="City choices">
          {cities.map((city, index) => (
            <button
              className="answer-button"
              key={city}
              type="button"
              onClick={() => chooseCity(city)}
              disabled={selectedCity !== null}
            >
              <span className="answer-number">0{index + 1}</span>
              <span>{city}</span>
              <span className="radio-dot" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
