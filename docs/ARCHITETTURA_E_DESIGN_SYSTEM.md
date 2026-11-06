# Architettura e Design System

Guida tecnica all'architettura software, alla gestione dello stato, al sistema audio e alle specifiche del Design System per *Batman Statue Experience*.

---

## 1. Architettura dell'applicazione

Il progetto adotta un'architettura modulare basata su **React 19**, **TypeScript** e **Vite 8** con bundler Rolldown/esbuild.

### Organizzazione dei sorgenti per feature

Il codice applicativo in `src/` è strutturato per flusso operativo:

```
src/
├── features/               # Moduli funzionali verticali
│   ├── intro/              # StartScreen, IntroScreen, BatcomputerBootOverlay
│   ├── mission/            # Panorama 360°, MouseLookControls, JokerCard, Hint, Result
│   ├── showreel/           # BatmanCamera (800 frame WebP)
│   ├── checkout/           # Checkout flow, ThankYouPage, checkoutModel
│   └── not-found/          # NotFound screen (404)
├── components/             # Componenti riutilizzabili condivisi
│   ├── layout/             # Navbar trasparente e BatcaveBackdrop (sfera 3D 360°)
│   └── ui/                 # Design System (Button, IconButton, Logos, Timer, Cursor, ErrorBoundary, FormInput, PauseOverlay)
├── hooks/                  # Hook di utilità (useDesktop, useMissionTimer)
├── lib/                    # Logica di business pura (experience.ts, audioManager.ts)
├── App.tsx                 # Root orchestrator dell'esperienza
├── main.tsx                # Entry point dell'applicazione React
└── index.css               # Token e regole CSS del Design System Figma
```

### Gestione dello stato e routing

- **State machine pura (`src/lib/experience.ts`)**:
  - Un reducer immutabile `experienceReducer` gestisce le fasi (`start`, `storytelling`, `tutorial`, `batcomputer`, `transition1`, `armeria`, `transition2`, `batmobile`, `reveal`, `showreel`, `checkout`, `thankyou`).
  - La navigazione verso i prodotti usa gli hash `#statua`, `#checkout`, `#conferma`.
  - Lo stato di avanzamento della missione è effimero: un ricaricamento del browser o una navigazione forzata riavvia pulitamente l'esperienza per impedire salti non autorizzati.
- **Caricamento differito (Code Splitting)**:
  - Le componenti computazionalmente intense (Three.js, il canvas 3D, il visualizzatore a 800 frame e il checkout) vengono caricate tramite `React.lazy` e `Suspense`.
  - Three.js non grava sul bundle iniziale della pagina di start.

### Gestione audio unificata (`src/lib/audioManager.ts`)

- **Web Audio API + HTMLAudioElement**:
  - Nessuna riproduzione parte prima di un'interazione utente esplicita (rispetto delle policy browser autoplay).
  - La musica di sottofondo (`SiglaBatman.wav`) e gli effetti sonori (`RisataJoker.wav`, beep di feedback) condividono un nodo di guadagno master.
  - **Sincronizzazione desktop/touch**: all'eventuale smontaggio di `Experience` (es. passaggio a modalità touch), `BatcavernAudio.stop()` reimposta correttamente lo stato dei flag `muted` e `paused`. Al ritorno in modalità desktop, la UI e il gestore audio ripartono perfettamente sincronizzati.

---

## 2. Design System Figma definitivo

Il Design System applica fedelmente le specifiche del file Figma ufficiale:
- [BatmanStatueExperience Design System](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/BatmanStatueExperience_DesignSystem?node-id=64-1521)
- [Set compositivo screen-flow](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/BatmanStatueExperience_DesignSystem?node-id=315-5534)

### Tipografia

| Famiglia | Pesi | Utilizzo |
|---|---|---|
| **Poppins** | Bold (700), Regular (400) | Titoli display, bottoni d'azione, etichette primarie, corpo del testo narrativo |
| **Space Grotesk** | Bold, Regular | Timer, contatori numerici, telemetria tecnica HUD del Batcomputer |

### Palette cromatica Tech-Noir

- `--bat-black`: `#000000` (sfondo primario)
- `--bat-dark`: `#0b0f19` (superfici e card)
- `--bat-yellow`: `#ffd000` (accenti primari, bottoni e loghi)
- `--bat-purple`: `#8a2be2` (luci neon, indizi Joker, timer)
- `--bat-cyan`: `#00ffff` (terminale Batcomputer e indicatori)
- `--text-primary`: `#ffffff` (testi ad alta leggibilità)
- `--text-muted`: `#8892b0` (didascalie e note secondarie)

### Componenti UI condivisi

1. **`Button`**:
   - Varianti: `primary` (giallo brillante con testo nero), `secondary` (superficie scura con bordo sottile), `outline` (trasparente con contorno neon).
   - Dimensioni: `normal` e `small`.
2. **`IconButton`**:
   - Dimensioni 40×40 px con outline di focus accessibile; icone SVG 30×30 px (`audio-on`, `audio-off`, `pause`, `play`, `chevron-left`, `chevron-right`).
3. **`Logos`**:
   - Loghi originali Figma Sideshow Collectibles e Batman; i wrapper compensano le aree trasparenti dei bagliori per mantenere l'allineamento geometrico perfetto.
4. **`Timer`**:
   - Visualizzazione tecnica del tempo residuo con supporto a variante standard e HUD compatto.
5. **`FormInput`**:
   - Campi di testo con etichetta superiore, stati espliciti di riposo, focus, compilato, errore (con messaggio contestuale) e successo.
6. **`JokerCard`**:
   - Carte fronte/retro posizionate nello spazio tridimensionale con dimensioni 300×426 px (immagine 260×386 px), conforme agli export Figma originali.
7. **`BatcaveBackdrop` (Ambiente 3D chiuso a 360°)**:
   - Regola vincolante: per tutte le schermate che ospitano l'UI al di sopra della Batcaverna, l'ambiente `BatCaverna_Batcomputer360.mp4` deve essere sempre proiettato come panorama a 360 gradi chiuso (proiezione prospettica 3D sferica), MAI aperto come video 2D equirettangolare piatto.
8. **Favicon ufficiale (`338:5677`)**:
   - Icona ufficiale Batman del Design System su sfondo nero (`#010013`) con bagliore oro (`#FFD700`), esportata in formato vettoriale `public/favicon.svg` e multi-risoluzione `public/favicon.ico`.

---

## 3. Manifest degli asset

Tutti gli export SVG e PNG ufficiali conservano le dimensioni native e gli hash SHA-256 registrati nel manifest:
- Percorso del manifest attivo: [`docs/figma/assets.json`](figma/assets.json)
- Copia archiviata di riscontro storico: [`docs/archivio/figma/assets.json`](archivio/figma/assets.json)
