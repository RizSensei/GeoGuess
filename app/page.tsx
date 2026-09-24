import Link from "next/link";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="GeoGuess home">
          GeoGuess
        </a>
        <span className="edition">Field atlas no. 1</span>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Est. from the street up</p>
          <h1 id="hero-title">
            Where in the
            <br />
            world <em>are you</em>
            <br />
            standing?
          </h1>
          <p className="intro">
            One street photo. Four cities. Pick right to keep your streak alive
            - one miss and the journey ends.
          </p>
          <Link className="google-button" href="/start-journey">
            <span className="google-mark" aria-hidden="true">G</span>
            <span>Sign in with Google</span>
          </Link>
        </div>

        <div className="postcard" aria-label="Unknown location postcard">
          <div className="postcard-inner">
            <span className="question-mark">?</span>
            <span className="postmark">Postmark: Unknown</span>
          </div>
        </div>
      </section>
    </main>
  );
}
