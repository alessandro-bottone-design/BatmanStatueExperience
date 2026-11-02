import { useEffect } from "react";
export default function PauseOverlay() {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document
      .querySelector<HTMLButtonElement>(
        'button[aria-label="Riprendi esperienza"]',
      )
      ?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <section
      className="ds-pause ds-centered"
      aria-labelledby="pause-title"
      data-figma-node="155:331"
    >
      <h1 id="pause-title" className="ds-display ds-purple ds-glow-text">
        MISSIONE IN PAUSA
      </h1>
    </section>
  );
}
