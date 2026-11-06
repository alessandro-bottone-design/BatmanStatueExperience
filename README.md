# Batman 87th Anniversary Statue Experience

Esperienza multimediale e interattiva per desktop ideata e progettata da Alessandro Bottone. L'applicazione celebra l'87º anniversario di Batman attraverso un'esplorazione investigativa a 360° della Batcaverna con cinque enigmi del Joker, la presentazione cinematica della statua da collezione Sideshow a 800 frame e un checkout dimostrativo accessibile.

> **Avviso accademico**: il sito è un progetto di design UI/UX e non costituisce un negozio reale. La procedura di preordine e il checkout sono simulazioni locali: utilizzare esclusivamente dati fittizi.

- **Repository GitHub**: [https://github.com/alessandro-bottone-design/BatmanStatueExperience](https://github.com/alessandro-bottone-design/BatmanStatueExperience)
- **Sito web pubblico**: [https://batman-87th-anniversary.vercel.app/](https://batman-87th-anniversary.vercel.app/)

---

## Avvio locale

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
./node_modules/.bin/playwright install chromium firefox webkit

# Compilazione della fixture del Design System e suite end-to-end
npm run build:ds-fixture
npm run test:e2e
```

---

## Mappa delle cartelle

```
.
├── src/                          # Codice sorgente attivo dell'applicazione
│   ├── features/                 # Moduli organizzati per flusso utente
│   │   ├── intro/                # Schermata di avvio, storytelling Joker, tutorial Batcomputer
│   │   ├── mission/              # Panorama 360°, carte Joker in-world, indizi, audio, vittoria/sconfitta
│   │   ├── showreel/             # Visualizzatore interattivo a 800 frame WebP della statua
│   │   └── checkout/             # Flusso di acquisto a 4 step (750 €), riepilogo e conferma
│   ├── components/               # Componenti riutilizzabili condivisi
│   │   ├── layout/               # Navbar adattiva contestuale per fase
│   │   ├── cinematic/            # Fondale Batcomputer (video loop con fallback statico)
│   │   ├── ui/                   # Token e componenti Design System (Button, IconButton, Timer, Logos, Cursor)
│   │   └── shared/               # Indice di esportazione unificato dei componenti condivisi
│   ├── hooks/                    # Hook riutilizzabili (useDesktop per gate hardware, useMissionTimer)
│   ├── lib/                      # Motore di stato (experience.ts) e audio Web Audio API (audioManager.ts)
│   ├── index.css                 # Stili globali e token visivi del Design System definitivo
│   ├── main.tsx                  # Bootstrap dell'applicazione React 19
│   └── App.tsx                   # Orchestratore principale delle fasi di fruizione
├── public/                       # Risorse statiche servite direttamente
│   └── assets/                   # Audio (WAV), video (MP4), texture 360°, font Poppins/Space Grotesk, 800 frame WebP
├── tests/                        # Suite di collaudo
│   ├── browser/                  # Test e2e Playwright con verifiche di accessibilità (Axe)
│   ├── fixtures/                 # Pagina e configurazione isolata per i test dei componenti
│   └── experience.test.ts        # Test unitari Node.js su state machine e validazione checkout
├── docs/                         # Documentazione attiva di progetto
│   ├── ESPERIENZA_E_CHECKOUT.md  # Flusso narrativo reale, controlli da tastiera, video e checkout
│   ├── ARCHITETTURA_E_DESIGN_SYSTEM.md # Architettura React/Three.js, stato, audio e Design System Figma
│   ├── VERIFICA_E_RILASCIO.md    # Suite di collaudo, CI GitHub Actions, deploy e rollback Vercel
│   ├── CHANGELOG.md              # Storico ragionato dei rilasci e delle versioni
│   ├── figma/assets.json         # Manifest con dimensioni native e checksum SHA-256 degli asset
│   └── archivio/                 # Archivio storico di guide, audit, testi e materiali dei mesi di lavoro
├── artifacts/                    # Cartella di output generata per report, tracce e fixture (esclusa da Git e Vercel)
├── scripts/                      # Strumenti di manutenzione supportati (open-site.command, extract-frame.mjs)
├── .github/workflows/            # Pipeline CI/CD di qualità su matrice browser
├── playwright.config.ts          # Configurazione Playwright con reporter e tracciamento in artifacts/
├── vite.config.ts                # Configurazione Vite con entrypoint per index.html e 404.html
└── vercel.json                   # Configurazione deployment e header di sicurezza Vercel
```

---

## Documentazione di approfondimento

Per consultare le guide dettagliate del progetto:
- [**Esperienza utente e Checkout**](docs/ESPERIENZA_E_CHECKOUT.md): regole di gioco, controlli da tastiera, fondale video e fallback, checkout a 4 tappe e schermata 404.
- [**Architettura e Design System**](docs/ARCHITETTURA_E_DESIGN_SYSTEM.md): stato applicativo, caricamento asincrono, sistema audio e specifiche dei token Figma.
- [**Verifica e Rilascio**](docs/VERIFICA_E_RILASCIO.md): procedure di test, CI/CD, distribuzione candidata su Vercel, promozione e rollback.
- [**Changelog**](docs/CHANGELOG.md): evoluzione delle versioni del progetto.
- [**Archivio storico**](docs/archivio/): documentazione precedente, audit, testi e report degli otto mesi di sviluppo.
