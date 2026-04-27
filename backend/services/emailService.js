// ============================================================
// services/emailService.js - Email Service
// Handles sending emails for OTP, password reset, verification
// ============================================================

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP email for password reset
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @returns {Promise<boolean>} - True if email sent successfully
 */
const sendPasswordResetOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Smart Assistant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Smart Assistant</h1>
            <p style="margin: 5px 0 0 0;">Senior Care Platform</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1C382A; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #666; font-size: 14px;">
              We received a request to reset your password. Use the OTP below to proceed:
            </p>
            
            <div style="background-color: white; border: 2px solid #52b788; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666;">Your OTP:</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #1C382A; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              <strong>⏱️ This OTP will expire in 5 minutes.</strong>
            </p>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              If you didn't request this password reset, please ignore this email or contact our support team immediately.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 11px; margin: 0;">
              © 2025 Smart Assistant. All rights reserved.<br>
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending password reset OTP to ${email}:`, error);
    return false;
  }
};

/**
 * Send email verification OTP
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @returns {Promise<boolean>} - True if email sent successfully
 */
const sendVerificationOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Smart Assistant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Smart Assistant</h1>
            <p style="margin: 5px 0 0 0;">Senior Care Platform</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1C382A; margin-top: 0;">Welcome to Smart Assistant!</h2>
            
            <p style="color: #666; font-size: 14px;">
              Thank you for signing up. Please verify your email address using the OTP below:
            </p>
            
            <div style="background-color: white; border: 2px solid #52b788; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666;">Your Verification OTP:</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #1C382A; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              <strong>⏱️ This OTP will expire in 10 minutes.</strong>
            </p>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              If you didn't create this account, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 11px; margin: 0;">
              © 2025 Smart Assistant. All rights reserved.<br>
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending verification OTP to ${email}:`, error);
    return false;
  }
};

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} fullName - User's full name
 * @returns {Promise<boolean>} - True if email sent successfully
 */
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Smart Assistant!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Smart Assistant</h1>
            <p style="margin: 5px 0 0 0;">Senior Care Platform</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1C382A; margin-top: 0;">Welcome, ${fullName}!</h2>
            
            <p style="color: #666; font-size: 14px;">
              Your account has been successfully created and verified. You can now log in to Smart Assistant and start using our services.
            </p>
            
            <div style="background-color: white; border-left: 4px solid #52b788; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1C382A; font-weight: bold;">What's Next?</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666; font-size: 12px;">
                <li>Complete your profile</li>
                <li>Set up emergency contacts</li>
                <li>Enable location sharing (optional)</li>
                <li>Explore our features</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              If you have any questions or need assistance, please contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 11px; margin: 0;">
              © 2025 Smart Assistant. All rights reserved.<br>
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${email}:`, error);
    return false;
  }
};

/**
 * Send password changed confirmation email
 * @param {string} email - Recipient email
 * @param {string} fullName - User's full name
 * @returns {Promise<boolean>} - True if email sent successfully
 */
const sendPasswordChangedEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Changed - Smart Assistant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1C382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Smart Assistant</h1>
            <p style="margin: 5px 0 0 0;">Senior Care Platform</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1C382A; margin-top: 0;">Password Changed Successfully</h2>
            
            <p style="color: #666; font-size: 14px;">
              Dear ${fullName},
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Your password has been successfully changed. You can now log in with your new password.
            </p>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Security Notice</p>
              <p style="margin: 10px 0 0 0; color: #856404; font-size: 12px;">
                If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin: 20px 0;">
              For security reasons, you may need to log in again on your devices.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 11px; margin: 0;">
              © 2025 Smart Assistant. All rights reserved.<br>
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password changed email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending password changed email to ${email}:`, error);
    return false;
  }
};

module.exports = {
  sendPasswordResetOTPEmail,
  sendVerificationOTPEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
};
