// 페이서 후원 엑스배너 (세로 60×180cm, 1200×3600px @ 200dpi)
// 실행: node scripts/generate-pacer-xbanner.mjs
import sharp from "sharp";
import QRCode from "qrcode";
import fs from "node:fs";
import path from "node:path";

const W = 1200, H = 3600;
const OUT = path.join(process.env.HOME, "Downloads/더나일-페이서-엑스배너.png");
const PACER_URL = "https://www.thenile.kr/pacer";

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0", sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  navy:"#1B2A4A", gold:"#C9A961",
};

const qrPng = await QRCode.toBuffer(PACER_URL, {
  errorCorrectionLevel: "H",
  width: 600,
  margin: 2,
  color: { dark: "#1B2A4A", light: "#FFFFFF" },
});
const qrB64 = "data:image/png;base64," + qrPng.toString("base64");

const PATHS = {
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
  flower:"M50 18c0-6 5-10 10-10s10 5 10 10c0 4-2 7-5 9 5 1 9 5 9 10s-4 9-9 10c3 2 5 5 5 9 0 6-5 10-10 10s-10-4-10-10c-2 4-6 6-10 6-6 0-10-5-10-10s4-9 10-9c-4-2-6-5-6-9 0-5 4-9 9-10-3-2-5-5-5-9 0-5 4-9 9-9 5 0 9 4 10 9z",
  leaf:"M50 8C30 24 14 40 14 60c0 16 14 28 36 28s36-12 36-28C86 40 70 24 50 8z",
};

let _id = 0;
const emo = (cx, cy, size, shape, c1, c2, opts = {}) => {
  const { rotate = 0, opacity = 1 } = opts;
  const d = PATHS[shape];
  const id = `e${++_id}`;
  const scale = size / 100;
  return `<g transform="translate(${cx-size/2},${cy-size/2})" opacity="${opacity}">
    <g transform="rotate(${rotate} ${size/2} ${size/2}) scale(${scale})">
      <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <path d="${d}" fill="url(#${id})"/>
    </g></g>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="title" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="100%" stop-color="${C.rose}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 (크게, 적게) -->
  ${emo(120, 280, 280, "heart", C.rose, C.coral, { rotate: -12, opacity: 0.88 })}
  ${emo(1080, 700, 260, "flower", C.mango, C.peach, { rotate: 15, opacity: 0.78 })}
  ${emo(100, 2400, 240, "burst", C.coral, C.mango, { rotate: 10, opacity: 0.55 })}
  ${emo(1080, 3320, 220, "leaf", C.sage, C.mint, { rotate: 20, opacity: 0.55 })}

  <!-- 헤더 칩 (y: 260-380) -->
  <g transform="translate(${W/2}, 320)">
    <rect x="-440" y="-70" rx="60" ry="60" width="880" height="130" fill="${C.coral}"/>
    <text font-family="Pretendard" font-size="56" font-weight="800" fill="#FFFFFF" text-anchor="middle" dy="22" letter-spacing="3">PACER · 함께 걷는 사람들</text>
  </g>

  <!-- 메인 카피 (y: 540-1020) -->
  <text x="${W/2}" y="700" font-family="Pretendard" font-size="120" font-weight="900" fill="${C.ink}" text-anchor="middle" letter-spacing="-3">사단법인 더나일의</text>
  <text x="${W/2}" y="860" font-family="Pretendard" font-size="120" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-3">페이서가 되어주세요!</text>

  <!-- 강조 메시지 박스 (y: 1080-1400) -->
  <g transform="translate(${W/2}, 1240)">
    <rect x="-560" y="-160" rx="70" ry="70" width="1120" height="320" fill="${C.ink}"/>
    <text font-family="Pretendard" font-size="72" font-weight="800" fill="${C.cream}" text-anchor="middle" dy="-30">오늘의 가족을 변화시키는 일에</text>
    <text font-family="Pretendard" font-size="72" font-weight="800" fill="${C.peach}" text-anchor="middle" dy="80">힘이 되어 주세요!</text>
  </g>

  <!-- 페이서 설명 (y: 1500-1850) — 글자 키움 -->
  <text x="${W/2}" y="1570" font-family="Pretendard" font-size="56" font-weight="700" fill="${C.coral}" text-anchor="middle" letter-spacing="2">페이서(PACER)란</text>
  <text x="${W/2}" y="1680" font-family="Pretendard" font-size="50" fill="${C.inkBrown}" text-anchor="middle">더 나은 사회를 위해 가족의 가치가</text>
  <text x="${W/2}" y="1760" font-family="Pretendard" font-size="50" fill="${C.inkBrown}" text-anchor="middle">회복되어야 한다는 것에 동의하며</text>
  <text x="${W/2}" y="1850" font-family="Pretendard" font-size="56" font-weight="800" fill="${C.ink}" text-anchor="middle">더나일과 함께 걷는 사람들입니다.</text>

  <!-- QR 코드 영역 (y: 1980-2820) — 사이즈 880→680 -->
  <g transform="translate(${W/2}, 2400)">
    <text font-family="Pretendard" font-size="62" font-weight="800" fill="${C.coral}" text-anchor="middle" dy="-360" letter-spacing="3">후원하기 →</text>
    <rect x="-340" y="-310" rx="40" ry="40" width="680" height="680" fill="#FFFFFF" stroke="${C.coral}" stroke-width="6" stroke-opacity="0.4"/>
    <image x="-300" y="-270" width="600" height="600" href="${qrB64}"/>
  </g>

  <!-- URL 텍스트 (QR 못 읽을 때) y: 2880 -->
  <text x="${W/2}" y="2880" font-family="Pretendard" font-size="46" font-weight="700" fill="${C.navy}" text-anchor="middle">www.thenile.kr/pacer</text>

  <!-- 기부금 영수증 안내 (y: 3050-3250) -->
  <g transform="translate(${W/2}, 3150)">
    <rect x="-560" y="-100" rx="50" ry="50" width="1120" height="200" fill="${C.cream}" stroke="${C.gold}" stroke-width="5" stroke-opacity="0.6"/>
    <text font-family="Pretendard" font-size="50" font-weight="800" fill="${C.inkBrown}" text-anchor="middle" dy="-15">기획재정부 지정 지정기부금단체</text>
    <text font-family="Pretendard" font-size="42" fill="${C.inkBrown}" text-anchor="middle" dy="55" opacity="0.85">기부금영수증 발급 가능 (법인 / 개인)</text>
  </g>

  <!-- 푸터 (y: 3400-3500) -->
  <text x="${W/2}" y="3480" font-family="Pretendard" font-size="46" font-weight="800" fill="${C.ink}" text-anchor="middle" letter-spacing="6">사단법인 더나일 · THE NILE</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (60×180cm @ 200dpi)`);
console.log(`  QR → ${PACER_URL} (680×680 박스, 600×600 코드)`);
