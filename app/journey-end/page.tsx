import Link from "next/link";
import AtlasHeader from "../components/AtlasHeader";
import GoogleButtons from "../components/GoogleButtons";

type JourneyEndProps = {
  searchParams: Promise<{ city?: string }>;
};

export default async function JourneyEnd({ searchParams }: JourneyEndProps) {
  const { city = "Barcelona, Spain" } = await searchParams;

  return (
    <main className="site-shell">
      <AtlasHeader />
      <section className="center-stage end-stage" aria-labelledby="end-title">
        <p className="eyebrow">Journey ended</p>
        <h1 className="score" id="end-title">0</h1>
        <p className="score-caption">correct in a row</p>
        <p className="result-copy">That was <strong>{city}</strong>.</p>
        <p className="best-copy">Best: 1</p>
        <div className="end-actions">
          <Link className="primary-button" href="/guess">Play again</Link>
          <GoogleButtons type="signout" className="secondary-button" />
        </div>
      </section>
    </main>
  );
}
