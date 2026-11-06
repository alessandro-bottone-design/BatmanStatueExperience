# Batman Statue Experience

Esperienza multimediale e interattiva per desktop ideata e progettata da Alessandro Bottone. L'applicazione presenta la Batman Statue Experience attraverso un'esplorazione investigativa a 360° della Batcaverna con cinque enigmi del Joker, la presentazione cinematica della statua da collezione Sideshow a 800 frame e un checkout dimostrativo accessibile.

> **Avviso accademico**: il sito è un progetto di design UI/UX e non costituisce un negozio reale. La procedura di preordine e il checkout sono simulazioni locali: utilizzare esclusivamente dati fittizi.

- **Repository GitHub**: [https://github.com/alessandro-bottone-design/batman-statue-experience](https://github.com/alessandro-bottone-design/batman-statue-experience)
- **Sito web pubblico**: [https://batman-statue-experience.vercel.app/](https://batman-statue-experience.vercel.app/)

---

## Caratteristiche Principali & Regole Architetturali

1. **Ambiente 3D Panorama 360° Chiuso (Three.js)**:
   - Sia durante l'esplorazione investigativa (`SharedPanoramaCanvas.tsx`) sia nelle schermate con interfaccia utente in overlay (`BatcaveBackdrop.tsx` per Start, Intro, Tutorial, Pausa, Risultati, Checkout, Thank You, 404), la Batcaverna è sempre proiettata all'interno di una geometria sferica 3D (`SphereGeometry` invertita con `PerspectiveCamera`), garantendo linee rette architettoniche naturali e l'assoluta assenza di distorsioni polari o nadir equirettangolari 2D.
2. **Design System & Navbar Trasparente**:
   - Navbar (`.ds-navbar`) completamente trasparente a tutto schermo (`inset: 0`), HUD integrato e token visivi fedeli al Design System Figma ufficiale.
3. **Sound Design Immersivo Web Audio**:
   - Colonna sonora procedurale Gotham, battito d'allarme, risate spazializzate del Joker e feedback sonori sintetizzati.
4. **Showreel Interattivo 800 Frame**:
   - Visualizzatore dinamico a 800 frame WebP della statua Sideshow Batman 87th Anniversary, con scrubber temporale e rotazione a 360°.

---

## Avvio Locale

### Prerequisiti
- **Node.js**: versione 22.12+ o 24 LTS (l'ambiente di hosting Vercel e la CI GitHub Actions adottano Node 24).
- **npm**: versione inclusa con Node.js.

### Installazione e avvio del server di sviluppo

```bash
# Installazione pulita e deterministica delle dipendenze
npm ci

# Avvio del server di sviluppo locale su http://127.0.0.1:3000
npm run dev
```

### Build e anteprima di produzione

```bash
# Compilazione dei sorgenti e generazione del pacchetto di produzione
npm run build

# Anteprima locale della build di produzione su http://127.0.0.1:4173
npm run preview
```

> **Nota**: non aprire `dist/index.html` tramite protocollo `file://`. La build utilizza moduli ES e caricamenti dinamici asincroni che richiedono un server HTTP.

### Verifiche di qualità e test

```bash
# Controllo rapido: typecheck TypeScript, lint ESLint, test unitari e build
npm run check

# Installazione dei browser Playwright (Chromium, Firefox, WebKit)
./node_modules/.bin/playwright install chromium

# Suite end-to-end completa con Playwright
./node_modules/.bin/playwright test --project=chromium
```

---

## Mappa delle Cartelle (Architettura Pulita)

```
.
├── src/                          # Codice sorgente attivo dell'applicazione
│   ├── components/               # Componenti condivisi
│   │   ├── layout/               # Elementi strutturali globali
│   │   │   ├── Navbar.tsx        # Navbar trasparente adattiva con switch audio
│   │   │   └── BatcaveBackdrop.tsx # Ambiente sferico 360° chiuso Three.js per le schermate UI
│   │   └── ui/                   # Token e componenti Design System Figma
│   │       ├── DesignSystem.tsx  # Button, IconButton, Timer, Logos, Cursor
│   │       ├── ErrorBoundary.tsx # Fallback per errori di runtime
│   │       ├── FormInput.tsx     # Campi form accessibili con validazione
│   │       └── PauseOverlay.tsx  # Schermata di pausa missione
│   ├── features/                 # Moduli funzionali organizzati per flusso utente
│   │   ├── intro/                # Schermata di avvio, storytelling Joker, tutorial Batcomputer
│   │   │   ├── StartScreen.tsx   # Schermata iniziale con CTA di inizio
│   │   │   ├── IntroScreen.tsx   # Monologo Joker e briefing missione
│   │   │   └── BatcomputerBootOverlay.tsx # Tutorial a 4 step
│   │   ├── mission/              # Esplorazione 360° investigativa
│   │   │   ├── SharedPanoramaCanvas.tsx # Canvas Three.js con texture 360° e carte in-world
│   │   │   ├── CinematicVideoPlayer.tsx # Riproduzione transizioni video
│   │   │   ├── JokerCard.tsx     # Carte indizio 3D animate con domande a risposta multipla
│   │   │   ├── JokerAudioManager.tsx # Gestione risate e battute Joker
│   │   │   ├── JokerHintSystem.tsx # Suggerimenti progressivi
│   │   │   ├── MouseLookControls.tsx # Controlli panoramica mouse e tastiera
│   │   │   ├── MissionResult.tsx # Schermata di esito (vittoria / fallimento)
│   │   │   └── useJokerHint.ts   # Hook di temporizzazione indizi
│   │   ├── showreel/             # Galleria 800 frame statua
│   │   │   └── BatmanCamera.tsx  # Visualizzatore fotogrammi statua interattivo
│   │   ├── checkout/             # Flusso di preordine in 4 step (750 €)
│   │   │   ├── Checkout.tsx      # Form di preordine (Dati, Spedizione, Pagamento, Riepilogo)
│   │   │   ├── ThankYouPage.tsx  # Schermata di conferma ordine con dati riepilogativi
│   │   │   └── checkoutModel.ts  # Modello dati e validazione form
│   │   └── not-found/            # Pagina 404 (Frequenza smarrita)
│   │       └── NotFound.tsx      # Schermata di fallback con navigazione verso la Home
│   ├── hooks/                    # Hook personalizzati (useDesktop, useMissionTimer)
│   ├── lib/                      # Motore di stato (experience.ts), checkout demo e sound engine
│   ├── index.css                 # Stili globali, token visivi e variabili CSS
│   ├── main.tsx                  # Entry point dell'applicazione React
│   └── App.tsx                   # Orchestratore principale della macchina a stati
├── public/                       # Risorse statiche servite direttamente
│   ├── assets/                   # Audio (WAV), video (MP4), texture 360°, font, frame statua
│   ├── favicon.svg               # Favicon vettoriale ufficiale Figma (Frame 440)
│   └── favicon.ico               # Favicon multi-risoluzione
├── tests/                        # Suite di collaudo
│   ├── browser/                  # Test e2e Playwright
│   ├── fixtures/                 # Pagina e fixture isolata per i componenti
│   └── experience.test.ts        # Test unitari Node.js su state machine e validazione checkout
├── docs/                         # Documentazione tecnica attiva di progetto
│   ├── ARCHITETTURA_E_DESIGN_SYSTEM.md # Architettura React/Three.js, stato, audio e token Figma
│   ├── ESPERIENZA_E_CHECKOUT.md  # Macchina a stati, gameplay 360°, enigmi Joker e checkout
│   ├── VERIFICA_E_RILASCIO.md    # Suite di collaudo, CI GitHub Actions e deploy Vercel
│   ├── CHANGELOG.md              # Storico ragionato delle versioni
│   ├── figma/                    # Specifiche e manifest degli asset Figma
│   └── archivio/                 # Archivio storico di guide, audit e bozze iniziali
├── AGENTS.md                     # Regole operative vincolanti per AI Agents
├── vercel.json                   # Configurazione deployment e routing Vercel
├── vite.config.ts                # Configurazione bundling Vite
└── package.json                  # Script e dipendenze di progetto
```

---

## Documentazione di Approfondimento

- [**Architettura e Design System**](docs/ARCHITETTURA_E_DESIGN_SYSTEM.md): stato applicativo, rendering Three.js, audio engine e specifiche dei token Figma.
- [**Esperienza utente e Checkout**](docs/ESPERIENZA_E_CHECKOUT.md): regole di gioco, controlli da tastiera, proiezioni 360°, checkout a 4 tappe e schermata 404.
- [**Verifica e Rilascio**](docs/VERIFICA_E_RILASCIO.md): procedure di test, CI/CD, distribuzione su Vercel, promozione e rollback.
- [**Regole Operative Agenti**](AGENTS.md): vincoli di rendering 3D sferico chiuso e trasparenza navbar.
- [**Changelog**](docs/CHANGELOG.md): evoluzione e release note del progetto.
- [**Archivio Storico**](docs/archivio/README.md): consultazione dei materiali e delle iterazioni precedenti.
