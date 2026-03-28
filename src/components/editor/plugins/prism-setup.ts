import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";

const prismGlobal = globalThis as typeof globalThis & { Prism?: typeof Prism };
prismGlobal.Prism = Prism;

if (typeof window !== "undefined") {
  (window as typeof window & { Prism?: typeof Prism }).Prism = Prism;
}
