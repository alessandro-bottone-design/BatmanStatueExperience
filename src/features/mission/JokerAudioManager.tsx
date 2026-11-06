import { useEffect, useRef } from "react";
import { BatcavernAudio } from "../../lib/audioManager";

// Parametri temporali: primo effetto sorpresa dopo 18-28s,
// poi intervalli casuali e distanziati di 45-75s per non risultare mai invadenti
const INITIAL_DELAY_MIN_MS = 18_000;
const INITIAL_DELAY_MAX_MS = 28_000;
const LAUGH_INTERVAL_MIN_MS = 45_000;
const LAUGH_INTERVAL_MAX_MS = 75_000;

export default function JokerAudioManager({
  isActive,
  isMuted,
  isPaused,
}: {
  isActive: boolean;
  isMuted: boolean;
  isPaused: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopLaughRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isActive || isMuted || isPaused) {
      if (stopLaughRef.current) {
        stopLaughRef.current();
        stopLaughRef.current = null;
      }
      return;
    }

    const schedule = (isFirst: boolean) => {
      const min = isFirst ? INITIAL_DELAY_MIN_MS : LAUGH_INTERVAL_MIN_MS;
      const max = isFirst ? INITIAL_DELAY_MAX_MS : LAUGH_INTERVAL_MAX_MS;
      const delay = min + Math.random() * (max - min);

      timerRef.current = setTimeout(() => {
        if (!isActive || isMuted || isPaused) return;
        stopLaughRef.current = BatcavernAudio.spatialLaugh();
        schedule(false);
      }, delay);
    };

    schedule(true);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (stopLaughRef.current) {
        stopLaughRef.current();
        stopLaughRef.current = null;
      }
    };
  }, [isActive, isMuted, isPaused]);

  return null;
}
