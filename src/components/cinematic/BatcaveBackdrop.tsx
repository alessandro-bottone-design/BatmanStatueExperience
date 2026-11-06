import { useState } from "react";
import { useReducedMotion } from "motion/react";

const BATCOMPUTER = "/assets/textures/BatCaverna_Batcomputer360";

export default function BatcaveBackdrop() {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  return (
    <div className="batcave-backdrop" aria-hidden="true" inert>
      {!reduced && !failed && (
        <video
          src={BATCOMPUTER + ".mp4"}
          poster={BATCOMPUTER + ".jpg"}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
