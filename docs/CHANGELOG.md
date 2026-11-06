# Changelog

## 2026-11-06 (v2.1.1) — Risoluzione rendering panoramico 3D istantaneo, culling facce interne e stabilità di navigazione

- **Ottimizzazione rendering Three.js su BatcaveBackdrop**:
  - Risolto il problema delle schermate nere su produzione causato dal face-culling combinato (`scale(-1, 1, 1)` con `BackSide`): applicato `THREE.DoubleSide` e orientamento polare sincronizzato a `SharedPanoramaCanvas` (`rotation.y = -Math.PI / 2`).
  - Precaricamento istantaneo della texture statica `.jpg` ad alta risoluzione al montaggio, garantendo che l'ambiente 3D della Batcaverna sia visibile fin dal frame zero senza alcuna attesa del buffering video.
  - Transizione fluida alla `VideoTexture` non appena il video inizia il playback con avvio controllato e recupero trasparente in caso di blocco autoplay.
  - Svincolo del loop di animazione continuo quando il video non è attivo, riducendo a zero il carico GPU e l'occupazione del main thread.
- **Stabilità CSS stacking context**:
  - Impostato `background: transparent;` su `.experience-shell:has(> .batcave-backdrop)` e posizionamento controllato del backdrop a `z-index: 0` con `#experience-content` a `z-index: 10`, prevenendo qualsiasi sovrascrittura di colore opaco da parte del contenitore.
- **Accessibilità e navigazione hash sincrona**:
  - Integrazione diretta delle sezioni `Statue`, `Checkout` e `Confirmation` per garantire il rendering istantaneo privo di ritardi di caricamento, con salvaguardia del livello di intestazione `<h1>` nei fallback Suspense.
  - Superamento del 100% dei test Playwright e verifiche di accessibilità Axe su Chromium.

- **Riorganizzazione e pulizia architettura (`src/`)**:
  - Eliminazione definitiva di tutte le cartelle fantasma e i file wrapper re-export non necessari: rimosse `src/sections/`, `src/components/cinematic/`, `src/components/joker/`, `src/features/introduzione/`, `src/features/missione/`, `src/components/shared/` e cartelle vuote residue.
  - Normalizzazione della pagina di errore 404 in `src/features/not-found/NotFound.tsx`.
  - Spostamento del componente di sfondo globale in `src/components/layout/BatcaveBackdrop.tsx`.
- **Implementazione ambiente 3D sferico chiuso 360° per Batcomputer (`BatcaveBackdrop`)**:
  - Risoluzione della regola vincolante di rendering: proiezione dell'ambiente Batcomputer (`BatCaverna_Batcomputer360.mp4` / `.jpg`) su geometria sferica Three.js a 360° prospettica (`SphereGeometry` invertita con `PerspectiveCamera`), eliminando la distorsione polare e nadir 2D su tutte le schermate UI (Start, Intro, Tutorial, Pausa, Risultati, Checkout, Thank You, 404).
  - Mantenuto il fallback statico ad alte prestazioni e il supporto per `prefers-reduced-motion`.
- **Favicon ufficiale Figma**:
  - Sostituzione delle icone placeholder con il nodo ufficiale Figma Frame 440 (`338:5677`) in formato vettoriale `public/favicon.svg` e multi-risoluzione `public/favicon.ico`.
- **Trasparenza globale Navbar**:
  - Eliminazione di qualsiasi barra nera o gradiente: navbar al 100% trasparente a filo superiore (`inset: 0`).
- **Riorganizzazione documentale e archivio storico**:
  - Creazione di `docs/archivio/README.md` per chiarire la natura storica dei file archiviati e separarla dalle guide attive.
  - Aggiornamento del `README.md` principale e delle guide di verifica e rilascio.

## 2026-11-06 — Consolidamento Design System definitivo, riordino modulare e pubblicazione

- **Design System definitivo e fondale Batcomputer**: consolidamento della versione approvata in anteprima con il fondale Batcomputer (`BatcaveBackdrop`) e i token Figma ufficiali.
- **Correzione bug riprodotti**:
  - Tasto Esc: gestione della pressione prolungata con flag `!event.repeat`, sia per la chiusura delle carte 3D sia per l'attivazione/disattivazione della pausa.
  - Sincronizzazione audio: ripristino affidabile del controllo audio e della riproduzione al passaggio da modalità touch a desktop mediante reset pulito dello stato all'unmount.
  - Asserzioni di memoria nel checkout: verifica mirata che i dati fittizi non vengano trasmessi via rete né persistiti in storage locale o parametri URL.
- **Riorganizzazione modulare (`src/features/`)**:
  - Raggruppamento per flusso applicativo: `src/features/intro`, `src/features/mission`, `src/features/showreel`, `src/features/checkout`.
  - Componenti condivisi mantenuti in `src/components/layout`, `src/components/cinematic`, `src/components/ui` e unificati in `src/components/shared`.
- **Archivio storico del progetto (`docs/archivio/`)**:
  - Archiviazione di materiali, guide precedenti, report Figma, testi sorgente e screenshot degli otto mesi di sviluppo in `docs/archivio/`.
  - Ritiro degli script deprecati (`push.sh`, `design-audit.cjs`, `test-app.js`) e del template Gemini/metadati obsoleti.
  - Creazione della cartella `artifacts/` (esclusa da Git e Vercel) per fixture, tracce e report Playwright.
- **Documentazione corrente riscritta in italiano**:
  - `README.md` essenziale con scopo del progetto, avvio locale e mappa delle cartelle.
  - Tre guide attive in `docs/`: `ESPERIENZA_E_CHECKOUT.md`, `ARCHITETTURA_E_DESIGN_SYSTEM.md`, `VERIFICA_E_RILASCIO.md`.
  - Conservati il changelog e il manifest degli asset Figma (`docs/figma/assets.json`).

## 2026-11-01 — Design System ufficiale

Trasposizione dei componenti e delle composizioni Figma in sola lettura: start separata, storytelling, tutorial adattivo, carte che girano nel panorama, navbar per fase, pausa, win/loss, showreel, checkout a quantità singola e totale 750 €, conferma e avviso mobile senza pulsanti. Rimossi footer, premio speedrun e UI editoriale. Conservati 800 frame, cinque MP4, ottimizzazioni e controlli funzionali dell’audit. Tre stati restano provvisori in attesa dei disegni dell’autore; dettagli e prove in FIGMA_DS_ALIGNMENT.md.

## 2026-10-29 — Revisione audit

Gestione controllata delle fasi, gate desktop, accesso da tastiera, pausa e hint, fallback grafici, cache limitata dello showreel, checkout dimostrativo accessibile, revisione visiva, build minificata a chunk, aggiornamenti dipendenze e suite di regressione. Il dettaglio verificato per F01–F33 è in AUDIT_REMEDIATION.md.

Il changelog precedente è conservato in `docs/archivio/CHANGELOG.md` come documento storico.
