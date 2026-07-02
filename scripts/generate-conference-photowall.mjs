// 컨퍼런스 포토월 배너 (180cm × 200cm @ 150dpi)
// 실행: node scripts/generate-conference-photowall.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const CM_PER_INCH = 2.54;
const DPI = 150;

const WIDTH_CM = 180, HEIGHT_CM = 200;
const W = Math.round((WIDTH_CM / CM_PER_INCH) * DPI);   // 10630
const H = Math.round((HEIGHT_CM / CM_PER_INCH) * DPI);  // 11811
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-포토월.png");

const C = {
  navy: "#1B2A4A",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  ink: "#2A1F1A",
  mango: "#FFC93C",
  peach: "#FFB088",
};

const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const NILE_LOGO_SVG_PATH = path.join(ROOT, "public/images/thenile-logo.svg");

// ─── 더나일 공식 로고 렌더링 (색상 변환) ───
const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");

async function renderNileLogo(cellW, cellH, textColor, dotColor) {
  // fill 색상 치환: #1E1E1E → textColor, #3985FF → dotColor
  const themedSvg = nileSvgSource
    .replaceAll('fill="#1E1E1E"', `fill="${textColor}"`)
    .replaceAll('fill="#3985FF"', `fill="${dotColor}"`);

  // 셀 크기의 70%만 사용 (여백)
  const targetW = Math.round(cellW * 0.65);
  const targetH = Math.round(cellH * 0.3);

  const rasterized = await sharp(Buffer.from(themedSvg), { density: 300 })
    .resize({ width: targetW, height: targetH, fit: "inside" })
    .png()
    .toBuffer();
  return rasterized;
}

// ─── 협찬사 로고 렌더링 ───
async function partnerLogoForCell(filePath, cellW, cellH) {
  if (!fs.existsSync(filePath)) return null;
  const marginX = Math.round(cellW * 0.18);
  const marginY = Math.round(cellH * 0.22);
  const targetW = cellW - marginX * 2;
  const targetH = cellH - marginY * 2;
  const resized = await sharp(filePath)
    .resize({ width: targetW, height: targetH, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const buf = await sharp({
    create: { width: cellW, height: cellH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  }).composite([{ input: resized, gravity: "centre" }]).png().toBuffer();
  return buf;
}

// 헤이그라운드 · Take Root · 봄마음 제외 (13개)
const partners = [
  { name: "성동구청",        path: "seongdong.png" },
  { name: "BICYCLE",         path: "bicycle.png" },
  { name: "고마워서그래",     path: "gomaweo.png" },
  { name: "AZURE852",        path: "azure852.png" },
  { name: "sheventures",     path: "sheventures.webp" },
  { name: "몽클",            path: "mongcle.png" },
  { name: "BOBOMAMA",        path: "bobomama.png" },
  { name: "원니스코칭센터",   path: "oneness.png" },
  { name: "앙즈로 산후조리원", path: "angelot.png" },
  { name: "hey you",         path: "heyyou.png" },
  { name: "레피움",          path: "lepium.jpg" },
  { name: "앙호두",          path: "anghodu.png" },
  { name: "다랑클래스",       path: "darangclass.jpg" },
];

// ─── 그리드: 6×7 = 42셀 체스판 ───
const COLS = 6, ROWS = 7;
const CELL_W = Math.floor(W / COLS);
const CELL_H = Math.floor(H / ROWS);

const cells = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const isNavy = (r + c) % 2 === 0;
    cells.push({ row: r, col: c, isNavy, x: c * CELL_W, y: r * CELL_H });
  }
}

// 남색 셀: 모두 더나일 로고 (크림 톤)
const nileLogoCream = await renderNileLogo(CELL_W, CELL_H, C.cream, C.mango);

// 흰색 셀: 협찬사 로고 반복 배열 + 남는 셀에 더나일 로고 (남색)
const whiteCells = cells.filter(c => !c.isNavy);
const partnerLogos = [];
for (const p of partners) {
  partnerLogos.push({
    name: p.name,
    buf: await partnerLogoForCell(path.join(PARTNERS_DIR, p.path), CELL_W, CELL_H),
  });
}
const nileLogoNavy = await renderNileLogo(CELL_W, CELL_H, C.navy, "#3985FF");

// 흰색 셀 21개에 협찬사 15개 → 나머지 6개 셀은 협찬사 반복 (앞 6개 재사용)
for (let i = 0; i < whiteCells.length; i++) {
  whiteCells[i].logo = partnerLogos[i % partnerLogos.length];
}

// ─── 렌더링: 큰 캔버스 위에 composite ───
console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`그리드: ${COLS}×${ROWS} = ${COLS*ROWS}셀, 셀 ${CELL_W}×${CELL_H}`);
console.log(`남색 셀 ${cells.filter(c=>c.isNavy).length}개 · 흰색 셀 ${whiteCells.length}개`);
console.log(`협찬사 ${partners.length}개 반복 배열 → ${whiteCells.length}칸`);

// 셀 개별 렌더링 후 큰 캔버스에 composite
const composites = [];

// 남색 셀 배경 rect + 더나일 로고
const navyCellBuf = await sharp({
  create: { width: CELL_W, height: CELL_H, channels: 3, background: { r: 27, g: 42, b: 74 } },  // navy
}).composite([{ input: nileLogoCream, gravity: "centre" }]).png().toBuffer();

// 흰색 셀 각각: 협찬사 로고
for (const c of cells) {
  if (c.isNavy) {
    composites.push({ input: navyCellBuf, top: c.y, left: c.x });
  } else {
    composites.push({ input: c.logo.buf, top: c.y, left: c.x });
  }
}

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 255, g: 255, b: 255 } },
  limitInputPixels: false,
})
  .composite(composites)
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const stat = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(stat.size/1024/1024).toFixed(1)} MB`);
