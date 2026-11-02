import { Button, Logos } from "../components/ui/DesignSystem";
export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="ds-start"
      data-figma-node="143:332"
      aria-labelledby="start-title"
    >
      <div className="ds-start-stack">
        <Logos />
        <div className="ds-start-title">
          <h1 id="start-title" className="ds-display ds-glow-text">
            BATMAN
            <br />
            STATUE EXPERIENCE
          </h1>
        </div>
        <div className="ds-start-action">
          <Button onClick={onStart}>INIZIA LA MISSIONE</Button>
        </div>
      </div>
    </section>
  );
}
