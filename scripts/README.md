# Strumenti di manutenzione supportati

- `open-site.command`: avvia la build locale via HTTP servita con preview locale. Non aprire `dist/index.html` tramite `file://`: la build usa moduli ES e chunk asincroni.
- `extract-frame.mjs`: utility di manutenzione per estrarre o rigenerare i JPG delle panoramiche a 360° dai video MP4; richiede FFmpeg installato nel PATH.

Gli script ritirati (`push.sh`, `design-audit.cjs`, `test-app.js` e le conversioni video `convert_*.sh`) sono archiviati in `docs/archivio/scripts/`.
I test e le verifiche ufficiali sono eseguiti tramite i comandi npm (`npm run check`, `npm run test:e2e`, `npm run build:ds-fixture`).
