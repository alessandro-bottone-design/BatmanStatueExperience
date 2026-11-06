import { useEffect, useRef, type CSSProperties } from "react";
import { Button, IconButton, Logos, Timer } from "../ui/DesignSystem";

export type NavPhase =
  | "start"
  | "storytelling"
  | "tutorial"
  | "gamification"
  | "win"
  | "loss"
  | "showreel"
  | "checkout"
  | "thankyou"
  | "not-found";

type Props = {
  phase: NavPhase;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onPreorder?: () => void;
  completedCount?: number;
  timeLeft?: number;
};

export default function Navbar({
  phase,
  isMuted = false,
  onToggleMute,
  isPaused = false,
  onTogglePause,
  onPreorder,
  completedCount = 0,
  timeLeft = 180,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    const shell = nav?.parentElement;
    if (!nav || !shell) return;
    const update = () =>
      shell.style.setProperty("--nav-height", nav.offsetHeight + "px");
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    update();
    return () => {
      observer.disconnect();
      shell.style.removeProperty("--nav-height");
    };
  }, []);
  const showHud = phase === "gamification" || phase === "tutorial";

  return (
    <nav
      ref={ref}
      className="ds-navbar"
      aria-label="Controlli esperienza"
      data-figma-node="249:1659"
    >
      <div className="ds-navbar-left">
        {(phase !== "start" || isPaused) && <Logos />}
        {showHud && (
          <div className="ds-hud">
            <Timer seconds={timeLeft} small />
            <div
              className="ds-clue-progress"
              role="progressbar"
              aria-label="Indizi raccolti"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={completedCount}
              data-figma-node="238:2995"
            >
              <span className="ds-body-small-space">INDIZI RACCOLTI</span>
              <div>
                <span className="ds-caption">{completedCount} / 5</span>
                <span className="ds-progress-track">
                  {completedCount > 0 && (
                    <span
                      style={
                        {
                          "--progress-asset": `url(/assets/ds/progress-${completedCount === 5 ? "full" : completedCount}.svg)`,
                        } as CSSProperties
                      }
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {(onPreorder || onToggleMute || onTogglePause) && (
        <div className="ds-navbar-actions">
          {onPreorder && (
            <Button size="small" onClick={onPreorder}>
              PREORDINA IL CAVALIERE
            </Button>
          )}
          {onToggleMute && (
            <IconButton
              icon={isMuted ? "audio-off" : "audio-on"}
              aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
              aria-pressed={isMuted}
              onClick={onToggleMute}
            />
          )}
          {onTogglePause && (
            <IconButton
              icon={isPaused ? "play" : "pause"}
              aria-label={
                isPaused ? "Riprendi esperienza" : "Metti in pausa esperienza"
              }
              aria-pressed={isPaused}
              onClick={onTogglePause}
            />
          )}
        </div>
      )}
    </nav>
  );
}
