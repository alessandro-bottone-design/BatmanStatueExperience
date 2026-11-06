import { useEffect, useRef, useState, type FormEvent } from "react";
import FormInput from "../../components/ui/FormInput";
import { Button, IconButton } from "../../components/ui/DesignSystem";
import {
  EMPTY_FORM,
  PRICE,
  SHIPPING,
  orderTotal,
  validateCheckout,
  type CheckoutData,
  type CheckoutErrors,
  type PaymentMethod,
} from "./checkoutModel";

const PERSONAL = [
  ["phone", "NUMERO DI TELEFONO", "+39 000 000 000"],
  ["fullName", "NOME E COGNOME", "BRUCE WAYNE"],
  ["email", "EMAIL", "BRUCEWAYNE@GMAIL.COM"],
  ["birthDate", "DATA DI NASCITA", "GG/MM/AAAA"],
  ["password", "PASSWORD", "PASSWORD"],
] as const;
const SHIPPING_FIELDS = [
  ["region", "REGIONE", "CAMPANIA"],
  ["provincia", "PROVINCIA", "NA"],
  ["city", "CITTÀ", "NAPOLI"],
  ["cap", "CAP", "80125"],
  ["address", "INDIRIZZO", "VIALE KENNEDY, 15"],
] as const;
const CARD = [
  ["cardOwner", "NOME INTESTATARIO", "BRUCE WAYNE"],
  ["cardNumber", "NUMERO CARTA", "0000 0000 0000 0000"],
  ["cardExpiry", "DATA DI SCADENZA", "MM/AA"],
  ["cardCvv", "CVV", "000"],
] as const;
const STEPS = [
  {
    id: "314:2102",
    name: "personal",
    title: "DATI PERSONALI",
    fields: PERSONAL.map(([key]) => key),
  },
  {
    id: "314:2101",
    name: "shipping",
    title: "DATI DI SPEDIZIONE",
    fields: SHIPPING_FIELDS.map(([key]) => key),
  },
  {
    id: "314:2100",
    name: "payment",
    title: "METODO DI PAGAMENTO",
    fields: ["paymentMethod", ...CARD.map(([key]) => key)],
  },
  { id: "314:2103", name: "order", title: "ORDINE", fields: [] },
] as const;
type Field = readonly [keyof CheckoutData, string, string];

export default function Checkout({
  onSuccess,
}: {
  onSuccess: (quantity: number, total: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckoutData>({ ...EMPTY_FORM });
  const [method, setMethod] = useState<PaymentMethod>("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusError = useRef(false);
  const current = STEPS[step];
  const isOrder = current.name === "order";

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (focusError.current) {
      form.current
        ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
        ?.focus();
      focusError.current = false;
    } else {
      heading.current?.focus();
    }
  }, [step]);

  function change(key: keyof CheckoutData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    if (errors[key])
      setErrors({ ...errors, [key]: validateCheckout(next, method)[key] });
  }

  function select(value: PaymentMethod) {
    setMethod(value);
    setErrors({});
  }

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current !== null) return;

    const validation = validateCheckout(data, method);
    const invalidStep = isOrder
      ? STEPS.findIndex((stage) => stage.fields.some((key) => validation[key]))
      : current.fields.some((key) => validation[key])
        ? step
        : -1;
    if (invalidStep !== -1) {
      setErrors(validation);
      if (invalidStep !== step) {
        focusError.current = true;
        setStep(invalidStep);
      } else {
        requestAnimationFrame(() =>
          form.current
            ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
            ?.focus(),
        );
      }
      return;
    }

    if (!isOrder) {
      setErrors({});
      setStep(step + 1);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(() => {
      onSuccess(1, orderTotal());
    }, 4000);
  }

  const field = ([key, label, placeholder]: Field) => (
    <FormInput
      key={key}
      name={key}
      label={label}
      placeholder={placeholder}
      value={data[key]}
      error={errors[key]}
      onChange={(event) => change(key, event.target.value)}
      type={
        key === "password" ? "password" : key === "email" ? "email" : "text"
      }
      inputMode={
        key === "phone"
          ? "tel"
          : ["cap", "cardNumber", "cardCvv"].includes(key)
            ? "numeric"
            : undefined
      }
    />
  );

  return (
    <section
      className="ds-checkout"
      data-figma-node="314:2693"
      aria-labelledby="checkout-title"
    >
      <h1 id="checkout-title" className="ds-display">
        CHECKOUT
      </h1>
      {current.name === "personal" && (
        <p
          className="demo-banner legacy-pending ds-checkout-notice"
          id="demo-disclosure"
        >
          Utilizza solo dati fittizi. Checkout dimostrativo: nessun pagamento,
          account o ordine reale.
        </p>
      )}
      <form
        ref={form}
        noValidate
        autoComplete="off"
        onSubmit={advance}
        className={"ds-panel ds-checkout-card ds-checkout-" + current.name}
        aria-labelledby="checkout-step-title"
        aria-describedby={
          current.name === "personal" ? "demo-disclosure" : undefined
        }
        data-figma-node={current.id}
      >
        <h2
          id="checkout-step-title"
          ref={heading}
          tabIndex={-1}
          className="ds-heading ds-glow-text"
        >
          {current.title}
        </h2>
        {current.name === "personal" && (
          <div className="ds-checkout-grid">{PERSONAL.map(field)}</div>
        )}
        {current.name === "shipping" && (
          <div className="ds-checkout-grid">{SHIPPING_FIELDS.map(field)}</div>
        )}
        {current.name === "payment" && (
          <fieldset className="ds-payment">
            <legend className="sr-only">Metodo di pagamento simulato</legend>
            {(["paypal", "card"] as const).map((value) => (
              <div key={value} className="ds-payment-option">
                <label className="ds-payment-label">
                  <span className="ds-radio-slot">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={method === value}
                      aria-invalid={!!errors.paymentMethod}
                      aria-describedby={
                        errors.paymentMethod ? "payment-error" : undefined
                      }
                      onChange={() => select(value)}
                    />
                  </span>
                  <span className="ds-body-small-space ds-bold ds-glow-text">
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
              <p
                id="payment-error"
                className="ds-caption ds-purple"
                role="alert"
              >
                {errors.paymentMethod}
              </p>
            )}
          </fieldset>
        )}
        {isOrder && (
          <dl className="ds-order-summary">
            <div>
              <dt>BATMAN STATUE</dt>
              <dd>{PRICE}€</dd>
            </div>
            <div>
              <dt>SPEDIZIONE</dt>
              <dd>{SHIPPING}€</dd>
            </div>
            <div>
              <dt>TOTALE</dt>
              <dd>{orderTotal()}€</dd>
            </div>
          </dl>
        )}
        <div className="ds-checkout-actions">
          {step > 0 && (
            <IconButton
              icon="chevron-left"
              aria-label="Tappa precedente"
              disabled={loading}
              onClick={() => {
                setErrors({});
                setStep(step - 1);
              }}
            />
          )}
          {isOrder ? (
            <Button disabled={loading} type="submit">
              CHECKOUT
            </Button>
          ) : (
            <IconButton
              icon="chevron-right"
              aria-label="Tappa successiva"
              type="submit"
            />
          )}
        </div>
        {loading && (
          <p role="status" className="legacy-pending">
            Elaborazione della simulazione…
          </p>
        )}
      </form>
    </section>
  );
}
