# Design System ufficiale

La fonte visiva è la pagina `design-system` del file [Batman_DesignSystem](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/Batman_DesignSystem?node-id=0-1). Il file Figma viene consultato in sola lettura. La precedente direzione editoriale è stata sostituita su richiesta dell’autore.

I cinque colori primitivi sono giallo `#FFD700`, viola chiaro `#A64DFF`, viola scuro `#320D57`, nero `#010013` e bianco `#FAF9F6`. Gli stati disabilitati e i feedback usano i colori semantici del DS. Space Grotesk e Satoshi sono ospitati localmente nei pesi Regular e Bold. I ruoli tipografici usano 80/81, 40/41, 30/31, 20/21, 16/17 e 12/13 px.

`src/components/ui/DesignSystem.tsx` compone bottoni nelle tre dimensioni e due varianti, icone, loghi, timer, avviso mobile e cursore. Gli SVG esportati da Figma mantengono file e dimensioni intrinseche; le icone sono maschere alfa native da 30 px, colorate per stato. La freccia precedente usa il glifo ufficiale con orientamento invertito nel wrapper. I bordi esterni Figma sono resi con outline da 2 px; i bagliori usano drop-shadow con deviazione gaussiana pari a metà del raggio blur Figma.

Le schermate usano layout adattivi, con dimensioni native a 1920×1080 e spazio riservato alla navbar. Le finestre piccole consentono lo scorrimento e riusano ruoli tipografici ufficiali. Le carte girano nel panorama, conservando dimensioni e gerarchia del componente; Esc richiude la carta e ripristina il focus. La pausa rende inerti i contenuti. In movimento ridotto restano le medesime composizioni con media statici.

Il mobile mostra esclusivamente la card ufficiale aggiornata, senza pulsanti o media dell’esperienza. Tre superfici concordate restano provvisorie: caricamento, errori recuperabili dei contenuti/WebGL, avvisi ed elaborazione del checkout simulato. Il dettaglio dei nodi, degli asset e dei confronti è in [FIGMA_DS_ALIGNMENT.md](FIGMA_DS_ALIGNMENT.md).
