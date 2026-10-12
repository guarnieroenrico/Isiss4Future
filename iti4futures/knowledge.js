/* ============================================================
   CONOSCENZA DI ITI4Future  —  FILE DA MODIFICARE A MANO
   - "core": regole e carattere dell'assistente (breve!)
   - "sections": una scheda per argomento. L'assistente legge solo
     le 2 schede più adatte alla domanda (cerca le parole in "keys").
   Per aggiungere un progetto: copia una scheda, cambia id, keys e text.
   ============================================================ */
window.KNOWLEDGE = {
  core:
`Sei ITI4Future, l'assistente virtuale dell'ITI "G. Caso" (ISISS Matese, Piedimonte Matese, CE). Parli con ragazzi delle medie, studenti e famiglie: sii amichevole, chiaro e incoraggiante. Rispondi sempre in italiano, in 3-6 righe, in prima persona, senza salutare né ripresentarti a ogni messaggio e senza ripetere la domanda.
Rispondi usando SOLO le INFORMAZIONI UFFICIALI qui sotto. Se la risposta non c'è, dillo onestamente e consiglia la segreteria: ceis00200v@istruzione.it, tel. +39 0823 911648. Non inventare mai nomi di persone, orari, costi o dettagli. Puoi anche aiutare con la programmazione (Python, Java, C++, HTML, CSS, JavaScript, SQL). Se la domanda non c'entra con scuola, orientamento o programmazione, riporta gentilmente il discorso lì.
Contatti: Via G.G. D'Amore 24, Piedimonte Matese (CE) · Instagram @isissmatese.`,

  sections: [
    { id: "scuola", keys: ["isiss", "scuola", "matese", "storia", "motto", "dove", "indirizzo", "sede", "contatt", "iscri", "quali scuole", "ramo"],
      text:
`**ISISS Matese** – Via G.G. D'Amore 24, Piedimonte Matese (CE). Motto: "Innovazione, tradizione e formazione per il futuro". Nasce nel 1997/98 dalla fusione di ITA "A. Scorciarini Coppola" e ITI "G. Caso"; dal 2023/24 include l'IPSEOA "E.V. Cappello". Comprende: ITI "G. Caso" (4 indirizzi), ITA (2 indirizzi), IPSEOA (3 indirizzi + corsi serali), Convitto e Azienda Agraria. Tel. +39 0823 911648, email ceis00200v@istruzione.it.
L'ITI "G. Caso" nasce nel 1961 come sezione dell'ITI "Giordani" di Caserta ed è autonomo dal 1968/69.` },

    { id: "iti", keys: ["iti", "indirizzi", "quali indirizzi", "tecnico industriale", "caso", "scegliere", "quale scegliere", "consigli"],
      text:
`L'ITI "G. Caso" ha 4 indirizzi: **Costruzioni, Ambiente e Territorio (CAT)**, **Elettronica ed Elettrotecnica** (con area Robotica), **Informatica e Telecomunicazioni** (con curvatura Intelligenza Artificiale) e **Meccanica, Meccatronica ed Energia**. Tutti puntano molto sul laboratorio e permettono di lavorare subito o di proseguire con università, ITS o IFTS. Per scegliere: chi ama progettare edifici e territorio → CAT; circuiti, impianti e robot → Elettronica; programmare, reti e IA → Informatica; macchine e automazione → Meccanica.` },

    { id: "cat", keys: ["cat", "costruzioni", "edilizia", "geometra", "topografia", "drone", "cantiere", "catasto", "architettura", "rilievo"],
      text:
`**CAT – Costruzioni, Ambiente e Territorio.** Si studiano materiali, progettazione architettonica 3D, rendering, realtà virtuale immersiva, rilievi con stazione totale e droni, sicurezza, normativa, stime immobiliari, catasto, gestione dei cantieri e territorio. Sbocchi: studi tecnici e di architettura/ingegneria, imprese edili, uffici tecnici comunali, agenzie immobiliari, catasto. Dopo: università (ingegneria, architettura, design) o ITS. Orario: 33 ore settimanali in prima, 32 dalla seconda alla quinta.` },

    { id: "elettronica", keys: ["elettronica", "elettrotecnica", "robotica", "robot", "automazione", "impianti elettrici", "circuiti", "biomedicale", "fibra", "rinnovabili"],
      text:
`**Elettronica ed Elettrotecnica** (area Robotica). Molto laboratorio: elettronica, elettrotecnica, sistemi automatici, automazione, robotica, grandi impianti elettrici, energie rinnovabili, trasmissione dati, reti mobili e in fibra, applicazioni biomedicali. Sbocchi: automazione industriale, impianti elettrici, elettronica, robotica, telecomunicazioni, energie rinnovabili, tecnologie biomedicali; o proseguimento post-diploma.` },

    { id: "informatica", keys: ["informatica", "programmazione", "programmare", "intelligenza artificiale", "ia", "ai", "telecomunicazioni", "reti", "java", "python", "c++", "cloud", "sicurezza informatica", "realta virtuale", "vr", "ar", "sviluppatore"],
      text:
`**Informatica e Telecomunicazioni** (con curvatura Intelligenza Artificiale). Si studiano programmazione, algoritmi, Java, C++, sistemi e reti, sicurezza informatica, cloud, data science, IA, realtà virtuale e aumentata (gaming, formazione, simulazioni). Materie: Informatica; Sistemi e reti; Tecnologie e progettazione di sistemi informatici; Telecomunicazioni; Gestione progetto e organizzazione d'impresa. Sbocchi: sviluppatore, tecnico di rete o informatico, specialista VR/AR; università (informatica, ingegneria). Orario: 33 ore in prima, 32 poi.` },

    { id: "meccanica", keys: ["meccanica", "meccatronica", "energia", "macchine", "macchine utensili", "meccanico"],
      text:
`**Meccanica, Meccatronica ed Energia.** Progettazione, disegno, realizzazione, verifica, installazione e manutenzione di componenti meccanici, sistemi automatizzati, impianti produttivi, macchine utensili e automazione, con sicurezza e sistemi informatici applicati alla produzione. Dopo il diploma: lavoro, università, IFTS, ITS o formazione professionale.` },

    { id: "ita", keys: ["ita", "agrario", "agraria", "perito agrario", "forestale", "lattiero", "caseario", "formaggio", "ambiente", "agricoltura", "alimentare", "scorciarini"],
      text:
`**ITA "A. Scorciarini Coppola"** (periti agrari, nel contesto del Parco Nazionale del Matese). Due indirizzi: **Gestione dell'Ambiente e del Territorio** (curvatura Forestale: boschi, biodiversità, difesa del suolo, GPS/GIS/droni) e **Produzioni e Trasformazioni** (curvatura Lattiero-Casearia: filiera agroalimentare, HACCP, qualità, prodotti DOP, economia e marketing). Sbocchi: aziende agricole e agroalimentari, tecnico ambientale/forestale, consulenza agronomica; università (Agraria, Scienze Forestali, Ing. Ambientale), ITS, IFTS.` },

    { id: "ipseoa", keys: ["ipseoa", "alberghiero", "cucina", "sala", "bar", "accoglienza", "turistica", "cappello", "cuoco", "chef", "sommelier", "serale", "serali", "turismo"],
      text:
`**IPSEOA "E.V. Cappello"** – primo Istituto Alberghiero della provincia di Caserta (anni '60), nell'ISISS dal 2023/24. Tre indirizzi: **Accoglienza Turistica** (ricevimento, eventi, itinerari, tour operator), **Enogastronomia – Cucina** (con opzione prodotti dolciari) e **Enogastronomia – Sala e Vendita** (sala, bar, sommelier, banqueting). Previsto PCTO in Italia e all'estero. Ci sono anche i Corsi Serali per adulti. Orario: 33 ore in prima, 32 poi.` },

    { id: "convitto", keys: ["convitto", "semiconvitto", "alloggio", "dormire", "pernottamento", "lontano", "mensa", "camere", "pranzo"],
      text:
`**Convitto**: pensato per chi viene da lontano. Convitto residenziale dal lunedì al sabato (colazione, pranzo, studio, attività, cena, pernottamento); semiconvitto dal lunedì al venerdì fino alle 18:00. Ha cucina, refettorio, sale studio, camere, infermeria e lavanderia. Essendo scuola statale, c'è una quota annuale solo per le spese alimentari (importi: chiedere alla segreteria).` },

    { id: "azienda", keys: ["azienda", "azienda agraria", "ettari", "vigneto", "serra", "tartufaia", "apiario", "frantoio", "uliveto", "oliveto"],
      text:
`**Azienda Agraria**: circa 20 ettari per la didattica pratica: vigneti, oliveti sperimentali, collezioni di meli/peri/susini autoctoni, serra idroponica, tartufaia, apiario didattico, frantoio, drone per il monitoraggio. Collega agricoltura tradizionale e Agricoltura 4.0.` },

    /* ---------- PROGETTI ----------  ⚠️ ESEMPI: sostituiteli con i vostri! */
    { id: "progetti", keys: ["progetto", "progetti", "orientamento", "realizzato", "realizzati", "fatto", "fatti", "lavori", "studenti hanno"],
      text:
`**I progetti dell'ITI4Future** (elenco di esempio, da sostituire): 1) **ITI4Future** – questo assistente virtuale, creato dagli studenti di Informatica per presentare la scuola. 2) **[Nome progetto 2]** – indirizzo [..], classe [..]: [cosa fa in una frase]. 3) **[Nome progetto 3]** – indirizzo [..]: [cosa fa in una frase]. Chiedimi il nome di un progetto per i dettagli.` },

    { id: "progetto-iti4future", keys: ["iti4future", "assistente virtuale", "chi ti ha creato", "chi ti ha fatto", "come funzioni", "chi sei"],
      text:
`**Progetto ITI4Future**: assistente virtuale realizzato dagli studenti dell'ITI "G. Caso" per presentare la scuola e i suoi progetti durante gli orientamenti. Funziona con un modello di intelligenza artificiale che gira direttamente nel browser, senza inviare le conversazioni a nessun server. [Aggiungete qui: chi ha partecipato, classe, docente referente, tecnologie usate.]` }
  ]
};
