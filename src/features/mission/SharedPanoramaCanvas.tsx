import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Html } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { MouseLookControls } from "./MouseLookControls";
import JokerCard from "./JokerCard";
import JokerHintSystem from "./JokerHintSystem";
import { useJokerHint } from "./useJokerHint";
export type PanoramaScene = "batcomputer" | "armeria" | "batmobile";
interface Props {
  scene: PanoramaScene;
  onProgress: (count: number) => void;
  baseCompleted: number;
  isPaused: boolean;
  onNext: () => void;
  isMuted?: boolean;
  isMissionActive?: boolean;
  onReady?: (ready: boolean) => void;
  onExit?: () => void;
}
const BATCOMPUTER_RIDDLES = [
  {
    id: 1,
    riddle:
      "Non è un uomo, non è un mostro, non è un re... eppure tutta Gotham trattiene il fiato quando compare nel cielo notturno.",
    options: ["JOKER", "BAT SEGNALE", "PINGUINO", "ARKHAM"],
    correctAnswer: "BAT SEGNALE",
  },
  {
    id: 2,
    riddle:
      "Porto un sorriso eterno, ma non ho mai conosciuto la gioia. Più rido... più Gotham brucia.",
    options: ["ROBIN", "JOKER", "DUE FACCE", "ENIGMISTA"],
    correctAnswer: "JOKER",
  },
];
const ARMERIA_RIDDLE = {
  id: 3,
  riddle:
    "Non ho poteri sovrumani, eppure i criminali tremano al mio nome. Le tenebre sono il mio dominio.",
  options: ["SUPERMAN", "BATMAN", "BANE", "FLASH"],
  correctAnswer: "BATMAN",
};
const BATMOBILE_RIDDLES = [
  {
    id: 4,
    riddle:
      "Divoro l’asfalto di Gotham a velocità impossibili. Lascio solo fumo e terrore. Cosa sono?",
    options: ["BATWING", "BATMOBILE", "JOKER VAN", "TRENO DI GOTHAM"],
    correctAnswer: "BATMOBILE",
  },
  {
    id: 5,
    riddle:
      "Ruggio nell’oscurità di Gotham, il cuore pulsante della Bat Mobile, cosa sono?",
    options: ["PISTONE", "REATTORE", "TURBINA"],
    correctAnswer: "REATTORE",
  },
];

const ARMERIA_RIDDLES = [ARMERIA_RIDDLE];
const MEDIA = {
  batcomputer: "BatCaverna_Batcomputer360",
  armeria: "BatCaverna_Armeria360",
  batmobile: "BatCaverna_BatMobile360",
};
const POSITIONS: Record<PanoramaScene, [number, number, number][]> = {
  batcomputer: [
    [190, -30, 60],
    [-160, -20, 120],
  ],
  armeria: [[170, 40, -100]],
  batmobile: [
    [-180, -10, 80],
    [120, 30, -170],
  ],
};
export default function SharedPanoramaCanvas({
  scene,
  onProgress,
  baseCompleted,
  isPaused,
  onNext,
  isMuted = false,
  isMissionActive = true,
  onReady,
  onExit,
}: Props) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<
    [number, number, number] | null
  >(null);
  const [contextLost, setContextLost] = useState(false);
  const [graphics, setGraphics] = useState<
    "checking" | "available" | "unavailable"
  >("checking");
  useEffect(() => {
    const probe = document.createElement("canvas");
    try {
      const gl = probe.getContext("webgl2");
      setGraphics(gl ? "available" : "unavailable");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setGraphics("unavailable");
    }
  }, [retry]);
  useEffect(() => {
    const failedCreation = () => {
      onReady?.(false);
      setContextLost(true);
    };
    document.addEventListener(
      "webglcontextcreationerror",
      failedCreation,
      true,
    );
    return () =>
      document.removeEventListener(
        "webglcontextcreationerror",
        failedCreation,
        true,
      );
  }, [onReady]);
  useEffect(() => {
    onReady?.(!loading && graphics === "available" && !contextLost && !failed);
  }, [loading, graphics, contextLost, failed, onReady]);
  const video = useRef<HTMLVideoElement | null>(null);
  const reduced = !!useReducedMotion();
  const riddles =
    scene === "batcomputer"
      ? BATCOMPUTER_RIDDLES
      : scene === "armeria"
        ? ARMERIA_RIDDLES
        : BATMOBILE_RIDDLES;
  const hint = useJokerHint(
    isPaused || loading,
    isMissionActive,
    completed,
    active,
  );
  const { startHintTimer, resetHint } = hint;
  useEffect(() => {
    if (active !== null) return;
    const next = riddles.find((r) => !completed.includes(r.id));
    if (next) startHintTimer(next.id);
    else resetHint();
  }, [riddles, completed, active, startHintTimer, resetHint]);
  useEffect(() => {
    let alive = true,
      fallback = false;
    const textures = new Set<THREE.Texture>();
    setLoading(true);
    setFailed(false);
    setTexture(null);
    onReady?.(false);
    const ready = (tex: THREE.Texture) => {
      if (!alive) {
        tex.dispose();
        return;
      }
      textures.add(tex);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setTexture(tex);
      setLoading(false);
    };
    const nextScene =
      scene === "batcomputer"
        ? "armeria"
        : scene === "armeria"
          ? "batmobile"
          : null;
    if (nextScene) {
      const poster = new Image();
      poster.src = `/assets/textures/${MEDIA[nextScene]}.jpg`;
    }
    const loadStatic = () => {
      if (!alive || fallback) return;
      fallback = true;
      video.current?.pause();
      new THREE.TextureLoader().load(
        `/assets/textures/${MEDIA[scene]}.jpg`,
        ready,
        undefined,
        () => {
          if (alive) {
            setFailed(true);
            setLoading(false);
          }
        },
      );
    };
    const el = document.createElement("video");
    video.current = el;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.preload = "metadata";
    const tex = new THREE.VideoTexture(el);
    textures.add(tex);
    const playing = () => {
      if (!fallback) ready(tex);
    };
    el.addEventListener("playing", playing);
    el.addEventListener("error", loadStatic);
    if (reduced) loadStatic();
    else {
      el.src = `/assets/textures/${MEDIA[scene]}.mp4`;
      void el.play().catch(loadStatic);
    }
    const timeout = setTimeout(() => {
      if (el.readyState < 2) loadStatic();
    }, 8000);
    return () => {
      alive = false;
      clearTimeout(timeout);
      el.removeEventListener("playing", playing);
      el.removeEventListener("error", loadStatic);
      el.pause();
      el.removeAttribute("src");
      el.load();
      video.current = null;
      for (const item of textures) item.dispose();
      onReady?.(false);
    };
  }, [scene, retry, reduced, onReady]);
  useEffect(() => {
    const el = video.current;
    if (!el || reduced || !el.getAttribute("src")) return;
    if (isPaused) el.pause();
    else void el.play().catch(() => {});
  }, [isPaused, reduced]);
  const complete = useCallback(
    (id: number) => {
      if (completed.includes(id) || isPaused) return;
      const next = [...completed, id];
      setCompleted(next);
      setActive(null);
      onProgress(baseCompleted + next.length);
      if (next.length === riddles.length) onNext();
    },
    [completed, isPaused, baseCompleted, onProgress, onNext, riddles.length],
  );
  if (graphics === "unavailable")
    return (
      <section className="result-screen">
        <p className="eyebrow">MODALITÀ ALTERNATIVA</p>
        <h1>La Batcaverna non è disponibile.</h1>
        <p>
          Il browser non riesce ad avviare WebGL. Puoi riprovare o scoprire
          direttamente la statua.
        </p>
        <div className="action-row">
          <button
            onClick={() => {
              setGraphics("checking");
              setRetry((r) => r + 1);
            }}
          >
            Riprova
          </button>
          <button className="secondary" onClick={onExit}>
            Scopri la statua
          </button>
        </div>
      </section>
    );
  if (graphics === "checking")
    return (
      <div className="loading-screen" role="status">
        Verifica grafica…
      </div>
    );
  if (failed || contextLost)
    return (
      <section className="result-screen">
        <h1>Ambiente non disponibile</h1>
        <p>
          Non è stato possibile caricare questa area. Puoi riprovare oppure
          scoprire la statua.
        </p>
        <div className="action-row">
          <button
            onClick={() => {
              setContextLost(false);
              setRetry((r) => r + 1);
            }}
          >
            Riprova
          </button>
          <button className="secondary" onClick={onExit}>
            Scopri la statua
          </button>
        </div>
      </section>
    );
  return (
    <section className="panorama-scene" aria-label={`Esplorazione: ${scene}`}>
      <div aria-hidden={isPaused} inert={isPaused ? true : undefined}>
        <Canvas
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                onReady?.(false);
                setContextLost(true);
              },
              { once: true },
            );
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
          <MouseLookControls
            enabled={active === null && !isPaused && !loading}
            focusTarget={focusTarget}
          />
          {texture && (
            <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
              <sphereGeometry args={[500, 64, 64]} />
              <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>
          )}
          {riddles.map(
            (r, i) =>
              !completed.includes(r.id) && (
                <group position={POSITIONS[scene][i]} key={r.id}>
                  <Html center zIndexRange={[30, 20]}>
                    <JokerCard
                      {...r}
                      active={active === r.id}
                      hint={hint.hintCardId === r.id}
                      disabled={
                        isPaused ||
                        loading ||
                        (active !== null && active !== r.id)
                      }
                      onOpen={() => setActive(r.id)}
                      onClose={() => setActive(null)}
                      onSuccess={complete}
                      onKeyboardFocus={() =>
                        setFocusTarget([...POSITIONS[scene][i]])
                      }
                    />
                  </Html>
                </group>
              ),
          )}
        </Canvas>
        <div
          className="sr-only"
          aria-label="Raggiungi gli indizi con la tastiera"
        >
          {riddles
            .filter((r) => !completed.includes(r.id))
            .map((r) => (
              <button
                key={r.id}
                disabled={isPaused || loading || active !== null}
                onFocus={(event) => {
                  const target = event.currentTarget;
                  const index = riddles.findIndex((item) => item.id === r.id);
                  setFocusTarget([...POSITIONS[scene][index]]);
                  let attempts = 0;
                  const transfer = () => {
                    if (document.activeElement !== target) return;
                    const card = document.querySelector<HTMLButtonElement>(
                      '[data-clue-id="' + r.id + '"] .clue-card',
                    );
                    if (card && card.getClientRects().length)
                      card.focus({ preventScroll: true });
                    else if (attempts++ < 60) requestAnimationFrame(transfer);
                  };
                  requestAnimationFrame(transfer);
                }}
                onClick={() => setActive(r.id)}
              >
                Raggiungi indizio {r.id}
              </button>
            ))}
        </div>
      </div>
      <JokerHintSystem {...hint} isMuted={isMuted} isPaused={isPaused} />
      {loading && (
        <div className="loading-screen" role="status">
          Sincronizzazione area…
        </div>
      )}
    </section>
  );
}
