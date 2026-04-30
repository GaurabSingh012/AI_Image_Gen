import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter using standard SMTP (Gmail is easiest for dev)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password (not your normal password)
    },
  });

  // Define the email content
  const mailOptions = {
    from: `"VisionAI Security" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // We also use HTML to make it look professional
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5;">VisionAI Password Reset</h2>
        <p>You requested a password reset. Here is your 6-digit authorization code:</p>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
          ${options.otp}
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;