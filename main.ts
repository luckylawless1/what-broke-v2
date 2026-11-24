// Say What Actually Broke — u-po-pu-say-what-actually-broke-a2c153b5
// v2: writes one line (1-200 chars) naming the real failure to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Nothing crashed. The certificate expired at midnight, and the page that explains the outage lives on the same dead domain.";

function gate(line: string): string {
  if (typeof line !== "string") throw new Error("line must be a string");
  if (line.length < 1 || line.length > 200)
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  if (line.trim().length === 0) throw new Error("line must not be only whitespace");
  if (line.includes("\n") || line.includes("\r"))
    throw new Error("line must be a single line");
  if (line.includes("  ")) throw new Error("line must not contain double spaces");
  if (!line.endsWith(".")) throw new Error("line must end with a full stop");
  if (line.trim().length !== line.length)
    throw new Error("line must not have leading or trailing whitespace");
  return line;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, gate(LINE) + "\n", "utf8");
// Read-back byte verification: what is on disk must be exactly what was written.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== gate(LINE) + "\n")
  throw new Error("read-back mismatch: entry.txt on disk differs from written bytes");
