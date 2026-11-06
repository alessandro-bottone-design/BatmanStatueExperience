import { Button } from "../../components/ui/DesignSystem";

const ITEMS = [
  ["ID-TRANSAZIONE", "ord-bw-4019"],
  ["PRODOTTO", "Batman Statue"],
  ["STATO", "Ordine Confermato"],
  ["SPEDIZIONE IN ARRIVO", "15/01/2027"],
  ["DATA ACQUISTO", "12/12/2026"],
  ["QUANTITÀ", "x1"],
];

export default function ThankYouPage({
  onReturnHome,
}: {
  onReturnHome: () => void;
}) {
  return (
    <section
      className="ds-thankyou ds-centered"
      data-figma-node="243:3874"
      aria-labelledby="thankyou-title"
    >
      <div className="ds-panel ds-thankyou-card" data-figma-node="243:3817">
        <header>
          <h1 id="thankyou-title" className="ds-display ds-glow-text">
            ACQUISTO ANDATO
            <br />A BUON FINE
          </h1>
          <p className="ds-body">
            Il tuo ordine è stato registrato con successo.
          </p>
        </header>
        <dl>
          {ITEMS.map(([label, value]) => (
            <div key={label}>
              <dt className="ds-heading ds-glow-text">{label}</dt>
              <dd className="ds-body">{value}</dd>
            </div>
          ))}
        </dl>
        <Button onClick={onReturnHome}>TORNA ALLA HOME</Button>
      </div>
      <p className="demo-banner legacy-pending ds-confirmation-notice">
        Dimostrazione. Ordine, pagamento, spedizione, ID e date sono simulati.
      </p>
    </section>
  );
}
