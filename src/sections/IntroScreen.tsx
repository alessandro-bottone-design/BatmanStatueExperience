import { useEffect, useRef, useState } from "react";
import { Button, Timer } from "../components/ui/DesignSystem";

const STORY = [
  "BATMAN...\nHO LASCIATO UN REGALINO\nNELLA TUA PREZIOSA CAVERNA...",
  "RISOLVI IL GIOCO\nO LA TUA CAVERNA DIVENTERÀ POLVERE",
  "NON È IL SOLITO GIOCATTOLO,\nMA QUALCOSA CHE FARÀ IL BOTTO...",
  "IL TEMPO SCORRE.\nTIC, TAC, TIC, TAC BAT...",
  "TROVA I MIEI 5 INDIZI\nDIMOSTRAMI CHE IL GRANDE PIPISTRELLO\nSA ANCORA GIOCARE.",
] as const;
const STORY_NODES = [
  "252:2150",
  "252:2149",
  "252:2148",
  "252:2147",
  "252:2145",
];
const FRAME_DURATION = 5000;

export default function IntroScreen({
  onBegin,
  isPaused,
}: {
  onBegin: () => void;
  isPaused: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const remaining = useRef(FRAME_DURATION);
  const briefing = frame === STORY.length;
  const accept = useRef<HTMLButtonElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const transferFocus = useRef(false);

  useEffect(() => {
    if (briefing || isPaused) return;
    const started = performance.now();
    let advanced = false;
    const timer = setTimeout(() => {
      if (frame === STORY.length - 2) {
        transferFocus.current = document.activeElement === skip.current;
      } else if (frame === STORY.length - 1) {
        transferFocus.current = document.activeElement === heading.current;
      }
      advanced = true;
      remaining.current = FRAME_DURATION;
      setFrame((previous) => previous + 1);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      if (!advanced) {
        remaining.current = Math.max(
          0,
          remaining.current - (performance.now() - started),
        );
      }
    };
  }, [briefing, frame, isPaused]);

  useEffect(() => {
    if (!transferFocus.current) return;
    (briefing ? accept.current : heading.current)?.focus();
    transferFocus.current = false;
  }, [briefing, frame]);

  return (
    <section
      className={
        "ds-storytelling ds-centered" + (briefing ? " ds-briefing" : "")
      }
      data-figma-node={briefing ? "252:2146" : STORY_NODES[frame]}
      aria-label="Introduzione alla missione"
    >
      {briefing ? (
        <>
          <Timer seconds={180} />
          <Button ref={accept} tone="secondary" onClick={onBegin}>
            ACCETTA LA SFIDA
          </Button>
        </>
      ) : (
        <>
          <h1
            ref={heading}
            tabIndex={-1}
            className="ds-display ds-purple ds-glow-text"
            aria-live="polite"
          >
            {STORY[frame]}
          </h1>
          {frame < STORY.length - 1 && (
            <Button ref={skip} tone="secondary" onClick={onBegin}>
              SALTA INTRO
            </Button>
          )}
        </>
      )}
    </section>
  );
}
