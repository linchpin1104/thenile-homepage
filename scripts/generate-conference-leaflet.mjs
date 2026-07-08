// 2026 양육불안 컨퍼런스 리플렛 (A4 세로, 21.0×29.7cm @ 300dpi)
// 프로그램 타임테이블 + 슬라이도 QR + 후원 QR + 협찬사
// 실행: node scripts/generate-conference-leaflet.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const CM_PER_INCH = 2.54;
const DPI = 300;

// A4 세로 21.0×29.7cm @ 300dpi
const WIDTH_CM = 21.0, HEIGHT_CM = 29.7;
const W = Math.round((WIDTH_CM / CM_PER_INCH) * DPI);  // 2480
const H = Math.round((HEIGHT_CM / CM_PER_INCH) * DPI); // 3508
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛.png");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26", g4:"#5C4A3E", g5:"#7A6355",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0", sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF", gold:"#B8860B", navy:"#1B2A4A",
};

const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const QR_DIR = path.join(ROOT, "public/images/qr");
const NILE_LOGO_SVG_PATH = path.join(ROOT, "public/images/thenile-logo.svg");

function imgB64(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : ext;
  return `data:image/${mime};base64,` + fs.readFileSync(filePath).toString("base64");
}

const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");
const nileLogoBuf = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ height: 90 }).png().toBuffer();
const nileLogoB64 = "data:image/png;base64," + nileLogoBuf.toString("base64");
const nileLogoMeta = await sharp(nileLogoBuf).metadata();

const seongdongLogoBuf = await sharp(path.join(PARTNERS_DIR, "seongdong.png"))
  .resize({ height: 210 }).png().toBuffer();
const seongdongLogoB64 = "data:image/png;base64," + seongdongLogoBuf.toString("base64");
const seongdongLogoMeta = await sharp(seongdongLogoBuf).metadata();

const slidoQR = imgB64(path.join(QR_DIR, "slido.png"));
const donationQR = imgB64(path.join(QR_DIR, "donation.png"));

async function partnerLogoNormalize(filePath, targetW = 260, targetH = 100) {
  if (!fs.existsSync(filePath)) return null;
  const resized = await sharp(filePath)
    .resize({ width: targetW - 16, height: targetH - 16, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const buf = await sharp({
    create: { width: targetW, height: targetH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  }).composite([{ input: resized, gravity: "centre" }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

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
  { name: "율립",            path: "yullip.png" },
];
for (const p of partners) {
  p.img = await partnerLogoNormalize(path.join(PARTNERS_DIR, p.path));
}

// 프로그램 타임테이블
const program = [
  { time: "10:50–11:00", title: "등록 · 체크인 · 입장" },
  { time: "11:00–12:30", title: "SESSION 1 키노트 (90분)",
    sub: "「양육불안은 어디에서 오는가」",
    people: "장동선(뇌과학자) · 이다랑(아동심리전문가·더나일 이사장) / 사회 김혜민" },
  { time: "12:30–13:00", title: "밍글링 · 가벼운 식사" },
  { time: "13:00–14:30", title: "SESSION 2 패널토크 (90분)",
    sub: "「양육불안과 함께 살아간다는 것」",
    people: "모더레이터 이혜린 + 패널 신두란 · 정지우 · 후추맘" },
  { time: "14:30–15:00", title: "클로징 (후원사 소개 포함)" },
];

// 타임테이블 행 렌더 (텍스트 y 배치 담당)
const PROGRAM_START_Y = 1050;
const ROW_H_BASE = 210;
function programRow(y, item, i) {
  const hasSub = !!item.sub;
  const boxH = hasSub ? 270 : 130;
  return `
    <g transform="translate(0, ${y})">
      <rect x="150" y="0" rx="18" ry="18" width="${W - 300}" height="${boxH}"
            fill="#FFFFFF" stroke="${C.coral}" stroke-width="2.5" stroke-opacity="0.35"/>
      <text x="200" y="60" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="42" font-weight="700" fill="${C.coral}" letter-spacing="1">${item.time}</text>
      <text x="580" y="60" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="42" font-weight="800" fill="${C.ink}">${item.title}</text>
      ${hasSub ? `
        <text x="580" y="130" font-family="'Cormorant Garamond',serif"
              font-size="42" font-weight="600" font-style="italic" fill="${C.gold}">${item.sub}</text>
        <text x="580" y="200" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
              font-size="30" font-weight="500" fill="${C.g5}">${item.people}</text>
      ` : ""}
    </g>
  `;
}

// 각 행이 sub 유무에 따라 높이가 다르므로 누적 y 계산
let cursorY = PROGRAM_START_Y;
const rowsSvg = program.map((item, i) => {
  const svgFrag = programRow(cursorY, item, i);
  cursorY += (item.sub ? 300 : 160);
  return svgFrag;
}).join("");
const PROGRAM_END_Y = cursorY;

// 협찬사 5×3 배치
const partnerCols = 5;
const partnerCellW = 380;
const partnerCellH = 130;
const partnersStartY = 3020;
const partnersStartX = (W - partnerCols * partnerCellW) / 2;
const partnerSvg = partners.map((p, i) => {
  const col = i % partnerCols;
  const row = Math.floor(i / partnerCols);
  const x = partnersStartX + col * partnerCellW;
  const y = partnersStartY + row * partnerCellH;
  return `<image x="${x}" y="${y}" width="${partnerCellW}" height="${partnerCellH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
}).join("");

// QR 영역 (프로그램 아래)
const QR_Y = PROGRAM_END_Y + 40;
const QR_SIZE = 320;
const QR_GAP = 200;
const QR_TOTAL_W = QR_SIZE * 2 + QR_GAP;
const QR_START_X = (W - QR_TOTAL_W) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <!-- 상단 로고 (좌 더나일, 우 성동구) -->
  ${(() => {
    const baseY = 100;
    const rowH = Math.max(nileLogoMeta.height, seongdongLogoMeta.height);
    const nileY = baseY + (rowH - nileLogoMeta.height) / 2;
    const sdY = baseY + (rowH - seongdongLogoMeta.height) / 2;
    return `
      <image x="180" y="${nileY}" width="${nileLogoMeta.width}" height="${nileLogoMeta.height}" href="${nileLogoB64}"/>
      <image x="${W - seongdongLogoMeta.width - 180}" y="${sdY}" width="${seongdongLogoMeta.width}" height="${seongdongLogoMeta.height}" href="${seongdongLogoB64}"/>
    `;
  })()}

  <!-- 타이틀 -->
  <text x="${W/2}" y="500" text-anchor="middle"
        font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
        font-size="46" font-weight="600" fill="${C.g4}" letter-spacing="4">사단법인 더나일</text>
  <text x="${W/2}" y="610" text-anchor="middle"
        font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
        font-size="96" font-weight="900" fill="${C.coral}" letter-spacing="2">2026 양육불안 컨퍼런스</text>
  <text x="${W/2}" y="700" text-anchor="middle"
        font-family="'Cormorant Garamond',serif"
        font-size="46" font-style="italic" font-weight="500" fill="${C.gold}">Nurtuning Into the Light Everyday</text>

  <!-- 일시 · 장소 박스 -->
  <g transform="translate(${W/2}, 830)">
    <rect x="-800" y="-70" rx="30" ry="30" width="1600" height="140"
          fill="#FFFFFF" stroke="${C.mango}" stroke-width="3" stroke-opacity="0.5"/>
    <text x="0" y="-8" text-anchor="middle"
          font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
          font-size="40" font-weight="700" fill="${C.ink}">2026. 7. 9. (목) 10:50 ~ 15:00</text>
    <text x="0" y="52" text-anchor="middle"
          font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
          font-size="34" font-weight="500" fill="${C.g5}">성동구 · 헤이그라운드 성수시작점</text>
  </g>

  <!-- PROGRAM 헤더 -->
  <text x="${W/2}" y="1000" text-anchor="middle"
        font-family="'Cormorant Garamond',serif"
        font-size="60" font-weight="700" fill="${C.coral}" letter-spacing="12">PROGRAM</text>

  <!-- 타임테이블 -->
  ${rowsSvg}

  <!-- QR 2개 -->
  <g transform="translate(0, ${QR_Y})">
    <!-- 슬라이도 QR -->
    <g transform="translate(${QR_START_X}, 0)">
      <rect x="-25" y="-25" rx="20" ry="20" width="${QR_SIZE + 50}" height="${QR_SIZE + 130}"
            fill="#FFFFFF" stroke="${C.sky}" stroke-width="3" stroke-opacity="0.4"/>
      ${slidoQR ? `<image x="0" y="0" width="${QR_SIZE}" height="${QR_SIZE}" href="${slidoQR}"/>`
                : `<rect x="0" y="0" width="${QR_SIZE}" height="${QR_SIZE}" fill="#EEE"/>
                   <text x="${QR_SIZE/2}" y="${QR_SIZE/2}" text-anchor="middle" font-size="24" fill="#999">slido QR</text>`}
      <text x="${QR_SIZE/2}" y="${QR_SIZE + 55}" text-anchor="middle"
            font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="34" font-weight="800" fill="${C.sky}">실시간 질문 · 슬라이도</text>
      <text x="${QR_SIZE/2}" y="${QR_SIZE + 100}" text-anchor="middle"
            font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="24" font-weight="500" fill="${C.g5}">Slido로 질문을 실시간으로 남겨주세요</text>
    </g>
    <!-- 후원하기 QR -->
    <g transform="translate(${QR_START_X + QR_SIZE + QR_GAP}, 0)">
      <rect x="-25" y="-25" rx="20" ry="20" width="${QR_SIZE + 50}" height="${QR_SIZE + 130}"
            fill="#FFFFFF" stroke="${C.coral}" stroke-width="3" stroke-opacity="0.4"/>
      ${donationQR ? `<image x="0" y="0" width="${QR_SIZE}" height="${QR_SIZE}" href="${donationQR}"/>`
                   : `<rect x="0" y="0" width="${QR_SIZE}" height="${QR_SIZE}" fill="#EEE"/>
                      <text x="${QR_SIZE/2}" y="${QR_SIZE/2}" text-anchor="middle" font-size="24" fill="#999">donation QR</text>`}
      <text x="${QR_SIZE/2}" y="${QR_SIZE + 55}" text-anchor="middle"
            font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="34" font-weight="800" fill="${C.coral}">더나일 후원하기</text>
      <text x="${QR_SIZE/2}" y="${QR_SIZE + 100}" text-anchor="middle"
            font-family="'Pretendard','Apple SD Gothic Neo',sans-serif"
            font-size="24" font-weight="500" fill="${C.g5}">양육의 오늘에 힘이 되어 주세요</text>
    </g>
  </g>

  <!-- 협찬사 헤더 -->
  <text x="${W/2}" y="${partnersStartY - 30}" text-anchor="middle"
        font-family="'Cormorant Garamond',serif"
        font-size="34" font-weight="600" fill="${C.gold}" letter-spacing="8">PARTNERS · 함께하는 분들</text>

  <!-- 협찬사 로고 그리드 -->
  ${partnerSvg}

  <!-- 하단 -->
  <text x="${W/2}" y="${H - 60}" text-anchor="middle"
        font-family="'Cormorant Garamond',serif"
        font-size="26" font-style="italic" fill="${C.g5}" letter-spacing="3">The NILE · thenile.kr</text>
</svg>`;

console.log(`캔버스: ${W}×${H} (${WIDTH_CM}×${HEIGHT_CM}cm @ ${DPI}dpi)`);
console.log(`슬라이도 QR: ${slidoQR ? "✓" : "✗ (placeholder)"}`);
console.log(`후원 QR: ${donationQR ? "✓" : "✗ (placeholder)"}`);
console.log(`율립 로고: ${fs.existsSync(path.join(PARTNERS_DIR, "yullip.png")) ? "✓" : "✗ (파일 없음)"}`);
console.log(`프로그램 5개 · 협찬사 ${partners.length}개`);

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const stat = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(stat.size/1024/1024).toFixed(2)} MB`);
