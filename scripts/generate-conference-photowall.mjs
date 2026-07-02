// 컨퍼런스 포토월 배너 (180cm × 200cm @ 150dpi)
// 실행: node scripts/generate-conference-photowall.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const CM_PER_INCH = 2.54;
const DPI = 150;

// 실제 사이즈: 180×200cm
const WIDTH_CM = 180, HEIGHT_CM = 200;
const W = Math.round((WIDTH_CM / CM_PER_INCH) * DPI);   // 10630
const H = Math.round((HEIGHT_CM / CM_PER_INCH) * DPI);  // 11811
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-포토월.png");

const C = {
  navy: "#1B2A4A",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  ink: "#2A1F1A",
  coral: "#FF6B6B",
  peach: "#FFB088",
  mango: "#FFC93C",
};

const PARTNERS_DIR = path.join(ROOT, "public/images/partners");

// 협찬사 로고 (흰 배경으로 정규화, 셀에 fit)
async function partnerLogoForCell(filePath, cellW, cellH) {
  if (!fs.existsSync(filePath)) return null;
  const marginX = Math.round(cellW * 0.15);
  const marginY = Math.round(cellH * 0.20);
  const targetW = cellW - marginX * 2;
  const targetH = cellH - marginY * 2;
  const resized = await sharp(filePath)
    .resize({ width: targetW, height: targetH, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const buf = await sharp({
    create: { width: cellW, height: cellH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  }).composite([{ input: resized, gravity: "centre" }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

const partners = [
  { name: "성동구청",        path: "seongdong.png" },
  { name: "헤이그라운드",     path: "heyground.png" },
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

// ─── 그리드 구성 ───
// 6열 × 7행 = 42셀. 체스판 무늬로 남색(21) + 흰색(21) 반반씩
// 흰색 셀: 협찬사 로고 15개 + 더나일 로고 여백 6개
// 남색 셀: 21개 모두 "사단법인 더나일" 텍스트 (강조)
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

// 협찬사를 흰색 셀에 순차 배치 (15개), 나머지 흰 셀(6개)은 더나일 텍스트 로고
const whiteCells = cells.filter(c => !c.isNavy);
for (let i = 0; i < partners.length && i < whiteCells.length; i++) {
  whiteCells[i].partner = partners[i];
  whiteCells[i].partner.img = await partnerLogoForCell(
    path.join(PARTNERS_DIR, partners[i].path),
    CELL_W, CELL_H
  );
}

// ─── SVG 생성 ───
function drawNavyCell(cell) {
  // 남색 배경 + "사단법인 더나일" 텍스트 (강조 브랜딩)
  const cx = cell.x + CELL_W / 2;
  const line1Y = cell.y + CELL_H / 2 - 40;
  const line2Y = cell.y + CELL_H / 2 + 60;
  return `
    <rect x="${cell.x}" y="${cell.y}" width="${CELL_W}" height="${CELL_H}" fill="${C.navy}"/>
    <text x="${cx}" y="${line1Y}" font-family="Pretendard" font-size="70" font-weight="600" fill="${C.cream}" text-anchor="middle" opacity="0.8" letter-spacing="6">사단법인</text>
    <text x="${cx}" y="${line2Y}" font-family="Pretendard" font-size="130" font-weight="900" fill="${C.mango}" text-anchor="middle" letter-spacing="-2">더나일</text>
  `;
}

function drawWhiteCell(cell) {
  const rect = `<rect x="${cell.x}" y="${cell.y}" width="${CELL_W}" height="${CELL_H}" fill="${C.white}"/>`;
  if (cell.partner?.img) {
    return `${rect}<image x="${cell.x}" y="${cell.y}" width="${CELL_W}" height="${CELL_H}" href="${cell.partner.img}"/>`;
  } else {
    // 협찬사 남는 흰 셀: 더나일 로고 wordmark
    const cx = cell.x + CELL_W / 2;
    const cy = cell.y + CELL_H / 2;
    return `
      ${rect}
      <text x="${cx}" y="${cy - 30}" font-family="Georgia, serif" font-size="80" font-weight="700" fill="${C.navy}" text-anchor="middle" letter-spacing="6">THE NILE</text>
      <text x="${cx}" y="${cy + 40}" font-family="Pretendard" font-size="30" fill="${C.ink}" text-anchor="middle" opacity="0.7" letter-spacing="2">사단법인 더나일</text>
    `;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.white}"/>
  ${cells.map(c => c.isNavy ? drawNavyCell(c) : drawWhiteCell(c)).join("\n")}
</svg>`;

console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`그리드: ${COLS}×${ROWS} = ${COLS*ROWS}셀, 셀 크기 ${CELL_W}×${CELL_H}`);
console.log(`남색 셀 ${cells.filter(c=>c.isNavy).length}개 (더나일 브랜딩)`);
console.log(`흰색 셀 ${cells.filter(c=>!c.isNavy).length}개 (협찬사 ${partners.length} + 더나일 로고 ${whiteCells.length-partners.length})`);

await sharp(Buffer.from(svg), { limitInputPixels: false }).png({ compressionLevel: 9 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024/1024).toFixed(1)} MB`);
