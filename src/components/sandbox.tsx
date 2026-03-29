import { useState, useRef } from "react";

const GEMINI_KEY = "AIzaSyDyAPZro3vnwdRoccqmCcviZdbypRNNmWU";
const ELEVENLABS_KEY = "sk_650de27c7d1098a75c620247f18e93d37f05ed22ded5ca22";

export default function Sandbox() {
  const [code, setCode] = useState(`// Write TypeScript here\nconsole.log("Hello from sandbox!")`);
  const [output, setOutput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    const encoded = encodeURIComponent(code);
    const html = `<!DOCTYPE html><html><head><script src="https://unpkg.com/typescript/lib/typescript.js"><\/script></head><body><script>const logs=[];console.log=(...args)=>{logs.push(args.join(" "));window.parent.postMessage({type:"log",logs},"*");};try{const src=decodeURIComponent("${encoded}");const js=ts.transpileModule(src,{}).outputText;eval(js);}catch(e){window.parent.postMessage({type:"error",message:e.message},"*");}<\/script></body></html>`;
    if (iframeRef.current) iframeRef.current.srcdoc = html;
    window.onmessage = (e) => {
      if (e.data.type === "log") setOutput(e.data.logs.join("\n"));
      if (e.data.type === "error") setOutput("Error: " + e.data.message);
    };
  };

  const askGemini = async () => {
    setLoadingGemini(true);
    setSuggestion("");
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a TypeScript expert. Explain this code in 2 sentences and suggest one improvement:\n\n${code}` }] }],
          }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
      setSuggestion(text);
    } catch {
      setSuggestion("Could not reach Gemini.");
    }
    setLoadingGemini(false);
  };

  const speak = async () => {
    if (!suggestion) return;
    setLoadingVoice(true);
    try {
      const res = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_KEY,
          },
          body: JSON.stringify({
            text: suggestion,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 },
          }),
        }
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch {
      alert("Could not reach ElevenLabs.");
    }
    setLoadingVoice(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#16130d", display: "flex", flexDirection: "column", padding: "1rem", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#eae1d6", margin: 0 }}>Sandbox</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={askGemini} style={{ background: "#1e1a13", color: "#fd5300", border: "1px solid #fd5300", borderRadius: "9999px", padding: "0.5rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}>
            {loadingGemini ? "Thinking..." : "Ask Gemini"}
          </button>
          {suggestion && (
            <button onClick={speak} style={{ background: "#1e1a13", color: "#eae1d6", border: "1px solid #eae1d6", borderRadius: "9999px", padding: "0.5rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}>
              {loadingVoice ? "Speaking..." : "🔊 Speak"}
            </button>
          )}
          <button onClick={runCode} style={{ background: "#fd5300", color: "#220a00", border: "none", borderRadius: "9999px", padding: "0.5rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}>
            Run
          </button>
        </div>
      </div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={{ flex: 1, background: "#1e1a13", color: "#eae1d6", border: "none", borderRadius: "0.5rem", padding: "1rem", fontFamily: "monospace", fontSize: "14px", resize: "none" }} />
      {suggestion && (
        <div style={{ background: "#1e1a13", borderLeft: "3px solid #fd5300", borderRadius: "0.5rem", padding: "1rem" }}>
          <strong style={{ color: "#fd5300" }}>Gemini:</strong>
          <p style={{ color: "#eae1d6", margin: "0.5rem 0 0", fontSize: "14px", whiteSpace: "pre-wrap" }}>{suggestion}</p>
        </div>
      )}
      <div style={{ background: "#1e1a13", borderRadius: "0.5rem", padding: "1rem" }}>
        <strong style={{ color: "#eae1d6" }}>Output:</strong>
        <pre style={{ margin: 0, color: "#fd5300" }}>{output || "Click Run to see output"}</pre>
      </div>
      <iframe ref={iframeRef} style={{ display: "none" }} title="sandbox-runner" />
    </div>
  );
}