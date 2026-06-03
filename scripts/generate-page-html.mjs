/**
 * 빌드 후처리: dist/index.html 을 기반으로 페이지별 OG 메타가 적용된 정적 HTML을 생성한다.
 * - 크롤러(카카오톡, 페이스북 등)는 JS 실행이 없으므로 정적 HTML의 OG 태그만 읽는다.
 * - Vite SPA 라우팅은 그대로 유지되며, 사용자 측 동작은 동일하다.
 * - vercel.json 에서 해당 경로를 정적 HTML 로 rewrite 한다.
 */
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}
const indexHtml = fs.readFileSync(indexPath, "utf-8");

const pages = [
  {
    file: "conference.html",
    title: "2026 양육불안 컨퍼런스 | 사단법인 더나일",
    description:
      "불안을 불안해하지 마세요 — 2026.07.09 (목) 헤이그라운드 브릭스홀에서 열리는 사단법인 더나일의 비영리 컨퍼런스. 뇌과학·발달심리·당사자의 시선으로 양육불안을 함께 풀어봅니다.",
    ogTitle: "2026 양육불안 컨퍼런스 · 불안을 불안해하지 마세요",
    ogDescription:
      "사단법인 더나일이 여는 비영리 컨퍼런스 · 2026.07.09 (목) 헤이그라운드 브릭스홀 · 참가 무료 · 사전 신청 필수",
    ogImage: "https://www.thenile.kr/og-conference.jpg",
    canonical: "https://www.thenile.kr/conference",
  },
];

function replaceTag(html, tagPattern, replacement) {
  return html.replace(tagPattern, replacement);
}

for (const p of pages) {
  let html = indexHtml;

  html = replaceTag(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${p.title}</title>`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="description"[^>]*\/?>/,
    `<meta name="description" content="${p.description}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"[^>]*\/?>/,
    `<meta property="og:title" content="${p.ogTitle}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"[^>]*\/?>/,
    `<meta property="og:description" content="${p.ogDescription}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"[^>]*\/?>/,
    `<meta property="og:url" content="${p.canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:image"[^>]*\/?>/,
    `<meta property="og:image" content="${p.ogImage}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:image"[^>]*\/?>/,
    `<meta name="twitter:image" content="${p.ogImage}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"[^>]*\/?>/,
    `<meta name="twitter:title" content="${p.ogTitle}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"[^>]*\/?>/,
    `<meta name="twitter:description" content="${p.ogDescription}" />`,
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"[^>]*\/?>/,
    `<link rel="canonical" href="${p.canonical}" />`,
  );

  const outPath = path.join(distDir, p.file);
  fs.writeFileSync(outPath, html, "utf-8");
  console.log(`✓ ${p.file} generated (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}
