import { useEffect, useRef } from "react";
import { IconButton, Logos, Timer } from "../ui/DesignSystem";
export type NavPhase =
  | "storytelling"
  | "gamification"
  | "win"
  | "showreel"
  | "checkout"
  | "thankyou";
interface Props {
  phase: NavPhase;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  completedCount: number;
  timeLeft: number;
}
export default function Navbar({
  phase,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  completedCount,
  timeLeft,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () =>
      document.documentElement.style.setProperty(
        "--nav-height",
        (ref.current?.offsetHeight ?? 166) + "px",
      );
    const observer = new ResizeObserver(update);
    if (ref.current) observer.observe(ref.current);
    update();
    return () => observer.disconnect();
  }, []);
  return (
    <nav
      ref={ref}
      className="ds-navbar"
      aria-label="Controlli esperienza"
      data-figma-node="64:1261"
    >
      <div className="ds-navbar-left">
        <Logos />
        {phase === "gamification" && (
          <>
            <Timer seconds={timeLeft} small />
            <div
              className="ds-clue-progress"
              role="progressbar"
              aria-label="Indizi raccolti"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={completedCount}
              data-figma-node="23:485"
            >
              <span className="ds-body-small-space">INDIZI RACCOLTI</span>
              <div>
                <span className="ds-caption">{completedCount} / 5</span>
                <span className="ds-progress-track">
                  <span
                    style={{
                      clipPath:
                        "inset(0 " +
                        (100 - (completedCount / 5) * 100) +
                        "% 0 0)",
                    }}
                  />
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="ds-navbar-actions">
        <IconButton
          icon={isMuted ? "audio-off" : "audio-on"}
          aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
          aria-pressed={isMuted}
          onClick={onToggleMute}
        />
        {(phase === "storytelling" || phase === "gamification") && (
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
    </nav>
  );
}
