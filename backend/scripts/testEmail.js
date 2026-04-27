#!/usr/bin/env node

// ============================================================
// scripts/testEmail.js - Email Configuration Test
// Tests the email service configuration
// ============================================================

require('dotenv').config();
const { verifyEmailConfiguration, sendOTPEmail } = require('../services/emailService');

const testEmail = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('📧 Smart Assistant - Email Service Test');
  console.log('='.repeat(60) + '\n');

  // ============================================================
  // Step 1: Check Environment Variables
  // ============================================================
  console.log('📋 Checking Environment Variables...\n');

  const requiredEnvVars = [
    'EMAIL_SERVICE',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
  ];

  let allEnvVarsSet = true;
  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar];
    if (value) {
      const maskedValue = envVar === 'EMAIL_PASSWORD' 
        ? '*'.repeat(value.length) 
        : value;
      console.log(`✅ ${envVar}: ${maskedValue}`);
    } else {
      console.log(`❌ ${envVar}: NOT SET`);
      allEnvVarsSet = false;
    }
  });

  if (!allEnvVarsSet) {
    console.log('\n⚠️  Some environment variables are not set.');
    console.log('Please update your .env file with the required values.\n');
    process.exit(1);
  }

  // ============================================================
  // Step 2: Verify Email Configuration
  // ============================================================
  console.log('\n📡 Verifying Email Configuration...\n');

  try {
    const isConfigured = await verifyEmailConfiguration();
    
    if (isConfigured) {
      console.log('✅ Email service is configured correctly!\n');
    } else {
      console.log('❌ Email service configuration failed.\n');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Error verifying email configuration:', error.message, '\n');
    process.exit(1);
  }

  // ============================================================
  // Step 3: Send Test Email
  // ============================================================
  console.log('📤 Sending Test Email...\n');

  const testEmailAddress = process.env.EMAIL_USER;
  const testOTP = '123456';

  try {
    const result = await sendOTPEmail(
      testEmailAddress,
      'Test User',
      testOTP,
      10
    );

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log(`📧 Email sent to: ${testEmailAddress}`);
      console.log(`📨 Message ID: ${result.messageId}\n`);
    } else {
      console.log('❌ Failed to send test email:', result.message, '\n');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Error sending test email:', error.message, '\n');
    process.exit(1);
  }

  // ============================================================
  // Step 4: Summary
  // ============================================================
  console.log('='.repeat(60));
  console.log('✅ Email Service Test Completed Successfully!');
  console.log('='.repeat(60) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Check your email inbox for the test email');
  console.log('2. Verify that the email formatting looks correct');
  console.log('3. Check spam folder if email is not in inbox');
  console.log('4. Update .env with your actual email credentials\n');

  console.log('📚 For more information, see EMAIL_SETUP_GUIDE.md\n');

  process.exit(0);
};

// Run the test
testEmail().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
