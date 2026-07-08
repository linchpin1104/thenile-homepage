// 2026 양육불안 컨퍼런스 폼보드 7종 (A3 세로, 30.0×42.6cm 작업 사이즈 · 사방 1.5mm 블리드)
// 실행: node scripts/generate-conference-foamboards.mjs
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const CM_PER_INCH = 2.54;
const PT_PER_INCH = 72;
const DPI = 300;

// A3 작업 사이즈 (사방 1.5mm 블리드 포함)
const WIDTH_CM = 30.0, HEIGHT_CM = 42.6;
const W = Math.round((WIDTH_CM / CM_PER_INCH) * DPI);   // 3543
const H = Math.round((HEIGHT_CM / CM_PER_INCH) * DPI);  // 5031
const SAFE_MARGIN = 200;  // 안전 영역 (재단선에서 안쪽으로)

const OUT_DIR = path.join(process.env.HOME, "Downloads/더나일-폼보드");
fs.mkdirSync(OUT_DIR, { recursive: true });

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26", g4:"#5C4A3E",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
  sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF", navy:"#1B2A4A",
};

const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const NILE_LOGO_SVG_PATH = path.join(ROOT, "public/images/thenile-logo.svg");
const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");

const nileLogoBuf = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ height: 90 }).png().toBuffer();
const nileLogoB64 = "data:image/png;base64," + nileLogoBuf.toString("base64");
const nileLogoMeta = await sharp(nileLogoBuf).metadata();

const seongdongLogoBuf = await sharp(path.join(PARTNERS_DIR, "seongdong.png"))
  .resize({ height: 200 }).png().toBuffer();
const seongdongLogoB64 = "data:image/png;base64," + seongdongLogoBuf.toString("base64");
const seongdongLogoMeta = await sharp(seongdongLogoBuf).metadata();

const PATHS = {
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  drop:"M50 8c10 18 30 32 30 50 0 16-13 28-30 28S20 74 20 58c0-18 20-32 30-50z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
  leaf:"M50 8C30 24 14 40 14 60c0 16 14 28 36 28s36-12 36-28C86 40 70 24 50 8z",
};

let _idc = 0;
const emo = (cx, cy, size, shape, c1, c2, opts = {}) => {
  const { rotate = 0, opacity = 1 } = opts;
  const d = PATHS[shape];
  const id = `fbg${++_idc}`;
  const scale = size / 100;
  return `<g transform="translate(${cx - size / 2},${cy - size / 2})" opacity="${opacity}">
    <g transform="rotate(${rotate} ${size / 2} ${size / 2}) scale(${scale})">
      <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <path d="${d}" fill="url(#${id})"/>
    </g></g>`;
};

// 폼보드 정의: 슬로건 / 스타일 프리셋 / 라인 분할 규칙
const boards = [
  {
    name: "01-메인타이틀",
    lines: ["2026", "양육불안 컨퍼런스"],
    lineSize: [500, 300],
    fill: [C.coral, "gradient"],
    weight: 900,
    letterSpacing: -8,
    kind: "title",
  },
  {
    name: "02-불안을-불안해하지-마세요",
    lines: ["불안을", "불안해하지 마세요"],
    lineSize: [420, 300],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
  {
    name: "03-불안을-넘어-행복으로",
    lines: ["불안을 넘어", "행복으로"],
    lineSize: [360, 360],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
  {
    name: "04-걱정-많은-부모-여기-있습니다",
    lines: ["걱정 많은 부모,", "여기 있습니다"],
    lineSize: [280, 320],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
  {
    name: "05-나만-불안한-게-아니었어",
    lines: ["나만 불안한 게", "아니었어!"],
    lineSize: [300, 340],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
  {
    name: "06-불안하지만-잘하고-있습니다",
    lines: ["불안하지만,", "잘하고 있습니다"],
    lineSize: [320, 300],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
  {
    name: "07-우리의-양육-다시-다정하게",
    lines: ["우리의 양육,", "다시 다정하게"],
    lineSize: [320, 320],
    fill: ["gradient", "gradient"],
    weight: 900,
    letterSpacing: -6,
    kind: "slogan",
  },
];

function renderBoard(b) {
  const gradFill = `url(#titleGradient)`;
  const resolveFill = (v) => v === "gradient" ? gradFill : v;

  // 세로 중앙 정렬
  const totalTextH = b.lines.reduce((sum, _, i) => sum + b.lineSize[i], 0) + (b.lines.length - 1) * 50;
  let cursorY = (H - totalTextH) / 2 + b.lineSize[0] * 0.85;

  const lineElements = b.lines.map((line, i) => {
    const fs = b.lineSize[i];
    const fill = resolveFill(b.fill[i]);
    const el = `<text x="${W / 2}" y="${cursorY}" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="${fs}" font-weight="${b.weight}" fill="${fill}" text-anchor="middle" letter-spacing="${b.letterSpacing}">${line}</text>`;
    cursorY += fs + 50;
    return el;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 (로고 영역 피해서 배치) -->
  ${emo(W / 2, H - 900, 380, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.35 })}
  ${emo(240, H - 1450, 300, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.5 })}
  ${emo(200, H - 550, 260, "drop", C.lilac, C.sky, { rotate: -15, opacity: 0.5 })}
  ${emo(W - 280, H - 500, 280, "leaf", C.sage, C.mint, { rotate: 22, opacity: 0.5 })}

  <!-- 상단 로고 (좌 더나일, 우 성동구) -->
  ${(() => {
    const baseY = 240;
    const rowH = Math.max(nileLogoMeta.height, seongdongLogoMeta.height);
    const nileY = baseY + (rowH - nileLogoMeta.height) / 2;
    const sdY = baseY + (rowH - seongdongLogoMeta.height) / 2;
    return `
      <image x="${SAFE_MARGIN}" y="${nileY}" width="${nileLogoMeta.width}" height="${nileLogoMeta.height}" href="${nileLogoB64}"/>
      <image x="${W - seongdongLogoMeta.width - SAFE_MARGIN}" y="${sdY}" width="${seongdongLogoMeta.width}" height="${seongdongLogoMeta.height}" href="${seongdongLogoB64}"/>
    `;
  })()}

  <!-- 상단 헤더 칩 (메인 타이틀이 아닌 경우만) -->
  ${b.kind !== "title" ? `
    <g transform="translate(${W / 2}, 620)">
      <rect x="-560" y="-70" rx="60" ry="60" width="1120" height="140" fill="${C.white}" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.55"/>
      <text x="0" y="18" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="80" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="8">2026 양육불안 컨퍼런스</text>
    </g>
  ` : ""}

  <!-- 메인 텍스트 -->
  ${lineElements}

  <!-- 하단 브랜드 라인 -->
  <text x="${W / 2}" y="${H - 320}" font-family="'Cormorant Garamond',serif" font-size="72" font-style="italic" font-weight="500" fill="${C.g4}" text-anchor="middle" letter-spacing="4">Nurtuning Into the Light Everyday</text>
  <text x="${W / 2}" y="${H - 220}" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="52" font-weight="700" fill="${C.inkBrown}" text-anchor="middle" letter-spacing="6" opacity="0.75">2026. 7. 9. (목) · 헤이그라운드 성수시작점</text>
</svg>`;
}

async function saveBoard(b) {
  const svg = renderBoard(b);
  const outPng = path.join(OUT_DIR, `${b.name}.png`);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPng);
  const pngStat = fs.statSync(outPng);

  // PDF 생성 (실제 물리 사이즈: cm → pt)
  const widthPt = (WIDTH_CM / CM_PER_INCH) * PT_PER_INCH;
  const heightPt = (HEIGHT_CM / CM_PER_INCH) * PT_PER_INCH;
  const pdfPath = path.join(OUT_DIR, `${b.name}.pdf`);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`2026 양육불안 컨퍼런스 - 폼보드 ${b.name}`);
  pdfDoc.setAuthor("사단법인 더나일");
  pdfDoc.setSubject(`${WIDTH_CM}×${HEIGHT_CM}cm A3 인쇄 발주용`);
  const pngBytes = fs.readFileSync(outPng);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([widthPt, heightPt]);
  page.drawImage(pngImage, { x: 0, y: 0, width: widthPt, height: heightPt });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);
  const pdfStat = fs.statSync(pdfPath);

  console.log(`✓ [${b.name}]`);
  console.log(`  PNG: ${(pngStat.size / 1024 / 1024).toFixed(2)} MB · ${W}×${H} px`);
  console.log(`  PDF: ${(pdfStat.size / 1024 / 1024).toFixed(2)} MB · ${widthPt.toFixed(0)}×${heightPt.toFixed(0)} pt (${WIDTH_CM}×${HEIGHT_CM}cm)`);
}

console.log(`\n═══ 폼보드 A3 발주용 생성 ═══`);
console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`재단 사이즈: 29.7×42.3cm · 사방 1.5mm 블리드 포함`);
console.log(`저장 위치: ${OUT_DIR}\n`);

for (const b of boards) {
  await saveBoard(b);
}

console.log(`\n✓ 총 ${boards.length}개 폼보드 생성 완료`);
