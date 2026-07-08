// 2026 양육불안 컨퍼런스 리플렛 (A4 세로 · 양면 · 21.0×29.7cm)
// 앞면: 컨퍼런스 상세 정보 · 타임테이블 · 슬라이도 QR
// 뒷면: 사단법인 더나일 소개 · 미션·비전 · 후원 QR
// 실행: node scripts/generate-conference-leaflet.mjs
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const W = 1080, H = 1528;  // A4 세로 비율
const OUT_FRONT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛-앞.png");
const OUT_BACK = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛-뒤.png");
const OUT_COMBINED_PNG = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛.png");
const OUT_PDF = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-리플렛-양면.pdf");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26", g4:"#5C4A3E", g5:"#7A6355", g6:"#928172",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
  sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF", navy:"#1B2A4A", gold:"#B8860B",
};

const FONT = "'Pretendard','Apple SD Gothic Neo',sans-serif";

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

const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");

// 상단 헤더용 로고 (작음)
const nileLogoBufS = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ height: 40 }).png().toBuffer();
const nileLogoB64S = "data:image/png;base64," + nileLogoBufS.toString("base64");
const nileLogoMetaS = await sharp(nileLogoBufS).metadata();

// 뒷면용 로고 (큼)
const nileLogoBufL = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ height: 100 }).png().toBuffer();
const nileLogoB64L = "data:image/png;base64," + nileLogoBufL.toString("base64");
const nileLogoMetaL = await sharp(nileLogoBufL).metadata();

// 성동구
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

// ─── 캐릭터 이모지 (사이트 EmoShape 그대로) ───
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
  const { rotate = 0, opacity = 1, eyes = true } = opts;
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

const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 2.5) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `cph${++_idc}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

// ═══════════════════════════════════════════════
// FRONT PAGE (앞면)
// ═══════════════════════════════════════════════
const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <!-- 캐릭터 이모지: 상단 -->
  ${emo(160, 130, 55, "star", C.mango, C.peach, { rotate: -8, opacity: 0.7, eyes: false })}
  ${emo(930, 130, 70, "cloud", C.sky, C.mint, { rotate: 6, opacity: 0.5, eyes: false })}

  <!-- 캐릭터 이모지: 슬로건 주변 -->
  ${emo(80, 285, 45, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.65, eyes: false })}
  ${emo(1000, 250, 50, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.5, eyes: false })}
  ${emo(140, 400, 40, "drop", C.lilac, C.sky, { rotate: -10, opacity: 0.5, eyes: false })}
  ${emo(960, 420, 42, "leaf", C.sage, C.mint, { rotate: 15, opacity: 0.5, eyes: false })}

  <!-- 캐릭터 이모지: 타임테이블 여백 -->
  ${emo(45, 700, 40, "flower", C.mint, C.sky, { rotate: -18, opacity: 0.35, eyes: false })}
  ${emo(1035, 780, 42, "blob", C.peach, C.rose, { rotate: 20, opacity: 0.35, eyes: false })}
  ${emo(50, 950, 38, "pebble", C.sage, C.mint, { rotate: 10, opacity: 0.35, eyes: false })}
  ${emo(1030, 1030, 44, "flower", C.lilac, C.rose, { rotate: -12, opacity: 0.35, eyes: false })}

  <!-- 캐릭터 이모지: 하단 -->
  ${emo(150, 1400, 60, "arch", C.mango, C.peach, { rotate: 0, opacity: 0.4, eyes: false })}
  ${emo(940, 1420, 55, "cloud", C.lilac, C.sky, { rotate: -8, opacity: 0.4, eyes: false })}

  <!-- 상단 로고: 좌 더나일 · 우 성동구 -->
  ${(() => {
    const baseY = 45;
    const rowH = Math.max(nileLogoMetaS.height, seongdongLogoMeta.height);
    const nileY = baseY + (rowH - nileLogoMetaS.height) / 2;
    const sdY = baseY + (rowH - seongdongLogoMeta.height) / 2;
    return `
      <image x="70" y="${nileY}" width="${nileLogoMetaS.width}" height="${nileLogoMetaS.height}" href="${nileLogoB64S}"/>
      <image x="${W - seongdongLogoMeta.width - 70}" y="${sdY}" width="${seongdongLogoMeta.width}" height="${seongdongLogoMeta.height}" href="${seongdongLogoB64}"/>
    `;
  })()}

  <line x1="70" y1="180" x2="${W - 70}" y2="180" stroke="${C.inkBrown}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- 타이틀 칩 -->
  <text x="${W / 2}" y="230" font-family="Pretendard" font-size="20" font-weight="700"
        fill="${C.coral}" text-anchor="middle" letter-spacing="4">2026 양육불안 컨퍼런스</text>

  <!-- 슬로건 -->
  <text x="${W / 2}" y="308" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="58" font-weight="800"
        fill="${C.ink}" text-anchor="middle" letter-spacing="-2">불안을 불안해하지 마세요</text>

  <text x="${W / 2}" y="345" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="20"        fill="${C.gold}" text-anchor="middle" letter-spacing="2">Nurtuning Into the Light Everyday</text>

  <!-- 일시·장소 -->
  <g transform="translate(${W / 2}, 405)">
    <rect x="-440" y="-32" rx="26" ry="26" width="880" height="64" fill="${C.ink}"/>
    <text y="-4" font-family="Pretendard" font-size="20" font-weight="800" fill="${C.cream}" text-anchor="middle">2026. 7. 9. (목) 10:50 – 15:00</text>
    <text y="20" font-family="Pretendard" font-size="14" font-weight="600" fill="${C.peach}" text-anchor="middle">헤이그라운드 성수시작점 · 선착순 100~120명 · 무료</text>
  </g>

  <!-- PROGRAM 헤더 -->
  <text x="${W / 2}" y="472" font-family="Pretendard" font-size="14" font-weight="800"
        fill="${C.coral}" text-anchor="middle" letter-spacing="5" opacity="0.8">PROGRAM · 상세 시간표</text>

  <!-- 타임테이블 -->
  ${(() => {
    const TIME_X = 90;
    const TIME_W = 170;
    const CONTENT_X = 300;
    const SPEAKER_R = 30;

    const schedule = [
      { time: "10:50 – 11:00", title: "등록 · 체크인 · 입장", kind: "plain" },
      {
        time: "11:00 – 12:30",
        badge: "SESSION 1 · 키노트 (90분)",
        title: "「양육불안은 어디에서 오는가」",
        descLines: [
          "뇌과학과 발달심리학, 두 시선이 한 자리에서 만나",
          "양육불안의 뿌리를 짚어드립니다.",
        ],
        accent: C.coral,
        speakers: [
          { name: "장동선", img: photo.장동선 },
          { name: "이다랑", img: photo.이다랑 },
          { name: "김혜민", img: photo.김혜민 },
        ],
        kind: "session",
      },
      { time: "12:30 – 13:00", title: "밍글링 · 가벼운 식사 · 네트워킹", kind: "plain" },
      {
        time: "13:00 – 14:30",
        badge: "SESSION 2 · 패널토크 (90분)",
        title: "「양육불안과 함께 살아간다는 것」",
        descLines: [
          "다른 자리에서 양육과 만나온 네 분이",
          "자신의 양육불안을 어떻게 통과해왔는지 나누는 대화.",
        ],
        accent: C.lilac,
        speakers: [
          { name: "이혜린", img: photo.이혜린 },
          { name: "신두란", img: photo.신두란 },
          { name: "정지우", img: photo.정지우 },
          { name: "후추맘", img: photo.후추맘 },
        ],
        kind: "session",
      },
      { time: "14:30 – 15:00", title: "클로징 · 후원사 소개 · 마무리", kind: "plain" },
    ];

    let cy = 500;
    return schedule.map((row, idx) => {
      const isSession = row.kind === "session";
      const rowH = isSession ? 220 : 55;
      const top = cy;

      const timeBadge = `
        <rect x="${TIME_X}" y="${top + (isSession ? 8 : 8)}" rx="10" ry="10" width="${TIME_W}" height="40"
              fill="${isSession ? row.accent : C.ink}"/>
        <text x="${TIME_X + TIME_W / 2}" y="${top + 34}"
              font-family="Pretendard" font-size="18" font-weight="800" fill="${C.white}" text-anchor="middle">${row.time}</text>
      `;

      let content;
      if (isSession) {
        // 세션 헤더 + 부제 + 설명 2줄 + 연사 얼굴만 (역할·훅 제거로 간결화)
        const speakerCount = row.speakers.length;
        const speakerAreaW = 720;                             // CONTENT_X ~ CONTENT_X+720
        const speakerGap = speakerAreaW / speakerCount;
        const speakerX0 = CONTENT_X + speakerGap / 2;
        const speakerFaces = row.speakers.map((s, i) => {
          const sx = speakerX0 + i * speakerGap;
          const sy = top + 155;
          return `
            <g>
              ${circlePhoto(sx, sy, SPEAKER_R, s.img, row.accent, 2)}
              <text x="${sx}" y="${sy + SPEAKER_R + 22}" font-family="${FONT}" font-size="14" font-weight="700" fill="${C.ink}" text-anchor="middle">${s.name}</text>
            </g>
          `;
        }).join("");

        content = `
          <text x="${CONTENT_X}" y="${top + 30}" font-family="${FONT}" font-size="16" font-weight="800" fill="${row.accent}" letter-spacing="1">${row.badge}</text>
          <text x="${CONTENT_X}" y="${top + 62}" font-family="${FONT}" font-size="22" font-weight="800" fill="${C.ink}">${row.title}</text>
          <text x="${CONTENT_X}" y="${top + 90}" font-family="${FONT}" font-size="13" font-weight="500" fill="${C.g5}">${row.descLines[0]}</text>
          <text x="${CONTENT_X}" y="${top + 110}" font-family="${FONT}" font-size="13" font-weight="500" fill="${C.g5}">${row.descLines[1]}</text>
          ${speakerFaces}
        `;
      } else {
        content = `
          <text x="${CONTENT_X}" y="${top + 34}" font-family="${FONT}" font-size="19" font-weight="600" fill="${C.inkBrown}">${row.title}</text>
        `;
      }

      const divider = idx < schedule.length - 1 ?
        `<line x1="${TIME_X}" y1="${top + rowH}" x2="${W - TIME_X}" y2="${top + rowH}"
               stroke="${C.inkBrown}" stroke-opacity="0.12" stroke-width="1"/>` : "";

      cy += rowH;
      return timeBadge + content + divider;
    }).join("\n");
  })()}

  <!-- 슬라이도 QR + 뒷면 안내 (컴팩트) -->
  <g transform="translate(0, 1215)">
    <!-- Slido QR 카드 (좌) -->
    <g transform="translate(70, 0)">
      <rect x="0" y="0" rx="16" ry="16" width="440" height="105" fill="${C.white}" stroke="${C.sky}" stroke-width="2" stroke-opacity="0.55"/>
      ${slidoQR
        ? `<image x="12" y="12" width="80" height="80" href="${slidoQR}"/>`
        : `<rect x="12" y="12" width="80" height="80" fill="#EEE"/>`}
      <text x="106" y="38" font-family="${FONT}" font-size="16" font-weight="800" fill="${C.sky}">실시간 질문 · SLIDO</text>
      <text x="106" y="62" font-family="${FONT}" font-size="12" font-weight="600" fill="${C.inkBrown}" opacity="0.75">궁금한 점을 남겨주세요</text>
      <text x="106" y="84" font-family="${FONT}" font-size="11" font-weight="600" fill="${C.inkBrown}" opacity="0.55">QR 스캔하여 실시간 참여</text>
    </g>

    <!-- 뒷면 안내 카드 (우) -->
    <g transform="translate(${W - 510}, 0)">
      <rect x="0" y="0" rx="16" ry="16" width="440" height="105" fill="${C.ink}"/>
      <text x="24" y="32" font-family="${FONT}" font-size="12" font-weight="800" fill="${C.mango}" letter-spacing="3">THE NILE</text>
      <text x="24" y="60" font-family="${FONT}" font-size="18" font-weight="800" fill="${C.cream}" letter-spacing="-0.5">사단법인 더나일 이야기</text>
      <text x="24" y="80" font-family="${FONT}" font-size="12" font-weight="500" fill="${C.peach}">부모됨의 여정을 함께 걷는 사람들</text>
      <text x="24" y="97" font-family="${FONT}" font-size="10" font-weight="700" fill="${C.mango}">→ 뒷면에서 계속됩니다</text>
    </g>
  </g>

  <!-- 후원 / 협찬 (흰 배경 박스) -->
  <g transform="translate(0, 1340)">
    <rect x="70" y="0" rx="16" ry="16" width="${W - 140}" height="150"
          fill="${C.white}" stroke="${C.inkBrown}" stroke-opacity="0.12" stroke-width="1"/>
    <text x="${W / 2}" y="24" font-family="${FONT}" font-size="11" font-weight="800"
          fill="${C.inkBrown}" text-anchor="middle" opacity="0.55" letter-spacing="3">PARTNERS · 후원 / 협찬</text>

    ${(() => {
      const cols = 5;
      const cellW = 180;
      const cellH = 38;
      const gridW = cols * cellW;
      const gridX = (W - gridW) / 2;
      const gridTopY = 42;
      const logoW = 100, logoH = 28;
      return partners.map((p, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = gridX + col * cellW + cellW / 2;
        const cy = gridTopY + row * cellH + cellH / 2;
        if (!p.img) {
          return `<text x="${cx}" y="${cy + 4}" font-family="${FONT}" font-size="11" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
        }
        return `<image x="${cx - logoW/2}" y="${cy - logoH/2}" width="${logoW}" height="${logoH}"
                       href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
      }).join("");
    })()}
  </g>

  <!-- 최하단 브랜드 라인 -->
  <text x="${W / 2}" y="${H - 18}" font-family="${FONT}" font-size="12"
        fill="${C.g5}" text-anchor="middle" letter-spacing="3">The NILE · thenile.kr</text>
</svg>`;

// ═══════════════════════════════════════════════
// BACK PAGE (뒷면 · 더나일 소개)
// ═══════════════════════════════════════════════
const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <!-- 캐릭터 이모지: 풍성하게 -->
  ${emo(120, 100, 55, "blob", C.coral, C.mango, { rotate: -12, opacity: 0.55, eyes: false })}
  ${emo(960, 90, 65, "heart", C.rose, C.lilac, { rotate: 8, opacity: 0.55, eyes: false })}
  ${emo(60, 320, 45, "cloud", C.sky, C.mint, { rotate: -5, opacity: 0.5, eyes: false })}
  ${emo(1010, 350, 50, "star", C.mango, C.peach, { rotate: 15, opacity: 0.5, eyes: false })}
  ${emo(70, 620, 42, "drop", C.lilac, C.rose, { rotate: -10, opacity: 0.4, eyes: false })}
  ${emo(1010, 640, 45, "flower", C.mint, C.sky, { rotate: 20, opacity: 0.4, eyes: false })}
  ${emo(50, 900, 40, "leaf", C.sage, C.mint, { rotate: -18, opacity: 0.4, eyes: false })}
  ${emo(1015, 920, 42, "burst", C.coral, C.mango, { rotate: 12, opacity: 0.4, eyes: false })}
  ${emo(150, 1180, 48, "pebble", C.lilac, C.rose, { rotate: 6, opacity: 0.35, eyes: false })}
  ${emo(930, 1220, 45, "arch", C.mango, C.peach, { rotate: -8, opacity: 0.35, eyes: false })}

  <!-- 상단 The NILE 큰 로고 -->
  <g transform="translate(${W / 2 - nileLogoMetaL.width / 2}, 90)">
    <image width="${nileLogoMetaL.width}" height="${nileLogoMetaL.height}" href="${nileLogoB64L}"/>
  </g>

  <text x="${W / 2}" y="235" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="24"        fill="${C.gold}" text-anchor="middle" letter-spacing="4">Nurtuning Into the Light Everyday</text>
  <text x="${W / 2}" y="270" font-family="Pretendard" font-size="15" font-weight="600"
        fill="${C.g5}" text-anchor="middle" letter-spacing="2">사단법인 더나일 · 지정기부금 단체</text>

  <line x1="200" y1="298" x2="${W - 200}" y2="298" stroke="${C.gold}" stroke-opacity="0.35" stroke-width="1"/>

  <!-- MISSION -->
  <text x="${W / 2}" y="345" font-family="Pretendard" font-size="14" font-weight="800"
        fill="${C.coral}" text-anchor="middle" letter-spacing="6">MISSION</text>
  <text x="${W / 2}" y="405" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="34" font-weight="800"
        fill="${C.navy}" text-anchor="middle" letter-spacing="-1">부모됨의 두려움이 기쁨으로 전환되는</text>
  <text x="${W / 2}" y="450" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="34" font-weight="800"
        fill="${C.navy}" text-anchor="middle" letter-spacing="-1">여정을 함께 합니다</text>
  <text x="${W / 2}" y="490" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="20"        fill="${C.g4}" text-anchor="middle" letter-spacing="1">Parenthood : From dread to delight</text>

  <!-- VISION 3개 -->
  <text x="${W / 2}" y="555" font-family="Pretendard" font-size="14" font-weight="800"
        fill="${C.coral}" text-anchor="middle" letter-spacing="6">VISION</text>

  ${(() => {
    const visions = [
      { n: "01", t: "부모의 일상이 매일의 성장이 됩니다",
        d1: "양육이 의무가 아닌 성장의 과정이라 믿습니다.",
        d2: "부모가 자신의 가능성을 발견하고 성장의 기쁨을 경험하도록 돕습니다.",
        c: C.coral },
      { n: "02", t: "양육에 대한 냉소를 다정함으로 바꿉니다",
        d1: "가족을 향한 냉소를 신뢰와 환대의 문화로 전환하고,",
        d2: "부모가 서로 연결되고 지지받는 따뜻한 커뮤니티를 만듭니다.",
        c: C.mango },
      { n: "03", t: "양육의 즐거움을 사회와 공유합니다",
        d1: "건강하게 성장한 부모들이 모여 사회의 문화를 바꿉니다.",
        d2: "다음 세대가 더 나은 세상에서 자라도록 환경을 만들어갑니다.",
        c: C.lilac },
    ];

    return visions.map((v, i) => {
      const y = 585 + i * 130;
      return `
        <g>
          <rect x="70" y="${y}" rx="18" ry="18" width="${W - 140}" height="115"
                fill="${C.white}" stroke="${v.c}" stroke-width="1.5" stroke-opacity="0.4"/>
          <g transform="translate(120, ${y + 57})">
            <circle cx="0" cy="0" r="34" fill="${v.c}22"/>
            <text x="0" y="10" font-family="${FONT}" font-size="26" font-weight="800"
                  fill="${v.c}" text-anchor="middle">${v.n}</text>
          </g>
          <text x="180" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="800" fill="${C.navy}">${v.t}</text>
          <text x="180" y="${y + 74}" font-family="${FONT}" font-size="13" font-weight="500" fill="${C.g5}">${v.d1}</text>
          <text x="180" y="${y + 96}" font-family="${FONT}" font-size="13" font-weight="500" fill="${C.g5}">${v.d2}</text>
        </g>
      `;
    }).join("");
  })()}

  <!-- 4개 접근 축 -->
  <text x="${W / 2}" y="1010" font-family="Pretendard" font-size="14" font-weight="800"
        fill="${C.coral}" text-anchor="middle" letter-spacing="6">우리의 접근</text>

  ${(() => {
    const axes = [
      { n: "01", t: "마음돌봄", d: "부모·아동의 심리적 건강측정과 전문 개입", c: C.coral, sh: "heart" },
      { n: "02", t: "관계의 연결", d: "양육 친화적 문화와 심리적 공감대 조성", c: C.mango, sh: "flower" },
      { n: "03", t: "양육문화 개선", d: "정서적 유대감·사회적 지지망 강화", c: C.mint, sh: "leaf" },
      { n: "04", t: "환경 · 구조", d: "제도적 변화를 이끄는 정책 옹호 활동", c: C.lilac, sh: "arch" },
    ];
    // 한 줄 레이아웃: [01] [마음돌봄] [설명 텍스트] [이모지]
    const gap = 14;
    const boxW = (W - 140 - gap) / 2;
    return axes.map((a, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 70 + col * (boxW + gap);
      const y = 1030 + row * 74;
      const cy = y + 30;
      return `
        <g>
          <rect x="${x}" y="${y}" rx="14" ry="14" width="${boxW}" height="60"
                fill="${C.white}" stroke="${a.c}" stroke-width="1" stroke-opacity="0.35"/>
          <text x="${x + 22}" y="${cy + 6}" font-family="${FONT}" font-size="17" font-weight="800"
                fill="${a.c}" letter-spacing="0.5">${a.n}</text>
          <text x="${x + 62}" y="${cy + 6}" font-family="${FONT}" font-size="17" font-weight="800" fill="${C.navy}">${a.t}</text>
          <text x="${x + 165}" y="${cy + 5}" font-family="${FONT}" font-size="12" font-weight="500" fill="${C.g5}">${a.d}</text>
          <g transform="translate(${x + boxW - 30}, ${cy})">
            ${emo(0, 0, 34, a.sh, a.c, C.cream, { rotate: 12, opacity: 0.55, eyes: false })}
          </g>
        </g>
      `;
    }).join("");
  })()}

  <!-- 페이서 후원 CTA — QR 축소 · 텍스트 확대로 균형 재조정 -->
  <g transform="translate(0, 1220)">
    <rect x="70" y="0" rx="20" ry="20" width="${W - 140}" height="270" fill="${C.navy}"/>

    ${(() => {
      const QR_SIZE = 140;
      const QR_X = W - 100 - QR_SIZE;
      const QR_Y = 55;
      return `
        <!-- 오른쪽: 후원 QR + 하단 라벨 확대 -->
        ${donationQR
          ? `<image x="${QR_X}" y="${QR_Y}" width="${QR_SIZE}" height="${QR_SIZE}" href="${donationQR}"/>`
          : `<rect x="${QR_X}" y="${QR_Y}" width="${QR_SIZE}" height="${QR_SIZE}" fill="#EEE"/>`}
        <text x="${QR_X + QR_SIZE / 2}" y="${QR_Y + QR_SIZE + 32}" font-family="${FONT}" font-size="20" font-weight="800" fill="${C.mango}" text-anchor="middle" letter-spacing="1">더나일 후원하기</text>
      `;
    })()}

    <!-- 왼쪽: 문구 확대 -->
    <text x="110" y="62" font-family="${FONT}" font-size="15" font-weight="700"
          fill="${C.mango}" letter-spacing="4">PACER · 페이서 되기</text>
    <text x="110" y="120" font-family="${FONT}" font-size="36" font-weight="800"
          fill="${C.cream}" letter-spacing="-1">부모됨의 여정을</text>
    <text x="110" y="168" font-family="${FONT}" font-size="36" font-weight="800"
          fill="${C.cream}" letter-spacing="-1">함께 걸어주세요</text>
    <text x="110" y="210" font-family="${FONT}" font-size="14" font-weight="500"
          fill="rgba(255,248,236,0.78)">페이서 = 함께 걷는 사람들.</text>
    <text x="110" y="232" font-family="${FONT}" font-size="14" font-weight="500"
          fill="rgba(255,248,236,0.78)">더 나은 사회를 위해 힘을 모으는 후원자입니다.</text>
    <text x="110" y="257" font-family="${FONT}" font-size="12" font-weight="700"
          fill="${C.mango}">→ 지정기부금 영수증 발급 가능</text>
  </g>

  <!-- 최하단 브랜드 -->
  <text x="${W / 2}" y="${H - 25}" font-family="'Pretendard','Apple SD Gothic Neo',sans-serif" font-size="14"        fill="${C.g5}" text-anchor="middle" letter-spacing="3">The NILE · thenile.kr · Nurtuning Into the Light Everyday</text>
</svg>`;

// ─── 두 페이지 PNG 생성 (A4 300dpi = 2480×3508) ───
// SVG viewBox: 1080×1528 → density 300으로 4500×6367 raster → 2480×3508로 resize (lanczos)
const A4_PX_W = 2480, A4_PX_H = 3508;   // A4 300dpi
async function renderPage(svgStr, outPath) {
  await sharp(Buffer.from(svgStr), { density: 300 })
    .resize({ width: A4_PX_W, height: A4_PX_H, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}
await renderPage(frontSvg, OUT_FRONT);
await renderPage(backSvg, OUT_BACK);
const frontStat = fs.statSync(OUT_FRONT);
const backStat = fs.statSync(OUT_BACK);

// 앞면 (하위 호환 · 미리보기용 저장)
fs.copyFileSync(OUT_FRONT, OUT_COMBINED_PNG);

// ─── 2페이지 양면 PDF ───
const CM_PER_INCH = 2.54;
const PT_PER_INCH = 72;
const WIDTH_CM = 21.0, HEIGHT_CM = 29.7;
const pdfDoc = await PDFDocument.create();
pdfDoc.setTitle("2026 양육불안 컨퍼런스 · 리플렛 (양면)");
pdfDoc.setAuthor("사단법인 더나일");
pdfDoc.setSubject(`${WIDTH_CM}×${HEIGHT_CM}cm A4 양면 리플렛`);
const widthPt = (WIDTH_CM / CM_PER_INCH) * PT_PER_INCH;
const heightPt = (HEIGHT_CM / CM_PER_INCH) * PT_PER_INCH;

for (const pngPath of [OUT_FRONT, OUT_BACK]) {
  const pngBytes = fs.readFileSync(pngPath);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([widthPt, heightPt]);
  page.drawImage(pngImage, { x: 0, y: 0, width: widthPt, height: heightPt });
}
const pdfBytes = await pdfDoc.save();
fs.writeFileSync(OUT_PDF, pdfBytes);

console.log(`슬라이도 QR: ${slidoQR ? "✓" : "✗"}`);
console.log(`후원 QR: ${donationQR ? "✓" : "✗"}`);
console.log(`캔버스: ${W}×${H} @ ${WIDTH_CM}×${HEIGHT_CM}cm`);
console.log(`✓ 앞면 PNG: ${OUT_FRONT} (${(frontStat.size / 1024).toFixed(1)} KB)`);
console.log(`✓ 뒷면 PNG: ${OUT_BACK} (${(backStat.size / 1024).toFixed(1)} KB)`);
console.log(`✓ 양면 PDF: ${OUT_PDF} (${(fs.statSync(OUT_PDF).size / 1024).toFixed(1)} KB)`);
