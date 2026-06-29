// 2026 양육불안 컨퍼런스 현수막 (가로 500cm × 90cm, 5000×900px @ 100dpi)
// 실행: node scripts/generate-conference-banner.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const W = 5000, H = 900;
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-현수막.png");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 좌측 강조: 2026 양육불안 컨퍼런스 -->
  <text x="180" y="220" font-family="Pretendard" font-size="100" font-weight="800" fill="${C.coral}" letter-spacing="4">2026 양육불안 컨퍼런스</text>

  <!-- 중앙 메인 슬로건 (그라데이션) -->
  <text x="180" y="500" font-family="Pretendard" font-size="280" font-weight="900" fill="url(#g)" letter-spacing="-6">"불안을 불안해하지 마세요"</text>

  <!-- 일시·장소 (큰 글씨, 가로 배치) -->
  <text x="180" y="700" font-family="Pretendard" font-size="110" font-weight="800" fill="${C.ink}">2026.07.09 (목)</text>
  <text x="1750" y="700" font-family="Pretendard" font-size="40" fill="${C.inkBrown}" opacity="0.4">·</text>
  <text x="1850" y="700" font-family="Pretendard" font-size="110" font-weight="800" fill="${C.ink}">헤이그라운드 B1</text>

  <!-- 하단 우측: 주최/후원 -->
  <text x="${W - 180}" y="820" font-family="Pretendard" font-size="44" font-weight="700" fill="${C.inkBrown}" text-anchor="end" letter-spacing="2">주최 사단법인 더나일  ·  후원 성동구청</text>

  <!-- 좌측 강조 컬러 바 -->
  <rect x="0" y="0" width="50" height="${H}" fill="url(#g)"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (500×90cm @ 100dpi)`);
