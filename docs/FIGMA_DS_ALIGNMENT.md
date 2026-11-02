# Applicazione del Design System — prima tranche

Fonte esclusiva: [Batman_DesignSystem, pagina design-system](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/Batman_DesignSystem?node-id=0-1). Figma consultato in sola lettura. Branch `codex/figma-design-system`, base `4e12570e962c41c3f1ef4366cef3635bd5b46e87`.

## Corrispondenza e confronti

Le immagini in `figma/reference` sono esportazioni di riferimento e non vengono servite dall’applicazione. Quelle in `figma/site` sono acquisizioni della build del sito a viewport 1920×1080; checkout e conferma includono l’intero documento scrollabile. Il mobile è acquisito a 390×844. Le differenze intenzionali sono la navbar riservata nel flusso, le istruzioni successive del tutorial, i dati demo compilabili, le geometrie adattive e i tre stati provvisori concordati. Non viene dichiarata equivalenza pixel per pixel tra motori di rendering.

| Schermata / componente            | Nodi Figma                              | Riferimento                                    | Sito                                                                                                                         |
| --------------------------------- | --------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Start                             | 143:332                                 | [Figma](figma/reference/start.png)             | [Sito](figma/site/start.png)                                                                                                 |
| Storytelling                      | 49:463                                  | [Figma](figma/reference/storytelling-text.png) | [Sito](figma/site/storytelling.png)                                                                                          |
| Timer / accetta sfida             | 49:458                                  | [Figma](figma/reference/briefing.png)          | [Sito](figma/site/briefing.png)                                                                                              |
| Tutorial adattivo                 | 54:461, 54:433                          | [Figma](figma/reference/tutorial.png)          | [1](figma/site/tutorial.png), [2](figma/site/tutorial-2.png), [3](figma/site/tutorial-3.png), [4](figma/site/tutorial-4.png) |
| Navbar / progresso                | 64:1261, 24:706                         | [Figma](figma/reference/navbar.png)            | [Gioco](figma/site/game.png)                                                                                                 |
| Carte                             | 64:1027, 16:196, 16:200, 16:199, 16:198 | [Figma](figma/reference/cards.png)             | [Retro](figma/site/card-back.png), [errore](figma/site/card-error.png), [corretta](figma/site/card-success.png)              |
| Pausa                             | 155:331                                 | [Figma](figma/reference/pause.png)             | [Sito](figma/site/pause.png)                                                                                                 |
| Vittoria                          | 52:357                                  | [Figma](figma/reference/win.png)               | [Sito](figma/site/win.png)                                                                                                   |
| Sconfitta                         | 132:413                                 | [Figma](figma/reference/loss.png)              | [Sito](figma/site/loss.png)                                                                                                  |
| Showreel testo                    | 49:496                                  | [Figma](figma/reference/showreel-text.png)     | [Sito](figma/site/showreel-text.png)                                                                                         |
| Showreel finale                   | 49:497                                  | [Figma](figma/reference/showreel-final.png)    | [Sito](figma/site/showreel-final.png)                                                                                        |
| Checkout                          | 101:2086, 101:1942                      | [Figma](figma/reference/checkout.png)          | [Base](figma/site/checkout.png), [carta espansa](figma/site/checkout-card.png)                                               |
| Conferma                          | 58:528                                  | [Figma](figma/reference/thankyou.png)          | [Sito](figma/site/thankyou.png)                                                                                              |
| Mobile aggiornato, senza pulsanti | 114:325                                 | [Figma](figma/reference/mobile.png)            | [Sito](figma/site/mobile.png)                                                                                                |

Token: colori 1:47, tipografia 1:167; bottoni 9:83; icone 22:265; bottoni icona 11:314; timer 16:576; input 75:1700/1697/1698/1699; pagamento 101:1942; cursore 49:499. I componenti riusabili e le varianti sono verificati nella fixture separata `tests/fixtures/ds.tsx`, esclusa dalla build pubblica.

La rotazione controlla esplicitamente la visibilità delle due facce, anche sui compositor software WebKit, e trasferisce il focus solo quando la faccia è visibile. La camera si ferma in prossimità delle carte per compensare il frame di proiezione in ritardo. I test della pausa usano un clock fermo e i test di missione verificano il progresso persistente; visibilità e feedback restano verificati separatamente sul componente e durante la pausa.

## Asset e geometria

[Manifest con dimensioni native, byte e SHA-256](figma/assets.json). Gli SVG locali sono gli export originali Figma; vengono usati come immagini o maschere alfa senza modificare i tracciati. I wrapper dei loghi compensano le aree trasparenti dei bagliori: slot Sideshow 179.683×65.151 e Batman 147×86, immagini native rispettivamente 307.683×193.151 e 255×194. Il cursore conserva il file 173.433×146.288 nel suo slot 77×50. Icone 30×30 (audio-off 30×29), pulsanti icona 40×40 più outline esterno. Carte 300×426 con immagine 260×386; il retro segue i tre ritagli del componente Figma.

Satoshi Regular/Bold provengono dai font già installati dell’autore; Space Grotesk e il relativo OFL erano già nella repository. Non vengono impiegati font di sistema come sostituti intenzionali. Per Satoshi non è stata aggiunta una licenza inventata.

Gli 800 WebP dello showreel e i cinque MP4 sono conservati senza modifiche rispetto alla base. Restano caricamento con massimo sei richieste, cache di 48 frame, primo frame al caricamento, lazy import e protezioni per errori dei media/WebGL. Il movimento ridotto conserva composizioni DS con panorami e statua statici.

## Stati provvisori concordati

1. Caricamento e inizializzazione: superfici preesistenti.
2. Errori recuperabili dei contenuti, video e WebGL: superfici e uscite preesistenti.
3. Avvisi della simulazione, elaborazione checkout e nota della conferma: superfici preesistenti; esempio di [elaborazione](figma/site/checkout-processing.png).

L’autore realizzerà questi tre stati in Figma. Non sono stati introdotti nuovi stili per completarli. Il checkout è interamente locale: dati fittizi manuali, quantità uno, 700 € + 50 € = 750 €, nessuna richiesta POST, account, pagamento, persistenza o ordine reale. ID e date della conferma sono gli esempi fittizi del DS.

## Verifiche riproducibili

`npm ci`, `npm run check` (TypeScript, ESLint, sette test di logica e build), `npm run build:ds-fixture`, `npm run test:e2e`. Il confronto CI Linux usa display desktop 1x per tutti e tre i motori; la suite locale WebKit su macOS mantiene il profilo Safari 2x. La verifica Linux non costituisce una misura di prestazioni Retina con rendering software. La CI conserva tracce DOM e screenshot espliciti senza lo screencast continuo delle tracce, che sovraccarica il renderer software. La CI esegue 21 scenari per Chromium, Firefox e WebKit su Linux con Xvfb. I due scenari componenti usano la fixture locale; gli altri 19 verificano l’applicazione. Non sono introdotti skip per browser.

Copertura: missione con mouse e tastiera, risposte errate/corrette, Esc, pausa durante feedback, timer e bonus senza badge, hint e fallimento; tutorial quattro passi; PayPal/carta, validazione, invio duplicato e cancellazione dell’elaborazione; navbar per fase; mobile touch nelle due orientazioni; frame mancanti, indisponibilità WebGL/video; scorrimento nelle finestre basse e larghezza equivalente a zoom 200%; axe sulle schermate principali; mute per sorgenti e beep.

L’audit npm delle dipendenze di produzione (`npm audit --omit=dev`) riporta zero vulnerabilità. L’audit completo segnala un advisory moderato su minimatch nella catena ESLint/TypeScript-ESLint (11 pacchetti conteggiati per propagazione); non è nel bundle pubblico. Gli aggiornamenti maggiori suggeriti automaticamente non sono stati applicati in questa tranche visiva. Rimane l’avviso Vite sul chunk Three.js lazy superiore a 500 kB.

Gli esiti CI, preview e pubblicazione sono tracciati nella PR e nel report di consegna. Firefox non si avvia sull’installazione Playwright del Mac locale: la sua esecuzione viene verificata sul runner Linux, senza indebolire i test.
