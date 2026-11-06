import Navbar from "../components/layout/Navbar";
import BatcaveBackdrop from "../components/cinematic/BatcaveBackdrop";

export default function NotFound() {
  return (
    <div className="experience-shell" data-phase="not-found">
      <BatcaveBackdrop />
      <Navbar phase="not-found" />
      <main className="ds-centered">
        <section
          className="ds-panel ds-secondary ds-not-found"
          data-figma-node="249:953"
          aria-labelledby="error-title"
        >
          <h1 id="error-title" className="ds-display ds-glow-text">
            404
          </h1>
          <p className="ds-body">SPIACENTI PAGINA NON TROVATA.</p>
          <a className="ds-button ds-button-big ds-secondary" href="/">
            TORNA ALLA HOME
          </a>
        </section>
      </main>
    </div>
  );
}
