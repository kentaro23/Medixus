const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "info@medixus.co.jp";
const DEFAULT_FROM_EMAIL = "Medixus <noreply@medixus.co.jp>";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function readFormData(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return Object.fromEntries(new URLSearchParams(req.body));

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return Object.fromEntries(new URLSearchParams(raw));
}

function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  res.end();
}

function normalizeRedirect(value, fallback = "/contact/") {
  if (!value || typeof value !== "string") return fallback;
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    redirect(res, "/contact/");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const redirectBase = "/contact/";

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    redirect(res, `${redirectBase}?error=missing_api_key`);
    return;
  }

  try {
    const data = await readFormData(req);
    const name = String(data.name || "").trim();
    const company = String(data.company || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const type = String(data.type || "お問い合わせ").trim();
    const message = String(data.message || "").trim();
    const job = String(data.job || "").trim();
    const request = String(data.request || "").trim();
    const redirectTo = normalizeRedirect(data.redirect, redirectBase);

    if (!name || !email || (!message && !request)) {
      redirect(res, `${redirectTo}?error=validation`);
      return;
    }

    const submittedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    const subjectParts = ["【Medixus】", type];
    if (request === "pitch") subjectParts.push("ピッチ資料");
    if (job) subjectParts.push(job);
    if (name) subjectParts.push(name);
    const subject = subjectParts.join(" / ");

    const rows = [
      ["種別", type],
      ["氏名", name],
      ["会社名・所属", company],
      ["メール", email],
      ["電話番号", phone],
      ["応募職種", job],
      ["リクエスト", request],
      ["送信日時", submittedAt],
      ["内容", message],
    ].filter(([, value]) => value);

    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; color: #0f1f3d;">
        <h2>Medixus HPからお問い合わせがありました</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="width: 160px; text-align: left; vertical-align: top; padding: 10px; border: 1px solid #dbe7f7; background: #f4f8ff;">${escapeHtml(label)}</th>
                  <td style="padding: 10px; border: 1px solid #dbe7f7; white-space: pre-wrap;">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </table>
      </div>
    `;

    const payload = {
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL],
      subject,
      text,
      html,
    };

    if (email) payload.reply_to = email;

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend send failed:", response.status, errorText);
      redirect(res, `${redirectTo}?error=send`);
      return;
    }

    redirect(res, `${redirectTo}?sent=1`);
  } catch (error) {
    console.error("Contact form failed:", error);
    redirect(res, `${redirectBase}?error=unknown`);
  }
};
