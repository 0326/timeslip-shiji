import { Compiler } from "inkjs/full";
import { readFileSync } from "node:fs";
const src = readFileSync("src/react-app/data/stories/ink/"+process.argv[2], "utf8");
const errors = [];
const opts = { errorHandler: (message, type) => errors.push(`[${type}] ${message}`) };
try { new Compiler(src, opts).Compile(); console.log("compiled"); }
catch(e){ console.log("threw:", e.message); }
console.log("errors:\n" + errors.join("\n"));
