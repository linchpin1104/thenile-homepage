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

async function partnerLogo(filePath, targetW = 300, targetH = 130) {
  if (!fs.existsSync(filePath)) return null;
  const resized = await sharp(filePath)
    .resize({ width: targetW - 20, height: targetH - 20, fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 0 } })
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

// 레이아웃 (5000×900):
// 상단 메인 (y 0 ~ 700):
//   [60-1850]    좌: 칩 + 슬로건 두 줄
//   [1900-2900]  중: 일시·장소 박스
//   [3000-4960]  우: 세션 1·2 제목
// 하단 푸터 (y 700 ~ 900, 200px):
//   가로 라인 + "주최/후원" + 협찬사 13개 가로 작게

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

  <!-- 좌측 (160 ~ 1850): 칩 + 슬로건 두 줄 -->
  <g transform="translate(160, 0)">
    <rect x="0" y="45" rx="42" ry="42" width="600" height="80" fill="#FFFFFF" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.5"/>
    <text x="300" y="98" font-family="Pretendard" font-size="38" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="3">2026 양육불안 컨퍼런스</text>

    <text x="0" y="350" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#g)" letter-spacing="-7">"불안을</text>
    <text x="0" y="580" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#g)" letter-spacing="-7">불안해하지 마세요"</text>
  </g>

  <!-- 캐릭터 액센트 -->
  ${emo(1960, 200, 100, "heart", C.rose, C.lilac, { rotate: -10, opacity: 0.85 })}
  ${emo(1960, 480, 80, "burst", C.coral, C.mango, { rotate: 15, opacity: 0.75 })}

  <!-- 중앙 (2080 ~ 3010): 일시·장소 (박스 없이 깔끔) -->
  <g transform="translate(2540, 100)">
    <line x1="-340" y1="60" x2="340" y2="60" stroke="${C.coral}" stroke-width="3" stroke-opacity="0.5"/>
    <text font-family="Pretendard" font-size="110" font-weight="800" fill="${C.ink}" text-anchor="middle" dy="180" letter-spacing="-2">2026.07.09 (목)</text>
    <text font-family="Pretendard" font-size="60" font-weight="600" fill="${C.inkBrown}" text-anchor="middle" dy="270" opacity="0.78">오전 11시 — 오후 3시</text>
    <text font-family="Pretendard" font-size="68" font-weight="800" fill="${C.coral}" text-anchor="middle" dy="370">헤이그라운드 B1</text>
    <line x1="-340" y1="420" x2="340" y2="420" stroke="${C.coral}" stroke-width="3" stroke-opacity="0.5"/>
  </g>

  <!-- 우측 (3120 ~ 4960): 세션 2개 제목 -->
  <g transform="translate(3120, 100)">
    <rect x="0" y="20" rx="22" ry="22" width="320" height="56" fill="${C.coral}"/>
    <text x="160" y="58" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SESSION 1 · 키노트</text>
    <text x="0" y="160" font-family="Pretendard" font-size="64" font-weight="800" fill="${C.ink}" letter-spacing="-2">양육불안은 어디에서 오는가</text>
    <text x="0" y="220" font-family="Pretendard" font-size="30" font-weight="600" fill="${C.inkBrown}" opacity="0.7">장동선 · 이다랑 · 김혜민 (PD)</text>

    <line x1="0" y1="290" x2="1700" y2="290" stroke="${C.inkBrown}" stroke-opacity="0.15" stroke-width="2"/>

    <rect x="0" y="330" rx="22" ry="22" width="340" height="56" fill="${C.lilac}"/>
    <text x="170" y="368" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SESSION 2 · 패널토크</text>
    <text x="0" y="470" font-family="Pretendard" font-size="64" font-weight="800" fill="${C.ink}" letter-spacing="-2">양육불안과 함께 살아간다는 것</text>
    <text x="0" y="530" font-family="Pretendard" font-size="30" font-weight="600" fill="${C.inkBrown}" opacity="0.7">이혜린 · 신두란 · 정지우 · 후추맘</text>
  </g>

  <!-- 하단 푸터 (y 700 ~ 900, 200px): 흰 배경 + 가로 로고 -->
  <rect x="60" y="700" width="${W - 60}" height="${H - 700}" fill="#FFFFFF"/>

  <g>
    <text x="160" y="810" font-family="Pretendard" font-size="32" font-weight="800" fill="${C.coral}" letter-spacing="3">주최</text>
    <text x="260" y="810" font-family="Pretendard" font-size="32" font-weight="700" fill="${C.ink}" letter-spacing="1">사단법인 더나일</text>
    <text x="700" y="810" font-family="Pretendard" font-size="32" font-weight="800" fill="${C.coral}" letter-spacing="3">후원</text>

    ${(() => {
      const startX = 820, endX = W - 100;
      const logoW = 220, logoH = 110;
      const n = partners.length;
      const span = (endX - startX) / n;
      return partners.map((p, i) => {
        const x = startX + span * i + span / 2;
        const y = 800;
        if (!p.img) return `<text x="${x}" y="${y + 6}" font-family="Pretendard" font-size="18" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
        return `<image x="${x - logoW/2}" y="${y - logoH/2}" width="${logoW}" height="${logoH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
      }).join("");
    })()}
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (500×90cm @ 100dpi)`);
