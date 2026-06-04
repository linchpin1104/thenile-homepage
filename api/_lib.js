// 공통 유틸 — Supabase INSERT + Solapi SMS 발송

import crypto from "node:crypto";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SOLAPI_API_KEY,
  SOLAPI_API_SECRET,
  SOLAPI_FROM,
  ADMIN_PHONE,         // (옵션) 관리자 SMS 알림 번호
  RESEND_API_KEY,      // (옵션) Resend 이메일 API 키 (없으면 메일 미발송)
  ADMIN_EMAIL,         // (옵션) 관리자 이메일 알림 받을 주소
  RESEND_FROM,         // (옵션) 발신 주소. 없으면 onboarding@resend.dev
} = process.env;

/** Supabase REST 직접 호출 — supabase-js 의존성 없이 가볍게 */
export async function supabaseInsert(table, row) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
}

/** Solapi 인증 헤더 (HMAC-SHA256) */
function solapiAuth() {
  if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
    throw new Error("Solapi env vars missing (SOLAPI_API_KEY / SOLAPI_API_SECRET)");
  }
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", SOLAPI_API_SECRET)
    .update(date + salt)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

/** SMS 발송 (실패 시 throw — 호출자 try/catch로 잡힘) */
export async function sendSms(to, text) {
  if (!SOLAPI_FROM) throw new Error("Solapi env vars missing (SOLAPI_FROM)");
  const cleaned = String(to).replace(/[^0-9]/g, "");
  const fromClean = String(SOLAPI_FROM).replace(/[^0-9]/g, "");
  if (!cleaned) throw new Error("수신 번호 비어 있음");

  const res = await fetch("https://api.solapi.com/messages/v4/send", {
    method: "POST",
    headers: {
      Authorization: solapiAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: { to: cleaned, from: fromClean, text },
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Solapi ${res.status}: ${body}`);
  return body;
}

/** 환경 (IP 일부 해시 + UA) — 단순 어뷰즈 추적용. PII 직접 저장 안 함 */
export function envFingerprint(req) {
  const ua = String(req.headers["user-agent"] || "").slice(0, 200);
  const ip = String(
    req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || ""
  )
    .split(",")[0]
    .trim();
  const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16) : null;
  return { ua, ipHash };
}

/** 관리자에게 알림 SMS (ADMIN_PHONE 환경변수 있을 때만) */
export async function sendAdminSms(text) {
  if (!ADMIN_PHONE) return;
  try {
    await sendSms(ADMIN_PHONE, text);
  } catch (err) {
    console.error("[admin-sms] 발송 실패:", err.message);
  }
}

/** Resend로 이메일 발송 (RESEND_API_KEY가 등록되어 있을 때만) */
export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY || !to) return { skipped: true };
  const from = RESEND_FROM || "더나일 컨퍼런스 <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`);
  return { ok: true };
}

/** 관리자에게 알림 메일 (ADMIN_EMAIL 환경변수 있을 때만) */
export async function sendAdminEmail({ subject, html, text }) {
  if (!ADMIN_EMAIL) return;
  try {
    await sendEmail({ to: ADMIN_EMAIL, subject, html, text });
  } catch (err) {
    console.error("[admin-email] 발송 실패:", err.message);
  }
}

/** CORS / preflight 핸들링 */
export function withCors(handler) {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "method not allowed" });
      return;
    }
    return handler(req, res);
  };
}
