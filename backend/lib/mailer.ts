import nodemailer from "nodemailer";

type SendOtpEmailArgs = {
  to: string;
  otp: string;
  purpose: "email_verification" | "password_reset";
  expiresInMinutes: number;
};

type SendContactEmailArgs = {
  firstName: string;
  lastName: string;
  senderEmail: string;
  message: string;
};

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE;

  if (!user || !pass || !service) {
    throw new Error("Email environment variables are not set (EMAIL_USER/EMAIL_PASS/EMAIL_SERVICE)");
  }

  return nodemailer.createTransport({ service, auth: { user, pass } });
}

export async function sendOtpEmail({ to, otp, purpose, expiresInMinutes }: SendOtpEmailArgs) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is not set");

  const transporter = createTransporter();

  const subject =
    purpose === "email_verification" ? "Your BlogNest OTP" : "Your BlogNest Password Reset OTP";

  const text =
    purpose === "email_verification"
      ? `Your OTP for email verification is: ${otp}\n\nIt expires in ${expiresInMinutes} minutes.`
      : `Your OTP for password reset is: ${otp}\n\nIt expires in ${expiresInMinutes} minutes.`;

  await transporter.sendMail({ from, to, subject, text });
}

export async function sendContactEmail({ firstName, lastName, senderEmail, message }: SendContactEmailArgs) {
  const ownerEmail = process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM;
  if (!ownerEmail || !from) throw new Error("EMAIL_USER or EMAIL_FROM is not set");

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:#1d4ed8;padding:32px 40px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#2563eb;width:40px;height:40px;border-radius:10px;text-align:center;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:22px;font-weight:900;line-height:40px;">B</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="color:#ffffff;font-size:20px;font-weight:700;">BlogNest</span>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#bfdbfe;margin:16px 0 0;font-size:14px;">New Contact Form Submission</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 24px;font-size:22px;color:#111827;">You've got a new message! 📬</h2>

                    <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">From</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${firstName} ${lastName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Reply To</p>
                          <a href="mailto:${senderEmail}" style="margin:0;font-size:15px;color:#2563eb;text-decoration:none;">${senderEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Message</p>
                          <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                        </td>
                      </tr>
                    </table>

                    <a href="mailto:${senderEmail}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:700;">
                      Reply to ${firstName}
                    </a>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">This email was sent from the contact form on your BlogNest platform.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to: ownerEmail,
    replyTo: senderEmail,
    subject: `📬 New Contact Message from ${firstName} ${lastName}`,
    html,
    text: `New contact form message from ${firstName} ${lastName} (${senderEmail}):\n\n${message}`,
  });
}

