// 컨퍼런스 엑스배너 (세로 60cm × 180cm, 1200×3600px @ 200dpi)
// 실행: node scripts/generate-conference-xbanner.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const W = 1200, H = 3600;
const OUT = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-엑스배너.png");

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

async function partnerLogoNormalize(filePath, targetW = 400, targetH = 160) {
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
  p.img = await partnerLogoNormalize(path.join(PARTNERS_DIR, p.path));
}

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

const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 8) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `c${++_id}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

const session1 = [
  { name: "장동선", role: "뇌과학자",        img: photo.장동선 },
  { name: "이다랑", role: "아동심리전문가",   img: photo.이다랑 },
  { name: "김혜민", role: "PD · 사회",        img: photo.김혜민 },
];
const session2 = [
  { name: "이혜린", role: "쉬벤처스 부대표",   img: photo.이혜린 },
  { name: "신두란", role: "고마워서그래 대표", img: photo.신두란 },
  { name: "정지우", role: "작가 · 변호사",     img: photo.정지우 },
  { name: "후추맘", role: "육아 크리에이터",   img: photo.후추맘 },
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="title" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 (크고 적게) -->
  ${emo(1080, 320, 280, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.9 })}
  ${emo(120, 920, 220, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.8 })}
  ${emo(80, 2600, 180, "drop", C.lilac, C.sky, { rotate: -15, opacity: 0.65 })}
  ${emo(1100, 3200, 180, "leaf", C.sage, C.mint, { rotate: 22, opacity: 0.65 })}

  <!-- 헤더 칩 (y: 240-360) -->
  <g transform="translate(${W/2}, 300)">
    <rect x="-450" y="-65" rx="55" ry="55" width="900" height="110" fill="#FFFFFF" stroke="${C.coral}" stroke-width="5" stroke-opacity="0.5"/>
    <text font-family="Pretendard" font-size="48" font-weight="800" fill="${C.coral}" text-anchor="middle" dy="18" letter-spacing="3">2026 양육불안 컨퍼런스</text>
  </g>

  <!-- 메인 슬로건 (y: 460-1050) -->
  <text x="${W/2}" y="700" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">"불안을</text>
  <text x="${W/2}" y="940" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">불안해하지</text>
  <text x="${W/2}" y="1180" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">마세요"</text>

  <!-- 일시·장소 큰 박스 (y: 1320-1700) -->
  <g transform="translate(${W/2}, 1510)">
    <rect x="-560" y="-185" rx="80" ry="80" width="1120" height="370" fill="${C.ink}"/>
    <text font-family="Pretendard" font-size="40" font-weight="700" fill="${C.peach}" text-anchor="middle" dy="-100" letter-spacing="6">WHEN · WHERE</text>
    <text font-family="Pretendard" font-size="92" font-weight="800" fill="${C.cream}" text-anchor="middle" dy="-10">2026.07.09 (목)</text>
    <text font-family="Pretendard" font-size="62" font-weight="700" fill="${C.cream}" text-anchor="middle" dy="60">오전 11시 — 오후 3시</text>
    <text font-family="Pretendard" font-size="62" font-weight="700" fill="${C.mango}" text-anchor="middle" dy="135">헤이그라운드 B1</text>
  </g>

  <!-- SESSION 1 (y: 1750-2240) -->
  <g>
    <rect x="${W/2-260}" y="1750" rx="28" ry="28" width="520" height="60" fill="${C.coral}"/>
    <text x="${W/2}" y="1791" font-family="Pretendard" font-size="34" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SESSION 1 · 키노트</text>
    <text x="${W/2}" y="1860" font-family="Pretendard" font-size="44" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안은 어디에서 오는가</text>

    ${(() => {
      const photoY = 2030;
      const r = 105;
      const gap = 320;
      const totalW = gap * 2;
      const startX = W/2 - totalW/2;
      return session1.map((s, i) => {
        const x = startX + i * gap;
        return `
          <g>
            ${circlePhoto(x, photoY, r, s.img, C.coral, 6)}
            <text x="${x}" y="${photoY + r + 50}" font-family="Pretendard" font-size="30" font-weight="800" fill="${C.ink}" text-anchor="middle">${s.name}</text>
            <text x="${x}" y="${photoY + r + 85}" font-family="Pretendard" font-size="20" font-weight="600" fill="${C.inkBrown}" opacity="0.7" text-anchor="middle">${s.role}</text>
          </g>
        `;
      }).join("");
    })()}
  </g>

  <!-- SESSION 2 (y: 2290-2740) -->
  <g>
    <rect x="${W/2-280}" y="2290" rx="28" ry="28" width="560" height="60" fill="${C.lilac}"/>
    <text x="${W/2}" y="2331" font-family="Pretendard" font-size="34" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SESSION 2 · 패널토크</text>
    <text x="${W/2}" y="2400" font-family="Pretendard" font-size="44" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안과 함께 살아간다는 것</text>

    ${(() => {
      const photoY = 2530;
      const r = 80;
      const gap = 260;
      const totalW = gap * 3;
      const startX = W/2 - totalW/2;
      return session2.map((s, i) => {
        const x = startX + i * gap;
        return `
          <g>
            ${circlePhoto(x, photoY, r, s.img, C.lilac, 5)}
            <text x="${x}" y="${photoY + r + 42}" font-family="Pretendard" font-size="26" font-weight="800" fill="${C.ink}" text-anchor="middle">${s.name}</text>
            <text x="${x}" y="${photoY + r + 72}" font-family="Pretendard" font-size="18" font-weight="600" fill="${C.inkBrown}" opacity="0.7" text-anchor="middle">${s.role}</text>
          </g>
        `;
      }).join("");
    })()}
  </g>

  <!-- 후원/협찬 (y: 2800-3300) -->
  <g>
    <text x="${W/2}" y="2830" font-family="Pretendard" font-size="28" font-weight="800" fill="${C.inkBrown}" text-anchor="middle" opacity="0.6" letter-spacing="6">PARTNERS · 후원 / 협찬</text>
    <rect x="40" y="2870" rx="30" ry="30" width="${W-80}" height="430" fill="#FFFFFF" stroke="${C.inkBrown}" stroke-opacity="0.1" stroke-width="2"/>

    ${(() => {
      const row1 = partners.slice(0, 7);
      const row2 = partners.slice(7, 13);
      const boxX = 40, boxW = W - 80;
      const logoMaxW = 140;
      const logoMaxH = 110;
      function placeRow(arr, y) {
        const cellW = boxW / arr.length;
        return arr.map((p, i) => {
          const x = boxX + cellW * i + cellW/2;
          if (!p.img) return `<text x="${x}" y="${y+8}" font-family="Pretendard" font-size="22" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
          return `<image x="${x - logoMaxW/2}" y="${y - logoMaxH/2}" width="${logoMaxW}" height="${logoMaxH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
        }).join("");
      }
      return placeRow(row1, 2980) + placeRow(row2, 3180);
    })()}
  </g>

  <!-- 푸터 (y: 3350-3550) -->
  <g transform="translate(${W/2}, 3450)">
    <text font-family="Pretendard" font-size="36" font-weight="800" fill="${C.ink}" text-anchor="middle" letter-spacing="4">주최  사단법인 더나일  ·  후원  성동구청</text>
    <text y="60" font-family="Pretendard" font-size="28" font-weight="600" fill="${C.inkBrown}" text-anchor="middle" opacity="0.7" letter-spacing="2">www.thenile.kr/conference</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (60×180cm @ 200dpi)`);
