import { useState } from "react";
import { Button, IconButton } from "./DesignSystem";
const STEPS = [
  [
    "ESPLORA L'AMBIENTE",
    <>
      Muovi il cursore
      <br />
      ai bordi dello schermo
      <br />
      per esplorare la BatCaverna a 360 gradi.
    </>,
  ],
  [
    "TROVA GLI INDIZI",
    <>
      Cerca cinque carte del Joker:
      <br />
      due al Batcomputer, una nell’Armeria
      <br />e due vicino alla Batmobile.
    </>,
  ],
  [
    "RISOLVI GLI ENIGMI",
    <>
      Clicca una carta per girarla
      <br />e scegli la risposta corretta.
      <br />
      Puoi usare anche Tab e Invio.
    </>,
  ],
  [
    "CONTROLLA IL TEMPO",
    <>
      Hai tre minuti per disinnescare la bomba.
      <br />
      Esc mette in pausa l’esplorazione
      <br />o richiude la carta aperta.
    </>,
  ],
] as const;
export default function BatcomputerBootOverlay({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  return (
    <section
      className="ds-tutorial ds-centered"
      data-figma-node="54:461"
      aria-labelledby="tutorial-title"
    >
      <h1 id="tutorial-title" className="ds-display ds-purple ds-glow-text">
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
      <div className="ds-tutorial-card" data-figma-node="54:433">
        <h2 className="ds-body-space ds-purple" aria-live="polite">
          {STEPS[step][0]}
        </h2>
        <p className="ds-body">{STEPS[step][1]}</p>
        <div className="ds-tutorial-actions">
          <IconButton
            tone="secondary"
            icon="chevron-left"
            aria-label="Istruzione precedente"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          />
          <IconButton
            tone="secondary"
            icon="chevron-right"
            aria-label="Istruzione successiva"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep(step + 1)}
          />
          <Button tone="secondary" onClick={onComplete}>
            INIZIA LA MISSIONE
          </Button>
        </div>
      </div>
    </section>
  );
}
