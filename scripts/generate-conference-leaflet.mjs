// 2026 양육불안 컨퍼런스 리플렛 (A4 세로, 21.0×29.7cm)
// 정보 중심 · 타임테이블 강조 · 연사 작게 · 파트너 흰 박스
// 실행: node scripts/generate-conference-leaflet.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const W = 1080, H = 1528;  // A4 세로 비율
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛.png");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26", g4:"#5C4A3E", g5:"#7A6355",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
  sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF", ivory:"#FBF3E4", navy:"#1B2A4A", gold:"#B8860B",
};

const SPEAKERS_DIR = path.join(ROOT, "public/images/speakers");
const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const QR_DIR = path.join(ROOT, "public/images/qr");
const KIM = path.join(ROOT, "public/images/김혜민.png");
const NILE_LOGO_SVG_PATH = path.join(ROOT, "public/images/thenile-logo.svg");

async function compositeOnDarkBg(srcPath) {
  const meta = await sharp(srcPath).metadata();
  const buf = await sharp({
    create: { width: meta.width || 800, height: meta.height || 800, channels: 4, background: { r: 92, g: 82, b: 78, alpha: 1 } },
  }).composite([{ input: srcPath }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

function imgB64(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : ext;
  return `data:image/${mime};base64,` + fs.readFileSync(filePath).toString("base64");
}

const photo = {
  장동선: await compositeOnDarkBg(path.join(SPEAKERS_DIR, "장동선.png")),
  이다랑: imgB64(path.join(SPEAKERS_DIR, "이다랑.png")),
  김혜민: imgB64(KIM),
  이혜린: imgB64(path.join(SPEAKERS_DIR, "이혜린.png")),
  신두란: imgB64(path.join(SPEAKERS_DIR, "신두란.png")),
  정지우: imgB64(path.join(SPEAKERS_DIR, "정지우.png")),
  후추맘: imgB64(path.join(SPEAKERS_DIR, "후추맘.png")),
};

const slidoQR = imgB64(path.join(QR_DIR, "slido.png"));
const donationQR = imgB64(path.join(QR_DIR, "donation.png"));

// 상단 로고 (엑스배너 스타일: 더나일 좌 · 성동구 우)
const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");
const nileLogoBuf = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ height: 40 }).png().toBuffer();
const nileLogoB64 = "data:image/png;base64," + nileLogoBuf.toString("base64");
const nileLogoMeta = await sharp(nileLogoBuf).metadata();

const seongdongLogoBuf = await sharp(path.join(PARTNERS_DIR, "seongdong.png"))
  .resize({ height: 80 }).png().toBuffer();
const seongdongLogoB64 = "data:image/png;base64," + seongdongLogoBuf.toString("base64");
const seongdongLogoMeta = await sharp(seongdongLogoBuf).metadata();

async function partnerLogoNormalize(filePath, targetW = 200, targetH = 60) {
  if (!fs.existsSync(filePath)) return null;
  const resized = await sharp(filePath)
    .resize({ width: targetW - 20, height: targetH - 10, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
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

let _idc = 0;
const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 2.5) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `cph${++_idc}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

// ─── 타임테이블 데이터 ───
const schedule = [
  { time: "10:50–11:00", title: "등록 · 체크인", type: "plain" },
  {
    time: "11:00–12:30",
    title: "SESSION 1 · 키노트 (90분)",
    subtitle: "「양육불안은 어디에서 오는가」",
    accent: C.coral,
    speakers: [
      { name: "장동선", role: "뇌과학자", img: photo.장동선 },
      { name: "이다랑", role: "아동심리전문가", img: photo.이다랑 },
      { name: "김혜민", role: "PD · 사회", img: photo.김혜민 },
    ],
  },
  { time: "12:30–13:00", title: "밍글링 · 가벼운 식사", type: "plain" },
  {
    time: "13:00–14:30",
    title: "SESSION 2 · 패널토크 (90분)",
    subtitle: "「양육불안과 함께 살아간다는 것」",
    accent: C.lilac,
    speakers: [
      { name: "이혜린", role: "모더레이터", img: photo.이혜린 },
      { name: "신두란", role: "패널", img: photo.신두란 },
      { name: "정지우", role: "패널",     img: photo.정지우 },
      { name: "후추맘", role: "패널",     img: photo.후추맘 },
    ],
  },
  { time: "14:30–15:00", title: "클로징 · 후원사 소개", type: "plain" },
];

// 타임테이블 렌더링
const TIME_COL_X = 90;
const TIME_COL_W = 170;
const CONTENT_X = 300;
const CONTENT_W = 700;
const ROW_START_Y = 480;
const SPEAKER_R = 32;

let cursorY = ROW_START_Y;
const scheduleRows = schedule.map((row, idx) => {
  const isSession = row.type !== "plain";
  const rowH = isSession ? 155 : 65;
  const rowTop = cursorY;
  const rowMid = rowTop + rowH / 2;

  // 시간 라벨
  const timeBadge = `
    <rect x="${TIME_COL_X}" y="${rowTop + 10}" rx="10" ry="10" width="${TIME_COL_W}" height="42"
          fill="${isSession ? row.accent : C.ink}"/>
    <text x="${TIME_COL_X + TIME_COL_W / 2}" y="${rowTop + 38}"
          font-family="Pretendard" font-size="19" font-weight="800" fill="${C.white}" text-anchor="middle" letter-spacing="0.5">${row.time}</text>
  `;

  // 컨텐츠
  let content;
  if (isSession) {
    // 세션: 제목 · 부제 · 연사 얼굴들
    const speakerX0 = CONTENT_X + 5;
    const speakerGap = 90;
    const speakerFaces = row.speakers.map((s, i) => {
      const sx = speakerX0 + i * speakerGap + SPEAKER_R;
      const sy = rowTop + 108;
      return `
        <g>
          ${circlePhoto(sx, sy, SPEAKER_R, s.img, row.accent, 2.5)}
          <text x="${sx}" y="${sy + SPEAKER_R + 20}" font-family="Pretendard" font-size="15" font-weight="800" fill="${C.ink}" text-anchor="middle">${s.name}</text>
        </g>
      `;
    }).join("");

    content = `
      <text x="${CONTENT_X}" y="${rowTop + 34}" font-family="Pretendard" font-size="24" font-weight="900" fill="${C.ink}">${row.title}</text>
      <text x="${CONTENT_X}" y="${rowTop + 62}" font-family="Pretendard" font-size="18" font-weight="700" fill="${row.accent}">${row.subtitle}</text>
      ${speakerFaces}
    `;
  } else {
    // 일반 스케줄
    content = `
      <text x="${CONTENT_X}" y="${rowTop + 40}" font-family="Pretendard" font-size="22" font-weight="700" fill="${C.inkBrown}">${row.title}</text>
    `;
  }

  // 행 사이 구분선 (마지막 제외)
  const divider = idx < schedule.length - 1 ?
    `<line x1="${TIME_COL_X}" y1="${rowTop + rowH}" x2="${W - TIME_COL_X}" y2="${rowTop + rowH}"
           stroke="${C.inkBrown}" stroke-opacity="0.12" stroke-width="1"/>` : "";

  cursorY += rowH;
  return timeBadge + content + divider;
}).join("\n");

const SCHEDULE_END_Y = cursorY;

// QR 2개 (컴팩트)
const QR_Y = SCHEDULE_END_Y + 35;

// 파트너 (흰 박스)
const PARTNERS_Y = QR_Y + 155;
const PARTNERS_H = 200;
const partnerCols = 5;
const partnerRows = Math.ceil(partners.length / partnerCols);
const partnerCellW = 180;
const partnerCellH = 50;
const partnerGridW = partnerCols * partnerCellW;
const partnerGridX = (W - partnerGridW) / 2;
const partnerGridTopY = PARTNERS_Y + 40;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <!-- 상단 로고 (엑스배너 스타일: 좌 더나일 · 우 성동구) -->
  ${(() => {
    const baseY = 45;
    const rowH = Math.max(nileLogoMeta.height, seongdongLogoMeta.height);
    const nileY = baseY + (rowH - nileLogoMeta.height) / 2;
    const sdY = baseY + (rowH - seongdongLogoMeta.height) / 2;
    return `
      <image x="70" y="${nileY}" width="${nileLogoMeta.width}" height="${nileLogoMeta.height}" href="${nileLogoB64}"/>
      <image x="${W - seongdongLogoMeta.width - 70}" y="${sdY}" width="${seongdongLogoMeta.width}" height="${seongdongLogoMeta.height}" href="${seongdongLogoB64}"/>
    `;
  })()}

  <!-- 상단 헤더 - 얇은 라인 하나로 구분 -->
  <line x1="70" y1="180" x2="${W - 70}" y2="180" stroke="${C.inkBrown}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- 타이틀 (간결) -->
  <text x="${W / 2}" y="235" font-family="Pretendard" font-size="20" font-weight="700"
        fill="${C.coral}" text-anchor="middle" letter-spacing="4">2026 양육불안 컨퍼런스</text>

  <!-- 슬로건 (작게) -->
  <text x="${W / 2}" y="310" font-family="Pretendard" font-size="60" font-weight="900"
        fill="${C.ink}" text-anchor="middle" letter-spacing="-2">불안을 불안해하지 마세요</text>

  <text x="${W / 2}" y="345" font-family="Cormorant Garamond, serif" font-size="21" font-style="italic"
        fill="${C.gold}" text-anchor="middle" letter-spacing="2">Nurtuning Into the Light Everyday</text>

  <!-- 일시 · 장소 (컴팩트 박스) -->
  <g transform="translate(${W / 2}, 405)">
    <rect x="-440" y="-32" rx="26" ry="26" width="880" height="64" fill="${C.ink}"/>
    <text y="-4" font-family="Pretendard" font-size="20" font-weight="800" fill="${C.cream}" text-anchor="middle">2026. 7. 9. (목) 10:50 – 15:00</text>
    <text y="20" font-family="Pretendard" font-size="14" font-weight="600" fill="${C.peach}" text-anchor="middle">헤이그라운드 성수시작점 · 선착순 100~120명 · 무료</text>
  </g>

  <!-- PROGRAM 헤더 -->
  <text x="${W / 2}" y="465" font-family="Pretendard" font-size="14" font-weight="800"
        fill="${C.coral}" text-anchor="middle" letter-spacing="5" opacity="0.8">PROGRAM</text>

  <!-- 타임테이블 -->
  ${scheduleRows}

  <!-- QR 2개 -->
  <g transform="translate(0, ${QR_Y})">
    ${(() => {
      const qrSize = 100;
      const boxW = 430;
      const boxH = 120;
      const gap = 40;
      const totalW = boxW * 2 + gap;
      const startX = (W - totalW) / 2;

      const renderQR = (x, dataUri, title, sub, accent) => {
        const qrX = x + 12;
        const qrY = 10;
        const textX = qrX + qrSize + 20;
        return `
          <g transform="translate(${x}, 0)">
            <rect x="0" y="0" rx="14" ry="14" width="${boxW}" height="${boxH}" fill="${C.white}" stroke="${accent}" stroke-width="2" stroke-opacity="0.5"/>
            ${dataUri
              ? `<image x="${qrX - x}" y="${qrY}" width="${qrSize}" height="${qrSize}" href="${dataUri}"/>`
              : `<rect x="${qrX - x}" y="${qrY}" width="${qrSize}" height="${qrSize}" fill="#EEE"/>`
            }
            <text x="${textX - x}" y="42" font-family="Pretendard" font-size="18" font-weight="800" fill="${accent}">${title}</text>
            <text x="${textX - x}" y="68" font-family="Pretendard" font-size="13" font-weight="600" fill="${C.inkBrown}" opacity="0.8">${sub}</text>
            <text x="${textX - x}" y="93" font-family="Pretendard" font-size="12" font-weight="600" fill="${C.inkBrown}" opacity="0.55">QR 스캔하여 참여</text>
          </g>
        `;
      };
      return `
        ${renderQR(startX, slidoQR, "실시간 질문 · SLIDO", "궁금한 점을 남겨주세요", C.sky)}
        ${renderQR(startX + boxW + gap, donationQR, "더나일 후원하기", "오늘의 가족에 힘이 되어 주세요", C.coral)}
      `;
    })()}
  </g>

  <!-- 후원/협찬 (흰 배경 박스) -->
  <g>
    <rect x="70" y="${PARTNERS_Y}" rx="16" ry="16" width="${W - 140}" height="${PARTNERS_H}"
          fill="${C.white}" stroke="${C.inkBrown}" stroke-opacity="0.1" stroke-width="1"/>
    <text x="${W / 2}" y="${PARTNERS_Y + 24}" font-family="Pretendard" font-size="12" font-weight="800"
          fill="${C.inkBrown}" text-anchor="middle" opacity="0.55" letter-spacing="3">PARTNERS · 후원 / 협찬</text>

    ${(() => {
      return partners.map((p, i) => {
        const col = i % partnerCols;
        const row = Math.floor(i / partnerCols);
        const cx = partnerGridX + col * partnerCellW + partnerCellW / 2;
        const cy = partnerGridTopY + row * partnerCellH + partnerCellH / 2;
        if (!p.img) {
          return `<text x="${cx}" y="${cy + 4}" font-family="Pretendard" font-size="12" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
        }
        const logoW = 120, logoH = 36;
        return `<image x="${cx - logoW/2}" y="${cy - logoH/2}" width="${logoW}" height="${logoH}"
                       href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
      }).join("");
    })()}
  </g>

  <!-- 최하단 브랜드 라인 -->
  <text x="${W / 2}" y="${H - 20}" font-family="Cormorant Garamond, serif" font-size="14" font-style="italic"
        fill="${C.g5}" text-anchor="middle" letter-spacing="3">The NILE · thenile.kr</text>
</svg>`;

console.log(`캔버스: ${W}×${H} (A4 세로 비율)`);
console.log(`슬라이도 QR: ${slidoQR ? "✓" : "✗"}`);
console.log(`후원 QR: ${donationQR ? "✓" : "✗"}`);
console.log(`협찬사 ${partners.length}개 (${partnerCols}×${partnerRows} 그리드)`);
console.log(`타임테이블 rows: ${schedule.length}`);
console.log(`Schedule 마지막 y: ${SCHEDULE_END_Y}`);
console.log(`QR y: ${QR_Y}`);
console.log(`Partners y: ${PARTNERS_Y} ~ ${PARTNERS_Y + PARTNERS_H}`);

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const stat = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(stat.size / 1024).toFixed(1)} KB`);
