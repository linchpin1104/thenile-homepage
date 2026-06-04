// POST /api/apply — 참가 신청
import { supabaseInsert, sendSms, envFingerprint, withCors } from "./_lib.js";

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

    // 2) 신청자 SMS (실패해도 DB는 이미 저장됨 — 사용자 응답엔 ok)
    let smsOk = false;
    try {
      const text =
        `[더나일] ${name}님, 2026 양육불안 컨퍼런스 참가 신청이 접수되었습니다.\n` +
        `· 일시: 2026.07.09 (목) 11:00–14:30\n` +
        `· 장소: 헤이그라운드 브릭스홀\n` +
        `제출하신 정보로 행사 관련 안내를 드리겠습니다.`;
      await sendSms(phone, text);
      smsOk = true;
    } catch (err) {
      console.error("[apply] SMS 실패:", err.message);
    }

    return res.status(200).json({ ok: true, smsOk });
  } catch (err) {
    console.error("[apply] 처리 실패:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

export default withCors(handler);
