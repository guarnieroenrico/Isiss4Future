/* ITI4Future — IA nel browser con WebLLM (nessun server) */
import * as webllm from "https://esm.run/@mlc-ai/web-llm@0.2.79";

// Dal più adatto al più leggero. Se uno non parte, prova il successivo.
const MODELS = ["Qwen2.5-1.5B-Instruct-q4f16_1-MLC", "Qwen2.5-1.5B-Instruct-q4f32_1-MLC", "Llama-3.2-1B-Instruct-q4f16_1-MLC"];
const K = window.KNOWLEDGE;
const S = { state: "loading", text: "Controllo il dispositivo..." };
let engine = null, resolveReady;
const ready = new Promise(r => (resolveReady = r));

const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const words = s => ` ${norm(s).replace(/[^a-z0-9+#]+/g, " ")} `;

function score(q) {
  const w = words(q);
  return K.sections.map(sec => ({ sec, n: sec.keys.reduce((a, k) => a + (w.includes(` ${norm(k)}`) ? 1 + k.length / 20 : 0), 0) }))
    .filter(x => x.n > 0).sort((a, b) => b.n - a.n);
}
function retrieve(q, prev) {
  let r = score(q);
  if (!r.length && prev) r = score(prev); // domande di seguito: "e gli sbocchi?"
  return r.slice(0, 2).map(x => x.sec);
}

async function init() {
  try {
    if (!navigator.gpu || !(await navigator.gpu.requestAdapter())) throw new Error("no WebGPU");
  } catch { return basic("Modalità base"); }
  for (const id of MODELS) {
    try {
      engine = await webllm.CreateMLCEngine(id, {
        initProgressCallback: p => { S.state = "loading"; S.text = `Scarico l'IA ${Math.round(p.progress * 100)}%`; },
      });
      S.state = "ready"; S.text = "Assistente pronto"; return resolveReady(true);
    } catch (e) { console.warn("Modello non avviato:", id, e); engine = null; }
  }
  basic("Modalità base");
}
function basic(text) { S.state = "basic"; S.text = text; resolveReady(false); }

async function* chat(history, signal) {
  await ready;
  const users = history.filter(m => m.role === "user");
  const last = users.at(-1)?.content || "", prev = users.at(-2)?.content || "";
  const secs = retrieve(last, prev);

  if (!engine) { // senza WebGPU: risposta dalla scheda più adatta
    yield secs.length ? secs[0].text + "\n\n*Modalità base: questo dispositivo non supporta l'IA nel browser, provami da un PC con Chrome o Edge per poter dialogare davvero.*"
      : "Posso rispondere su **indirizzi**, **ITA**, **IPSEOA**, **convitto**, **azienda agraria** e **progetti**. Prova a scrivere una di queste parole!";
    return;
  }
  const sys = K.core + "\n\nINFORMAZIONI UFFICIALI:\n" + (secs.map(s => s.text).join("\n\n") || "(nessuna scheda specifica per questa domanda)");
  const msgs = [{ role: "system", content: sys }, ...history.slice(-6).map(m => ({ role: m.role, content: m.content }))];
  signal?.addEventListener("abort", () => engine.interruptGenerate());
  const it = await engine.chat.completions.create({ messages: msgs, stream: true, temperature: 0.3, max_tokens: 600 });
  for await (const c of it) { const d = c.choices[0]?.delta?.content; if (d) yield d; }
}

window.ITI_LLM = { state: S, ready, chat };
init();
