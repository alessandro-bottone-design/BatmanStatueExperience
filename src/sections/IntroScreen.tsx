import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Button, Timer } from "../components/ui/DesignSystem";
export default function IntroScreen({
  onBegin,
  isPaused,
}: {
  onBegin: () => void;
  isPaused: boolean;
}) {
  const reduced = useReducedMotion();
  const [final, setFinal] = useState(false);
  const remaining = useRef(12000);
  useEffect(() => {
    if (final || isPaused || reduced) return;
    const started = performance.now();
    let fired = false;
    const timer = setTimeout(() => {
      fired = true;
      setFinal(true);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      if (!fired)
        remaining.current = Math.max(
          0,
          remaining.current - performance.now() + started,
        );
    };
  }, [final, isPaused, reduced]);
  return (
    <section
      className="ds-storytelling ds-centered"
      data-figma-node={final ? "49:458" : "49:463"}
    >
      {final ? (
        <>
          <Timer seconds={180} />
          <Button tone="secondary" onClick={onBegin} disabled={isPaused}>
            ACCETTA LA SFIDA
          </Button>
        </>
      ) : (
        <>
          <h1 className="ds-display ds-purple ds-glow-text">
            BATMAN...
            <br />
            HO LASCIATO UN REGALINO
            <br />
            NELLA TUA PREZIOSA CAVERNA...
          </h1>
          <Button
            tone="secondary"
            onClick={() => setFinal(true)}
            disabled={isPaused}
          >
            SALTA L'INTRO
          </Button>
        </>
      )}
    </section>
  );
}
