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
const NILE_LOGO_SVG_PATH = path.join(ROOT, "public/images/thenile-logo.svg");

// 상단 헤더 로고 (좌 더나일, 우 성동구) — SVG에 base64 image로 삽입
const nileSvgSource = fs.readFileSync(NILE_LOGO_SVG_PATH, "utf-8");
const nileLogoRasterized = await sharp(Buffer.from(nileSvgSource), { density: 300 })
  .resize({ width: 700, height: 130, fit: "inside" })
  .png()
  .toBuffer();
const nileLogoB64 = "data:image/png;base64," + nileLogoRasterized.toString("base64");
const nileLogoMeta = await sharp(nileLogoRasterized).metadata();

const seongdongLogoRasterized = await sharp(path.join(PARTNERS_DIR, "seongdong.png"))
  .resize({ width: 220, height: 160, fit: "inside" })
  .png()
  .toBuffer();
const seongdongLogoB64 = "data:image/png;base64," + seongdongLogoRasterized.toString("base64");
const seongdongLogoMeta = await sharp(seongdongLogoRasterized).metadata();

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

async function partnerLogoNormalize(filePath, targetW = 300, targetH = 110) {
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

const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 6) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `c${++_id}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

const session1 = [
  { name: "장동선", role: "뇌과학자",                 img: photo.장동선 },
  { name: "이다랑", role: "아동심리전문가 · 더나일 이사장", img: photo.이다랑 },
  { name: "김혜민", role: "PD · 사회",                img: photo.김혜민 },
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

  <!-- 배경 캐릭터 -->
  ${emo(1080, 380, 260, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.88 })}
  ${emo(120, 1020, 200, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.78 })}

  <!-- 상단 로고 (좌: 사단법인 더나일 · 우: 성동구청) y 60-170 -->
  <image x="70" y="70" width="${nileLogoMeta.width}" height="${nileLogoMeta.height}" href="${nileLogoB64}"/>
  <image x="${W - seongdongLogoMeta.width - 70}" y="${70 + (nileLogoMeta.height - seongdongLogoMeta.height) / 2}" width="${seongdongLogoMeta.width}" height="${seongdongLogoMeta.height}" href="${seongdongLogoB64}"/>

  <!-- 헤더 칩: 사단법인 더나일 / 2026 양육불안 컨퍼런스 (y 220 ~ 420) -->
  <g transform="translate(${W/2}, 320)">
    <rect x="-460" y="-100" rx="60" ry="60" width="920" height="200" fill="#FFFFFF" stroke="${C.coral}" stroke-width="5" stroke-opacity="0.5"/>
    <text font-family="Pretendard" font-size="36" font-weight="700" fill="${C.inkBrown}" text-anchor="middle" dy="-25" opacity="0.7" letter-spacing="6">사단법인 더나일</text>
    <text font-family="Pretendard" font-size="52" font-weight="800" fill="${C.coral}" text-anchor="middle" dy="50" letter-spacing="3">2026 양육불안 컨퍼런스</text>
  </g>

  <!-- 메인 슬로건 (y: 520-1140) -->
  <text x="${W/2}" y="720" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">"불안을</text>
  <text x="${W/2}" y="940" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">불안해하지</text>
  <text x="${W/2}" y="1160" font-family="Pretendard" font-size="200" font-weight="900" fill="url(#title)" text-anchor="middle" letter-spacing="-6">마세요"</text>

  <!-- 일시·장소 (단순 텍스트, 박스 없이 깔끔 — y 1280-1480) -->
  <line x1="350" y1="1260" x2="850" y2="1260" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.4"/>
  <text x="${W/2}" y="1340" font-family="Pretendard" font-size="58" font-weight="800" fill="${C.ink}" text-anchor="middle" letter-spacing="-1">2026.07.09 (목)</text>
  <text x="${W/2}" y="1410" font-family="Pretendard" font-size="42" font-weight="600" fill="${C.inkBrown}" text-anchor="middle" opacity="0.78">오전 11시 — 오후 3시</text>
  <text x="${W/2}" y="1480" font-family="Pretendard" font-size="46" font-weight="800" fill="${C.coral}" text-anchor="middle">헤이그라운드 B1</text>
  <line x1="350" y1="1520" x2="850" y2="1520" stroke="${C.coral}" stroke-width="4" stroke-opacity="0.4"/>

  <!-- SESSION 1 (y: 1620-2150) -->
  <g>
    <rect x="${W/2-240}" y="1620" rx="26" ry="26" width="480" height="56" fill="${C.coral}"/>
    <text x="${W/2}" y="1658" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SESSION 1 · 키노트</text>
    <text x="${W/2}" y="1730" font-family="Pretendard" font-size="42" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안은 어디에서 오는가</text>

    ${(() => {
      const photoY = 1900;
      const r = 100;
      const gap = 310;
      const totalW = gap * 2;
      const startX = W/2 - totalW/2;
      return session1.map((s, i) => {
        const x = startX + i * gap;
        return `
          <g>
            ${circlePhoto(x, photoY, r, s.img, C.coral, 5)}
            <text x="${x}" y="${photoY + r + 48}" font-family="Pretendard" font-size="28" font-weight="800" fill="${C.ink}" text-anchor="middle">${s.name}</text>
            <text x="${x}" y="${photoY + r + 82}" font-family="Pretendard" font-size="19" font-weight="600" fill="${C.inkBrown}" opacity="0.7" text-anchor="middle">${s.role}</text>
          </g>
        `;
      }).join("");
    })()}
  </g>

  <!-- SESSION 2 (2×2 그리드, 키노트와 동일 크기 r=100) y: 2200-3060 -->
  <g>
    <rect x="${W/2-260}" y="2200" rx="26" ry="26" width="520" height="56" fill="${C.lilac}"/>
    <text x="${W/2}" y="2238" font-family="Pretendard" font-size="32" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SESSION 2 · 패널토크</text>
    <text x="${W/2}" y="2310" font-family="Pretendard" font-size="42" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안과 함께 살아간다는 것</text>

    ${(() => {
      const r = 100;
      const gapX = 460;
      const gapY = 340;
      const photoY1 = 2470;  // 1행
      const photoY2 = photoY1 + gapY;  // 2행 (2810)
      const startX = W/2 - gapX/2;  // 370
      const positions = [
        { ...session2[0], x: startX,         y: photoY1 },
        { ...session2[1], x: startX + gapX,  y: photoY1 },
        { ...session2[2], x: startX,         y: photoY2 },
        { ...session2[3], x: startX + gapX,  y: photoY2 },
      ];
      return positions.map((s) => `
        <g>
          ${circlePhoto(s.x, s.y, r, s.img, C.lilac, 5)}
          <text x="${s.x}" y="${s.y + r + 48}" font-family="Pretendard" font-size="28" font-weight="800" fill="${C.ink}" text-anchor="middle">${s.name}</text>
          <text x="${s.x}" y="${s.y + r + 80}" font-family="Pretendard" font-size="19" font-weight="600" fill="${C.inkBrown}" opacity="0.7" text-anchor="middle">${s.role}</text>
        </g>
      `).join("");
    })()}
  </g>

  <!-- 주최 강조 텍스트 + 후원/협찬 박스 (y: 3040 ~ 3480 — 위로 120 이동) -->
  <g>
    <text x="${W/2}" y="3080" font-family="Pretendard" font-size="32" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="4">주최 · 사단법인 더나일</text>

    <text x="${W/2}" y="3140" font-family="Pretendard" font-size="22" font-weight="800" fill="${C.inkBrown}" text-anchor="middle" opacity="0.55" letter-spacing="5">PARTNERS · 후원 / 협찬</text>
    <rect x="40" y="3170" rx="24" ry="24" width="${W-80}" height="290" fill="#FFFFFF" stroke="${C.inkBrown}" stroke-opacity="0.1" stroke-width="2"/>

    ${(() => {
      const rows = [partners.slice(0, 5), partners.slice(5, 9), partners.slice(9, 13)];
      const boxX = 80, boxW = W - 160;
      const logoMaxW = 130;
      const logoMaxH = 55;
      const yStarts = [3220, 3310, 3400];
      return rows.map((arr, rowIdx) => {
        const y = yStarts[rowIdx];
        const cellW = boxW / arr.length;
        return arr.map((p, i) => {
          const x = boxX + cellW * i + cellW/2;
          if (!p.img) return `<text x="${x}" y="${y+6}" font-family="Pretendard" font-size="14" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
          return `<image x="${x - logoMaxW/2}" y="${y - logoMaxH/2}" width="${logoMaxW}" height="${logoMaxH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
        }).join("");
      }).join("");
    })()}
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(OUT);
const s = fs.statSync(OUT);
console.log(`✓ ${OUT}`);
console.log(`  ${(s.size/1024).toFixed(1)} KB · ${W}×${H} px (60×180cm @ 200dpi)`);
