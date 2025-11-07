const nodemailer = require('nodemailer');

exports.emailSender = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mohamed.hassa3nnn@gmail.com',
        pass: 'ihtu cfey zspv aoui',
      },
    });
    await transporter.sendMail({
      to,
      subject,
      html,
    });
    console.log('Email sent successfully ✅');
  } catch (error) {
    console.error('Error sending email ❌', error);
  }
};
exports.templates = {
  resetPassword: (resetUrl) => `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:8px;">
      <h2 style="color:#333; text-align:center;">Reset Your Password</h2>

      <p style="font-size:15px; color:#555;">
        We received a request to reset your password. Click the button below to proceed.
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a href="${resetUrl}" 
           style="background:#007bff; color:#fff; padding:12px 18px; border-radius:6px; text-decoration:none; font-size:16px;">
          Reset Password
        </a>
      </div>

      <p style="margin-top:30px; font-size:14px; color:#777;">
        If you did not request a password reset, you can safely ignore this message.
      </p>

      <hr style="border:none; border-bottom:1px solid #ddd; margin-top:30px;" />

      <p style="text-align:center; font-size:13px; color:#999;">
        © ${new Date().getFullYear()} Your Company Name
      </p>
    </div>
  `,

  welcome: (name) => `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#ffffff; border-radius:8px;">
      <h1 style="color:#333; text-align:center;">Welcome, ${name} 🎉</h1>

      <p style="font-size:15px; color:#555; text-align:center;">
        We're excited to have you with us! Get ready for a great experience.
      </p>

      <hr style="border:none; border-bottom:1px solid #ddd; margin-top:30px;" />

      <p style="text-align:center; font-size:13px; color:#999;">
        © ${new Date().getFullYear()} Your Company Name
      </p>
    </div>
  `,
};
