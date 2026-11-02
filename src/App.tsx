import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import PauseOverlay from "./components/ui/PauseOverlay";
import Navbar, { type NavPhase } from "./components/layout/Navbar";
import IntroScreen from "./sections/IntroScreen";
import StartScreen from "./sections/StartScreen";
import BatcomputerBootOverlay from "./components/ui/BatcomputerBootOverlay";
import FinalReveal from "./sections/FinalReveal";
import { Button, Cursor, MobileNotice } from "./components/ui/DesignSystem";
import { useDesktop } from "./hooks/useDesktop";
import { useMissionTimer } from "./hooks/useMissionTimer";
import {
  experienceReducer,
  initialExperience,
  phaseFromHash,
} from "./lib/experience";
import { BatcavernAudio } from "./lib/audioManager";
import ErrorBoundary from "./components/ui/ErrorBoundary";
const Panorama = lazy(
  () => import("./components/cinematic/SharedPanoramaCanvas"),
);
const Transition = lazy(
  () => import("./components/cinematic/CinematicVideoPlayer"),
);
const Statue = lazy(() => import("./components/cinematic/BatmanCamera"));
const Checkout = lazy(() => import("./sections/Checkout"));
const Confirmation = lazy(() => import("./sections/ThankYouPage"));
const JokerAudio = lazy(() => import("./components/joker/JokerAudioManager"));
export default function App() {
  const desktop = useDesktop();
  return desktop ? (
    <MotionConfig reducedMotion="user">
      <Experience />
    </MotionConfig>
  ) : (
    <MobileNotice />
  );
}
function Experience() {
  const [state, dispatch] = useReducer(
    experienceReducer,
    initialExperience,
    (s) =>
      experienceReducer(s, {
        type: "navigate",
        phase: phaseFromHash(location.hash),
      }),
  );
  const { phase, status, run } = state;
  const [paused, setPaused] = useState(false),
    [muted, setMuted] = useState(false),
    [ready, setReady] = useState(false);
  const reduced = !!useReducedMotion(),
    heading = useRef<HTMLDivElement>(null);
  const transition = phase === "transition1" || phase === "transition2";
  const scene =
    phase === "armeria" || phase === "transition2"
      ? "armeria"
      : phase === "batmobile"
        ? "batmobile"
        : "batcomputer";
  const playing =
    status === "active" &&
    ["batcomputer", "armeria", "batmobile"].includes(phase);
  const time = useMissionTimer(
    status,
    paused || !ready,
    transition,
    useCallback(() => dispatch({ type: "fail" }), []),
  );
  const { resetTimer } = time;
  useEffect(() => {
    resetTimer();
  }, [run, resetTimer]);
  useEffect(() => {
    setPaused(false);
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [phase]);
  useEffect(() => {
    if (state.completed === 5 && status === "active")
      dispatch({ type: "win", time: time.elapsedSeconds });
  }, [state.completed, status, time.elapsedSeconds]);
  useEffect(() => {
    if (
      state.completed === 2 &&
      status === "active" &&
      time.elapsedSeconds <= 45 &&
      !time.bonusTimeGranted
    )
      time.grantBonusTime(60);
  }, [state.completed, status, time]);
  useEffect(() => {
    BatcavernAudio.setMuted(muted);
    BatcavernAudio.setPaused(paused);
  }, [muted, paused]);
  useEffect(() => () => BatcavernAudio.stop(), []);
  const navigate = useCallback((target: "start" | "showreel" | "checkout") => {
    const hash =
      target === "showreel"
        ? "#statua"
        : target === "checkout"
          ? "#checkout"
          : "";
    if (location.hash !== hash)
      history.pushState(null, "", location.pathname + location.search + hash);
    dispatch({ type: "navigate", phase: target });
  }, []);
  useEffect(() => {
    const change = () =>
      dispatch({ type: "navigate", phase: phaseFromHash(location.hash) });
    window.addEventListener("popstate", change);
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("popstate", change);
      window.removeEventListener("hashchange", change);
    };
  }, []);
  useEffect(() => {
    if (location.hash === "#conferma" && !state.order)
      history.replaceState(null, "", "#statua");
  }, [state.order]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        (playing || transition || phase === "storytelling")
      )
        setPaused((p) => !p);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [playing, transition, phase]);
  const goStatue = () => navigate("showreel");
  let navPhase: NavPhase | null = null;
  if (playing || transition) navPhase = "gamification";
  else if (phase === "storytelling") navPhase = "storytelling";
  else if (phase === "reveal") navPhase = "win";
  else if (phase === "showreel" || phase === "checkout" || phase === "thankyou")
    navPhase = phase;
  return (
    <div
      className="experience-shell"
      data-phase={phase}
      style={
        navPhase ? undefined : ({ "--nav-height": "0px" } as CSSProperties)
      }
    >
      <a
        className="skip-link"
        href="#experience-content"
        onClick={(e) => {
          e.preventDefault();
          heading.current?.focus();
        }}
      >
        Salta al contenuto
      </a>
      {navPhase && (
        <Navbar
          phase={navPhase}
          isMuted={muted}
          onToggleMute={() => {
            BatcavernAudio.start();
            setMuted((m) => !m);
          }}
          isPaused={paused}
          onTogglePause={() => setPaused((p) => !p)}
          completedCount={state.completed}
          timeLeft={time.timeLeft}
        />
      )}
      <main id="experience-content" ref={heading} tabIndex={-1}>
        <div
          inert={paused ? true : undefined}
          aria-hidden={paused ? true : undefined}
        >
          <Suspense
            fallback={
              <div className="loading-screen legacy-pending" role="status">
                Inizializzazione della Batcaverna…
              </div>
            }
          >
            {phase === "start" && (
              <StartScreen
                onStart={() => {
                  BatcavernAudio.start();
                  dispatch({ type: "storytelling" });
                }}
              />
            )}
            {phase === "storytelling" && (
              <IntroScreen
                onBegin={() => dispatch({ type: "tutorial" })}
                isPaused={paused}
              />
            )}
            {phase === "tutorial" && (
              <BatcomputerBootOverlay
                onComplete={() => dispatch({ type: "start" })}
              />
            )}
            {playing && (
              <ErrorBoundary key={run + scene} onExit={goStatue}>
                <Panorama
                  key={run + scene}
                  scene={scene}
                  onProgress={(count) => dispatch({ type: "progress", count })}
                  baseCompleted={
                    scene === "batcomputer" ? 0 : scene === "armeria" ? 2 : 3
                  }
                  isPaused={paused}
                  isMuted={muted}
                  isMissionActive
                  onNext={() => dispatch({ type: "next" })}
                  onReady={setReady}
                  onExit={goStatue}
                />
              </ErrorBoundary>
            )}
            {transition && (
              <Transition
                key={phase}
                src={
                  phase === "transition1"
                    ? "./assets/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4"
                    : "./assets/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"
                }
                isPaused={paused}
                reducedMotion={reduced}
                onEnded={() => dispatch({ type: "next" })}
              />
            )}
            {phase === "reveal" && <FinalReveal onComplete={goStatue} />}
            {phase === "showreel" && (
              <Statue onPreorder={() => navigate("checkout")} />
            )}
            {phase === "checkout" && (
              <Checkout
                onSuccess={(quantity, total) => {
                  dispatch({ type: "purchase", order: { quantity, total } });
                  history.pushState(null, "", "#conferma");
                }}
              />
            )}
            {phase === "thankyou" && state.order && (
              <Confirmation onReturnHome={() => navigate("start")} />
            )}
            {playing && !reduced && (
              <JokerAudio
                isActive={status === "active"}
                isMuted={muted}
                isPaused={paused}
              />
            )}
          </Suspense>
          {status === "failed" && (
            <section
              className="ds-loss ds-centered"
              aria-labelledby="failed-title"
              data-figma-node="132:413"
            >
              <h1
                id="failed-title"
                className="ds-display ds-purple ds-glow-text"
              >
                MISSIONE FALLITA
              </h1>
              <p className="ds-body">
                Gotham ha pagato il prezzo!
                <br />
                Ora la Bat Caverna non esiste più!
              </p>
              <Button
                tone="secondary"
                emphasis
                onClick={() => navigate("start")}
              >
                RIPROVA LA MISSIONE
              </Button>
            </section>
          )}
        </div>
        {paused && <PauseOverlay />}
      </main>
      <Cursor />
    </div>
  );
}
