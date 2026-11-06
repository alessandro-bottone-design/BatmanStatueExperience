# Gameplay corrente

Il flusso iniziale è start → storytelling → tutorial → missione. Lo storytelling mostra cinque quadri di cinque secondi e una schermata di briefing che attende «Accetta la sfida». «Salta intro» apre direttamente il tutorial. Le quattro istruzioni Figma sono Batti il tempo, Risolvi gli enigmi, Trova tutti gli indizi ed Esplora l’ambiente. La missione concede 180 secondi e richiede cinque risposte in tre aree (2+1+2). Pausa, caricamento e transizioni non consumano tempo. Completando i primi due indizi entro 45 secondi si ricevono 60 secondi aggiuntivi una sola volta, senza badge. Il premio commerciale speedrun è stato rimosso.

Gli hint rispettano pausa, scena e carta aperta: attivazione a 60 secondi, intensità successive a 80 e 100. La carta completata viene rimossa e il timer hint passa alla successiva. Il feedback corretto dura 850 ms di tempo attivo e sopravvive a una pausa.

La visuale risponde al mouse ai bordi o alle frecce; i tasti nei campi e nei pulsanti non vengono intercettati. I controlli degli indizi sono raggiungibili con Tab e portano la camera alla carta nell’ambiente. Invio la gira; Tab naviga le risposte; Esc la richiude e ripristina il focus. Fuori dalla carta, Esc mette in pausa o riprende. L’interfaccia conserva fase e progresso. In vittoria il timer mostra il tempo residuo congelato.

La sconfitta propone il pulsante ufficiale di riprova, che riparte dalla start screen. Il refresh resetta la missione. I link `#statua` e `#checkout` aprono le rispettive sezioni; `#conferma` richiede un checkout demo valido e non persiste al refresh. Nessun A/B timer 120/240 secondi è implementato.
