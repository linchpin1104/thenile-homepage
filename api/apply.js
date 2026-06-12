// POST /api/apply — 참가 신청
import { supabaseInsert, sendSms, safeSendSlack, safeCreateNotion, notionProp, NOTION_DBS, envFingerprint, withCors } from "./_lib.js";

async function handler(req, res) {
  try {
    const body = req.body || {};
    const { name, phone, email, type, childAge, channel, message, agree } = body;

    // 필수 필드
    if (!name || !phone || !email || !type || !agree) {
      return res.status(400).json({ ok: false, error: "필수 항목 누락" });
    }

    const { ua, ipHash } = envFingerprint(req);

    // 1) DB INSERT
    await supabaseInsert("apply", {
      name,
      phone,
      email,
      type,
      child_age: childAge || null,
      channel: channel || null,
      message: message || null,
      user_agent: ua,
      ip_hash: ipHash,
    });

    // 2) 신청자 SMS
    let smsOk = false;
    try {
      const text =
        `[더나일] ${name}님, 2026 양육불안 컨퍼런스 참가 신청이 접수되었습니다.\n` +
        `· 일시: 2026.07.09 (목) 11:00 - 15:00\n` +
        `· 장소: 헤이그라운드 성수시작점\n` +
        `제출하신 정보로 행사 관련 안내를 드리겠습니다 :) 만나뵙는 그날까지 기쁜 마음으로 기다리고 있을게요.`;
      await sendSms(phone, text);
      smsOk = true;
    } catch (err) {
      console.error("[apply] SMS 실패:", err.message);
    }

    // 3) Slack 알림
    await safeSendSlack({
      headline: `🎯 참가 신청 · ${name} (${type})`,
      color: "#FF6B6B",
      fields: [
        ["이름", name],
        ["연락처", phone],
        ["이메일", email],
        ["참가자 유형", type],
        ["자녀 연령", childAge],
        ["알게 된 경로", channel],
        ["듣고 싶은 이야기", message],
      ],
    });

    // 4) Notion DB 추가
    await safeCreateNotion(NOTION_DBS.apply, Object.fromEntries(Object.entries({
      "이름":               notionProp.title(name),
      "연락처":             notionProp.phone(phone),
      "이메일":             notionProp.email(email),
      "참가자 유형":         notionProp.select(type),
      "자녀 연령":           notionProp.select(childAge),
      "알게 된 경로":         notionProp.text(channel),
      "듣고 싶은 이야기":     notionProp.text(message),
      "신청일시":             notionProp.date(new Date().toISOString()),
      "상태":                notionProp.select("신규"),
    }).filter(([_, v]) => v !== null)));

    return res.status(200).json({ ok: true, smsOk });
  } catch (err) {
    console.error("[apply] 처리 실패:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

export default withCors(handler);
