// All sound uses the same mute/pause policy; nothing loads before a user action.
let music: HTMLAudioElement | null = null;
let muted = false,
  paused = false;
let context: AudioContext | null = null;
let master: GainNode | null = null;
const sources = new Set<AudioScheduledSourceNode>();
const clips = new Set<HTMLAudioElement>();
let laughBuffer: AudioBuffer | null = null;
function graph() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.connect(context.destination);
  }
  master!.gain.value = muted || paused ? 0 : 1;
  if (!paused) void context.resume().catch(() => {});
  return { ctx: context, gain: master! };
}
function sync() {
  if (music) {
    music.muted = muted;
    if (paused) music.pause();
    else void music.play().catch(() => {});
  }
  for (const clip of clips) {
    clip.muted = muted;
    if (paused) clip.pause();
    else void clip.play().catch(() => {});
  }
  if (master && context)
    master.gain.setValueAtTime(muted || paused ? 0 : 1, context.currentTime);
  if (context)
    void (paused ? context.suspend() : context.resume()).catch(() => {});
}
export const BatcavernAudio = {
  preload() {
    try {
      const { ctx } = graph();
      if (!laughBuffer && ctx.state !== "closed") {
        void fetch("/assets/audio/RisataJoker.wav")
          .then((res) => (res.ok ? res.arrayBuffer() : null))
          .then((buf) => (buf ? ctx.decodeAudioData(buf) : null))
          .then((decoded) => {
            if (decoded) laughBuffer = decoded;
          })
          .catch(() => {});
      }
    } catch {
      /* Audio is optional. */
    }
  },
  start(_fade?: number) {
    if (muted || paused) return;
    if (!music) {
      music = new Audio("/assets/audio/SiglaBatman.wav");
      music.loop = true;
      music.volume = 0.3;
    }
    void music.play().catch(() => {});
    try {
      const { ctx } = graph();
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {});
      }
      this.preload();
    } catch {
      /* Audio is optional. */
    }
  },
  setMuted(value: boolean) {
    muted = value;
    sync();
  },
  setPaused(value: boolean) {
    paused = value;
    sync();
  },
  isPlaying() {
    return !!music && !music.paused;
  },
  getInstance() {
    return music;
  },
  beep(frequency: number, type: OscillatorType = "sine", duration = 0.25) {
    if (muted || paused) return;
    try {
      const { ctx, gain } = graph();
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0.08, ctx.currentTime);
      envelope.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration,
      );
      oscillator.connect(envelope);
      envelope.connect(gain);
      sources.add(oscillator);
      oscillator.onended = () => {
        sources.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      /* Audio is optional. */
    }
  },
  clip(src: string) {
    if (muted || paused) return () => {};
    const clip = new Audio(src);
    clip.volume = 0.16;
    clips.add(clip);
    clip.onended = () => clips.delete(clip);
    void clip.play().catch(() => clips.delete(clip));
    return () => {
      clip.pause();
      clip.removeAttribute("src");
      clip.load();
      clips.delete(clip);
    };
  },
  spatialLaugh() {
    let cancelled = false;
    let source: AudioBufferSourceNode | null = null;
    const nodes: AudioNode[] = [];
    void (async () => {
      try {
        const { ctx, gain } = graph();
        if (ctx.state === "suspended") {
          await ctx.resume().catch(() => {});
        }
        if (!laughBuffer) {
          const response = await fetch("/assets/audio/RisataJoker.wav");
          if (!response.ok) return;
          laughBuffer = await ctx.decodeAudioData(await response.arrayBuffer());
        }
        if (cancelled || muted || paused || ctx.state === "closed") return;
        source = ctx.createBufferSource();
        source.buffer = laughBuffer;
        // Rallentamento inquietante e cupo della voce del Joker
        source.playbackRate.value = 0.62 + Math.random() * 0.13;

        // Volume procedurale via di mezzo: varia da 0.09 (in lontananza) a 0.22 (più presente),
        // simulando distanze diverse senza mai essere assordante né inudibile.
        const volumeVal = 0.09 + Math.random() * 0.13;

        // Lowpass: le rocce della caverna smorzano le alte frequenze in lontananza
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650 + Math.random() * 1350;
        filter.Q.value = 0.7;

        // Posizione stereo casuale nello spazio della caverna (-0.85 a +0.85)
        const pan = ctx.createStereoPanner();
        const panVal = (Math.random() * 2 - 1) * 0.85;
        pan.pan.value = panVal;

        const mainVolume = ctx.createGain();
        mainVolume.gain.value = volumeVal;

        // Eco 1: riflessione vicina rimbalzata dalla parete opposta
        const delay1 = ctx.createDelay(2);
        delay1.delayTime.value = 0.32 + Math.random() * 0.18;
        const echo1Pan = ctx.createStereoPanner();
        echo1Pan.pan.value = panVal * -0.45;
        const echo1Gain = ctx.createGain();
        echo1Gain.gain.value = volumeVal * 0.34;

        // Eco 2: riverbero profondo del fondo della caverna
        const delay2 = ctx.createDelay(2);
        delay2.delayTime.value = 0.72 + Math.random() * 0.35;
        const echo2Pan = ctx.createStereoPanner();
        echo2Pan.pan.value = panVal * -0.7;
        const echo2Gain = ctx.createGain();
        echo2Gain.gain.value = volumeVal * 0.16;

        // Connessione percorso diretto
        source.connect(filter);
        filter.connect(pan);
        pan.connect(mainVolume);
        mainVolume.connect(gain);

        // Connessione riflessione eco 1
        filter.connect(delay1);
        delay1.connect(echo1Pan);
        echo1Pan.connect(echo1Gain);
        echo1Gain.connect(gain);

        // Connessione riflessione eco 2
        filter.connect(delay2);
        delay2.connect(echo2Pan);
        echo2Pan.connect(echo2Gain);
        echo2Gain.connect(gain);

        nodes.push(
          filter,
          pan,
          mainVolume,
          delay1,
          echo1Pan,
          echo1Gain,
          delay2,
          echo2Pan,
          echo2Gain,
        );
        sources.add(source);
        const current = source;
        source.onended = () => {
          sources.delete(current);
          current.disconnect();
          for (const node of nodes) node.disconnect();
        };
        source.start();
      } catch {
        /* Optional audio must never block a scene. */
      }
    })();
    return () => {
      cancelled = true;
      try {
        source?.stop();
      } catch {
        /* Already ended. */
      }
    };
  },
  stop() {
    music?.pause();
    music?.removeAttribute("src");
    music?.load();
    music = null;
    for (const clip of clips) {
      clip.pause();
      clip.removeAttribute("src");
      clip.load();
    }
    clips.clear();
    for (const source of sources) {
      try {
        source.stop();
      } catch {
        /* Already ended. */
      }
    }
    sources.clear();
    if (context) void context.close().catch(() => {});
    laughBuffer = null;
    context = null;
    master = null;
    muted = false;
    paused = false;
  },
};
