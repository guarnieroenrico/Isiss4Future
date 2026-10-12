# ITI4Future – versione GitHub Pages (senza server)

L'IA gira nel browser (WebLLM). Nessun Python, nessun Ollama, nessun costo.

## Pubblicare
1. Crea un repository su GitHub e carica TUTTO il contenuto di questa cartella (index.html, app.js, llm.js, knowledge.js, style.css, markdown.js, images/).
2. Settings > Pages > Source: "Deploy from a branch" > main / (root) > Save.
3. Dopo 1-2 minuti il sito è su https://TUOUTENTE.github.io/NOMEREPO/

## Aggiungere i vostri progetti
Aprite `knowledge.js`: ogni argomento è una scheda { id, keys, text }.
- keys = parole che l'utente può scrivere per far scegliere quella scheda (minuscole)
- text = cosa deve sapere l'assistente (breve: 3-5 righe)
Le schede "progetti" e "progetto-iti4future" sono ESEMPI: sostituite i testi tra [parentesi quadre].
Un progetto = una scheda. Non scrivete schede lunghissime: il modello è piccolo.

## Come funziona
- Al primo accesso il browser scarica il modello (~1 GB, solo la prima volta, poi resta in cache).
- Serve un browser con WebGPU (Chrome/Edge su PC; Android recente). Altrimenti parte la "modalità base": risponde con le schede, senza IA.
- Il modello può essere cambiato in `llm.js` (lista MODELS).

## Provare in locale
Non aprire index.html con doppio click (i moduli JS non funzionano da file://). Da questa cartella:
    python -m http.server 8000
poi apri http://localhost:8000
