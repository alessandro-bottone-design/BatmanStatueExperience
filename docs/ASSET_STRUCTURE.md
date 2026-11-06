# Asset correnti

- `public/assets/showreel/0001.webp` … `0800.webp`: 800 frame 1536×864 della sequenza statua, conservati integralmente.
- `public/assets/textures`: tre MP4 panoramici e relativi JPG di fallback. Rigenerazione: `node scripts/extract-frame.mjs` con FFmpeg installato.
- `public/assets/videos`: i due filmati di passaggio tra aree.
- `public/assets/audio`: musica e risata del Joker.
- `public/assets/ds`: export ufficiali Figma per carte, icone, loghi, progresso e cursore; [manifest](figma/assets.json).
- `public/assets/fonts`: Space Grotesk e Poppins Regular/Bold, con i file OFL delle rispettive famiglie.
- `public/assets/images` e immagini alla root di `public`: asset storici conservati.

Il video Batcomputer 360° è il fondale decorativo delle schermate UI, in loop e senza audio, con inquadratura fissa. Con movimento ridotto o se il video è indisponibile si usa il JPG corrispondente. Gli altri MP4 restano legati alle rispettive scene e transizioni. Lo showreel prioritizza il frame richiesto e quelli vicini, massimo sei richieste concorrenti e cache di 48 immagini caricate. Il primo frame viene dipinto al caricamento; gli errori non incrementano successi. Nel movimento ridotto viene richiesto il solo frame statico finale.

Gli asset sorgente vivono in `public`; la copia generata in `dist` è ignorata da Git. Gli screenshot storici negli asset non sono una prova della versione corrente.
