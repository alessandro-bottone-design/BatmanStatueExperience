# Regole di Sviluppo del Progetto (Antigravity & AI Agents)

Questo file definisce le regole operative vincolanti per il progetto **Batman Statue Experience**.

---

## 1. Regola di Rendering: Ambiente 3D Batcaverna 360° (`BatCaverna_Batcomputer360.mp4`)

### Ambito di applicazione: le schermate con UI su ambiente Batcomputer
Nelle schermate in cui l'interfaccia utente (UI) è posizionata al di sopra dell'ambiente Batcomputer (`public/assets/textures/BatCaverna_Batcomputer360.mp4` / `.jpg`):
1. **Start Screen** (`StartScreen`)
2. **Storytelling** (Monologo Joker in `IntroScreen`)
3. **Briefing** (Accetta la sfida in `IntroScreen`)
4. **Tutorial Tappa 1** — "Batti il tempo" (`BatcomputerBootOverlay`)
5. **Tutorial Tappa 2** — "Risolvi gli enigmi" (`BatcomputerBootOverlay`)
6. **Tutorial Tappa 3** — "Trova tutti gli indizi" (`BatcomputerBootOverlay`)
7. **Tutorial Tappa 4** — "Esplora l'ambiente" (`BatcomputerBootOverlay`)
8. **Schermata di Pausa** (`PauseOverlay`)
9. **Esito Missione** — Vittoria o Sconfitta (`MissionResult`)
10. **Checkout** — 4 tappe compilazione (`Checkout`)
11. **Thank You Page** / Conferma preordine (`ThankYouPage`)
12. **Errore 404** / Frequenza smarrita (`NotFound`)

### Regola vincolante:
> **L'ambiente 3D deve essere sempre "chiuso" con panorama a 360 gradi (proiezione sferica prospettica 3D), MAI "aperto" come video o immagine equirettangolare 2D piana.**

- **COSA È VIETATO ("Ambiente aperto")**:
  - È severamente vietato visualizzare il file equirettangolare 2:1 (`BatCaverna_Batcomputer360.mp4` / `.jpg`) tramite un semplice tag `<video>` o `background-image` HTML piatto con `object-fit: cover`. Questa modalità srotola la sfera equirettangolare in 2D ("aperta"), producendo gravi deformazioni prospettiche e curvature anomale del pavimento (distorsione polare/nadir), come avveniva precedentemente nella schermata Checkout.

- **COSA È RICHIESTO ("Ambiente chiuso con panorama a 360°")**:
  - L'ambiente deve essere proiettato su una geometria sferica 3D (`sphereGeometry` Three.js con normale invertita / `BackSide`) osservata dall'interno con camera prospettica (`PerspectiveCamera`), esattamente come avviene per il modulo di esplorazione 3D (`SharedPanoramaCanvas`).
  - La visuale deve mantenere le linee rette prospettiche dell'architettura della Batcaverna senza distorsioni sferiche equirettangolari visibili.
  - Sulle schermate touch/mobile prive di supporto WebGL desktop, mantenere il fallback statico ottimizzato e privo di distorsioni visibili.

---

## 2. Regola di Trasparenza della Navbar
- La navbar (`.ds-navbar`) appartiene al Design System ed è **completamente trasparente** (`background: transparent;`).
- Non devono mai essere introdotte barre scure, gradienti o sfondi opachi dietro la navbar.
- L'ambiente 3D o i filmati a schermo intero devono estendersi a filo del bordo superiore (`inset: 0`), posizionando i controlli dell'HUD direttamente in overlay sulla scena.

