import { useEffect, useRef, useState } from "react";
import { BatcavernAudio } from "../../lib/audioManager";
interface Props {
  id: number;
  riddle: string;
  options: string[];
  correctAnswer: string;
  active: boolean;
  disabled: boolean;
  hint: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSuccess: (id: number) => void;
  onKeyboardFocus: () => void;
}
export default function JokerCard({
  id,
  riddle,
  options,
  correctAnswer,
  active,
  disabled,
  hint,
  onOpen,
  onClose,
  onSuccess,
  onKeyboardFocus,
}: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const front = useRef<HTMLButtonElement>(null),
    answers = useRef<HTMLDivElement>(null);
  const callback = useRef(onSuccess);
  callback.current = onSuccess;
  const correct = chosen === correctAnswer;
  const wasActive = useRef(false);
  const remainingSuccess = useRef(850);
  useEffect(() => {
    if (active)
      answers.current?.querySelector<HTMLButtonElement>("button")?.focus();
    else {
      setChosen(null);
      if (wasActive.current) front.current?.focus({ preventScroll: true });
    }
    wasActive.current = active;
  }, [active]);
  useEffect(() => {
    if (!correct) {
      remainingSuccess.current = 850;
      return;
    }
    if (disabled) return;
    const started = performance.now();
    let fired = false;
    const timer = setTimeout(() => {
      fired = true;
      callback.current(id);
    }, remainingSuccess.current);
    return () => {
      clearTimeout(timer);
      if (!fired)
        remainingSuccess.current = Math.max(
          0,
          remainingSuccess.current - performance.now() + started,
        );
    };
  }, [correct, disabled, id]);
  useEffect(() => {
    if (!active) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!correct) onClose();
    };
    window.addEventListener("keydown", escape, true);
    return () => window.removeEventListener("keydown", escape, true);
  }, [active, disabled, correct, onClose]);
  useEffect(() => {
    if (!active) return;
    const outside = (event: PointerEvent) => {
      if (
        !(event.target as Element)?.closest(".ds-world-clue,nav") &&
        !disabled &&
        !correct
      ) {
        onClose();
        front.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [active, disabled, correct, onClose]);
  return (
    <div
      className={"ds-world-clue" + (hint ? " ds-clue-hint" : "")}
      data-clue-id={id}
      data-face={active ? "back" : "front"}
      data-feedback={chosen ? (correct ? "success" : "error") : "active"}
    >
      <div className="ds-clue-inner">
        <button
          ref={front}
          className="clue-card ds-clue-front"
          aria-label={"Apri indizio " + id}
          aria-expanded={active}
          aria-hidden={active}
          inert={active}
          disabled={disabled || active}
          onClick={onOpen}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) onKeyboardFocus();
          }}
          onPointerDown={(e) => {
            if (e.button === 0) e.currentTarget.setPointerCapture(e.pointerId);
          }}
          data-figma-node="16:196"
        >
          <span>
            <img src="/assets/ds/card-front.png" alt="" draggable={false} />
          </span>
        </button>
        <div
          ref={answers}
          className="ds-clue-back"
          role="group"
          aria-labelledby={"riddle-" + id}
          aria-hidden={!active}
          inert={!active}
          data-figma-node="64:1025"
        >
          <div className="ds-card-back-art" aria-hidden="true">
            <span className="ds-card-art-top">
              <img src="/assets/ds/card-back.png" alt="" />
            </span>
            <span className="ds-card-art-middle">
              <img src="/assets/ds/card-back.png" alt="" />
            </span>
            <span className="ds-card-art-bottom">
              <img src="/assets/ds/card-back.png" alt="" />
            </span>
          </div>
          <div className="ds-card-content">
            {chosen && (
              <p
                className={
                  "ds-answer-label ds-caption " +
                  (correct ? "ds-answer-success" : "ds-answer-error")
                }
                role="status"
              >
                {correct ? "RISPOSTA CORRETTA" : "RISPOSTA ERRATA"}
              </p>
            )}
            <p className="ds-question" id={"riddle-" + id}>
              {riddle}
            </p>
            {options.map((option) => (
              <button
                key={option}
                className="ds-answer"
                disabled={disabled || (correct && chosen !== option)}
                data-state={
                  chosen === option
                    ? correct
                      ? "success"
                      : "error"
                    : correct
                      ? "disabled"
                      : "active"
                }
                onClick={() => {
                  if (correct) return;
                  setChosen(option);
                  BatcavernAudio.beep(
                    option === correctAnswer ? 880 : 150,
                    option === correctAnswer ? "sine" : "sawtooth",
                  );
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
