# Verifica e Rilascio

Guida operativa per la suite di test, la pipeline di integrazione continua GitHub Actions e il processo di pubblicazione e rollback su Vercel per *Batman 87th Anniversary Statue Experience*.

---

## 1. Suite di verifica locale

Prima di ogni pubblicazione, eseguire l'intera catena di controlli per garantire l'assenza di regressioni funzionali o tipologiche:

```bash
# 1. Installazione pulita delle dipendenze esatte
npm ci

# 2. Controllo statico dei tipi, linting, test unitari e build di produzione
npm run check

# 3. Compilazione della fixture isolata per i componenti del Design System
npm run build:ds-fixture

# 4. Suite completa di regressione browser Playwright (Chromium, WebKit)
npm run test:e2e
```

### Dettaglio dei comandi di controllo

| Comando | Descrizione tecnica |
|---|---|
| `npm run typecheck` | Esegue il compilatore TypeScript in modalità `--noEmit` su tutto il progetto. |
| `npm run lint` | Esegue ESLint verificando conformità stilistica e hook React su `src`, `tests`, `vite.config.ts`, `playwright.config.ts`. |
| `npm test` | Esegue i test unitari con il test runner nativo di Node.js (`node:test` e `tsx`) validando il reducer di stato e il modello di checkout. |
| `npm run build` | Compila l'applicazione client per produzione con Vite, producendo `dist/index.html`, `dist/404.html` e i chunk ottimizzati. |
| `npm run build:ds-fixture` | Compila `tests/fixtures/ds.html` in `artifacts/fixtures/ds` per i test visivi e di accessibilità del Design System. |
| `npm run test:e2e` | Esegue tutti i 23 test Playwright su browser Chromium e WebKit (e Firefox in CI Linux con xvfb). |

---

## 2. Pipeline GitHub Actions (CI)

Il workflow `.github/workflows/quality.yml` viene attivato a ogni push su `main` e su ogni Pull Request.

- **Ambiente**: Ubuntu Latest con Node.js 24.
- **Matrice browser**: `chromium`, `firefox`, `webkit`.
- **Display virtuale**: `xvfb-run` per abilitare l'esecuzione headed e l'accelerazione software WebGL (`LIBGL_ALWAYS_SOFTWARE: "1"`).
- **Archiviazione evidenze**: in caso di fallimento o successo, i report HTML e le tracce di esecuzione situati in `artifacts/playwright-report` e `artifacts/test-results` vengono salvati come artefatti di workflow per 7 giorni.

---

## 3. Procedura di rilascio su Vercel

Il rilascio in produzione adotta la strategia a due fasi: **build candidata isolata** seguita da **promozione a dominio pubblico** solo dopo verifica manuale/automatica positiva.

### Fase 1: Creazione della build candidata di produzione

Dallo SHA confluito in `main`, lanciare:

```bash
vercel deploy --prod --skip-domain
```

Questo comando crea un deployment di produzione completo senza assegnare immediatamente il dominio pubblico `batman-87th-anniversary.vercel.app`, restituendo un URL univoco di anteprima candidata (es. `https://batman-87th-anniversary-xxxx.vercel.app`).

### Fase 2: Checklist di collaudo sull'URL candidato

Sull'URL generato da Vercel, verificare puntualmente:
1. **Navigazione iniziale**: caricamento della Start Screen con loghi e assenza di riproduzione audio automatica.
2. **Audio e controlli**: avvio della colonna sonora al click di inizio; test del pulsante muto e pausa.
3. **Fondale e fallback**: riproduzione del video in loop `BatCaverna_Batcomputer360.mp4` e corretto fallback statico in caso di motion ridotto.
4. **Missione 3D**: orientamento della visuale con mouse/tastiera, rotazione e risposta alle carte, passaggio tra le tre scene con i video di transizione.
5. **Showreel della Statua**: scorrimento fluido dei frame e reattività della vista a 360°.
6. **Checkout dimostrativo**: compilazione dei campi e verifica che né PayPal né la carta trasmettano dati all'esterno o lascino residui in memoria.
7. **Gate mobile**: simulazione di dispositivo touch da DevTools con visualizzazione dell'avviso *Dispositivo non compatibile* e assenza di pulsanti/canvas/audio.
8. **HTTP 404 personalizzato**: richiesta di un percorso inesistente (es. `/percorso-non-valido`) e verifica che il server risponda con codice di stato **HTTP 404** e con la schermata personalizzata del Batcomputer.

### Fase 3: Promozione della build verificata

A collaudo superato con esito positivo:

```bash
vercel promote <deployment-url-o-id>
```

Vercel instrada istantaneamente il traffico del dominio pubblico sulla build certificata senza necessità di ricompilazione.

---

## 4. Procedura di Rollback di emergenza

Qualora dovesse emergere una regressione bloccante dopo la promozione:

```bash
# Esegue il rollback immediato al deployment stabile precedente
vercel rollback
```

Oppure specificando l'identificativo esatto del deployment precedente:

```bash
vercel rollback <previous-deployment-id>
```

Dopo il rollback, verificare che il dominio pubblico `https://batman-87th-anniversary.vercel.app` risponda con il commit e la versione corretti.
