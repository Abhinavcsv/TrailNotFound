import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL =
  process.env.SMTP_FROM || process.env.SMTP_USER;

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const APP_NAME = "TrailNotFound";

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${APP_NAME}</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #f8fafc;
  font-family: Arial, Helvetica, sans-serif;
  color: #0f172a;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f8fafc;"
  >
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border:1px solid #e2e8f0;
            border-radius:16px;
            overflow:hidden;
          "
        >

          <!-- BRAND -->
          <tr>
            <td
              style="
                padding:26px 32px;
                border-bottom:1px solid #f1f5f9;
              "
            >
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>

                  <td
                    style="
                      width:40px;
                      height:40px;
                      background:#2563eb;
                      border-radius:11px;
                      text-align:center;
                      vertical-align:middle;
                    "
                  >
                    <span
                      style="
                        color:#ffffff;
                        font-size:20px;
                        line-height:40px;
                      "
                    >
                      ▲
                    </span>
                  </td>

                  <td style="padding-left:10px;">
                    <span
                      style="
                        color:#0f172a;
                        font-size:19px;
                        font-weight:800;
                        letter-spacing:-0.4px;
                      "
                    >
                      TrailNotFound
                    </span>
                  </td>

                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="
                padding:22px 32px;
                border-top:1px solid #f1f5f9;
                background:#fafafa;
              "
            >
              <p
                style="
                  margin:0;
                  color:#94a3b8;
                  font-size:12px;
                  line-height:20px;
                  text-align:center;
                "
              >
                © ${new Date().getFullYear()} TrailNotFound
              </p>

              <p
                style="
                  margin:4px 0 0;
                  color:#cbd5e1;
                  font-size:11px;
                  text-align:center;
                "
              >
                Your journey starts here.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}


/* =========================================================
   PASSWORD RESET OTP
========================================================= */

export async function sendPasswordResetOTP(
  email: string,
  otp: string
) {
  const html = emailLayout(`
    <p
      style="
        margin:0 0 8px;
        color:#2563eb;
        font-size:13px;
        font-weight:700;
      "
    >
      Password reset
    </p>

    <h1
      style="
        margin:0;
        color:#0f172a;
        font-size:30px;
        line-height:38px;
        font-weight:800;
        letter-spacing:-0.8px;
      "
    >
      Verify your identity
    </h1>

    <p
      style="
        margin:14px 0 30px;
        color:#64748b;
        font-size:14px;
        line-height:24px;
      "
    >
      We received a request to reset the password
      for your TrailNotFound account.
    </p>

    <p
      style="
        margin:0 0 10px;
        color:#334155;
        font-size:13px;
        font-weight:700;
      "
    >
      Your verification code
    </p>

    <!-- OTP -->
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
    >
      <tr>
        <td
          align="center"
          style="
            padding:22px 10px;
            background:#eff6ff;
            border:1px solid #dbeafe;
            border-radius:12px;
          "
        >
          <span
            style="
              color:#2563eb;
              font-size:32px;
              font-weight:800;
              letter-spacing:9px;
            "
          >
            ${otp}
          </span>
        </td>
      </tr>
    </table>

    <div style="height:24px;"></div>

    <p
      style="
        margin:0;
        padding:14px 16px;
        background:#f8fafc;
        border-radius:10px;
        color:#64748b;
        font-size:13px;
        line-height:21px;
      "
    >
      This code will expire in
      <strong style="color:#0f172a;">
        10 minutes
      </strong>.
    </p>

    <p
      style="
        margin:24px 0 0;
        color:#64748b;
        font-size:13px;
        line-height:21px;
      "
    >
      For your security, don't share this code
      with anyone. TrailNotFound will never ask
      you for your OTP.
    </p>

    <p
      style="
        margin:18px 0 0;
        color:#94a3b8;
        font-size:12px;
        line-height:20px;
      "
    >
      If you didn't request a password reset,
      you can safely ignore this email.
    </p>
  `);

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,

    subject: "Your TrailNotFound verification code",

    text: `
TrailNotFound

Verify your identity

Your password reset verification code is:

${otp}

This code will expire in 10 minutes.

For your security, don't share this code with anyone.

If you didn't request a password reset,
you can safely ignore this email.

© ${new Date().getFullYear()} TrailNotFound
    `.trim(),

    html,
  });
}


/* =========================================================
   WELCOME EMAIL
========================================================= */

export async function sendWelcomeEmail(
  email: string,
  name?: string | null
) {
  const displayName =
    name?.trim() || "Explorer";

  const html = emailLayout(`
    <p
      style="
        margin:0 0 8px;
        color:#2563eb;
        font-size:13px;
        font-weight:700;
      "
    >
      Welcome aboard
    </p>

    <h1
      style="
        margin:0;
        color:#0f172a;
        font-size:30px;
        line-height:38px;
        font-weight:800;
        letter-spacing:-0.8px;
      "
    >
      Welcome to TrailNotFound, ${displayName} 👋
    </h1>

    <p
      style="
        margin:16px 0 0;
        color:#64748b;
        font-size:14px;
        line-height:24px;
      "
    >
      Your journey starts here.
      Discover places worth getting lost in,
      plan unforgettable trips and find the
      hidden gems that others miss.
    </p>

    <!-- Quote -->
    <div
      style="
        margin:30px 0;
        padding:20px;
        border-left:3px solid #2563eb;
        background:#f8fafc;
      "
    >
      <p
        style="
          margin:0;
          color:#334155;
          font-size:15px;
          line-height:24px;
          font-weight:600;
        "
      >
        “Not every great destination is on the map.”
      </p>
    </div>

    <!-- Features -->
    <p
      style="
        margin:0 0 14px;
        color:#0f172a;
        font-size:14px;
        font-weight:700;
      "
    >
      What's waiting for you
    </p>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
    >

      <tr>
        <td
          style="
            padding:10px 0;
            color:#475569;
            font-size:13px;
          "
        >
          🗺️ &nbsp; Discover new destinations
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#475569;
            font-size:13px;
          "
        >
          💎 &nbsp; Find hidden gems
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#475569;
            font-size:13px;
          "
        >
          🧭 &nbsp; Plan your next adventure
        </td>
      </tr>

    </table>

    <!-- CTA -->
    <div
      style="
        margin:32px 0 8px;
        text-align:center;
      "
    >
      <a
        href="${APP_URL}"
        style="
          display:inline-block;
          padding:14px 24px;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:10px;
          font-size:14px;
          font-weight:700;
        "
      >
        Start exploring →
      </a>
    </div>

    <p
      style="
        margin:24px 0 0;
        color:#94a3b8;
        font-size:12px;
        line-height:20px;
      "
    >
      You received this email because a
      TrailNotFound account was created using
      this email address.
    </p>
  `);

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,

    subject: "Welcome to TrailNotFound 🏔️",

    text: `
Welcome to TrailNotFound, ${displayName}!

Your journey starts here.

Discover places worth getting lost in,
plan unforgettable trips and find hidden gems.

Start exploring:
${APP_URL}

© ${new Date().getFullYear()} TrailNotFound
    `.trim(),

    html,
  });
}