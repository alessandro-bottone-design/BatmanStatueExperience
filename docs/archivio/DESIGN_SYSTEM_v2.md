# Design System ufficiale

Il riferimento visivo è il file definitivo [BatmanStatueExperience Design System](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/BatmanStatueExperience_DesignSystem?node-id=64-1521). Il [set screen-flow](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/BatmanStatueExperience_DesignSystem?node-id=315-5534) specifica la composizione delle schermate.

## Fondazioni

- I primitivi sono giallo `#FFD700`, viola `#A64DFF`, nero `#010013` e bianco `#FAF9F6`. I pannelli usano nero opaco, contorno e bagliore semantico. Lo sfondo delle schermate statiche compone il nero al 40% sul fondale scuro della reference.
- Space Grotesk e Poppins sono serviti localmente. I ruoli hanno dimensione e interlinea 80/88, 40/48, 30/36, 20/28, 16/24 e 12/16 px. Le licenze sono nella cartella dei font. [Poppins Regular e Bold](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/poppins)
- I loghi, le icone, il cursore e le maschere del progresso usano gli export Figma. Le carte riutilizzano gli stessi file verificati byte per byte. Il [manifest degli asset](figma/assets.json) registra dimensioni native e hash.

## Riferimenti di implementazione

| Area | Nodi Figma |
| --- | --- |
| Start, intro e tutorial | `239:3262`, `252:2151`, `243:3639`, `307:4306` |
| Navbar, bottoni, icone, timer e progresso | `249:1659`, `239:3234`, `11:314`, `22:265`, `239:3081`, `238:2995`, `23:411` |
| Carte, risposte e pausa | `290:1342`, `239:3359`, `14:108`, `239:3271` |
| Esiti e showreel | `302:1348`, `241:3528` |
| Checkout e conferma | `314:2693`, `314:2104`, `245:3938`, `235:1590`, `243:3874` |
| Avviso touch e 404 | `238:2970`, `249:953` |
| Favicon ufficiale | `338:5677` |

Le schermate a 1920 × 1080 hanno una composizione adattiva per finestre più piccole. Le scene di missione conservano i panorami, le carte nel mondo e i valori effettivi di timer e progresso. Il checkout mostra una tappa per volta, conserva i dati in memoria durante la compilazione e simula entrambi i metodi di pagamento. La build include la pagina `404.html` per l’hosting statico.

## Stati in attesa di Figma

I messaggi di caricamento, gli errori recuperabili e le informazioni della simulazione usano le superfici provvisorie. L’avviso touch mostra i loghi e la card del DS con una disposizione adattata dal riferimento desktop, in attesa del frame a 390 × 844.
