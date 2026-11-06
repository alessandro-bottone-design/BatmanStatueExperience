# Esperienza utente e Checkout

Guida di riferimento per il flusso utente, i controlli d'interazione, la gestione multimediale e la simulazione di checkout dell'esperienza interattiva *Batman 87th Anniversary Statue Experience*.

---

## 1. Flusso reale dell'esperienza

L'esperienza è progettata come una narrazione interattiva a capitoli che guida l'utente dalla scoperta del messaggio del Joker fino alla visione della statua celebrativa e al preordine dimostrativo.

```
[Start Screen]
       │
       ▼
[Storytelling: Monologo Joker] ── (Salto opzionale) ──┐
       │                                             │
       ▼                                             │
[Tutorial: Batcomputer Boot] ◄───────────────────────┘
       │
       ▼
[Missione 3D Panoramica: 3 Scene & 5 Indizi]
  ├─ Scena 1: Batcomputer (Indizi 1-2)
  │    │
  │    ▼ (Transizione Video 1)
  ├─ Scena 2: Armeria (Indizio 3)
  │    │
  │    ▼ (Transizione Video 2)
  └─ Scena 3: Batmobile (Indizi 4-5)
       │
       ├─► [Vittoria: Missione Compiuta] ──► [Showreel Statua] ──► [Checkout] ──► [Conferma]
       │
       └─► [Sconfitta: Tempo Scaduto] ──► [Ricomincia da Start]
```

### Dettaglio delle fasi

1. **Gate di compatibilità hardware (`useDesktop`)**:
   - I dispositivi con puntatore primario touch/coarse (smartphone e tablet touch) vengono intercettati all'ingresso e mostrano una schermata dedicata di avviso (*MobileNotice*).
   - Le finestre desktop ridimensionate o con zoom elevato rimangono supportate e fruibili per garantire la massima accessibilità visiva.

2. **Start Screen (`StartScreen`)**:
   - Schermata iniziale pulita con loghi ufficiali Sideshow Collectibles e Batman.
   - Pulsante primario *"INIZIA LA MISSIONE"* con attivazione audio al click utente.

3. **Storytelling narrativo (`IntroScreen`)**:
   - Cinque battute narrative animate con il testo originale del Joker.
   - Indicatore del tempo decorativo e pulsante per passare direttamente alle istruzioni operative.

4. **Tutorial adattivo (`BatcomputerBootOverlay`)**:
   - Overlay a quattro tappe informative con estetica terminale Batcomputer:
     1. Regola del timer a 3 minuti (180 secondi).
     2. Risoluzione degli indizi e logica delle domande del Joker.
     3. Navigazione della camera a 360° tramite mouse o tastiera.
     4. Conferma d'inizio con boot finale.

5. **Missione investigativa 3D (`SharedPanoramaCanvas`)**:
   - Tre ambienti sferici navigabili in sequenza: Batcomputer (2 indizi), Armeria (1 indizio), Batmobile (2 indizi).
   - Collegamento tra scene tramite filmati di passaggio fluidi (`CinematicVideoPlayer`).
   - Le carte del Joker sono posizionate nello spazio tridimensionale con rotazione contestuale e animazione di flip fronte/retro.
   - Bonus segreto: se i primi due indizi vengono completati entro 45 secondi, vengono accreditati 60 secondi extra sul timer di missione.

6. **Epilogo della missione (`MissionResult`)**:
   - **Vittoria**: mostra il tempo totale impiegato e abilita l'accesso esclusivo allo showreel della statua.
   - **Sconfitta**: compare in caso di esaurimento del timer; permette il ripristino pulito dello stato iniziale.

7. **Showreel interattivo della Statua (`BatmanCamera`)**:
   - Esplorazione a 360° della statua da collezione mediante 800 frame WebP ad alta definizione con scrubbing fluido.
   - Cache dinamica con prefetching a concorrenza controllata (6 worker concorrenti, limite 48 frame in memoria).
   - Pulsante d'acquisto *"PREORDINA IL CAVALIERE"* per passare alla fase di checkout.

---

## 2. Controlli da tastiera e accessibilità

L'applicazione supporta la piena navigazione tramite tastiera, rispettando gli standard WCAG 2.1 AA.

| Tasto | Contesto d'uso | Comportamento implementato |
|---|---|---|
| **Esc** | Carta indizio aperta | Chiude la carta senza attivare la pausa. La protezione anti-ripetizione (`!event.repeat`) assicura che una pressione prolungata chiuda unicamente la carta. |
| **Esc** | Missione in corso | Attiva o disattiva l'overlay di pausa (`PauseOverlay`). Non produce rimbalzi multipli se tenuto premuto. |
| **Spazio / Invio** | Pulsanti, Carte, Form | Attivazione dell'elemento interattivo focalizzato. |
| **Frecce / WASD** | Scena 3D | Rotazione e orientamento della visuale panoramica. |
| **Tab / Shift+Tab** | Tutto il sito | Spostamento sequenziale del focus con outline grafico ad alto contrasto. |

---

## 3. Fondale video e fallback statico

- **Fondale attivo (`BatcaveBackdrop`)**:
  - Utilizza il video loop `public/assets/textures/BatCaverna_Batcomputer360.mp4` come ambientazione dinamica del Batcomputer.
  - Il video è marcato come `aria-hidden="true"`, `muted`, `loop`, `playsInline` per non interferire con gli screen reader né consumare risorse non necessarie.
- **Fallback statico automatico**:
  - Se il video fallisce il caricamento (rete degradata, decoder non supportato), se l'utente ha impostato `prefers-reduced-motion: reduce`, o su dispositivi a basso consumo energetico, l'applicazione commuta automaticamente sulla texture statica `BatCaverna_Batcomputer360.jpg`.
  - La transizione tra fallback e video è gestita in modo trasparente senza sfarfallio né salti di layout.

---

## 4. Checkout a quattro tappe (Prezzo fisso 750 €)

Il checkout è una simulazione sicura e autonoma che ricalca l'esperienza di acquisto di un prodotto da collezione in edizione limitata.

1. **Tappa 1 — Dati personali**:
   - Nome e cognome, indirizzo email valido, password di sicurezza.
2. **Tappa 2 — Indirizzo di spedizione**:
   - Indirizzo di consegna, città, CAP (5 cifre), note per il corriere.
3. **Tappa 3 — Metodo di pagamento**:
   - **PayPal**: flusso simulato con reindirizzamento e autorizzazione immediata senza richiesta di dati carta.
   - **Carta di credito**: convalida puntuale con algoritmo Luhn su 16 cifre, formato scadenza MM/AA, codice CVV a 3 cifre.
4. **Tappa 4 — Riepilogo e conferma**:
   - Quantità bloccata a 1 pezzo (edizione limitata 87º anniversario).
   - Prezzo fisso: 750,00 € con spedizione inclusa.

### Privacy e sicurezza dei dati demo
- Nessun dato inserito viene trasmesso via rete (zero chiamate POST/fetch verso server esterni).
- Nessun dato viene persistito in `localStorage`, `sessionStorage` o parametri di query URL.
- I timer di elaborazione vengono disarmati tempestivamente se l'utente abbandona la schermata durante il caricamento fittizio.

---

## 5. Gestione errori e pagina 404 personalizzata

- **Instradamento e 404**:
  - Qualsiasi percorso sconosciuto servito dal server o navigato via hash attiva la pagina personalizzata `404.html` e il componente `NotFound`.
  - La schermata mantiene la Navbar e il fondale della Batcaverna con l'avviso *"FREQUENZA SMARRITA - IL BATCOMPUTER NON TROVA QUESTA COORDINATA"*.
  - Un pulsante esplicito *"TORNA ALLA HOME"* consente il rientro immediato alla schermata iniziale.

---

## 6. Stati visivi in attesa dei frame Figma definitivi

I seguenti elementi visivi sono implementati con componenti provvisori ad alta fedeltà nel rispetto della palette di progetto, in attesa del rilascio dei frame Figma dedicati:
1. **Banner informativo di simulazione checkout**: avviso sul carattere dimostrativo della transazione.
2. **Overlay di elaborazione transazione**: spinner circolare con dicitura *"ELABORAZIONE IN CORSO"*.
3. **Box note legali nella pagina di conferma**: dettagli fittizi sulla tracciabilità della spedizione.
