import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "../../components/ui/DesignSystem";

const STEPS = [
  [
    "307:4305",
    "BATTI IL TEMPO",
    "Hai a disposizione 3 Minuti.\nSe il timer scade la missione fallisce",
  ],
  [
    "307:4304",
    "RISOLVI GLI ENIGMI",
    "Rispondi correttamente alle domande\nposte dal Joker per procedere",
  ],
  [
    "307:4303",
    "TROVA TUTTI GLI INDIZI",
    "Individua tutte le Joker Cards\nnascoste nell’oscurità",
  ],
  [
    "307:4302",
    "ESPLORA L’AMBIENTE",
    "Muovi il cursore\nai bordi dello schermo\nper esplorare la BatCaverna a 360 gradi.",
  ],
] as const;

export default function BatcomputerBootOverlay({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const start = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  useEffect(() => {
    if (!transferFocus.current) return;
    (last ? start.current : next.current)?.focus();
    transferFocus.current = false;
  }, [last, step]);
  const [node, title, description] = STEPS[step];

  return (
    <section
      className="ds-tutorial ds-centered"
      data-figma-node="243:3639"
      aria-labelledby="tutorial-title"
    >
      <div
        className="ds-panel ds-secondary ds-tutorial-intro"
        data-figma-node="243:3612"
      >
        <h1 id="tutorial-title" className="ds-display">
          ALLARME ALLA
          <br />
          BATCAVERNA
        </h1>
        <p className="ds-body">
          Joker ha attivato una bomba nella BatCaverna.
          <br />
          Individua tutti e 5 gli indizi e neutralizza la minaccia
          <br />
          prima dello scadere del tempo.
        </p>
      </div>
      <div
        className="ds-panel ds-secondary ds-tutorial-card"
        data-figma-node={node}
      >
        <div className="ds-tutorial-copy" aria-live="polite" aria-atomic="true">
          <h2 className="ds-body-space ds-glow-text">{title}</h2>
          <p className="ds-body">{description}</p>
        </div>
        <div className="ds-tutorial-actions">
          <IconButton
            tone="secondary"
            icon="chevron-left"
            aria-label="Istruzione precedente"
            disabled={step === 0}
            onClick={(event) => {
              transferFocus.current =
                step === 1 && document.activeElement === event.currentTarget;
              setStep(step - 1);
            }}
          />
          {last ? (
            <Button ref={start} tone="secondary" onClick={onComplete}>
              INIZIA LA MISSIONE
            </Button>
          ) : (
            <IconButton
              tone="secondary"
              icon="chevron-right"
              ref={next}
              aria-label="Istruzione successiva"
              onClick={(event) => {
                transferFocus.current =
                  step === STEPS.length - 2 &&
                  document.activeElement === event.currentTarget;
                setStep(step + 1);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
