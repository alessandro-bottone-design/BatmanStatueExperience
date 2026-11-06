export const PRICE = 700,
  SHIPPING = 50;
export type PaymentMethod = "" | "paypal" | "card";
export const EMPTY_FORM = {
  fullName: "",
  region: "",
  birthDate: "",
  provincia: "",
  email: "",
  address: "",
  password: "",
  city: "",
  phone: "",
  cap: "",
  cardOwner: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};
export type CheckoutData = typeof EMPTY_FORM;
export type CheckoutErrors = Partial<
  Record<keyof CheckoutData | "paymentMethod", string>
>;
export function validateCheckout(
  data: CheckoutData,
  method: PaymentMethod,
  now = new Date(),
): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const personal: (keyof CheckoutData)[] = [
    "fullName",
    "region",
    "birthDate",
    "provincia",
    "email",
    "address",
    "password",
    "city",
    "phone",
    "cap",
  ];
  const required =
    method === "card"
      ? ([
          ...personal,
          "cardOwner",
          "cardNumber",
          "cardExpiry",
          "cardCvv",
        ] as (keyof CheckoutData)[])
      : personal;
  for (const key of required)
    if (!data[key].trim())
      errors[key] = "Compila questo campo con dati fittizi.";
  if (!method) errors.paymentMethod = "Seleziona un metodo dimostrativo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Inserisci un indirizzo email valido.";
  if (
    !/^\+?[\d ()-]{7,20}$/.test(data.phone.trim()) ||
    data.phone.replace(/\D/g, "").length < 7
  )
    errors.phone = "Inserisci almeno 7 cifre.";
  if (!/^\d{5}$/.test(data.cap.trim()))
    errors.cap = "Inserisci un codice postale di 5 cifre.";
  const birth = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.birthDate);
  const date = birth ? new Date(+birth[3], +birth[2] - 1, +birth[1]) : null;
  if (
    !birth ||
    !date ||
    date.getFullYear() !== +birth[3] ||
    date.getMonth() !== +birth[2] - 1 ||
    date.getDate() !== +birth[1] ||
    date > now
  )
    errors.birthDate = "Usa GG/MM/AAAA con una data valida.";
  if (method === "card") {
    if (!/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, "")))
      errors.cardNumber = "Inserisci da 13 a 19 cifre fittizie.";
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(data.cardExpiry.trim());
    if (
      !match ||
      new Date(2000 + +match[2], +match[1], 1) <=
        new Date(now.getFullYear(), now.getMonth(), 1)
    )
      errors.cardExpiry = "Usa MM/AA con una scadenza corrente o futura.";
    if (!/^\d{3,4}$/.test(data.cardCvv.trim()))
      errors.cardCvv = "Inserisci 3 o 4 cifre fittizie.";
  }
  return errors;
}
export function orderTotal() {
  return PRICE + SHIPPING;
}
