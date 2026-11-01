import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";
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
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: "big" | "medium" | "small";
  emphasis?: boolean;
}) {
  return (
    <button
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
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; tone?: Tone }) {
  return (
    <button
      {...props}
      className={"ds-icon-button ds-" + tone + " " + className}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Logos() {
  return (
    <div
      className="ds-logos"
      aria-label="Sideshow per Batman"
      data-figma-node="16:871"
    >
      <span className="ds-sideshow">
        <img src="/assets/ds/sideshow.svg" alt="Sideshow" />
      </span>
      <span className="ds-logo-x ds-heading">X</span>
      <span className="ds-batman">
        <img src="/assets/ds/batman.svg" alt="Batman" />
      </span>
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
            ? "16:573"
            : "16:572"
          : tone === "secondary"
            ? "16:574"
            : "16:575"
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
      <section
        className="ds-mobile-card"
        data-figma-node="114:325"
        aria-labelledby="mobile-title"
      >
        <h1 id="mobile-title" className="ds-heading ds-glow-text">
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
