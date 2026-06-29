// 컨퍼런스 엑스배너 (세로 60cm × 180cm, 1200×3600px @ 200dpi)
// 실행: node scripts/generate-conference-xbanner.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const W = 1200, H = 3600;
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-엑스배너.png");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0", sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
};

const PATHS = {
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
  drop:"M50 8c10 18 30 32 30 50 0 16-13 28-30 28S20 74 20 58c0-18 20-32 30-50z",
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
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 -->
  ${emo(1100, 320, 300, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.85 })}
  ${emo(100, 900, 240, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.78 })}
  ${emo(1100, 2400, 200, "leaf", C.sage, C.mint, { rotate: 20, opacity: 0.7 })}
  ${emo(100, 3100, 200, "drop", C.lilac, C.sky, { rotate: -15, opacity: 0.7 })}

  <!-- 상단 라벨 -->
  <g transform="translate(${W/2}, 300)">
    <rect x="-440" y="-70" rx="60" ry="60" width="880" height="120" fill="#FFFFFF" stroke="${C.coral}" stroke-width="5" stroke-opacity="0.5"/>
    <text font-family="Pretendard" font-size="52" font-weight="800" fill="${C.coral}" text-anchor="middle" dy="20" letter-spacing="3">2026 양육불안 컨퍼런스</text>
  </g>

  <!-- 메인 슬로건 (세로 4줄, 그라데이션) -->
  <text x="${W/2}" y="720" font-family="Pretendard" font-size="180" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-5">"불안을</text>
  <text x="${W/2}" y="940" font-family="Pretendard" font-size="180" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-5">불안해하지</text>
  <text x="${W/2}" y="1160" font-family="Pretendard" font-size="180" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-5">마세요"</text>

  <!-- 설명문 (2줄) -->
  <text x="${W/2}" y="1500" font-family="Pretendard" font-size="60" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안의 시대,</text>
  <text x="${W/2}" y="1600" font-family="Pretendard" font-size="60" font-weight="800" fill="${C.ink}" text-anchor="middle">우리는 괜찮은 걸까요?</text>

  <!-- 일시·장소 큰 박스 -->
  <g transform="translate(${W/2}, 2100)">
    <rect x="-540" y="-200" rx="80" ry="80" width="1080" height="400" fill="${C.ink}"/>
    <text font-family="Pretendard" font-size="56" font-weight="700" fill="${C.peach}" text-anchor="middle" dy="-110" letter-spacing="4">WHEN · WHERE</text>
    <text font-family="Pretendard" font-size="120" font-weight="800" fill="${C.cream}" text-anchor="middle" dy="0">2026.07.09 (목)</text>
    <text font-family="Pretendard" font-size="80" font-weight="700" fill="${C.cream}" text-anchor="middle" dy="120">헤이그라운드 B1</text>
  </g>

  <!-- 시간 (보조 정보) -->
  <text x="${W/2}" y="2580" font-family="Pretendard" font-size="64" font-weight="600" fill="${C.inkBrown}" text-anchor="middle">오전 11시 — 오후 3시</text>

  <!-- 참가 안내 -->
  <text x="${W/2}" y="2820" font-family="Pretendard" font-size="56" font-weight="700" fill="${C.coral}" text-anchor="middle" letter-spacing="2">선착순 100~120명 · 참가 무료</text>

  <!-- 신청 URL -->
  <g transform="translate(${W/2}, 3060)">
    <rect x="-500" y="-70" rx="50" ry="50" width="1000" height="140" fill="${C.coral}"/>
    <text font-family="Pretendard" font-size="48" font-weight="800" fill="${C.white}" text-anchor="middle" dy="-10">참가 신청</text>
    <text font-family="Pretendard" font-size="42" font-weight="600" fill="${C.cream}" text-anchor="middle" dy="40">www.thenile.kr/conference</text>
  </g>

  <!-- 하단 주최/후원 -->
  <g transform="translate(${W/2}, 3400)">
    <line x1="-440" y1="-50" x2="440" y2="-50" stroke="${C.inkBrown}" stroke-opacity="0.2" stroke-width="2"/>
    <text font-family="Pretendard" font-size="40" font-weight="700" fill="${C.inkBrown}" text-anchor="middle" dy="20" opacity="0.7" letter-spacing="3">주최 사단법인 더나일</text>
    <text font-family="Pretendard" font-size="40" font-weight="700" fill="${C.inkBrown}" text-anchor="middle" dy="90" opacity="0.7" letter-spacing="3">후원 성동구청</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (60×180cm @ 200dpi)`);
