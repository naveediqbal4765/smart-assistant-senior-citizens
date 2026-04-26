// ============================================================
// backend/src/utils/emailService.js - Email Service for OTP
// ============================================================

const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP to user email
 * @param {string} email - User email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPEmail = async (email, otp) => {
  try {
    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Smart Assistant for Senior Citizens</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset Request</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="color: #333; font-size: 14px; margin-bottom: 20px;">
            We received a request to reset your password. Use the code below to proceed:
          </p>
          
          <div style="background-color: white; border: 2px solid #52b788; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">Your OTP Code</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #1C382A; letter-spacing: 5px;">
              ${otp}
            </p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 20px 0;">
            This code will expire in 5 minutes.
          </p>
          
          <p style="color: #666; font-size: 12px; margin: 20px 0;">
            If you did not request a password reset, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
            © 2026 Smart Assistant for Senior Citizens. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - OTP Code',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send password reset confirmation email
 * @param {string} email - User email address
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetConfirmation = async (email) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Smart Assistant for Senior Citizens</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset Successful</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="color: #333; font-size: 14px; margin-bottom: 20px;">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">✓ Password Reset Complete</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 20px 0;">
            If you did not reset your password, please contact support immediately.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
            © 2026 Smart Assistant for Senior Citizens. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetConfirmation,
};
