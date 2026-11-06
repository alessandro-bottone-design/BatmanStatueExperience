import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import PauseOverlay from "./components/ui/PauseOverlay";
import BatcaveBackdrop from "./components/cinematic/BatcaveBackdrop";
import Navbar, { type NavPhase } from "./components/layout/Navbar";
import IntroScreen from "./sections/IntroScreen";
import StartScreen from "./sections/StartScreen";
import BatcomputerBootOverlay from "./components/ui/BatcomputerBootOverlay";
import MissionResult from "./sections/MissionResult";
import { Cursor, MobileNotice } from "./components/ui/DesignSystem";
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
  const failed = status === "failed";
  const viewPhase = failed ? "loss" : phase;
  const previousView = useRef(viewPhase);
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
    if (previousView.current === viewPhase) return;
    previousView.current = viewPhase;
    setPaused(false);
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [viewPhase]);
  useEffect(() => {
    if (state.completed === 5 && status === "active")
      dispatch({ type: "win", time: time.timeLeft });
  }, [state.completed, status, time.timeLeft]);
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
    BatcavernAudio.setPaused(paused);
  }, [paused]);
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
    const change = () => {
      const target = phaseFromHash(location.hash);
      if (target === "thankyou" && !state.order) {
        history.replaceState(null, "", "#statua");
      }
      dispatch({ type: "navigate", phase: target });
    };
    window.addEventListener("popstate", change);
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("popstate", change);
      window.removeEventListener("hashchange", change);
    };
  }, [state.order]);
  useEffect(() => {
    if (location.hash === "#conferma" && !state.order)
      history.replaceState(null, "", "#statua");
  }, [state.order]);
  const canPause = phase !== "checkout" && phase !== "thankyou";
  const togglePause = () => setPaused((previous) => !previous);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !event.repeat &&
        !event.defaultPrevented &&
        canPause
      ) {
        setPaused((previous) => !previous);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [canPause]);
  useEffect(() => {
    if (!paused || phase !== "showreel") return;
    const position = window.scrollY;
    const keepPosition = () => {
      if (window.scrollY !== position) window.scrollTo(0, position);
    };
    const preventWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) event.preventDefault();
    };
    window.addEventListener("scroll", keepPosition, { passive: true });
    window.addEventListener("wheel", preventWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", keepPosition);
      window.removeEventListener("wheel", preventWheel);
    };
  }, [paused, phase]);
  const showBackdrop =
    paused || failed || (!playing && !transition && phase !== "showreel");
  const goStatue = () => navigate("showreel");
  const goCheckout = () => navigate("checkout");
  let navPhase: NavPhase;
  if (failed) navPhase = "loss";
  else if (phase === "reveal") navPhase = "win";
  else if (
    phase === "batcomputer" ||
    phase === "armeria" ||
    phase === "batmobile" ||
    transition
  )
    navPhase = "gamification";
  else navPhase = phase;
  return (
    <div
      className="experience-shell"
      data-phase={viewPhase}
      data-paused={paused || undefined}
    >
      {showBackdrop && <BatcaveBackdrop />}
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
      <Navbar
        phase={navPhase}
        isMuted={muted}
        onToggleMute={() => {
          const next = !muted;
          BatcavernAudio.setMuted(next);
          if (!next) BatcavernAudio.start();
          setMuted(next);
        }}
        isPaused={paused}
        onTogglePause={canPause ? togglePause : undefined}
        onPreorder={phase === "showreel" && !paused ? goCheckout : undefined}
        completedCount={phase === "tutorial" ? 0 : state.completed}
        timeLeft={phase === "tutorial" ? 180 : time.timeLeft}
      />
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
            {transition && !failed && (
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
            {phase === "reveal" && (
              <MissionResult won seconds={state.time} onContinue={goStatue} />
            )}
            {phase === "showreel" && <Statue onPreorder={goCheckout} />}
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
          {failed && (
            <MissionResult
              won={false}
              seconds={0}
              onContinue={() => navigate("start")}
            />
          )}
        </div>
        {paused && <PauseOverlay />}
      </main>
      <Cursor />
    </div>
  );
}
