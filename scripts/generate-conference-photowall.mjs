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
const SEONGDONG_LOGO_PATH = path.join(PARTNERS_DIR, "seongdong.png");

// ─── 더나일 공식 로고 렌더링 ───
const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");

async function renderNileLogo(targetW, targetH, textColor, dotColor) {
  const themedSvg = nileSvgSource
    .replaceAll('fill="#1E1E1E"', `fill="${textColor}"`)
    .replaceAll('fill="#3985FF"', `fill="${dotColor}"`);
  return await sharp(Buffer.from(themedSvg), { density: 300 })
    .resize({ width: targetW, height: targetH, fit: "inside" })
    .png()
    .toBuffer();
}

async function renderImage(filePath, targetW, targetH) {
  return await sharp(filePath)
    .resize({ width: targetW, height: targetH, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
}

// ─── 헤더 영역: 좌 더나일 로고 · 우 성동구청 로고 ───
const HEADER_H = 1200;
const headerMargin = 400;
const headerLogoH = HEADER_H - 300;  // 900

const nileHeaderLogo = await renderNileLogo(
  Math.round(W * 0.35), headerLogoH, C.navy, "#3985FF"
);
const seongdongHeaderLogo = await renderImage(SEONGDONG_LOGO_PATH, 1600, headerLogoH);
const nileMeta = await sharp(nileHeaderLogo).metadata();
const seongdongMeta = await sharp(seongdongHeaderLogo).metadata();

// ─── 셀 협찬사 로고 렌더링 ───
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

// 헤이그라운드 · Take Root 제외 (봄마음 포함)
const partners = [
  { name: "성동구청",        path: "seongdong.png" },
  { name: "BICYCLE",         path: "bicycle.png" },
  { name: "고마워서그래",     path: "gomaweo.png" },
  { name: "AZURE852",        path: "azure852.png" },
  { name: "sheventures",     path: "sheventures.webp" },
  { name: "몽클",            path: "mongcle.png" },
  { name: "봄마음",          path: "bommaeum.png" },
  { name: "BOBOMAMA",        path: "bobomama.png" },
  { name: "원니스코칭센터",   path: "oneness.png" },
  { name: "앙즈로 산후조리원", path: "angelot.png" },
  { name: "hey you",         path: "heyyou.png" },
  { name: "레피움",          path: "lepium.jpg" },
  { name: "앙호두",          path: "anghodu.png" },
  { name: "다랑클래스",       path: "darangclass.jpg" },
];

// ─── 그리드: 상단 헤더 아래 6×6 체스판 ───
const GRID_TOP = HEADER_H;
const GRID_H = H - HEADER_H;
const COLS = 6, ROWS = 6;
const CELL_W = Math.floor(W / COLS);
const CELL_H = Math.floor(GRID_H / ROWS);

const cells = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const isNavy = (r + c) % 2 === 0;
    cells.push({ row: r, col: c, isNavy, x: c * CELL_W, y: GRID_TOP + r * CELL_H });
  }
}

const nileLogoCream = await renderNileLogo(
  Math.round(CELL_W * 0.65), Math.round(CELL_H * 0.3), C.cream, C.mango
);

const whiteCells = cells.filter(c => !c.isNavy);
const partnerLogos = [];
for (const p of partners) {
  partnerLogos.push({
    name: p.name,
    buf: await partnerLogoForCell(path.join(PARTNERS_DIR, p.path), CELL_W, CELL_H),
  });
}
for (let i = 0; i < whiteCells.length; i++) {
  whiteCells[i].logo = partnerLogos[i % partnerLogos.length];
}

console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`헤더: y 0~${HEADER_H} (더나일 좌, 성동구 우)`);
console.log(`그리드: ${COLS}×${ROWS} = ${COLS*ROWS}셀 (y ${GRID_TOP}~${H})`);
console.log(`남색 셀 ${cells.filter(c=>c.isNavy).length}개 · 흰색 셀 ${whiteCells.length}개`);
console.log(`협찬사 ${partners.length}개 반복 배열 → ${whiteCells.length}칸`);

// 셀 렌더링 준비
const navyCellBuf = await sharp({
  create: { width: CELL_W, height: CELL_H, channels: 3, background: { r: 27, g: 42, b: 74 } },
}).composite([{ input: nileLogoCream, gravity: "centre" }]).png().toBuffer();

const composites = [];

// 헤더: 좌 더나일 (x 여백 headerMargin, 수직 중앙), 우 성동구 (반대)
composites.push({
  input: nileHeaderLogo,
  top: Math.round((HEADER_H - nileMeta.height) / 2),
  left: headerMargin,
});
composites.push({
  input: seongdongHeaderLogo,
  top: Math.round((HEADER_H - seongdongMeta.height) / 2),
  left: W - seongdongMeta.width - headerMargin,
});

// 헤더 아래 구분선 (얇은 남색 라인)
const dividerBuf = await sharp({
  create: { width: W, height: 20, channels: 3, background: { r: 27, g: 42, b: 74 } },
}).png().toBuffer();
composites.push({ input: dividerBuf, top: HEADER_H - 20, left: 0 });

// 셀들
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
