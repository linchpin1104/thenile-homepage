// POST /api/partner — 기업 제휴 문의
import { supabaseInsert, sendSms, sendAdminSms, safeSendSlack, safeCreateNotion, notionProp, NOTION_DBS, envFingerprint, withCors } from "./_lib.js";

async function handler(req, res) {
  try {
    const body = req.body || {};
    const { company, contact, position, phone, email, type, message, agree } = body;

    if (!company || !contact || !phone || !email || !agree) {
      return res.status(400).json({ ok: false, error: "필수 항목 누락" });
    }

    const { ua, ipHash } = envFingerprint(req);

    // 1) DB INSERT
    await supabaseInsert("partner", {
      company,
      contact,
      position: position || null,
      phone,
      email,
      type: type || null,
      message: message || null,
      user_agent: ua,
      ip_hash: ipHash,
    });

    // 2) 담당자 SMS
    let smsOk = false;
    try {
      const text =
        `[더나일] ${contact}님, ${company}의 2026 양육불안 컨퍼런스 기업 제휴 문의가 접수되었습니다.\n` +
        `영업일 기준 3일 이내에 회신드리겠습니다.\n` +
        `· cross@thenile.kr`;
      await sendSms(phone, text);
      smsOk = true;
    } catch (err) {
      console.error("[partner] 담당자 SMS 실패:", err.message);
    }

    // 3) 관리자 알림 SMS
    await sendAdminSms(
      `[더나일 제휴] ${company} / ${contact} (${phone}) 문의 접수. type=${type || "-"}`
    );

    // 4) Slack 알림
    await safeSendSlack({
      headline: `🤝 기업 제휴 · ${company} / ${contact}`,
      color: "#C6A8E8",
      fields: [
        ["기업/기관명", company],
        ["담당자명", contact],
        ["직책", position],
        ["연락처", phone],
        ["이메일", email],
        ["함께하고 싶은 방식", type],
        ["메시지", message],
      ],
    });

    // 5) Notion DB 추가
    await safeCreateNotion(NOTION_DBS.partner, Object.fromEntries(Object.entries({
      "기업/기관명":          notionProp.title(company),
      "담당자명":             notionProp.text(contact),
      "직책":                notionProp.text(position),
      "연락처":               notionProp.phone(phone),
      "이메일":               notionProp.email(email),
      "함께하고 싶은 방식":     notionProp.select(type),
      "메시지":               notionProp.text(message),
      "신청일시":             notionProp.date(new Date().toISOString()),
      "진행상태":             notionProp.select("검토"),
    }).filter(([_, v]) => v !== null)));

    return res.status(200).json({ ok: true, smsOk });
  } catch (err) {
    console.error("[partner] 처리 실패:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

export default withCors(handler);
