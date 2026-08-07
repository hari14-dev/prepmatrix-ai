import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = (env.SMTP_USER || '').trim();
  const pass = (env.SMTP_PASS || '').replace(/\s+/g, ''); // strip spaces from app password

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port: env.SMTP_PORT || 465,
      secure: (env.SMTP_PORT || 465) === 465,
      auth: { user, pass }
    });
  }
  return transporter;
}

export async function sendOtpEmail(toEmail, otpCode, fullName) {
  const mailer = getTransporter();

  // If no SMTP credentials configured in .env, log to console for local dev testing
  if (!mailer) {
    console.log(`\n[LOCAL DEV MAILER] Verification code for ${toEmail}: ${otpCode}\n`);
    return { sent: false, dev: true };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0; font-size: 22px;">Verification Code</h2>
      <p style="color: #334155; font-size: 15px;">Hello <strong>${fullName || 'Candidate'}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.5;">
        Thank you for signing up for <strong>PrepMatrix AI</strong>. Use the 6-digit verification code below to complete your account registration:
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; background-color: #f1f5f9; padding: 12px 28px; border-radius: 8px; border: 1px dashed #cbd5e1;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #64748b; font-size: 13px;">
        This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
        PrepMatrix AI — Smart Placement Preparation Platform
      </p>
    </div>
  `;

  try {
    await mailer.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to: toEmail,
      subject: `${otpCode} is your PrepMatrix AI verification code`,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error(`\n[SMTP AUTH ERROR] Invalid Gmail App Password or SMTP credentials in .env.\nError: ${err.message}\nFalling back to local dev verification code: ${otpCode}\n`);
    return { sent: false, dev: true, authError: err.message };
  }
}
