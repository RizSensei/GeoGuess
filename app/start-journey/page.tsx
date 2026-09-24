import Link from "next/link";
import AtlasHeader from "../components/AtlasHeader";

export default function StartJourney() {
  return (
    <main className="site-shell">
      <AtlasHeader />
      <section className="center-stage" aria-labelledby="start-title">
        <h1 id="start-title">Ready, Rijan?</h1>
        <p>Your best streak so far: 1</p>
        <div className="journey-intro">
          <span className="journey-intro-label">Field briefing</span>
          <p>
            Study a street photo and choose the city you think you&apos;re in.
            Keep your answers right to build your streak. One wrong guess ends
            the journey.
          </p>
          <span className="journey-intro-label how-to-play-label">How to play</span>
          <ol className="how-to-play">
            <li><strong>01</strong><span>Inspect the street photo.</span></li>
            <li><strong>02</strong><span>Pick one city from four choices.</span></li>
            <li><strong>03</strong><span>Stay sharp and protect your streak.</span></li>
          </ol>
        </div>
        <Link className="primary-button" href="/guess">
          Start journey
        </Link>
      </section>
    </main>
  );
}
