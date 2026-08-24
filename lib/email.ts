import nodemailer from "nodemailer";
import { getMilestoneEmailContent, MilestoneEmailData } from "./email-templates/milestone";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Creates nodemailer transporter if SMTP credentials are configured
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

/**
 * Generic email sender function
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || '"Metrik Media Indonesia" <redaksi@metrikmediaindonesia.id>';
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.subject,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("[Email Error] Failed to send email via SMTP:", error);
      throw error;
    }
  }

  // If no SMTP configured, check for Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Metrik Media <redaksi@metrikmediaindonesia.id>",
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Resend error: ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("[Email Error] Failed to send email via Resend:", error);
      throw error;
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Email provider is not configured");
  }

  // Development simulation mode
  console.log(`\n================ [EMAIL SIMULATION (DEV)] ================`);
  console.log(`To: ${options.to}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`(Configure SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY in .env.local to send live emails)`);
  console.log(`==========================================================\n`);

  return { success: true, simulated: true, messageId: `dev-email-${Date.now()}` };
}

/**
 * Sends milestone celebration email to an author
 */
export async function sendAuthorMilestoneEmail(data: MilestoneEmailData) {
  const { subject, html } = getMilestoneEmailContent(data);
  return await sendEmail({
    to: data.authorEmail,
    subject,
    html,
  });
}
