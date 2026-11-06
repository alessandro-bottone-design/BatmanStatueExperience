import { useEffect } from "react";
export default function PauseOverlay() {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document
      .querySelector<HTMLButtonElement>(
        'button[aria-label="Riprendi esperienza"]',
      )
      ?.focus({ preventScroll: true });
    return () => previous?.focus({ preventScroll: true });
  }, []);
  return (
    <section
      className="ds-pause ds-centered"
      aria-labelledby="pause-title"
      data-figma-node="239:3271"
    >
      <h1 id="pause-title" className="ds-display ds-purple">
        MISSIONE IN PAUSA
      </h1>
    </section>
  );
}
