import { useState, useRef } from "react";

export default function Sandbox() {
  const [code, setCode] = useState(`// Write TypeScript here\nconsole.log("Hello from sandbox!")`);
  const [output, setOutput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    const html = `<!DOCTYPE html>
<html>
  <head><script src="https://unpkg.com/typescript/lib/typescript.js"></script></head>
  <body>
    <script>
      const logs = [];
      console.log = (...args) => {
        logs.push(args.join(" "));
        window.parent.postMessage({ type: "log", logs }, "*");
      };
      try {
        const js = ts.transpileModule(\`${"`"}${"{code}"}\`${"`"}, {}).outputText;
        eval(js);
      } catch(e) {
        window.parent.postMessage({ type: "error", message: e.message }, "*");
      }
    </script>
  </body>
</html>`;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }

    window.onmessage = (e) => {
      if (e.data.type === "log") setOutput(e.data.logs.join("\n"));
      if (e.data.type === "error") setOutput("Error: " + e.data.message);
    };
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#16130d",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      padding: "1rem",
      gap: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#eae1d6", margin: 0 }}>Sandbox</h2>
        <button onClick={runCode} style={{
          background: "#fd5300",
          color: "#220a00",
          border: "none",
          borderRadius: "9999px",
          padding: "0.5rem 1.5rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}>Run</button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          flex: 1,
          background: "#1e1a13",
          color: "#eae1d6",
          border: "none",
          borderRadius: "0.5rem",
          padding: "1rem",
          fontFamily: "monospace",
          fontSize: "14px",
          resize: "none",
        }}
      />

      <div style={{
        color: "#eae1d6",
        background: "#1e1a13",
        borderRadius: "0.5rem",
        padding: "1rem",
      }}>
        <strong>Output:</strong>
        <pre style={{ margin: 0, color: "#fd5300" }}>{output || "Run your code to see output"}</pre>
      </div>

      <iframe ref={iframeRef} style={{ display: "none" }} title="sandbox-runner" />
    </div>
  );
}