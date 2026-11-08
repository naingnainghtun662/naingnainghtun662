// Generates the SVG cards in ../assets used by README.md.
// Run: node scripts/build.mjs
// Fonts: Geist (OFL). Icons: Lucide (ISC), Simple Icons (CC0).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "assets");
const b64 = (f) => readFileSync(join(here, f)).toString("base64");

const FONT = b64("geist.woff2");
const AVATAR = b64("avatar.jpg");
// Measured text widths at 1px font size (filled in by measuring in a browser); fallback = estimate.
const W = existsSync(join(here, "widths.json")) ? JSON.parse(readFileSync(join(here, "widths.json"), "utf8")) : {};

const C = {
  text: "#F4F2FA",
  body: "#D2CEE2",
  muted: "#BDB8D0",
  purple: "#A78BFA",
  violet: "#8B5CF6",
  border: "#2C2646",
  cardBorder: "#3A3164",
  card: "#16132A",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function textWidth(s, size, weight = 400) {
  const key = `${weight}|${s}`;
  if (W[key]) return W[key] * size;
  let w = 0;
  for (const ch of s) {
    if (" .,:;'’!|il".includes(ch)) w += 0.28;
    else if ("ftjrI()/".includes(ch)) w += 0.36;
    else if ("mwMW".includes(ch)) w += 0.82;
    else if (ch >= "A" && ch <= "Z") w += 0.66;
    else w += 0.55;
  }
  return w * size * (weight >= 600 ? 1.04 : 1);
}

const svgInner = (file) =>
  readFileSync(join(here, "icons", file), "utf8")
    .replace(/<!--.*?-->/gs, "")
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<title>.*?<\/title>/, "");

const lu = (name, x, y, size, color, sw = 2) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${svgInner(`lu/${name}.svg`)}</svg>`;

const si = (name, x, y, size, color) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">${svgInner(`si/${name}.svg`)}</svg>`;

const doc = (w, h, body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<defs>
<style>
@font-face{font-family:'G';src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:100 900;}
text{font-family:'G',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;}
</style>
<linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14111F"/><stop offset="1" stop-color="#0E0C17"/></linearGradient>
<clipPath id="round"><rect width="${w}" height="${h}" rx="20"/></clipPath>
${defs}
</defs>
<g clip-path="url(#round)">
<rect width="${w}" height="${h}" fill="url(#panel)"/>
${body}
</g>
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="19.5" fill="none" stroke="${C.border}" stroke-width="1.5"/>
</svg>
`;

const measured = []; // strings we want widths for
const T = (x, y, size, weight, fill, s, extra = "") => {
  measured.push(`${weight}|${s}`);
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}"${extra}>${esc(s)}</text>`;
};

// ---------- HERO ----------
function hero() {
  const w = 1280, h = 320;
  const dots = [];
  for (let x = 1120; x <= 1260; x += 18) for (let y = 170; y <= 300; y += 18) dots.push(`<circle cx="${x}" cy="${y}" r="1.4"/>`);
  const defs = `
<radialGradient id="glow" cx="1" cy="0" r="0.9"><stop offset="0" stop-color="#7C3AED" stop-opacity="0.55"/><stop offset="0.6" stop-color="#5B21B6" stop-opacity="0.12"/><stop offset="1" stop-color="#5B21B6" stop-opacity="0"/></radialGradient>
<linearGradient id="swoosh" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8B5CF6" stop-opacity="0"/><stop offset="0.6" stop-color="#8B5CF6" stop-opacity="0.35"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0.7"/></linearGradient>
<linearGradient id="name" gradientUnits="userSpaceOnUse" x1="250" y1="0" x2="740" y2="0"><stop offset="0" stop-color="#EEEAFF"/><stop offset="0.45" stop-color="#C9B8FF"/><stop offset="1" stop-color="#9F7AEA"/></linearGradient>
<clipPath id="av"><circle cx="1068" cy="160" r="128"/></clipPath>`;
  measured.push("700|Hi, I’m ", "700|Naing Naing Htun");
  const body = `
<rect x="560" y="-200" width="760" height="560" fill="url(#glow)"/>
<path d="M700 320 C 900 300 1060 150 1280 70 L 1280 120 C 1090 190 950 310 820 320 Z" fill="url(#swoosh)"/>
<g fill="#A78BFA" opacity="0.25">${dots.join("")}</g>
<text x="56" y="128" font-size="62" font-weight="700" letter-spacing="-1.2"><tspan fill="${C.text}">Hi, I’m </tspan><tspan fill="url(#name)">Naing Naing Htun</tspan><tspan> 👋</tspan></text>
<text x="58" y="186" font-size="24"><tspan font-weight="600" fill="${C.text}">Full Stack Software Engineer</tspan><tspan fill="${C.body}">  •  building real-time communication software</tspan></text>
${lu("map-pin", 56, 212, 26, C.purple, 2.2)}
${T(94, 233, 21, 400, C.body, "Yangon, Myanmar")}
<circle cx="1068" cy="160" r="138" fill="#8B5CF6" opacity="0.18"/>
<circle cx="1068" cy="160" r="128" fill="#000"/>
<image href="data:image/jpeg;base64,${AVATAR}" x="940" y="32" width="256" height="256" clip-path="url(#av)"/>
<circle cx="1068" cy="160" r="129" fill="none" stroke="#EDE9FE" stroke-width="5"/>`;
  return doc(w, h, body, defs);
}

// ---------- BUTTONS ----------
function button({ w, label, light, icon }) {
  const h = 64;
  const bg = light
    ? `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#FFFFFF" stroke="#D0D7DE" stroke-width="2"/>`
    : `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="url(#btn)" stroke="#B9A5FF" stroke-width="2"/>`;
  const fg = light ? "#111111" : "#FFFFFF";
  measured.push(`700|${label}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
<defs><style>@font-face{font-family:'G';src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:100 900;}text{font-family:'G',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}</style>
<linearGradient id="btn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B6CF6"/><stop offset="1" stop-color="#6A45E0"/></linearGradient></defs>
${bg}
${icon(fg)}
<text x="70" y="40.5" font-size="20" font-weight="700" letter-spacing="1.6" fill="${fg}">${label}</text>
${lu("arrow-up-right", w - 50, 20, 24, fg, 2.4)}
</svg>
`;
}
const btnPortfolio = () =>
  button({ w: 260, label: "PORTFOLIO", light: true, icon: (c) => `<path d="M42 19 L56 45 L28 45 Z" fill="${c}"/>` });
const btnLinkedin = () =>
  button({
    w: 250,
    label: "LINKEDIN",
    icon: () =>
      `<rect x="26" y="16" width="32" height="32" rx="6" fill="#FFFFFF"/><text x="31.5" y="41" font-size="21" font-weight="800" fill="#6A45E0">in</text>`,
  });

// ---------- BODY ----------
function card(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.card}" fill-opacity="0.85" stroke="${C.cardBorder}" stroke-width="1.5"/>`;
}

function heading(y, icon, label) {
  return `${lu(icon, 40, y - 30, 36, "#C4B5FD", 1.8)}\n${T(92, y, 32, 700, C.text, label, ' letter-spacing="-0.4"')}`;
}

function rich(x, y, size, parts) {
  // parts: [text, bold?]
  parts.forEach(([s, b]) => measured.push(`${b ? 700 : 400}|${s}`));
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${C.body}">${parts
    .map(([s, b]) => (b ? `<tspan font-weight="700" fill="${C.text}">${esc(s)}</tspan>` : `<tspan>${esc(s)}</tspan>`))
    .join("")}</text>`;
}

function workCard(x, y, w, h, icon, title, lines) {
  return `${card(x, y, w, h)}
<rect x="${x + 22}" y="${y + 24}" width="54" height="54" rx="12" fill="#2A2252"/>
${lu(icon, x + 34, y + 36, 30, "#E4DEFF", 2)}
${T(x + 98, y + 46, 20, 600, C.text, title)}
${lines.map((l, i) => T(x + 98, y + 82 + i * 27, 17, 400, C.muted, l)).join("\n")}`;
}

const CHIPS = {
  React: { icon: "react", bg: "#1E2230", fg: "#FFFFFF", ic: "#61DAFB", stroke: "#3E465C" },
  "Next.js": { icon: "nextdotjs", bg: "#0A0A0A", fg: "#FFFFFF", ic: "#FFFFFF", stroke: "#4A4A4A" },
  TypeScript: { icon: "typescript", bg: "#3178C6", fg: "#FFFFFF", ic: "#FFFFFF" },
  TanStack: { icon: "reactquery", bg: "#EF4458", fg: "#FFFFFF", ic: "#FFFFFF" },
  "Tailwind CSS": { icon: "tailwindcss", bg: "#0EA5C9", fg: "#FFFFFF", ic: "#FFFFFF" },
  "Node.js": { icon: "nodedotjs", bg: "#3C9A3F", fg: "#FFFFFF", ic: "#FFFFFF" },
  Laravel: { icon: "laravel", bg: "#E3342F", fg: "#FFFFFF", ic: "#FFFFFF" },
  PostgreSQL: { icon: "postgresql", bg: "#3D6FD9", fg: "#FFFFFF", ic: "#FFFFFF" },
  Kafka: { icon: "apachekafka", bg: "#24212B", fg: "#FFFFFF", ic: "#FFFFFF", stroke: "#4A4558" },
  Docker: { icon: "docker", bg: "#2496ED", fg: "#FFFFFF", ic: "#FFFFFF" },
  Kubernetes: { icon: "kubernetes", bg: "#326CE5", fg: "#FFFFFF", ic: "#FFFFFF" },
  SIP: { bg: "#3A3846", fg: "#FFFFFF" },
  VoIP: { bg: "#3A3846", fg: "#FFFFFF" },
  Android: { icon: "android", bg: "#2FB34F", fg: "#FFFFFF", ic: "#FFFFFF" },
  iOS: { icon: "apple", bg: "#000000", fg: "#FFFFFF", ic: "#FFFFFF", stroke: "#5A5A5A" },
};

function chips(x, y, names) {
  let cx = x;
  const parts = names.map((n) => {
    const c = CHIPS[n];
    const tw = textWidth(n, 15, 500);
    measured.push(`500|${n}`);
    const padL = c.icon ? 34 : 14;
    const w = Math.round(padL + tw + 13);
    const s = `<g>
<rect x="${cx}" y="${y}" width="${w}" height="38" rx="7" fill="${c.bg}"${c.stroke ? ` stroke="${c.stroke}" stroke-width="1.5"` : ""}/>
${c.icon ? si(c.icon, cx + 11, y + 10, 17, c.ic) : ""}
<text x="${cx + padL}" y="${y + 24.5}" font-size="15" font-weight="500" fill="${c.fg}">${esc(n)}</text>
</g>`;
    cx += w + 10;
    return s;
  });
  return { svg: parts.join("\n"), end: cx - 10 };
}

function techCard(x, y, w, icon, title, names) {
  const ch = chips(x + 24, y + 64, names);
  if (ch.end > x + w - 16) console.warn(`chips overflow in ${title}: ${ch.end} > ${x + w - 16}`);
  return `${card(x, y, w, 120)}
${lu(icon, x + 24, y + 18, 32, "#C4B5FD", 1.8)}
${T(x + 76, y + 44, 22, 700, C.text, title)}
${ch.svg}`;
}

function bodyCard() {
  const w = 1280, h = 830;
  const body = `
<rect x="40" y="40" width="4" height="74" rx="2" fill="${C.violet}"/>
${rich(66, 70, 20, [["I have 5 years of experience building web, mobile and desktop apps. I specialize in "], ["real-time communication", true], [": contact-center"]])}
${rich(66, 102, 20, [["ticketing systems and "], ["SIP/VoIP softphones.", true], [" I like owning products end to end, from the UI to the API to the infrastructure."]])}
<line x1="40" y1="150" x2="1240" y2="150" stroke="${C.border}" stroke-width="1.5"/>
${heading(214, "layers", "What I’m working on")}
${workCard(40, 244, 630, 170, "smartphone", "Lead Software Engineer @ Global Connect Solutions", [
    "Leading a mobile softphone for SIP/VoIP calling over business",
    "phone systems (registration, inbound/outbound calls, call",
    "controls, call history) on Android, iOS and Web.",
  ])}
${workCard(690, 244, 550, 170, "code-xml", "Previously Software Engineer @ klink.cloud", [
    "Built a configurable omnichannel ticketing system with",
    "Next.js, Node.js, PostgreSQL and Kafka, running on",
    "Docker and Kubernetes.",
  ])}
<line x1="40" y1="446" x2="1240" y2="446" stroke="${C.border}" stroke-width="1.5"/>
${heading(510, "wrench", "Tech I use")}
${techCard(40, 540, 660, "monitor", "Frontend", ["React", "Next.js", "TypeScript", "TanStack", "Tailwind CSS"])}
${techCard(720, 540, 520, "server", "Backend", ["Node.js", "Laravel", "PostgreSQL", "Kafka"])}
${techCard(40, 676, 580, "infinity", "DevOps", ["Docker", "Kubernetes"])}
${techCard(640, 676, 600, "phone", "Real-time / VoIP", ["SIP", "VoIP", "Android", "iOS"])}`;
  return doc(w, h, body);
}

function contactCard() {
  const w = 1280, h = 150;
  measured.push("400|LinkedIn.");
  const body = `
${heading(68, "send", "Get in touch")}
${T(40, 114, 20, 400, C.body, "Open to interesting work in real-time communication, VoIP and full-stack products. The best way to reach me is")}
<text x="${40 + textWidth("Open to interesting work in real-time communication, VoIP and full-stack products. The best way to reach me is", 20) + 6}" y="114" font-size="20" fill="${C.purple}" text-decoration="underline">LinkedIn.</text>`;
  return doc(w, h, body);
}

const files = {
  "hero.svg": hero(),
  "btn-portfolio.svg": btnPortfolio(),
  "btn-linkedin.svg": btnLinkedin(),
  "body.svg": bodyCard(),
  "contact.svg": contactCard(),
};
for (const [name, svg] of Object.entries(files)) writeFileSync(join(out, name), svg);

// Preview page + list of strings to measure (for widths.json).
const preview = process.argv[2];
if (preview) {
  writeFileSync(
    preview,
    `<!doctype html><meta charset="utf-8"><style>@font-face{font-family:'G';src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:100 900;}
body{margin:0;padding:24px;background:#0d1117}.light{background:#fff}img{display:block;max-width:100%;margin:0 0 12px}</style>
<script>window.MEASURE=${JSON.stringify([...new Set(measured)])};</script>
${Object.keys(files).map((f) => `<img src="assets/${f}">`).join("\n")}`,
  );
}
console.log("wrote", Object.keys(files).join(", "));
