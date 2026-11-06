import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const BATCOMPUTER = "/assets/textures/BatCaverna_Batcomputer360";

export default function BatcaveBackdrop() {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let texture: THREE.Texture | null = null;
    let animId: number | null = null;
    let frameCallbackId: number | null = null;
    let alive = true;

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

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      const material = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderScene = () => {
        if (!alive || !renderer || !scene || !camera) return;
        renderer.render(scene, camera);
      };

      if (!reduced && video && !failed) {
        const videoTex = new THREE.VideoTexture(video);
        videoTex.colorSpace = THREE.SRGBColorSpace;
        videoTex.minFilter = THREE.LinearFilter;
        videoTex.magFilter = THREE.LinearFilter;
        videoTex.generateMipmaps = false;
        texture = videoTex;
        material.map = videoTex;
        material.needsUpdate = true;

        const loop = () => {
          if (!alive) return;
          renderScene();
          if ("requestVideoFrameCallback" in video) {
            frameCallbackId = (
              video as HTMLVideoElement & {
                requestVideoFrameCallback: (cb: () => void) => number;
              }
            ).requestVideoFrameCallback(loop);
          } else {
            animId = requestAnimationFrame(loop);
          }
        };

        if (video.readyState >= 2) {
          loop();
        } else {
          video.oncanplay = () => {
            if (alive) loop();
          };
        }
      } else {
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
            texture = tex;
            material.map = tex;
            material.needsUpdate = true;
            renderScene();
          },
          undefined,
          () => {
            if (alive) setFailed(true);
          },
        );
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
        if (texture) texture.dispose();
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch {
      return () => {
        alive = false;
      };
    }
  }, [reduced, failed]);

  return (
    <div className="batcave-backdrop" aria-hidden="true" inert>
      <canvas ref={canvasRef} className="batcave-backdrop-canvas" />
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
