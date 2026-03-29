import { useState, useRef } from "react";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_KEY;

const CLINICAL_CODE = `type Patient = {
  id: string;
  age: number;
  treatment: "placebo" | "drug";
  baselineScore: number;
  weekFourScore: number;
};

const trialData: Patient[] = [
  { id: "P001", age: 45, treatment: "drug", baselineScore: 72, weekFourScore: 51 },
  { id: "P002", age: 52, treatment: "placebo", baselineScore: 68, weekFourScore: 65 },
  { id: "P003", age: 38, treatment: "drug", baselineScore: 80, weekFourScore: 54 },
  { id: "P004", age: 61, treatment: "placebo", baselineScore: 75, weekFourScore: 72 },
  { id: "P005", age: 47, treatment: "drug", baselineScore: 69, weekFourScore: 44 },
  { id: "P006", age: 55, treatment: "placebo", baselineScore: 71, weekFourScore: 70 },
];

const drugGroup = trialData.filter(p => p.treatment === "drug");
const placeboGroup = trialData.filter(p => p.treatment === "placebo");

const avgImprovement = (group: Patient[]) => {
  const total = group.reduce((sum, p) => sum + (p.baselineScore - p.weekFourScore), 0);
  return (total / group.length).toFixed(2);
};

console.log("=== CLINICAL TRIAL ANALYSIS ===");
console.log("Drug group improvement: " + avgImprovement(drugGroup) + " points");
console.log("Placebo group improvement: " + avgImprovement(placeboGroup) + " points");
const effective = Number(avgImprovement(drugGroup)) > Number(avgImprovement(placeboGroup));
console.log("Drug statistically superior: " + effective);
console.log("Patients analyzed: " + trialData.length);
console.log("--- Individual Results ---");
trialData.forEach(p => {
  const change = p.baselineScore - p.weekFourScore;
  console.log(p.id + " (" + p.treatment + "): " + change + " point improvement");
});`;

const CLINICAL_PROMPT = "Analyze this clinical trial TypeScript script. Check for data anomalies, statistical validity, and suggest improvements for regulatory compliance.";

export default function Sandbox() {
  const [mode, setMode] = useState<"sandbox" | "clinical">("sandbox");
  const [code, setCode] = useState(`// Write TypeScript here\nconsole.log("Hello from sandbox!")`);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const switchToClinical = () => {
    setMode("clinical");
    setCode(CLINICAL_CODE);
    setOutput("");
    setSuggestion("");
  };

  const switchToSandbox = () => {
    setMode("sandbox");
    setCode(`// Write TypeScript here\nconsole.log("Hello from sandbox!")`);
    setOutput("");
    setSuggestion("");
  };

  const runCode = () => {
    const encoded = encodeURIComponent(code);
    const html = `<!DOCTYPE html><html><head><script src="https://unpkg.com/typescript/lib/typescript.js"><\/script></head><body><script>const logs=[];console.log=(...args)=>{logs.push(args.join(" "));window.parent.postMessage({type:"log",logs},"*");};try{const src=decodeURIComponent("${encoded}");const js=ts.transpileModule(src,{}).outputText;eval(js);}catch(e){window.parent.postMessage({type:"error",message:e.message},"*");}<\/script></body></html>`;
    if (iframeRef.current) iframeRef.current.srcdoc = html;
    window.onmessage = (e) => {
      if (e.data.type === "log") setOutput(e.data.logs.join("\n"));
      if (e.data.type === "error") setOutput("Error: " + e.data.message);
    };
  };

  const generateCode = async () => {
    if (!prompt) return;
    setLoadingGenerate(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Write TypeScript code that does the following. Return ONLY the code, no explanation, no markdown, no backticks:\n\n${prompt}` }] }],
          }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```typescript/g, "").replace(/```ts/g, "").replace(/```/g, "").trim();
      setCode(clean);
    } catch {
      alert("Could not reach Gemini.");
    }
    setLoadingGenerate(false);
  };

  const askGemini = async () => {
    setLoadingGemini(true);
    setSuggestion("");
    const questionText = mode === "clinical"
      ? CLINICAL_PROMPT + "\n\n" + code
      : `You are a TypeScript expert. Explain this code in 2 sentences and suggest one improvement:\n\n${code}`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: questionText }] }],
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
      new Audio(url).play();
    } catch {
      alert("Could not reach ElevenLabs.");
    }
    setLoadingVoice(false);
  };

  const isClinical = mode === "clinical";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#16130d", display: "flex", flexDirection: "column", padding: "1rem", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ color: "#eae1d6", margin: 0 }}>
            {isClinical ? "🧬 Clinical Trial Mode" : "Sandbox"}
          </h2>
          <button
            onClick={isClinical ? switchToSandbox : switchToClinical}
            style={{ background: isClinical ? "#1e1a13" : "#0a2a1a", color: isClinical ? "#eae1d6" : "#00cc66", border: `1px solid ${isClinical ? "#444" : "#00cc66"}`, borderRadius: "9999px", padding: "0.3rem 1rem", cursor: "pointer", fontSize: "12px" }}
          >
            {isClinical ? "← Back to Sandbox" : "🧬 Clinical Trial Mode"}
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={askGemini} style={{ background: "#1e1a13", color: "#fd5300", border: "1px solid #fd5300", borderRadius: "9999px", padding: "0.5rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}>
            {loadingGemini ? "Analyzing..." : isClinical ? "🔬 Analyze Trial" : "Ask Gemini"}
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

      {!isClinical && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateCode()}
            placeholder="Describe what to build... (e.g. a ticket tracker)"
            style={{ flex: 1, background: "#1e1a13", color: "#eae1d6", border: "1px solid #333", borderRadius: "0.5rem", padding: "0.75rem 1rem", fontFamily: "sans-serif", fontSize: "14px" }}
          />
          <button onClick={generateCode} style={{ background: "#fd5300", color: "#220a00", border: "none", borderRadius: "0.5rem", padding: "0.75rem 1.5rem", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}>
            {loadingGenerate ? "Generating..." : "Generate Code"}
          </button>
        </div>
      )}

      {isClinical && (
        <div style={{ background: "#0a2a1a", border: "1px solid #00cc66", borderRadius: "0.5rem", padding: "0.75rem 1rem" }}>
          <p style={{ color: "#00cc66", margin: 0, fontSize: "13px" }}>🧬 Clinical Trial Mode — Pre-loaded with patient trial data. Click <strong>Analyze Trial</strong> for AI-powered regulatory analysis, then <strong>Run</strong> to execute safely in an isolated container.</p>
        </div>
      )}

      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={{ flex: 1, background: "#1e1a13", color: "#eae1d6", border: "none", borderRadius: "0.5rem", padding: "1rem", fontFamily: "monospace", fontSize: "14px", resize: "none" }} />

      {suggestion && (
        <div style={{ background: "#1e1a13", borderLeft: `3px solid ${isClinical ? "#00cc66" : "#fd5300"}`, borderRadius: "0.5rem", padding: "1rem" }}>
          <strong style={{ color: isClinical ? "#00cc66" : "#fd5300" }}>{isClinical ? "🔬 Clinical Analysis:" : "Gemini:"}</strong>
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