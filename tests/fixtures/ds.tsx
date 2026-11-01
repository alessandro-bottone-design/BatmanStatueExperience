import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  IconButton,
  Timer,
  Logos,
  Cursor,
  type Tone,
  type IconName,
} from "../../src/components/ui/DesignSystem";
import FormInput from "../../src/components/ui/FormInput";
import JokerCard from "../../src/components/joker/JokerCard";
import "../../src/index.css";
function Field() {
  const [value, setValue] = useState("");
  return (
    <FormInput
      label="LABEL"
      placeholder="PLACEHOLDER"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={value === "invalid" ? "SUPPORTING TEXT" : undefined}
    />
  );
}
function Card() {
  const [active, setActive] = useState(false);
  return (
    <JokerCard
      id={99}
      riddle="Non è un uomo, non è un mostro, non è un re... eppure tutta Gotham trattiene il fiato quando compare nel cielo notturno."
      options={["Joker", "Batsegnale", "Pinguino", "Arkham"]}
      correctAnswer="Batsegnale"
      active={active}
      disabled={false}
      hint={false}
      onOpen={() => setActive(true)}
      onClose={() => setActive(false)}
      onSuccess={() => {}}
      onKeyboardFocus={() => {}}
    />
  );
}
function Fixture() {
  return (
    <main
      style={{
        padding: 80,
        display: "flex",
        flexDirection: "column",
        gap: 80,
        alignItems: "flex-start",
      }}
    >
      <h1 className="ds-heading">Verifica componenti Figma</h1>
      <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>
        {(["primary", "secondary"] as Tone[]).map((tone) => (
          <section
            key={tone}
            style={{ display: "flex", gap: 40, alignItems: "center" }}
          >
            {(["big", "medium", "small"] as const).map((size) => (
              <Button
                key={size}
                tone={tone}
                size={size}
                data-testid={tone + "-" + size}
              >
                BUTTON
              </Button>
            ))}
            <Button tone={tone} disabled data-testid={tone + "-disabled"}>
              BUTTON
            </Button>
            <Button tone={tone} emphasis data-testid={tone + "-pressed"}>
              BUTTON
            </Button>
          </section>
        ))}
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        {(
          [
            "chevron-left",
            "chevron-right",
            "audio-off",
            "audio-on",
            "play",
            "pause",
          ] as IconName[]
        ).map((icon) => (
          <IconButton key={icon} icon={icon} aria-label={icon} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        {(["primary", "secondary"] as Tone[]).map((tone) => (
          <section
            key={tone}
            style={{ display: "flex", gap: 40, alignItems: "center" }}
          >
            <Timer seconds={180} tone={tone} />
            <Timer seconds={180} tone={tone} small />
          </section>
        ))}
      </div>
      <Logos />
      <Field />
      <Card />
      <Cursor />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
