import Link from "next/link";
import AtlasHeader from "../components/AtlasHeader";

export default function StartJourney() {
  return (
    <main className="site-shell">
      <AtlasHeader />
      <section className="center-stage" aria-labelledby="start-title">
        <h1 id="start-title">Ready, Rijan?</h1>
        <p>Your best streak so far: 1</p>
        <Link className="primary-button" href="/guess">
          Start journey
        </Link>
      </section>
    </main>
  );
}
