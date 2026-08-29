import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends a rich notification email to the Admin when a customer submits an inquiry
 * Supports:
 * 1. Resend API (if RESEND_API_KEY is configured in .env)
 * 2. Standard SMTP / Gmail (if SMTP_USER and SMTP_PASS are configured)
 * 3. Ethereal Test fallback (generates browser preview link)
 *
 * @param {Object} inquiry - { name, email, phone, message, property_id }
 * @param {Object} [property] - { title, price, location, id, type }
 */
export const sendInquiryEmailToAdmin = async (inquiry, property = null) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malvik.0123shrestha@gmail.com";
  const propertyTitle = property?.title || `Property #${inquiry.property_id}`;
  const propertyLocation = property?.location || "Nepal";
  const propertyPrice = property?.price
    ? `Nrs. ${Number(property.price).toLocaleString("en-IN")}`
    : "Not specified";
  const propertyCode = property?.id ? `NRES-${property.id}` : `ID #${inquiry.property_id}`;

  const submissionTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kathmandu",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `🏠 New Inquiry Lead: ${inquiry.name} for ${propertyTitle} [${propertyCode}]`;

  const textContent = `
NEW PROPERTY INQUIRY RECEIVED
=============================

Target Admin: ${adminEmail}

Property Details:
-----------------
Title: ${propertyTitle} (Code: ${propertyCode})
Location: ${propertyLocation}
Price: ${propertyPrice}

Customer Information:
---------------------
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || "Not provided"}
Submitted: ${submissionTime}

Customer Message:
-----------------
${inquiry.message || "No specific message provided."}

---
Bahumukhi Investment Company Pvt. Ltd.
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #1e2a3a 0%, #0f172a 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px; }
    .content { padding: 24px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .prop-title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
    .prop-meta { font-size: 13px; color: #64748b; margin: 0 0 8px 0; }
    .prop-price { font-size: 18px; font-weight: 800; color: #16a34a; margin: 0; }
    .info-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .info-table td { padding: 6px 0; }
    .info-label { width: 90px; color: #64748b; font-weight: 600; }
    .info-value { color: #0f172a; }
    .message-box { background: #ffffff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 4px; font-style: italic; color: #334155; line-height: 1.6; margin-top: 8px; }
    .actions { text-align: center; margin-top: 24px; }
    .btn { display: inline-block; padding: 11px 20px; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 6px; }
    .btn-primary { background: #1e2a3a; color: #ffffff !important; margin-right: 8px; }
    .btn-secondary { background: #16a34a; color: #ffffff !important; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 New Customer Lead</h1>
      <p>Bahumukhi Investment Company — Real Estate Portal</p>
    </div>

    <div class="content">
      <div class="section-title">Property Inquired</div>
      <div class="card">
        <h2 class="prop-title">${propertyTitle}</h2>
        <p class="prop-meta">📍 ${propertyLocation} &nbsp;|&nbsp; 🏷️ Code: <strong>${propertyCode}</strong></p>
        <p class="prop-price">${propertyPrice}</p>
      </div>

      <div class="section-title">Customer Details</div>
      <div class="card">
        <table class="info-table">
          <tr>
            <td class="info-label">👤 Name:</td>
            <td class="info-value"><strong>${inquiry.name}</strong></td>
          </tr>
          <tr>
            <td class="info-label">✉️ Email:</td>
            <td class="info-value"><a href="mailto:${inquiry.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td class="info-label">📞 Phone:</td>
            <td class="info-value"><a href="tel:${inquiry.phone || ""}" style="color: #2563eb; text-decoration: none;">${inquiry.phone || "Not provided"}</a></td>
          </tr>
          <tr>
            <td class="info-label">📅 Date:</td>
            <td class="info-value" style="color: #64748b;">${submissionTime}</td>
          </tr>
        </table>

        <div style="margin-top: 14px;">
          <strong style="font-size: 13px; color: #475569;">Customer Message:</strong>
          <div class="message-box">
            "${inquiry.message || "No custom message entered."}"
          </div>
        </div>
      </div>

      <div class="actions">
        <a href="mailto:${inquiry.email}?subject=Re: Inquiry on ${encodeURIComponent(propertyTitle)}" class="btn btn-primary">Reply via Email ✉️</a>
        ${inquiry.phone ? `<a href="tel:${inquiry.phone}" class="btn btn-secondary">Call Customer 📞</a>` : ""}
      </div>
    </div>

    <div class="footer">
      This notification was automatically sent to admin: <strong>${adminEmail}</strong><br>
      © ${new Date().getFullYear()} Bahumukhi Investment Company Pvt. Ltd.
    </div>
  </div>
</body>
</html>
`;

  // 1. Check if Resend API Key is provided (Fastest & most reliable)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.EMAIL_FROM || "Bahumukhi Real Estate <onboarding@resend.dev>";

      const data = await resend.emails.send({
        from: fromAddress,
        to: [adminEmail],
        subject,
        html: htmlContent,
        text: textContent,
        reply_to: inquiry.email,
      });

      console.log(`✅ [EmailService:Resend] Email sent to ${adminEmail}! ID: ${data?.data?.id || JSON.stringify(data)}`);
      return { success: true, id: data?.data?.id, provider: "resend" };
    } catch (resendErr) {
      console.error("❌ [EmailService:Resend] Error sending email:", resendErr.message);
      return { success: false, error: resendErr.message };
    }
  }

  // 2. Check if SMTP credentials exist
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim()?.replace(/\s+/g, "");

  if (user && pass && !pass.startsWith("@")) {
    try {
      const host = process.env.SMTP_HOST || "smtp.gmail.com";
      const port = parseInt(process.env.SMTP_PORT || "465", 10);
      const secure = process.env.SMTP_SECURE === "true" || port === 465;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Bahumukhi Real Estate" <${user}>`,
        to: adminEmail,
        subject,
        text: textContent,
        html: htmlContent,
        replyTo: inquiry.email,
      });

      console.log(`✅ [EmailService:SMTP] Inquiry email sent to ${adminEmail}! MessageID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (smtpErr) {
      console.error("❌ [EmailService:SMTP] Failed to send email via SMTP:", smtpErr.message);
      return { success: false, error: smtpErr.message };
    }
  }

  // 3. Fallback: Ethereal Test Account
  try {
    console.log("ℹ️ [EmailService] Using Ethereal preview mode...");
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await testTransporter.sendMail({
      from: `"Bahumukhi Real Estate" <noreply@bahumukhi.com>`,
      to: adminEmail,
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: inquiry.email,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`🔗 [EmailService Preview URL]: ${previewUrl}`);
    return { success: true, messageId: info.messageId, previewUrl, isTest: true };
  } catch (err) {
    console.error("❌ [EmailService] Fallback error:", err.message);
    return { success: false, error: err.message };
  }
};
