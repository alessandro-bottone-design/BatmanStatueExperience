import { Button, Timer } from "../components/ui/DesignSystem";
export default function FinalReveal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <section
      className="ds-win ds-centered"
      data-figma-node="52:357"
      aria-labelledby="win-title"
    >
      <h1 id="win-title" className="ds-display ds-purple ds-glow-text">
        BOMBA
        <br />
        DISINNESCATA
      </h1>
      <p className="ds-body">
        &quot;Complimenti, Bats…
        <br />
        Per una volta non era mia intenzione farti saltare in aria.
        <br />
        Goditi pure la tua preziosa reliquia — te la sei guadagnata.&quot;
      </p>
      <Timer seconds={0} />
      <Button emphasis onClick={onComplete}>
        SCOPRI LA STATUA
      </Button>
    </section>
  );
}
