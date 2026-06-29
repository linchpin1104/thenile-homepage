// 2026 양육불안 컨퍼런스 현수막 (가로 500cm × 90cm, 5000×900px @ 100dpi)
// 실행: node scripts/generate-conference-banner.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const W = 5000, H = 900;
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-현수막.png");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0", sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
};

const PARTNERS_DIR = path.join(ROOT, "public/images/partners");

async function partnerLogo(filePath, targetW = 380, targetH = 140) {
  if (!fs.existsSync(filePath)) return null;
  const resized = await sharp(filePath)
    .resize({ width: targetW - 30, height: targetH - 30, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const buf = await sharp({
    create: { width: targetW, height: targetH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  }).composite([{ input: resized, gravity: "centre" }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

const partners = [
  { name: "성동구청",        path: "seongdong.png" },
  { name: "헤이그라운드",     path: "heyground.png" },
  { name: "Take Root",       path: "takeroot.png" },
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
];
for (const p of partners) {
  p.img = await partnerLogo(path.join(PARTNERS_DIR, p.path));
}

const PATHS = {
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
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

// 현수막 영역 분할 (가로 5000):
// [0-1700]   좌: 칩 + 메인 슬로건 (그라데이션)
// [1700-3300] 중: 일시 / 시간 / 장소 (검정 박스)
// [3300-5000] 우: 협찬사 로고 (3x4 그리드)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 좌측 강조 컬러 바 -->
  <rect x="0" y="0" width="60" height="${H}" fill="url(#g)"/>

  <!-- 좌측: 브랜드 칩 + 메인 슬로건 (두 줄) — 0 ~ 1850 -->
  <g transform="translate(160, 0)">
    <!-- 상단 칩 -->
    <rect x="0" y="60" rx="45" ry="45" width="620" height="90" fill="#FFFFFF" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.5"/>
    <text x="310" y="118" font-family="Pretendard" font-size="42" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="3">2026 양육불안 컨퍼런스</text>

    <!-- 큰 슬로건 두 줄 (그라데이션) -->
    <text x="0" y="420" font-family="Pretendard" font-size="220" font-weight="900" fill="url(#g)" letter-spacing="-8">"불안을</text>
    <text x="0" y="660" font-family="Pretendard" font-size="220" font-weight="900" fill="url(#g)" letter-spacing="-8">불안해하지 마세요"</text>

    <!-- 푸터: 주최/후원 -->
    <text x="0" y="820" font-family="Pretendard" font-size="40" font-weight="700" fill="${C.inkBrown}" opacity="0.7" letter-spacing="2">주최 사단법인 더나일  ·  후원 성동구청</text>
  </g>

  <!-- 캐릭터 액센트 (슬로건과 일시 박스 사이) -->
  ${emo(1980, 280, 180, "heart", C.rose, C.lilac, { rotate: -10, opacity: 0.85 })}
  ${emo(1980, 640, 140, "burst", C.coral, C.mango, { rotate: 15, opacity: 0.75 })}

  <!-- 중앙: 일시·장소 검정 박스 — 2230 ~ 3210 -->
  <g transform="translate(2720, 450)">
    <rect x="-490" y="-330" rx="60" ry="60" width="980" height="660" fill="${C.ink}"/>
    <text font-family="Pretendard" font-size="42" font-weight="700" fill="${C.peach}" text-anchor="middle" dy="-220" letter-spacing="6">WHEN · WHERE</text>
    <text font-family="Pretendard" font-size="130" font-weight="800" fill="${C.cream}" text-anchor="middle" dy="-70">2026.07.09 (목)</text>
    <text font-family="Pretendard" font-size="72" font-weight="700" fill="${C.cream}" text-anchor="middle" dy="60">오전 11시 — 오후 3시</text>
    <text font-family="Pretendard" font-size="72" font-weight="700" fill="${C.mango}" text-anchor="middle" dy="190">헤이그라운드 B1</text>
  </g>

  <!-- 우측: 협찬사 로고 (3행 × 5열 = 13개, 마지막 줄 3개) — 3290 ~ 4960 -->
  <g transform="translate(3290, 50)">
    <text x="835" y="60" font-family="Pretendard" font-size="34" font-weight="800" fill="${C.inkBrown}" text-anchor="middle" opacity="0.6" letter-spacing="6">PARTNERS · 후원 / 협찬</text>
    <rect x="0" y="90" rx="30" ry="30" width="1670" height="760" fill="#FFFFFF" stroke="${C.inkBrown}" stroke-opacity="0.1" stroke-width="2"/>

    ${(() => {
      const innerW = 1670 - 80, innerH = 760 - 60;
      const cols = 5;
      const rows = 3;
      const cellW = innerW / cols;
      const cellH = innerH / rows;
      const startX = 40, startY = 120;
      const logoMaxW = cellW - 30;
      const logoMaxH = cellH - 30;
      return partners.map((p, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = startX + col * cellW + cellW/2;
        const y = startY + row * cellH + cellH/2;
        if (!p.img) return `<text x="${x}" y="${y+10}" font-family="Pretendard" font-size="24" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
        return `<image x="${x - logoMaxW/2}" y="${y - logoMaxH/2}" width="${logoMaxW}" height="${logoMaxH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
      }).join("");
    })()}
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (500×90cm @ 100dpi)`);
