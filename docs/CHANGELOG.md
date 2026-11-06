# Changelog

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
