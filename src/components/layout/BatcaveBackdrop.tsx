import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useDesktop } from "../../hooks/useDesktop";

const BATCOMPUTER = "/assets/textures/BatCaverna_Batcomputer360";

export default function BatcaveBackdrop() {
  const isDesktop = useDesktop();
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animId: number | null = null;
    let alive = true;
    let videoTexture: THREE.VideoTexture | null = null;
    let staticTexture: THREE.Texture | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 0, 0.1);

      const geometry = new THREE.SphereGeometry(500, 64, 40);
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(-1, 1, 1);
      mesh.rotation.set(0, -Math.PI / 2, 0);
      scene.add(mesh);

      const renderScene = () => {
        if (!alive || !renderer || !scene || !camera) return;
        renderer.render(scene, camera);
      };

      // 1. Carica immediatamente la texture statica per eliminare qualsiasi schermata nera
      const loader = new THREE.TextureLoader();
      loader.load(
        BATCOMPUTER + ".jpg",
        (tex) => {
          if (!alive) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          staticTexture = tex;
          if (!videoTexture) {
            material.map = tex;
            material.needsUpdate = true;
            renderScene();
          }
        },
        undefined,
        () => {
          if (alive && !videoRef.current) setFailed(true);
        },
      );

      // 2. Loop di rendering attivo solo durante il playback del video
      let frameCallbackId: number | null = null;
      const startVideoLoop = () => {
        if (!alive) return;
        const loop = () => {
          if (!alive) return;
          renderScene();
          if (video && "requestVideoFrameCallback" in video) {
            frameCallbackId = (
              video as HTMLVideoElement & {
                requestVideoFrameCallback: (cb: () => void) => number;
              }
            ).requestVideoFrameCallback(loop);
          } else {
            animId = requestAnimationFrame(loop);
          }
        };
        loop();
      };

      // 3. Se consentito da prefers-reduced-motion, collega il video e passa alla VideoTexture
      const video = videoRef.current;
      if (!reduced && video && !failed) {
        const onPlaying = () => {
          if (!alive || !mesh) return;
          if (!videoTexture) {
            videoTexture = new THREE.VideoTexture(video);
            videoTexture.colorSpace = THREE.SRGBColorSpace;
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.generateMipmaps = false;
          }
          material.map = videoTexture;
          material.needsUpdate = true;
          startVideoLoop();
        };

        video.addEventListener("playing", onPlaying);
        if (video.readyState >= 2 && !video.paused) {
          onPlaying();
        } else {
          void video.play().catch(() => {
            // Autoplay bloccato dal browser: rimane visibile la texture statica 3D
          });
        }
      }

      const onResize = () => {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderScene();
      };

      window.addEventListener("resize", onResize);

      return () => {
        alive = false;
        window.removeEventListener("resize", onResize);
        if (animId !== null) cancelAnimationFrame(animId);
        if (
          frameCallbackId !== null &&
          video &&
          "cancelVideoFrameCallback" in video
        ) {
          (
            video as HTMLVideoElement & {
              cancelVideoFrameCallback: (id: number) => void;
            }
          ).cancelVideoFrameCallback(frameCallbackId);
        }
        if (videoTexture) videoTexture.dispose();
        if (staticTexture) staticTexture.dispose();
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch {
      return () => {
        alive = false;
      };
    }
  }, [isDesktop, reduced, failed]);

  return (
    <div className="batcave-backdrop" aria-hidden="true" inert>
      {isDesktop && (
        <canvas ref={canvasRef} className="batcave-backdrop-canvas" />
      )}
      {!reduced && !failed && (
        <video
          ref={videoRef}
          src={BATCOMPUTER + ".mp4"}
          poster={BATCOMPUTER + ".jpg"}
          autoPlay
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
