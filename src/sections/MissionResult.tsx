import { Button, Timer } from "../components/ui/DesignSystem";

export default function MissionResult({
  won,
  seconds,
  onContinue,
}: {
  won: boolean;
  seconds: number;
  onContinue: () => void;
}) {
  return (
    <section
      className="ds-centered"
      aria-labelledby="result-title"
      data-figma-node={won ? "302:1346" : "302:1347"}
    >
      <div
        className={
          "ds-panel ds-result " +
          (won ? "ds-result-win" : "ds-secondary ds-result-loss")
        }
      >
        <h1 id="result-title" className="ds-display">
          MISSIONE
          <br />
          {won ? "COMPIUTA" : "FALLITA"}
        </h1>
        <p className="ds-body">
          {won ? (
            <>
              Complimenti, Bats…
              <br />
              Per una volta non era mia intenzione
              <br />
              farti saltare in aria.
              <br />
              Goditi pure la tua preziosa reliquia,
              <br />
              te la sei guadagnata.
            </>
          ) : (
            <>
              Gotham ha pagato il prezzo!
              <br />
              Ora la Bat Caverna non esiste più!
            </>
          )}
        </p>
        {won && <Timer seconds={seconds} tone="primary" />}
        <Button tone={won ? "primary" : "secondary"} onClick={onContinue}>
          {won ? "SCOPRI LA STATUA" : "RIPROVA LA MISSIONE"}
        </Button>
      </div>
    </section>
  );
}
