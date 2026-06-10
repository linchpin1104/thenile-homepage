// 2026 양육불안 컨퍼런스 웹포스터 생성기 (1080×1920 PNG + PPTX)
// 실행: node scripts/generate-conference-poster.mjs
import sharp from "sharp";
import PptxGenJS from "pptxgenjs";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || ".", "..");
const W = 1080, H = 1920;
const OUT_PNG = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-포스터.png");
const OUT_PPTX = path.join(process.env.HOME, "Downloads/더나일-컨퍼런스-포스터.pptx");

const C = {
  cream:"#FFF8EC", ink:"#2A1F1A", inkBrown:"#3D2E26",
  coral:"#FF6B6B", peach:"#FFB088", mango:"#FFC93C",
  lilac:"#C6A8E8", rose:"#F8A8C0",
  sage:"#A8C9A0", mint:"#7BD7B7", sky:"#87C5E8",
  white:"#FFFFFF",
};

const SPEAKERS_DIR = path.join(ROOT, "public/images/speakers");
const PARTNERS_DIR = path.join(ROOT, "public/images/partners");
const KIM = path.join(ROOT, "public/images/김혜민.png");

async function compositeOnDarkBg(srcPath) {
  const meta = await sharp(srcPath).metadata();
  const darkBg = { r: 92, g: 82, b: 78, alpha: 1 };
  const buf = await sharp({
    create: { width: meta.width || 800, height: meta.height || 800, channels: 4, background: darkBg },
  }).composite([{ input: srcPath }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

function imgB64(filePath, ext) {
  if (!fs.existsSync(filePath)) return null;
  const inferExt = ext || path.extname(filePath).slice(1).toLowerCase();
  const mime = inferExt === "jpg" || inferExt === "jpeg" ? "jpeg" : inferExt;
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

// 협력사 로고 (PNG → 흰 배경 cream으로 합성하면서 깔끔하게)
async function partnerLogoOnCream(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const meta = await sharp(filePath).metadata();
  const creamBg = { r: 255, g: 248, b: 236, alpha: 1 };
  // 가로 폭 400으로 통일 (비율 유지)
  const targetW = 400;
  const targetH = Math.round((meta.height / meta.width) * targetW);
  const resized = await sharp(filePath)
    .resize({ width: targetW, height: targetH, fit: "inside" })
    .toBuffer();
  const buf = await sharp({
    create: { width: targetW, height: targetH, channels: 4, background: creamBg },
  }).composite([{ input: resized }]).png().toBuffer();
  return "data:image/png;base64," + buf.toString("base64");
}

const partners = [
  { name: "성동구청",    path: "seongdong.png" },
  { name: "헤이그라운드", path: "heyground.png" },
  { name: "Take Root",   path: "takeroot.png" },
  { name: "BICYCLE",     path: "bicycle.png" },
  { name: "고마워서그래", path: "gomaweo.png" },
  { name: "AZURE852",    path: "azure852.png" },
  { name: "sheventures", path: "sheventures.webp" },
];

for (const p of partners) {
  p.img = await partnerLogoOnCream(path.join(PARTNERS_DIR, p.path));
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
  return `<g transform="translate(${cx - size / 2},${cy - size / 2})" opacity="${opacity}">
    <g transform="rotate(${rotate} ${size / 2} ${size / 2}) scale(${scale})">
      <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <path d="${d}" fill="url(#${id})"/>
      ${eyes ? `<g fill="#1a1a1a"><ellipse cx="40" cy="45" rx="3" ry="4"/><ellipse cx="60" cy="45" rx="3" ry="4"/></g>` : ""}
    </g></g>`;
};

const circlePhoto = (cx, cy, r, dataUri, borderColor, borderWidth = 5) => {
  if (!dataUri) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${borderColor}22"/>`;
  const id = `c${++_id}`;
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + borderWidth}" fill="${borderColor}"/>
    <image x="${cx - r}" y="${cy - r * 1.2}" width="${r * 2}" height="${r * 2.4}" href="${dataUri}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})"/>`;
};

const nameRole = (cx, cy, name, role, opts = {}) => {
  const { nameSize = 22, roleSize = 15 } = opts;
  return `<text x="${cx}" y="${cy}" font-family="Pretendard" text-anchor="middle">
    <tspan font-size="${nameSize}" font-weight="800" fill="${C.ink}">${name}</tspan><tspan font-size="${Math.round(roleSize * 0.85)}" fill="${C.inkBrown}" opacity="0.45">  ㅣ  </tspan><tspan font-size="${roleSize}" font-weight="600" fill="${C.inkBrown}" opacity="0.78">${role}</tspan>
  </text>`;
};

// 모든 SESSION 1 (장동선·이다랑·김혜민 동일 크기)
const session1 = [
  { name: "장동선", role: "뇌과학자",         img: photo.장동선, badge: "KEYNOTE 01" },
  { name: "이다랑", role: "아동심리전문가",    img: photo.이다랑, badge: "KEYNOTE 02" },
  { name: "김혜민", role: "PD · 사회",         img: photo.김혜민, badge: "MC" },
];

const session2 = [
  { name: "이혜린", role: "쉬벤처스 부대표",  img: photo.이혜린, badge: "MODERATOR" },
  { name: "신두란", role: "고마워서그래 대표", img: photo.신두란, badge: "PANEL" },
  { name: "정지우", role: "작가 · 변호사",    img: photo.정지우, badge: "PANEL" },
  { name: "후추맘", role: "육아 크리에이터",  img: photo.후추맘, badge: "PANEL" },
];

const poster = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.cream}"/>

  <defs>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.coral}"/>
      <stop offset="50%" stop-color="${C.mango}"/>
      <stop offset="100%" stop-color="${C.lilac}"/>
    </linearGradient>
  </defs>

  <!-- 배경 캐릭터 (감각적 5개) -->
  ${emo(1010, 140, 200, "burst", C.coral, C.mango, { rotate: 18, opacity: 0.92 })}
  ${emo(95, 430, 150, "heart", C.rose, C.lilac, { rotate: -12, opacity: 0.85 })}
  ${emo(995, 640, 95, "flower", C.mango, C.peach, { rotate: 14, opacity: 0.75 })}
  ${emo(80, 1240, 105, "drop", C.lilac, C.sky, { rotate: -15, opacity: 0.7 })}
  ${emo(1005, 1640, 115, "leaf", C.sage, C.mint, { rotate: 22, opacity: 0.75 })}

  <!-- 헤더 칩 -->
  <g>
    <rect x="320" y="100" rx="34" ry="34" width="440" height="60" fill="${C.white}" stroke="${C.coral}" stroke-width="2.5" stroke-opacity="0.5"/>
    <text x="${W / 2}" y="140" font-family="Pretendard" font-size="24" font-weight="800" fill="${C.coral}" text-anchor="middle" letter-spacing="2">2026 양육불안 컨퍼런스</text>
  </g>

  <!-- 메인 슬로건 -->
  <text x="${W / 2}" y="340" font-family="Pretendard" font-size="115" font-weight="900" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-3">불안을</text>
  <text x="${W / 2}" y="480" font-family="Pretendard" font-size="115" font-weight="900" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-3">불안해하지 마세요</text>

  <!-- 설명문 -->
  <text x="${W / 2}" y="580" font-family="Pretendard" font-size="26" font-weight="700" fill="${C.ink}" text-anchor="middle">양육불안의 시대, 우리는 괜찮은 걸까요?</text>
  <text x="${W / 2}" y="640" font-family="Pretendard" font-size="21" font-weight="500" fill="${C.inkBrown}" text-anchor="middle" opacity="0.85">양육불안은 이제 개인의 문제가 아니라 사회의 의제라는 것,</text>
  <text x="${W / 2}" y="675" font-family="Pretendard" font-size="21" font-weight="500" fill="${C.inkBrown}" text-anchor="middle" opacity="0.85">함께 이야기 나누어 보아요.</text>

  <!-- 일시·장소 박스 -->
  <g transform="translate(${W / 2}, 800)">
    <rect x="-470" y="-58" rx="48" ry="48" width="940" height="116" fill="${C.ink}"/>
    <text font-family="Pretendard" font-size="32" font-weight="800" fill="${C.cream}" text-anchor="middle" dy="-8">2026.07.09 (목) 11:00 – 15:00</text>
    <text y="30" font-family="Pretendard" font-size="20" font-weight="600" fill="${C.peach}" text-anchor="middle">헤이그라운드 성수시작점 · 선착순 100~120명 · 무료</text>
  </g>

  <!-- SESSION 1 (3명 동일 크기) -->
  <g>
    <rect x="380" y="900" rx="22" ry="22" width="320" height="44" fill="${C.coral}"/>
    <text x="${W / 2}" y="930" font-family="Pretendard" font-size="18" font-weight="800" fill="${C.white}" text-anchor="middle" letter-spacing="2">SESSION 1 · 키노트</text>
    <text x="${W / 2}" y="985" font-family="Pretendard" font-size="30" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안은 어디에서 오는가</text>

    ${(() => {
      const photoY = 1120;
      const r = 80;            // 세 명 모두 동일 크기
      const gap = 280;
      const totalW = gap * 2;  // 3명, 간격 2개
      const startX = W / 2 - totalW / 2;
      return session1.map((s, i) => {
        const x = startX + i * gap;
        return `
          <g>
            ${circlePhoto(x, photoY, r, s.img, C.coral, 5)}
            <rect x="${x - 60}" y="${photoY + r + 16}" rx="13" ry="13" width="120" height="28" fill="${C.coral}"/>
            <text x="${x}" y="${photoY + r + 35}" font-family="Pretendard" font-size="13" font-weight="800" fill="${C.white}" text-anchor="middle" letter-spacing="1.5">${s.badge}</text>
            ${nameRole(x, photoY + r + 75, s.name, s.role, { nameSize: 22, roleSize: 14 })}
          </g>
        `;
      }).join("");
    })()}
  </g>

  <!-- SESSION 2 -->
  <g>
    <rect x="380" y="1280" rx="22" ry="22" width="320" height="44" fill="${C.lilac}"/>
    <text x="${W / 2}" y="1310" font-family="Pretendard" font-size="18" font-weight="800" fill="${C.white}" text-anchor="middle" letter-spacing="2">SESSION 2 · 패널토크</text>
    <text x="${W / 2}" y="1365" font-family="Pretendard" font-size="30" font-weight="800" fill="${C.ink}" text-anchor="middle">양육불안과 함께 살아간다는 것</text>

    ${(() => {
      const photoY = 1495;
      const r = 68;
      const gap = 235;
      const totalW = gap * 3;
      const startX = W / 2 - totalW / 2;
      return session2.map((s, i) => {
        const x = startX + i * gap;
        return `
          <g>
            ${circlePhoto(x, photoY, r, s.img, C.lilac, 5)}
            <rect x="${x - 55}" y="${photoY + r + 14}" rx="12" ry="12" width="110" height="26" fill="${C.lilac}"/>
            <text x="${x}" y="${photoY + r + 31}" font-family="Pretendard" font-size="12" font-weight="800" fill="${C.white}" text-anchor="middle" letter-spacing="1.4">${s.badge}</text>
            ${nameRole(x, photoY + r + 62, s.name, s.role, { nameSize: 18, roleSize: 13 })}
          </g>
        `;
      }).join("");
    })()}
  </g>

  <!-- 협찬사 라벨 + 로고 그리드 -->
  <g>
    <text x="${W / 2}" y="1735" font-family="Pretendard" font-size="14" font-weight="800" fill="${C.inkBrown}" text-anchor="middle" opacity="0.55" letter-spacing="3">PARTNERS · 후원 / 협찬</text>

    ${(() => {
      // 7개를 두 줄로: 위 4 + 아래 3
      const row1 = partners.slice(0, 4);
      const row2 = partners.slice(4, 7);
      const cellW = 230;
      const cellH = 60;
      const logoMaxW = 160;
      const logoMaxH = 50;

      function placeRow(arr, y) {
        const totalW = cellW * (arr.length - 1);
        const startX = W / 2 - totalW / 2;
        return arr.map((p, i) => {
          const x = startX + i * cellW;
          if (!p.img) {
            return `<text x="${x}" y="${y + 6}" font-family="Pretendard" font-size="15" font-weight="700" fill="${C.inkBrown}" text-anchor="middle">${p.name}</text>`;
          }
          // 로고를 box 안에 fit
          return `<image x="${x - logoMaxW/2}" y="${y - logoMaxH/2}" width="${logoMaxW}" height="${logoMaxH}" href="${p.img}" preserveAspectRatio="xMidYMid meet"/>`;
        }).join("");
      }

      return placeRow(row1, 1780) + placeRow(row2, 1845);
    })()}
  </g>

  <!-- CTA -->
  <g transform="translate(${W / 2}, 1900)" style="display:none">
  </g>
</svg>`;

await sharp(Buffer.from(poster)).png({ quality: 95 }).toFile(OUT_PNG);
const pngStat = fs.statSync(OUT_PNG);
console.log(`✓ PNG: ${OUT_PNG}`);
console.log(`  ${(pngStat.size / 1024).toFixed(1)} KB · ${W}×${H} px`);

// PPTX 생성
const pptx = new PptxGenJS();
pptx.defineLayout({ name: "POSTER_9_16", width: 11.25, height: 20 });
pptx.layout = "POSTER_9_16";
pptx.title = "2026 양육불안 컨퍼런스 · 웹포스터";
pptx.company = "사단법인 더나일";
const slide = pptx.addSlide();
slide.addImage({ path: OUT_PNG, x: 0, y: 0, w: 11.25, h: 20 });
await pptx.writeFile({ fileName: OUT_PPTX });
const pptxStat = fs.statSync(OUT_PPTX);
console.log(`✓ PPTX: ${OUT_PPTX}`);
console.log(`  ${(pptxStat.size / 1024).toFixed(1)} KB · 11.25 × 20 in (9:16)`);
