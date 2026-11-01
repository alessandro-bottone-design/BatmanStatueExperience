import { useEffect, useRef, useState, type FormEvent } from "react";
import FormInput from "../components/ui/FormInput";
import { Button } from "../components/ui/DesignSystem";
import {
  EMPTY_FORM,
  orderTotal,
  validateCheckout,
  type CheckoutData,
  type CheckoutErrors,
  type PaymentMethod,
} from "../lib/checkout";
const PERSONAL = [
  ["fullName", "NOME", "BRUCE WAYNE"],
  ["region", "REGIONE", "CAMPANIA"],
  ["birthDate", "DATA DI NASCITA", "GG/MM/AAAA"],
  ["provincia", "PROVINCIA", "NA"],
  ["email", "EMAIL", "BRUCEWAYNE@GMAIL.COM"],
  ["address", "INDIRIZZO", "VIALE KENNEDY 15"],
  ["password", "PASSWORD", "PASSWORD"],
  ["city", "CITTÀ", "NAPOLI"],
  ["phone", "NUMERO DI TELEFONO", "+39 000 0000 000"],
  ["cap", "CODICE POSTALE", "80125"],
] as const;
const CARD = [
  ["cardOwner", "NOME INTESTATARIO", "BRUCE WAYNE"],
  ["cardNumber", "NUMERO CARTA", "0000 0000 0000 0000"],
  ["cardExpiry", "DATA DI SCADENZA", "MM/AA"],
  ["cardCvv", "CVV", "000"],
] as const;
export default function Checkout({
  onSuccess,
}: {
  onSuccess: (quantity: number, total: number) => void;
}) {
  const [data, setData] = useState<CheckoutData>({ ...EMPTY_FORM });
  const [method, setMethod] = useState<PaymentMethod>("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      pending.current = false;
    },
    [],
  );
  function change(key: keyof CheckoutData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    if (submitted) setErrors(validateCheckout(next, method));
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    const next = validateCheckout(data, method);
    setErrors(next);
    setSubmitted(true);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    pending.current = true;
    setLoading(true);
    timer.current = setTimeout(() => {
      if (!pending.current) return;
      pending.current = false;
      onSuccess(1, orderTotal());
    }, 4000);
  }
  const field = ([key, label, placeholder]: readonly [
    keyof CheckoutData,
    string,
    string,
  ]) => (
    <FormInput
      key={key}
      name={key}
      label={label}
      placeholder={placeholder}
      value={data[key]}
      error={errors[key]}
      onChange={(e) => change(key, e.target.value)}
      disabled={loading}
      type={
        key === "password" ? "password" : key === "email" ? "email" : "text"
      }
      inputMode={
        ["phone", "cap", "cardNumber", "cardCvv"].includes(key)
          ? "numeric"
          : undefined
      }
    />
  );
  return (
    <section
      className="ds-checkout"
      data-figma-node="101:2086"
      aria-label="Checkout dimostrativo"
    >
      <form
        ref={form}
        noValidate
        autoComplete="off"
        onSubmit={submit}
        className="ds-checkout-layout"
        aria-describedby="demo-disclosure"
      >
        <div className="ds-personal">
          <h1 className="ds-heading ds-glow-text">
            DATI PERSONALI E SPEDIZIONE
          </h1>
          <div className="ds-personal-grid">{PERSONAL.map(field)}</div>
        </div>
        <div className="ds-order-column">
          <div className="ds-order-official">
            <div className="ds-order-summary">
              <h2 className="ds-heading ds-glow-text">ORDINE</h2>
              <dl>
                <div>
                  <dt className="ds-heading ds-glow-text">BATMAN STATUE</dt>
                  <dd className="ds-body-space ds-white">700€</dd>
                </div>
                <div>
                  <dt className="ds-heading ds-glow-text">SPEDIZIONE</dt>
                  <dd className="ds-body-space ds-white">50€</dd>
                </div>
                <div>
                  <dt className="ds-heading ds-glow-text">TOTALE</dt>
                  <dd className="ds-body-space ds-white">750€</dd>
                </div>
              </dl>
              <h2 className="ds-body-small-space">
                SELEZIONA METODO DI PAGAMENTO
              </h2>
            </div>
            <fieldset className="ds-payment">
              <legend className="sr-only">Metodo di pagamento simulato</legend>
              {(["paypal", "card"] as const).map((value) => (
                <div
                  key={value}
                  className={
                    "ds-payment-option" +
                    (method === value ? " ds-payment-selected" : "")
                  }
                >
                  <label className="ds-payment-label">
                    <span className="ds-radio-slot">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={method === value}
                        disabled={loading}
                        onChange={() => {
                          setMethod(value);
                          if (submitted)
                            setErrors(validateCheckout(data, value));
                        }}
                      />
                    </span>
                    <span className="ds-body-small-space">
                      {value === "paypal"
                        ? "PAYPAL"
                        : "CARTA DI CREDITO O DEBITO"}
                    </span>
                  </label>
                  {value === "card" && method === "card" && (
                    <div className="ds-card-fields">{CARD.map(field)}</div>
                  )}
                </div>
              ))}
              {errors.paymentMethod && (
                <p className="ds-caption ds-purple" role="alert">
                  {errors.paymentMethod}
                </p>
              )}
              <div className="ds-checkout-submit">
                <Button disabled={!method || loading} type="submit">
                  CHECKOUT
                </Button>
              </div>
            </fieldset>
            <div className="ds-order-provisional">
              <p className="demo-banner legacy-pending" id="demo-disclosure">
                Utilizza solo dati fittizi. Checkout dimostrativo: nessun
                pagamento, account o ordine reale.
              </p>
              {loading && (
                <p role="status" className="legacy-pending">
                  Elaborazione della simulazione…
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
