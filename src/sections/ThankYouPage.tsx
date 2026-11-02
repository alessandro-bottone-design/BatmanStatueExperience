import { Button } from "../components/ui/DesignSystem";
export default function ThankYouPage({
  onReturnHome,
}: {
  onReturnHome: () => void;
}) {
  const items = [
    ["ID TRANSAZIONE", "ORD-BW-4019"],
    ["PRODOTTO", "BATMAN STATUE"],
    ["STATO PROTOCOLLO", "ORDINE CONFERMATO"],
    ["SPEDIZIONE", "PREVISTA PER IL 15/01/2027"],
    ["DATA", "12/12/2026"],
    ["QUANTITÀ", "X1"],
  ];
  return (
    <>
      <section
        className="ds-thankyou ds-centered"
        data-figma-node="58:528"
        aria-labelledby="thankyou-title"
      >
        <header>
          <h1 id="thankyou-title" className="ds-display ds-glow-text">
            MISSIONE
            <br />
            COMPLETATA
          </h1>
          <p className="ds-body">
            Il tuo ordine è stato registrato con successo.
          </p>
        </header>
        <dl className="ds-thankyou-card">
          {items.map(([label, value]) => (
            <div key={label}>
              <dt className="ds-body-space ds-glow-text">{label}</dt>
              <dd className="ds-body-space ds-white">{value}</dd>
            </div>
          ))}
        </dl>
        <Button onClick={onReturnHome}>TORNA ALLA HOME</Button>
      </section>
      <p className="demo-banner legacy-pending ds-confirmation-notice">
        Nessun addebito effettuato. Nessun ordine creato e nessun dato del form
        salvato o inviato. ID e date sono esempi fittizi.
      </p>
    </>
  );
}
