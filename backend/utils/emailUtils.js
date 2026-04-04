// ============================================================
// utils/emailUtils.js - Email Sending Utility (Nodemailer)
// Handles OTP emails for verification and password reset
// ============================================================

const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ============================================================
// createTransporter - Creates Nodemailer SMTP transporter
// Uses Gmail SMTP (configure in .env for other providers)
// ============================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // Use TLS (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER, // Gmail address
      pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
    },
  });
};

// ============================================================
// generateOTP - Generates a 6-digit numeric OTP
// @returns {string} 6-digit OTP string
// ============================================================
const generateOTP = () => {
  // Generate cryptographically secure random 6-digit number
  return crypto.randomInt(100000, 999999).toString();
};

// ============================================================
// getOTPExpiry - Returns OTP expiry timestamp
// @returns {Date} Expiry date (10 minutes from now)
// ============================================================
const getOTPExpiry = () => {
  const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES) || 10;
  return new Date(Date.now() + expireMinutes * 60 * 1000); // 10 minutes from now
};

// ============================================================
// sendOTPEmail - Sends OTP email to user
// @param {string} email - Recipient email address
// @param {string} otp - The 6-digit OTP
// @param {string} purpose - "verification" or "password-reset"
// @param {string} name - Recipient's name
// ============================================================
const sendOTPEmail = async (email, otp, purpose = "verification", name = "User") => {
  const transporter = createTransporter();

  // Set email subject based on purpose
  const subject =
    purpose === "password-reset"
      ? "Smart Assistant - Password Reset OTP"
      : "Smart Assistant - Email Verification OTP";

  // Set email body message based on purpose
  const purposeText =
    purpose === "password-reset"
      ? "You requested to reset your password."
      : "Please verify your email address to complete registration.";

  // HTML email template (senior-friendly large text)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">🏥 Smart Assistant</h1>
          <p style="color: #666; font-size: 16px;">For Senior Citizens</p>
        </div>

        <!-- Greeting -->
        <p style="font-size: 20px; color: #333; margin-bottom: 10px;">Dear ${name},</p>
        <p style="font-size: 18px; color: #555; line-height: 1.6;">${purposeText}</p>

        <!-- OTP Box -->
        <div style="background-color: #1a1a2e; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="color: #aaa; font-size: 16px; margin: 0 0 10px 0;">Your One-Time Password (OTP)</p>
          <h2 style="color: #ffffff; font-size: 48px; letter-spacing: 10px; margin: 0; font-weight: bold;">${otp}</h2>
          <p style="color: #aaa; font-size: 14px; margin: 15px 0 0 0;">⏰ This OTP expires in 10 minutes</p>
        </div>

        <!-- Warning -->
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="color: #856404; font-size: 16px; margin: 0;">
            ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. 
            Smart Assistant will never ask for your OTP via phone or email.
          </p>
        </div>

        <!-- Footer -->
        <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email or contact support immediately.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">
          Smart Assistant for Senior Citizens | SZABIST University, Islamabad
        </p>
      </div>
    </body>
    </html>
  `;

  // Send the email
  const mailOptions = {
    from: process.env.EMAIL_FROM || "Smart Assistant <noreply@smartassistant.com>",
    to: email,
    subject: subject,
    html: htmlContent,
    text: `Your OTP is: ${otp}. It expires in 10 minutes. Do not share this with anyone.`, // Plain text fallback
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to: ${email} (Purpose: ${purpose})`);
};

module.exports = { generateOTP, getOTPExpiry, sendOTPEmail };
