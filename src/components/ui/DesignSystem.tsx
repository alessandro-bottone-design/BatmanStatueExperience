import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type Ref,
} from "react";
import BatcaveBackdrop from "../cinematic/BatcaveBackdrop";
export type Tone = "primary" | "secondary";
export type IconName =
  | "chevron-left"
  | "chevron-right"
  | "audio-on"
  | "audio-off"
  | "play"
  | "pause";
export function Button({
  tone = "primary",
  size = "big",
  emphasis = false,
  className = "",
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: "big" | "medium" | "small";
  emphasis?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      className={[
        "ds-button",
        "ds-" + tone,
        "ds-button-" + size,
        emphasis ? "ds-pressed" : "",
        className,
      ].join(" ")}
    />
  );
}
export function Icon({ name }: { name: IconName }) {
  return (
    <span
      className={"ds-icon ds-icon-" + name}
      aria-hidden="true"
      style={
        {
          "--icon-source": "url('/assets/ds/" + name + ".svg')",
        } as CSSProperties
      }
    />
  );
}
export function IconButton({
  icon,
  tone = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  tone?: Tone;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      {...props}
      className={"ds-icon-button ds-" + tone + " " + className}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Logos({ plain = false }: { plain?: boolean }) {
  return (
    <div
      className={"ds-logos" + (plain ? " ds-logos-plain" : " ds-glow-text")}
      aria-label="Sideshow × Batman"
      role="img"
      data-figma-node={plain ? "267:1712" : "264:1679"}
    >
      <img src="/assets/ds/sideshow.svg" alt="" />
      <img src="/assets/ds/brand-x.svg" alt="" />
      <img src="/assets/ds/batman.svg" alt="" />
    </div>
  );
}
export function Timer({
  seconds,
  small = false,
  tone = "secondary",
}: {
  seconds: number;
  small?: boolean;
  tone?: Tone;
}) {
  const value =
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    "." +
    String(seconds % 60).padStart(2, "0");
  return (
    <div
      className={"ds-timer ds-" + tone + (small ? " ds-timer-small" : "")}
      aria-label="Tempo alla detonazione"
      data-figma-node={
        small
          ? tone === "secondary"
            ? "239:3077"
            : "239:3079"
          : tone === "secondary"
            ? "239:3078"
            : "239:3080"
      }
    >
      <span className={small ? "ds-caption" : "ds-body-space"}>
        TEMPO ALLA DETONAZIONE
      </span>
      <span className={small ? "ds-heading-l" : "ds-display"} role="timer">
        {value}
      </span>
    </div>
  );
}
export function MobileNotice() {
  return (
    <main className="ds-mobile-page">
      <BatcaveBackdrop />
      <header>
        <Logos />
      </header>
      <section
        className="ds-panel ds-mobile-card"
        data-figma-node="238:2970"
        aria-labelledby="mobile-title"
      >
        <h1 id="mobile-title" className="ds-heading">
          DISPOSITIVO
          <br />
          NON COMPATIBILE
        </h1>
        <p className="ds-body-small">
          L’esplorazione immersiva
          <br />
          della BatCaverna
          <br />
          richiede un monitor
          <br />
          desktop e un mouse.
        </p>
      </section>
    </main>
  );
}
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!ref.current || event.pointerType !== "mouse") return;
      ref.current.style.transform =
        "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      ref.current.hidden = false;
    };
    const hide = () => {
      if (ref.current) ref.current.hidden = true;
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="ds-cursor"
      hidden
      aria-hidden="true"
      data-figma-node="49:499"
    >
      <img src="/assets/ds/cursor.svg" alt="" />
    </div>
  );
}
