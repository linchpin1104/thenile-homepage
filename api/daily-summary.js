// GET /api/daily-summary — 매일 오전 9시 KST (= 00:00 UTC) Vercel Cron이 호출
// Slack 채널에 어제 신규 신청자 + 누계 요약 메시지 발송
import { safeSendSlack } from "./_lib.js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET } = process.env;

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
};

async function count(table, filter = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=id${filter ? "&" + filter : ""}`;
  const res = await fetch(url, { headers: { ...headers, Prefer: "count=exact" } });
  const range = res.headers.get("content-range") || "0";
  const total = parseInt(range.split("/").pop() || "0", 10);
  return Number.isFinite(total) ? total : 0;
}

async function recentRows(table, columns, since) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?created_at=gte.${since}&order=created_at.desc&select=${columns}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  return res.json();
}

export default async function handler(req, res) {
  // Vercel Cron 보호: header에 정확한 secret 있어야 통과 (선택)
  if (CRON_SECRET && req.headers["authorization"] !== `Bearer ${CRON_SECRET}`) {
    // Vercel Cron은 기본적으로 인증 없이 호출. CRON_SECRET 등록 안 했으면 그대로 통과
    if (req.headers["x-vercel-cron"] !== "1" && !req.query?.test) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
  }

  // KST 기준 어제 0시 ~ 오늘 0시
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 3600 * 1000);
  const kstToday0 = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
  const sinceUtc = new Date(kstToday0.getTime() - 24 * 3600 * 1000 - 9 * 3600 * 1000).toISOString();
  const untilUtc = new Date(kstToday0.getTime() - 9 * 3600 * 1000).toISOString();
  const filter = `created_at=gte.${sinceUtc}&created_at=lt.${untilUtc}`;

  try {
    const [applyTotal, partnerTotal, applyYesterdayRows, partnerYesterdayRows] = await Promise.all([
      count("apply"),
      count("partner"),
      recentRows("apply", "name,type,created_at", sinceUtc).then(r => r.filter(x => x.created_at < untilUtc)),
      recentRows("partner", "company,contact,type,created_at", sinceUtc).then(r => r.filter(x => x.created_at < untilUtc)),
    ]);

    // D-Day 카운트 (행사: 2026-07-09 11:00 KST)
    const eventKst = new Date("2026-07-09T11:00:00+09:00");
    const dDay = Math.ceil((eventKst.getTime() - now.getTime()) / (24 * 3600 * 1000));

    const yesterday = new Date(sinceUtc);
    const ystrKst = new Date(yesterday.getTime() + 9 * 3600 * 1000);
    const dateLabel = `${ystrKst.getMonth() + 1}월 ${ystrKst.getDate()}일`;

    const applyLines = applyYesterdayRows.length
      ? applyYesterdayRows.map(x => `  • ${x.name} _(${x.type})_`).join("\n")
      : "  _없음_";
    const partnerLines = partnerYesterdayRows.length
      ? partnerYesterdayRows.map(x => `  • ${x.company} / ${x.contact} _(${x.type || "-"})_`).join("\n")
      : "  _없음_";

    const text = [
      `📊 *더나일 컨퍼런스 일일 요약* — ${dateLabel} 신청`,
      ``,
      `*🎯 참가 신청*: ${applyYesterdayRows.length}명 신규 / 누계 ${applyTotal}명`,
      applyLines,
      ``,
      `*🤝 기업 제휴*: ${partnerYesterdayRows.length}건 신규 / 누계 ${partnerTotal}건`,
      partnerLines,
      ``,
      dDay > 0 ? `🔥 D-${dDay} (행사: 2026.07.09)` : (dDay === 0 ? `🔥 오늘 D-DAY!` : `_행사 종료 +${-dDay}일_`),
    ].join("\n");

    await safeSendSlack({
      headline: `📊 일일 요약 · ${dateLabel}`,
      color: "#3D2E26",
      fields: [
        ["참가 신청 (어제)", `${applyYesterdayRows.length}명`],
        ["참가 신청 (누계)", `${applyTotal}명`],
        ["기업 제휴 (어제)", `${partnerYesterdayRows.length}건`],
        ["기업 제휴 (누계)", `${partnerTotal}건`],
        ["D-Day", dDay > 0 ? `D-${dDay}` : (dDay === 0 ? "오늘 🔥" : `+${-dDay}일`)],
      ],
    });

    return res.status(200).json({ ok: true, applyTotal, partnerTotal, applyNew: applyYesterdayRows.length, partnerNew: partnerYesterdayRows.length });
  } catch (err) {
    console.error("[daily-summary] 실패:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
