export default function AtlasHeader() {
  return (
    <header className="atlas-header">
      <div className="atlas-brand">
        <a className="wordmark" href="/" aria-label="GeoGuess home">
          GeoGuess
        </a>
        <span className="edition">Field atlas no. 1</span>
      </div>
      <nav className="account-nav" aria-label="Account navigation">
        <span>Rijan Maharzan</span>
        <span>BEST 1</span>
        <a href="/">Sign out</a>
      </nav>
    </header>
  );
}
