// 2026 양육불안 컨퍼런스 폼보드 7종 (A3 가로, 42.6×30.0cm 작업 사이즈)
// 오려서 폼보드에 붙일 용도 → 슬로건+캐릭터 가득, 상단/하단 브랜드 최소화
// 실행: node scripts/generate-conference-foamboards.mjs
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const CM_PER_INCH = 2.54;
const PT_PER_INCH = 72;
const DPI = 300;

// A3 가로 작업 사이즈 (사방 1.5mm 블리드 포함)
const WIDTH_CM = 42.6, HEIGHT_CM = 30.0;
const W = Math.round((WIDTH_CM / CM_PER_INCH) * DPI);   // 5031
const H = Math.round((HEIGHT_CM / CM_PER_INCH) * DPI);  // 3543

const OUT_DIR = path.join(process.env.HOME, "Downloads/더나일-폼보드");
fs.mkdirSync(OUT_DIR, { recursive: true });

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26", g4:"#5C4A3E",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
  sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF", navy:"#1B2A4A", gold:"#B8860B",
};

// ─── 사이트 EmoShape 경로 그대로 ───
const SHAPES = {
  blob:"M50 8c18 0 34 12 38 28s-6 36-22 44-38 4-46-10-6-34 6-46S38 8 50 8z",
  star:"M50 8l9 24h25l-20 15 8 25-22-15-22 15 8-25L16 32h25z",
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  cloud:"M30 70c-12 0-20-8-20-18 0-9 7-16 16-17 1-13 12-23 26-23 13 0 24 9 26 21 11 1 18 9 18 18 0 11-9 19-20 19H30z",
  drop:"M50 8c10 18 30 32 30 50 0 16-13 28-30 28S20 74 20 58c0-18 20-32 30-50z",
  arch:"M16 90V46c0-19 15-34 34-34s34 15 34 34v44H16z",
  flower:"M50 18c0-6 5-10 10-10s10 5 10 10c0 4-2 7-5 9 5 1 9 5 9 10s-4 9-9 10c3 2 5 5 5 9 0 6-5 10-10 10s-10-4-10-10c-2 4-6 6-10 6-6 0-10-5-10-10s4-9 10-9c-4-2-6-5-6-9 0-5 4-9 9-10-3-2-5-5-5-9 0-5 4-9 9-9 5 0 9 4 10 9z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
  pebble:"M50 12c20 0 36 14 36 34S70 88 50 88 14 72 14 46s16-34 36-34z",
  leaf:"M50 8C30 24 14 40 14 60c0 16 14 28 36 28s36-12 36-28C86 40 70 24 50 8z",
};

let _idc = 0;
const emo = (cx, cy, size, shape, c1, c2, opts = {}) => {
  const { rotate = 0, opacity = 1, eyes = false } = opts;
  const d = SHAPES[shape] || SHAPES.blob;
  const id = `emo${++_idc}`;
  const scale = size / 100;
  return `<g transform="translate(${cx - size / 2},${cy - size / 2})" opacity="${opacity}">
    <g transform="rotate(${rotate} ${size / 2} ${size / 2}) scale(${scale})">
      <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <path d="${d}" fill="url(#${id})"/>
      ${eyes ? `<g fill="#1a1a1a"><ellipse cx="40" cy="45" rx="2.5" ry="3.5"/><ellipse cx="60" cy="45" rx="2.5" ry="3.5"/></g>` : ""}
    </g></g>`;
};

// ─── 캐릭터 대형 배치 (글자 뒤/근접 · 오려낼 때 함께 딸려나오도록) ───
// 텍스트 존은 캔버스 중앙 (y 1200~2350, x 1200~3800).
// - 대형(700~900): 텍스트 뒤 겹치게 · opacity 0.6~0.72 (텍스트가 위에서 덮어씀)
// - 중형(450~600): 텍스트 라인 바로 옆 · opacity 0.78~0.9
// - 소형(280~380): 상하단 여백 액센트 · opacity 0.7~0.8
const charSlots = [
  // 텍스트 뒤 (중앙 겹침, 저 opacity)
  { cx: 1500, cy: 1500, size: 850, shape: "burst",  rotate: -10, opacity: 0.62 },
  { cx: 3500, cy: 1500, size: 820, shape: "flower", rotate: 15,  opacity: 0.62 },
  { cx: 2500, cy: 2200, size: 900, shape: "blob",   rotate: -8,  opacity: 0.55 },
  { cx: 1500, cy: 2200, size: 720, shape: "cloud",  rotate: 12,  opacity: 0.6  },
  { cx: 3500, cy: 2200, size: 720, shape: "heart",  rotate: -14, opacity: 0.6  },

  // 텍스트 라인 근접 (양쪽)
  { cx:  760, cy: 1600, size: 560, shape: "star",   rotate: -18, opacity: 0.88 },
  { cx: 4270, cy: 1600, size: 560, shape: "drop",   rotate: 22,  opacity: 0.85 },
  { cx:  820, cy: 2400, size: 520, shape: "leaf",   rotate: 12,  opacity: 0.85 },
  { cx: 4230, cy: 2400, size: 520, shape: "pebble", rotate: -8,  opacity: 0.85 },

  // 상하 액센트 (텍스트 위/아래 살짝 걸침)
  { cx: 2500, cy:  900, size: 420, shape: "arch",   rotate: 0,   opacity: 0.78 },
  { cx: 2500, cy: 2900, size: 460, shape: "flower", rotate: 10,  opacity: 0.8  },
  { cx: 1400, cy:  850, size: 340, shape: "heart",  rotate: -15, opacity: 0.78 },
  { cx: 3600, cy:  850, size: 340, shape: "drop",   rotate: 18,  opacity: 0.78 },
  { cx: 1500, cy: 2900, size: 360, shape: "cloud",  rotate: 8,   opacity: 0.75 },
  { cx: 3500, cy: 2900, size: 360, shape: "burst",  rotate: -12, opacity: 0.78 },
];

function bgCharacters(palette) {
  return charSlots.map((s, i) => {
    const [c1, c2] = palette[i % palette.length];
    return emo(s.cx, s.cy, s.size, s.shape, c1, c2, { rotate: s.rotate, opacity: s.opacity });
  }).join("\n  ");
}

// ─── 폼보드 정의 (배경색 · 텍스트 그라디언트 · 캐릭터 팔레트 각각 다르게) ───
// bg: 파스텔 배경 · gradStops: 3색 그라디언트 · charPalette: 캐릭터 12개용 6쌍 팔레트
const boards = [
  {
    name: "01-메인타이틀",
    lines: ["2026", "양육불안 컨퍼런스"],
    lineSize: [520, 340],
    fill: [C.coral, "gradient"],
    letterSpacing: [-14, -8],
    lineGap: 40,
    bg: C.cream,                                          // 크림 (브랜드 기본)
    gradStops: [C.coral, C.mango, C.lilac],
    charPalette: [                                         // 코랄·망고·라일락 계열
      [C.coral, C.mango], [C.rose, C.lilac], [C.mint, C.sky],
      [C.lilac, C.rose], [C.mango, C.peach], [C.sage, C.mint],
    ],
  },
  {
    name: "02-불안을-불안해하지-마세요",
    lines: ["불안을 불안해하지", "마세요"],
    lineSize: [420, 420],
    fill: ["gradient", "gradient"],
    letterSpacing: [-8, -8],
    lineGap: 30,
    bg: "#DFF3E9",                                         // 소프트 민트
    gradStops: [C.coral, C.mango, C.lilac],
    charPalette: [
      [C.coral, C.rose], [C.mango, C.peach], [C.lilac, C.sky],
      [C.rose, C.lilac], [C.coral, C.peach], [C.mango, C.rose],
    ],
  },
  {
    name: "03-불안을-넘어-행복으로",
    lines: ["불안을 넘어", "행복으로"],
    lineSize: [440, 480],
    fill: ["gradient", "gradient"],
    letterSpacing: [-8, -8],
    lineGap: 30,
    bg: "#FFE4CE",                                         // 소프트 피치
    gradStops: [C.navy, C.coral, C.lilac],                 // 다크 → 코랄 → 라일락
    charPalette: [
      [C.lilac, C.sky], [C.sage, C.mint], [C.rose, C.lilac],
      [C.sky, C.mint], [C.mint, C.sage], [C.lilac, C.rose],
    ],
  },
  {
    name: "04-걱정-많은-부모-여기-있습니다",
    lines: ["걱정 많은 부모,", "여기 있습니다"],
    lineSize: [380, 420],
    fill: ["gradient", "gradient"],
    letterSpacing: [-6, -8],
    lineGap: 30,
    bg: "#E1EFFA",                                         // 소프트 스카이 블루
    gradStops: [C.coral, C.mango, C.peach],
    charPalette: [
      [C.coral, C.mango], [C.mango, C.peach], [C.rose, C.coral],
      [C.peach, C.rose], [C.coral, C.peach], [C.mango, C.rose],
    ],
  },
  {
    name: "05-나만-불안한-게-아니었어",
    lines: ["나만 불안한 게", "아니었어!"],
    lineSize: [400, 460],
    fill: ["gradient", "gradient"],
    letterSpacing: [-6, -8],
    lineGap: 30,
    bg: "#EEE0F5",                                         // 소프트 라일락
    gradStops: [C.coral, C.mango, C.mint],
    charPalette: [
      [C.mango, C.peach], [C.mint, C.sky], [C.coral, C.mango],
      [C.sage, C.mint], [C.mango, C.rose], [C.sky, C.mint],
    ],
  },
  {
    name: "06-불안하지만-잘하고-있습니다",
    lines: ["불안하지만,", "잘하고 있습니다"],
    lineSize: [420, 400],
    fill: ["gradient", "gradient"],
    letterSpacing: [-8, -6],
    lineGap: 30,
    bg: "#FCE1E7",                                         // 소프트 로즈
    gradStops: [C.navy, C.coral, C.mango],
    charPalette: [
      [C.sage, C.mint], [C.sky, C.mint], [C.mango, C.peach],
      [C.mint, C.sage], [C.sky, C.lilac], [C.mango, C.mint],
    ],
  },
  {
    name: "07-우리의-양육-다시-다정하게",
    lines: ["우리의 양육,", "다시 다정하게"],
    lineSize: [420, 420],
    fill: ["gradient", "gradient"],
    letterSpacing: [-6, -8],
    lineGap: 30,
    bg: "#FFF0C7",                                         // 소프트 버터 옐로우
    gradStops: [C.coral, C.lilac, C.sage],
    charPalette: [
      [C.coral, C.rose], [C.lilac, C.rose], [C.sage, C.mint],
      [C.rose, C.lilac], [C.mint, C.sky], [C.coral, C.lilac],
    ],
  },
];

function renderBoard(b) {
  const gradFill = `url(#titleGradient)`;
  const resolveFill = (v) => v === "gradient" ? gradFill : v;

  // 세로 중앙 정렬 계산
  const totalTextH = b.lines.reduce((sum, _, i) => sum + b.lineSize[i], 0) + (b.lines.length - 1) * b.lineGap;
  let cursorY = (H - totalTextH) / 2 + b.lineSize[0] * 0.85;

  const lineElements = b.lines.map((line, i) => {
    const fs = b.lineSize[i];
    const fill = resolveFill(b.fill[i]);
    const ls = Array.isArray(b.letterSpacing) ? b.letterSpacing[i] : b.letterSpacing;
    const el = `<text x="${W / 2}" y="${cursorY}" font-family="'Noto Serif KR', 'Pretendard', sans-serif" font-size="${fs}" font-weight="900" fill="${fill}" text-anchor="middle" letter-spacing="${ls}">${line}</text>`;
    cursorY += fs + b.lineGap;
    return el;
  }).join("\n    ");

  const [g1, g2, g3] = b.gradStops || [C.coral, C.mango, C.lilac];
  const bg = b.bg || C.cream;
  const palette = b.charPalette || [
    [C.coral, C.mango], [C.rose, C.lilac], [C.mint, C.sky],
    [C.lilac, C.rose], [C.mango, C.peach], [C.sage, C.mint],
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>

  <defs>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g1}"/>
      <stop offset="50%" stop-color="${g2}"/>
      <stop offset="100%" stop-color="${g3}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 (팔레트 순환) -->
  ${bgCharacters(palette)}

  <!-- 메인 슬로건 텍스트 -->
  ${lineElements}
</svg>`;
}

async function saveBoard(b) {
  const svg = renderBoard(b);
  const outPng = path.join(OUT_DIR, `${b.name}.png`);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPng);
  const pngStat = fs.statSync(outPng);

  const widthPt = (WIDTH_CM / CM_PER_INCH) * PT_PER_INCH;
  const heightPt = (HEIGHT_CM / CM_PER_INCH) * PT_PER_INCH;
  const pdfPath = path.join(OUT_DIR, `${b.name}.pdf`);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`2026 양육불안 컨퍼런스 - 폼보드 ${b.name}`);
  pdfDoc.setAuthor("사단법인 더나일");
  pdfDoc.setSubject(`${WIDTH_CM}×${HEIGHT_CM}cm A3 가로 인쇄 발주용`);
  const pngBytes = fs.readFileSync(outPng);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([widthPt, heightPt]);
  page.drawImage(pngImage, { x: 0, y: 0, width: widthPt, height: heightPt });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);
  const pdfStat = fs.statSync(pdfPath);

  console.log(`✓ [${b.name}]`);
  console.log(`  PNG: ${(pngStat.size / 1024 / 1024).toFixed(2)} MB · ${W}×${H} px`);
  console.log(`  PDF: ${(pdfStat.size / 1024 / 1024).toFixed(2)} MB · ${widthPt.toFixed(0)}×${heightPt.toFixed(0)} pt`);
}

console.log(`\n═══ 폼보드 A3 가로 발주용 생성 ═══`);
console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`저장 위치: ${OUT_DIR}\n`);

for (const b of boards) {
  await saveBoard(b);
}

console.log(`\n✓ 총 ${boards.length}개 폼보드 생성 완료`);
