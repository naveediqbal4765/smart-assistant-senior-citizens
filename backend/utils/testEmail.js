// ============================================================
// utils/testEmail.js - Test Email Configuration
// Run: node backend/utils/testEmail.js
// ============================================================

const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });

const testEmailConfig = async () => {
  console.log("\n🧪 Testing Email Configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET"}`);
  console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env");
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Test connection
  console.log("\n🔗 Testing SMTP Connection...");
  try {
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!");
  } catch (error) {
    console.log("❌ SMTP Connection Failed!");
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  }

  // Send test email
  console.log("\n📧 Sending Test Email...");
  try {
    const testEmail = process.env.EMAIL_USER; // Send to self
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Smart Assistant <noreply@smartassistant.com>",
      to: testEmail,
      subject: "Smart Assistant - Email Configuration Test",
      html: `
        <h2>Email Configuration Test</h2>
        <p>If you received this email, your email configuration is working correctly!</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>From: ${process.env.EMAIL_FROM}</li>
          <li>To: ${testEmail}</li>
          <li>Time: ${new Date().toLocaleString()}</li>
        </ul>
      `,
      text: "Email configuration test successful!",
    });

    console.log("✅ Test Email Sent Successfully!");
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   To: ${testEmail}`);
    console.log("\n📝 Check your email inbox (and spam folder) for the test email.");
  } catch (error) {
    console.log("❌ Failed to Send Test Email!");
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  }

  console.log("\n✅ Email Configuration Test Complete!\n");
};

testEmailConfig();
