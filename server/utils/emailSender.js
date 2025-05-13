const { Resend } = require("resend")

const resend = new Resend('re_9ERJ39f8_xPDfFCiJgMXM535RHq9W2i94');

passResetHtml = `
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the button below to continue:</p>
        <a href="{{resetUrl}}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>If you did not request this, please ignore this email. This link will expire in 15 minutes.</p>
        <p style="color: #777;">Thanks,<br/>The RanPick Team</p>
        </div>
    </body>
    </html>
`
function sendPasswordReset(to, resetUrl) {
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: "Password Reset",
        html: passResetHtml.replace("{{resetUrl}}", resetUrl)
    });
}

module.exports = {
    sendPasswordReset
}