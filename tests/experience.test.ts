import { test } from "node:test";
import assert from "node:assert/strict";
import {
  experienceReducer as reduce,
  initialExperience as initial,
  phaseFromHash,
} from "../src/lib/experience";
import { EMPTY_FORM, orderTotal, validateCheckout } from "../src/lib/checkout";
const story = () => reduce(initial, { type: "storytelling" });
const mission = () =>
  reduce(reduce(story(), { type: "tutorial" }), { type: "start" });
test("start, storytelling and tutorial are distinct guarded steps", () => {
  assert.equal(initial.phase, "start");
  assert.equal(reduce(initial, { type: "start" }), initial);
  assert.equal(reduce(initial, { type: "tutorial" }), initial);
  assert.equal(story().phase, "storytelling");
  assert.equal(reduce(story(), { type: "tutorial" }).phase, "tutorial");
  assert.equal(mission().phase, "batcomputer");
});
test("confirmation requires a valid single-item demo checkout", () => {
  assert.equal(
    reduce(initial, { type: "navigate", phase: "thankyou" }).phase,
    "showreel",
  );
  assert.equal(
    reduce(initial, { type: "purchase", order: { quantity: 1, total: 750 } }),
    initial,
  );
  const checkout = reduce(initial, { type: "navigate", phase: "checkout" });
  for (const order of [
    { quantity: 0, total: 750 },
    { quantity: 2, total: 1450 },
    { quantity: 1, total: 0 },
    { quantity: 1, total: NaN },
  ])
    assert.equal(reduce(checkout, { type: "purchase", order }), checkout);
  assert.equal(
    reduce(checkout, { type: "purchase", order: { quantity: 1, total: 750 } })
      .phase,
    "thankyou",
  );
  assert.equal(orderTotal(), 750);
});
test("five clues across three scenes are required to win", () => {
  let s = mission();
  assert.equal(reduce(s, { type: "win", time: 40 }), s);
  s = reduce(s, { type: "progress", count: 2 });
  s = reduce(s, { type: "next" });
  assert.equal(s.phase, "transition1");
  s = reduce(s, { type: "next" });
  assert.equal(s.phase, "armeria");
  s = reduce(s, { type: "progress", count: 3 });
  s = reduce(reduce(s, { type: "next" }), { type: "next" });
  assert.equal(s.phase, "batmobile");
  s = reduce(s, { type: "progress", count: 5 });
  const win = reduce(s, { type: "win", time: 89 });
  assert.equal(win.status, "succeeded");
  assert.equal(win.phase, "reveal");
  assert.equal("speedrun" in win, false);
});
test("failure cannot progress and reset starts a clean run", () => {
  let s = reduce(mission(), { type: "fail" });
  assert.equal(reduce(s, { type: "next" }), s);
  s = reduce(s, { type: "navigate", phase: "showreel" });
  assert.equal(s.status, "idle");
  assert.deepEqual(reduce(s, { type: "reset" }), {
    ...initial,
    run: s.run + 1,
  });
});
test("hash routes expose product screens without arbitrary mission skips", () => {
  assert.equal(phaseFromHash("#statua"), "showreel");
  assert.equal(phaseFromHash("#checkout"), "checkout");
  assert.equal(phaseFromHash("#armeria"), "start");
});
const valid = {
  ...EMPTY_FORM,
  fullName: "Bruce Demo",
  region: "Campania",
  birthDate: "01/01/1990",
  provincia: "NA",
  email: "demo@example.com",
  address: "Via Demo 15",
  password: "fittizia",
  city: "Napoli",
  phone: "+39 3330000000",
  cap: "80125",
  cardOwner: "Bruce Demo",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/30",
  cardCvv: "123",
};
const now = new Date(2026, 10, 1);
test("PayPal is simulated and does not require card details", () => {
  assert.deepEqual(
    validateCheckout(
      { ...valid, cardNumber: "", cardOwner: "", cardExpiry: "", cardCvv: "" },
      "paypal",
      now,
    ),
    {},
  );
  assert.ok(validateCheckout(valid, "", now).paymentMethod);
});
test("card input validates digits, expiry, phone, date and postal code", () => {
  assert.deepEqual(validateCheckout(valid, "card", now), {});
  const bad = validateCheckout(
    {
      ...valid,
      cardNumber: "abc",
      cardExpiry: "01/00",
      phone: "abc",
      cap: "abc",
      birthDate: "31/02/2026",
    },
    "card",
    now,
  );
  assert.ok(
    bad.cardNumber && bad.cardExpiry && bad.phone && bad.cap && bad.birthDate,
  );
  assert.ok(
    validateCheckout({ ...valid, birthDate: "01/01/2099" }, "paypal", now)
      .birthDate,
  );
  assert.deepEqual(
    validateCheckout({ ...valid, cardExpiry: "11/26" }, "card", now),
    {},
  );
});
