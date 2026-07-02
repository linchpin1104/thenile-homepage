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

const SPEAKERS_DIR = path.join(ROOT, "public/images/speakers");
const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const KIM = path.join(ROOT, "public/images/김혜민.png");

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

// 각 로고를 maxW × maxH 안에 fit (원본 비율 유지, 크기 균일)
async function partnerLogo(filePath, maxW = 130, maxH = 70) {
  if (!fs.existsSync(filePath)) return null;
  const resized = await sharp(filePath)
    .resize({ width: maxW, height: maxH, fit: "inside" })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  return { dataUri: "data:image/png;base64," + resized.toString("base64"), width: meta.width, height: meta.height };
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
];
for (const p of partners) {
  p.img = await partnerLogo(path.join(PARTNERS_DIR, p.path));
}

const PATHS = {
  blob:"M50 8c18 0 34 12 38 28s-6 36-22 44-38 4-46-10-6-34 6-46S38 8 50 8z",
  star:"M50 8l9 24h25l-20 15 8 25-22-15-22 15 8-25L16 32h25z",
  heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
  cloud:"M30 70c-12 0-20-8-20-18 0-9 7-16 16-17 1-13 12-23 26-23 13 0 24 9 26 21 11 1 18 9 18 18 0 11-9 19-20 19H30z",
  drop:"M50 8c10 18 30 32 30 50 0 16-13 28-30 28S20 74 20 58c0-18 20-32 30-50z",
  flower:"M50 18c0-6 5-10 10-10s10 5 10 10c0 4-2 7-5 9 5 1 9 5 9 10s-4 9-9 10c3 2 5 5 5 9 0 6-5 10-10 10s-10-4-10-10c-2 4-6 6-10 6-6 0-10-5-10-10s4-9 10-9c-4-2-6-5-6-9 0-5 4-9 9-10-3-2-5-5-5-9 0-5 4-9 9-9 5 0 9 4 10 9z",
  burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
  leaf:"M50 8C30 24 14 40 14 60c0 16 14 28 36 28s36-12 36-28C86 40 70 24 50 8z",
};

let _id = 0;
const emo = (cx, cy, size, shape, c1, c2, opts = {}) => {
  const { rotate = 0, opacity = 1, eyes = true } = opts;
  const d = PATHS[shape];
  const id = `e${++_id}`;
  const scale = size / 100;
  return `<g transform="translate(${cx-size/2},${cy-size/2})" opacity="${opacity}">
    <g transform="rotate(${rotate} ${size/2} ${size/2}) scale(${scale})">
      <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <path d="${d}" fill="url(#${id})"/>
      ${eyes ? `<g fill="#1a1a1a"><ellipse cx="40" cy="45" rx="3" ry="4"/><ellipse cx="60" cy="45" rx="3" ry="4"/></g>` : ""}
    </g></g>`;
};

const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 4) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `c${++_id}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

// 레이아웃 (5000×900):
// 좌측 (60~3300): 칩 + 슬로건 한 줄 + 날짜·시간·장소
// 우측 (3320~4960): SESSION 1, 2 (가로 스피커)
// 하단 (700~900, 흰 배경): 주최 + 협찬사 13개 가로

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 좌측 컬러 바 -->
  <rect x="0" y="0" width="50" height="${H}" fill="url(#g)"/>

  <!-- 배경 캐릭터 8개 (다양·크게·동적 배치) -->
  ${emo(3000, 200, 180, "heart", C.rose, C.lilac, { rotate: -10, opacity: 0.85 })}
  ${emo(3100, 480, 140, "burst", C.coral, C.mango, { rotate: 15, opacity: 0.82 })}
  ${emo(2880, 620, 100, "star", C.mango, C.peach, { rotate: -8, opacity: 0.7 })}
  ${emo(150, 250, 110, "flower", C.mango, C.peach, { rotate: 12, opacity: 0.7 })}
  ${emo(180, 600, 130, "drop", C.lilac, C.sky, { rotate: -15, opacity: 0.65 })}
  ${emo(2300, 80, 90, "leaf", C.sage, C.mint, { rotate: 25, opacity: 0.7 })}
  ${emo(3220, 50, 80, "cloud", C.sky, C.mint, { rotate: -10, opacity: 0.65, eyes: false })}
  ${emo(3290, 670, 110, "blob", C.rose, C.coral, { rotate: 15, opacity: 0.6 })}

  <!-- 좌측 (160~3300): 칩 + 슬로건 + 날짜·시간·장소 -->
  <g transform="translate(160, 0)">
    <!-- 상단 칩 -->
    <rect x="0" y="70" rx="44" ry="44" width="780" height="86" fill="#FFFFFF" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.5"/>
    <text x="390" y="124" font-family="Pretendard" font-size="38" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="3">사단법인 더나일 · 양육불안 컨퍼런스</text>

    <!-- 메인 슬로건 한 줄 (살짝 위로 — y 480 → 420) -->
    <text x="0" y="420" font-family="Pretendard" font-size="220" font-weight="900" fill="url(#g)" letter-spacing="-8">"불안을 불안해하지 마세요"</text>

    <!-- 날짜·시간·장소 한 줄 -->
    <text x="0" y="570" font-family="Pretendard" font-size="58" font-weight="800" fill="${C.ink}" letter-spacing="-1">
      <tspan>2026.07.09 (목)</tspan><tspan dx="40" font-weight="500" fill="${C.inkBrown}" opacity="0.4">|</tspan><tspan dx="40">오전 11시 — 오후 3시</tspan><tspan dx="40" font-weight="500" fill="${C.inkBrown}" opacity="0.4">|</tspan><tspan dx="40">헤이그라운드 B1</tspan>
    </text>
  </g>

  <!-- 우측 (3340~4960): SESSION 1·2 (라벨 옆에 연사 인라인, 타이틀 큼) -->
  <g transform="translate(3340, 0)">
    <!-- SESSION 1 (y: 100~360) -->
    <g>
      <rect x="0" y="100" rx="22" ry="22" width="360" height="58" fill="${C.coral}"/>
      <text x="180" y="140" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SESSION 1 · 키노트</text>
      <text x="390" y="140" font-family="Pretendard" font-size="26" font-weight="600" fill="${C.inkBrown}" opacity="0.75">장동선 · 이다랑 · 김혜민</text>
      <text x="0" y="270" font-family="Pretendard" font-size="62" font-weight="800" fill="${C.ink}" letter-spacing="-2">양육불안은 어디에서 오는가</text>
    </g>

    <!-- 구분선 -->
    <line x1="0" y1="380" x2="1620" y2="380" stroke="${C.inkBrown}" stroke-opacity="0.12" stroke-width="2"/>

    <!-- SESSION 2 (y: 420~660) -->
    <g>
      <rect x="0" y="420" rx="22" ry="22" width="400" height="58" fill="${C.lilac}"/>
      <text x="200" y="460" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SESSION 2 · 패널토크</text>
      <text x="430" y="460" font-family="Pretendard" font-size="26" font-weight="600" fill="${C.inkBrown}" opacity="0.75">이혜린 · 신두란 · 정지우 · 후추맘</text>
      <text x="0" y="590" font-family="Pretendard" font-size="62" font-weight="800" fill="${C.ink}" letter-spacing="-2">양육불안과 함께 살아간다는 것</text>
    </g>
  </g>

  <!-- 하단 흰 배경 (y 700~900): 주최 + 협찬사 -->
  <rect x="50" y="700" width="${W - 50}" height="${H - 700}" fill="#FFFFFF"/>

  <g>
    <text x="160" y="810" font-family="Pretendard" font-size="32" font-weight="800" fill="${C.coral}" letter-spacing="3">주최</text>
    <text x="260" y="810" font-family="Pretendard" font-size="32" font-weight="700" fill="${C.ink}" letter-spacing="1">사단법인 더나일</text>
    <text x="700" y="810" font-family="Pretendard" font-size="32" font-weight="800" fill="${C.coral}" letter-spacing="3">후원</text>

    ${(() => {
      const startX = 820, endX = W - 100;
      const n = partners.length;
      const span = (endX - startX) / n;   // 균등 셀 폭
      const y = 800;
      return partners.map((p, i) => {
        const x = startX + span * i + span / 2;  // 각 셀 중앙
        if (!p.img) return `<text x="${x}" y="${y + 6}" font-family="Pretendard" font-size="18" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
        // partnerLogo가 이미 130×70 max에 fit해서 반환. 실제 크기 그대로 렌더 → 각 셀 중앙 정렬
        const w = p.img.width, h = p.img.height;
        return `<image x="${x - w/2}" y="${y - h/2}" width="${w}" height="${h}" href="${p.img.dataUri}"/>`;
      }).join("");
    })()}
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (500×90cm @ 100dpi)`);
