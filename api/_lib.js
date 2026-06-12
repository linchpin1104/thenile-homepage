// 공통 유틸 — Supabase INSERT + Solapi SMS + Gmail SMTP 메일

import crypto from "node:crypto";
import nodemailer from "nodemailer";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SOLAPI_API_KEY,
  SOLAPI_API_SECRET,
  SOLAPI_FROM,
  ADMIN_PHONE,         // (옵션) 관리자 SMS 알림 번호
  ADMIN_EMAIL,         // (옵션) 관리자 이메일 알림 받을 주소
  GMAIL_USER,          // (옵션) Gmail SMTP 발신 계정
  GMAIL_APP_PASSWORD,  // (옵션) Google 앱 비밀번호
  SLACK_WEBHOOK_URL,   // (옵션) Slack Incoming Webhook URL — 신청 알림 채널
  NOTION_API_KEY,      // (옵션) Notion Internal Integration Secret
  NOTION_APPLY_DB_ID,  // (옵션) 참가 신청 노션 DB ID
  NOTION_PARTNER_DB_ID,// (옵션) 기업 제휴 노션 DB ID
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

/** Gmail SMTP로 이메일 발송 (GMAIL_USER + GMAIL_APP_PASSWORD 둘 다 등록되어 있을 때만) */
let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, "") },
  });
  return _transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter || !to) return { skipped: true };
  await transporter.sendMail({
    from: `"사단법인 더나일" <${GMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(",") : to,
    subject,
    html,
    text,
  });
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

/** Slack Incoming Webhook으로 알림 발송 (SLACK_WEBHOOK_URL 등록 시) */
export async function sendSlack({ headline, fields, color = "#FF6B6B" }) {
  if (!SLACK_WEBHOOK_URL) return { skipped: true };
  const attachment = {
    color,
    blocks: [
      { type: "header", text: { type: "plain_text", text: headline, emoji: true } },
      {
        type: "section",
        fields: fields.flatMap(([k, v]) => [
          { type: "mrkdwn", text: `*${k}*` },
          { type: "mrkdwn", text: v || "_(미입력)_" },
        ]),
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `🕒 ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} (KST)` },
        ],
      },
    ],
  };
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attachments: [attachment] }),
  });
  if (!res.ok) throw new Error(`Slack ${res.status}: ${await res.text()}`);
  return { ok: true };
}

/** sendSlack의 try/catch 래퍼 — 알림 실패해도 메인 흐름은 계속 */
export async function safeSendSlack(payload) {
  try { await sendSlack(payload); }
  catch (err) { console.error("[slack] 발송 실패:", err.message); }
}

/** Notion DB에 row 추가 (NOTION_API_KEY + 해당 DB_ID 둘 다 있을 때만) */
export async function createNotionPage(databaseId, properties) {
  if (!NOTION_API_KEY || !databaseId) return { skipped: true };
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  return { ok: true };
}

/** Notion property 빌더 (값이 비어 있으면 해당 키 자체를 누락) */
export const notionProp = {
  title: (text) => text ? { title: [{ text: { content: String(text).slice(0, 2000) } }] } : null,
  text:  (text) => text ? { rich_text: [{ text: { content: String(text).slice(0, 2000) } }] } : null,
  email: (v) => v ? { email: String(v) } : null,
  phone: (v) => v ? { phone_number: String(v) } : null,
  select:(name) => name ? { select: { name: String(name).slice(0, 100) } } : null,
  date:  (iso) => iso ? { date: { start: iso } } : null,
};

/** Notion 호출의 try/catch 래퍼 */
export async function safeCreateNotion(databaseId, properties) {
  try { await createNotionPage(databaseId, properties); }
  catch (err) { console.error("[notion] 발송 실패:", err.message); }
}

/** Notion DB_ID 노출 (apply/partner.js에서 사용) */
export const NOTION_DBS = {
  apply: NOTION_APPLY_DB_ID,
  partner: NOTION_PARTNER_DB_ID,
};

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
