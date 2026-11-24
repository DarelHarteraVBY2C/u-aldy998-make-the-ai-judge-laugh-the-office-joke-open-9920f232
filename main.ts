// Make the AI Judge Laugh: the Office Joke Open
// u-aldy998-make-the-ai-judge-laugh-the-office-joke-open-9920f232
//
// The joke: the setup is the classic office complaint (a meeting that
// could have been an email), the turn lands in the last few words —
// the manager "fixes" it by emailing the minutes, then books a meeting
// to discuss the email, so the cure is the disease. Specific office
// detail (manager, minutes, calendar invite), one line, no explanation
// needed.
//
// Gate (from competition.yaml): /output/entry.txt must be UTF-8 text
// of 1 to 200 characters, not only whitespace, a single line about
// office life. This program validates the text before writing it, and
// refuses to write anything that fails the gate. No network, no
// dependencies, fully deterministic: the same bytes on every run.

import { mkdirSync, writeFileSync } from "node:fs";

const SETUP =
  "I told my manager this meeting could have been an email, so he emailed me the minutes";
const PUNCHLINE = "then booked a meeting to discuss the email.";
const JOKE = `${SETUP} — ${PUNCHLINE}`;

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`[entry] GAGAL: ${message}`);
  process.exit(1);
}

const chars = [...JOKE].length;
if (chars < MIN_CHARS || chars > MAX_CHARS) {
  fail(`lelucon ${chars} karakter, di luar gate ${MIN_CHARS}-${MAX_CHARS}`);
}
if (JOKE.trim().length === 0) {
  fail("lelucon kosong / hanya whitespace");
}

if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("lelucon harus satu baris (mengandung newline)");
}

// Validasi isi: lelucon harus tentang kehidupan kantor (juri memberi
// nilai nol pada yang di luar topik). Wajib menyebut setidaknya dua
// dari detail kantor yang konkret: meeting, email, manager, minutes.
const OFFICE_WORDS = ["meeting", "email", "manager", "minutes"];
const found = OFFICE_WORDS.filter((w) => JOKE.toLowerCase().includes(w));
if (found.length < 2) {
  fail(`lelucon hanya menyebut ${found.length} detail kantor, minimal 2`);
}

// Validasi struktur setup/punchline: pemisah em-dash harus ada tepat
// satu, setup dan punchline masing-masing non-kosong, dan punchline
// (tempat twist-nya) harus diakhiri titik.
const parts = JOKE.split(" — ");
if (parts.length !== 2) {
  fail(`lelucon terpecah jadi ${parts.length} bagian di em-dash, harus 2`);
}
if (parts[0].trim().length === 0 || parts[1].trim().length === 0) {
  fail("setup atau punchline kosong");
}
if (!parts[1].endsWith(".")) {
  fail("punchline tidak diakhiri titik");
}

// Gate tidak mengizinkan entry hanya whitespace; pastikan tidak ada
// spasi berlebih di awal atau akhir berkas yang ditulis.
if (JOKE !== JOKE.trim()) {
  fail("lelucon punya whitespace di awal/akhir");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, JOKE, "utf8");
console.log(`[entry] OK: ${chars} karakter, 1 baris -> ${outDir}/entry.txt`);
