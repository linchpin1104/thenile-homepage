// 인쇄 발주용 PDF 생성 (120dpi + 실제 사이즈)
// 실행: node scripts/export-print-pdfs.mjs
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

const HOME = process.env.HOME;
const DPI = 150;  // 발주 최소 120dpi (여유있게 150)
const CM_PER_INCH = 2.54;
const PT_PER_INCH = 72;

// 각 인쇄물 정의
const items = [
  {
    name: "더나일-컨퍼런스-현수막",
    src: path.join(HOME, "Downloads/더나일-컨퍼런스-현수막.png"),
    widthCm: 500, heightCm: 90,
  },
  {
    name: "더나일-컨퍼런스-엑스배너",
    src: path.join(HOME, "Downloads/더나일-컨퍼런스-엑스배너.png"),
    widthCm: 60, heightCm: 180,
  },
  {
    name: "더나일-페이서-엑스배너",
    src: path.join(HOME, "Downloads/더나일-페이서-엑스배너.png"),
    widthCm: 60, heightCm: 180,
  },
  {
    name: "더나일-컨퍼런스-포토월-대형",
    src: path.join(HOME, "Downloads/더나일-컨퍼런스-포토월-대형.png"),
    widthCm: 300, heightCm: 200,
  },
  {
    // A3 종이 포스터: 작업 사이즈 30.0×42.6cm (재단 사이즈 29.7×42.3cm, 사방 1.5mm 블리드)
    // 인스타용 포스터(3:4)가 A3 비율에 가장 근접 → contain fit + cream 여백
    name: "더나일-컨퍼런스-포스터-A3",
    src: path.join(HOME, "Downloads/더나일-컨퍼런스-포스터-인스타.png"),
    widthCm: 30.0, heightCm: 42.6,
    fitMode: "contain",
    bgColor: { r: 255, g: 248, b: 236 },  // cream 배경 (포스터와 동일)
  },
];

const OUT_DIR = path.join(HOME, "Downloads/더나일-인쇄발주");
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const it of items) {
  if (!fs.existsSync(it.src)) {
    console.error(`✗ 원본 없음: ${it.src}`);
    continue;
  }

  // 목표 해상도 계산 (실제 사이즈 × DPI)
  const targetW = Math.round((it.widthCm / CM_PER_INCH) * DPI);
  const targetH = Math.round((it.heightCm / CM_PER_INCH) * DPI);
  console.log(`\n[${it.name}] ${it.widthCm}×${it.heightCm}cm @ ${DPI}dpi`);
  console.log(`  목표 해상도: ${targetW}×${targetH}px`);

  // 원본 PNG를 목표 해상도로 확대 (Lanczos3 curve로 품질 유지)
  const upscaledPath = path.join(OUT_DIR, `${it.name}-${DPI}dpi.png`);
  const fit = it.fitMode || "fill";
  const bg = it.bgColor || { r: 255, g: 255, b: 255 };

  if (fit === "contain") {
    // contain: 배경 캔버스 위에 이미지를 fit inside해서 composite (확실히 배경색 채움)
    const srcMeta = await sharp(it.src).metadata();
    const srcRatio = srcMeta.width / srcMeta.height;
    const targetRatio = targetW / targetH;
    let imgW, imgH;
    if (srcRatio > targetRatio) {
      imgW = targetW;
      imgH = Math.round(targetW / srcRatio);
    } else {
      imgH = targetH;
      imgW = Math.round(targetH * srcRatio);
    }
    const imgBuf = await sharp(it.src)
      .resize({ width: imgW, height: imgH, kernel: "lanczos3" })
      .png()
      .toBuffer();
    await sharp({
      create: { width: targetW, height: targetH, channels: 3, background: bg },
    })
      .composite([{ input: imgBuf, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toFile(upscaledPath);
  } else {
    await sharp(it.src)
      .resize({ width: targetW, height: targetH, kernel: "lanczos3", fit })
      .png({ compressionLevel: 9 })
      .toFile(upscaledPath);
  }
  const pngStat = fs.statSync(upscaledPath);
  console.log(`  ✓ PNG: ${(pngStat.size/1024/1024).toFixed(1)} MB`);

  // PDF 생성 (실제 물리 사이즈: cm → pt)
  const widthPt = (it.widthCm / CM_PER_INCH) * PT_PER_INCH;
  const heightPt = (it.heightCm / CM_PER_INCH) * PT_PER_INCH;
  const pdfPath = path.join(OUT_DIR, `${it.name}.pdf`);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(it.name);
  pdfDoc.setAuthor("사단법인 더나일");
  pdfDoc.setSubject(`${it.widthCm}×${it.heightCm}cm 인쇄 발주용`);
  pdfDoc.setCreator("The Nile");
  const pngBytes = fs.readFileSync(upscaledPath);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([widthPt, heightPt]);
  page.drawImage(pngImage, { x: 0, y: 0, width: widthPt, height: heightPt });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);
  const pdfStat = fs.statSync(pdfPath);
  console.log(`  ✓ PDF: ${(pdfStat.size/1024/1024).toFixed(1)} MB · ${widthPt.toFixed(0)}×${heightPt.toFixed(0)} pt`);
}

console.log(`\n═══════════════════════════════════════`);
console.log(`✓ 발주용 PDF/PNG 저장: ${OUT_DIR}`);
console.log(`  - PDF는 실제 물리 사이즈(pt) 지정 → 인쇄 도구에서 자동 인식`);
console.log(`  - PNG는 ${DPI}dpi 원본 (백업용)`);
console.log(`\n⚠ 발주 시 안내사항:`);
console.log(`  - CMYK 변환은 인쇄소에 맡기거나 인쇄 전문 도구로 처리`);
console.log(`  - 검정 텍스트는 원본 SVG 상 #2A1F1A (진한 갈색) 사용 중`);
console.log(`  - 사방 5cm 안전 영역: 우리 디자인의 중요 텍스트/사진은 안전 영역 안에 있음`);
