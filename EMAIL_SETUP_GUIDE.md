# Email Service Setup Guide - Nodemailer

This guide explains how to set up the email service for Smart Assistant using Nodemailer.

## 📧 Overview

The email service is configured to send:
- **OTP Emails** - For email verification and password reset
- **Welcome Emails** - When users sign up
- **Password Reset Emails** - For password recovery
- **Password Changed Confirmation** - When password is updated
- **Custom Emails** - For any other notifications

## 🔧 Setup Instructions

### Option 1: Gmail (Recommended for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification"
3. Follow the prompts to enable 2FA

#### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" from the dropdown
3. Select "Windows Computer" (or your device type)
4. Click "Generate"
5. Copy the 16-character password

#### Step 3: Update .env File
```bash
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Paste the 16-character password here
EMAIL_FROM=Smart Assistant <noreply@smartassistant.com>
```

#### Step 4: Test Email Configuration
```bash
npm run test:email
```

---

### Option 2: Outlook/Office365

#### Step 1: Update .env File
```bash
EMAIL_SERVICE=outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=Smart Assistant <noreply@smartassistant.com>
```

#### Step 2: Enable Less Secure Apps (if needed)
1. Go to [Account Security](https://account.microsoft.com/security)
2. Enable "Allow less secure apps"

---

### Option 3: Custom SMTP Server

#### Step 1: Update .env File
```bash
EMAIL_SERVICE=custom
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=Smart Assistant <noreply@smartassistant.com>
```

#### Step 2: Verify SMTP Credentials
Contact your email provider for:
- SMTP Host
- SMTP Port
- Username
- Password
- Security settings (TLS/SSL)

---

## 📋 Email Templates

### 1. OTP Email
**Used for:** Email verification, password reset OTP
**Includes:**
- 6-digit OTP code
- Expiry time (5-10 minutes)
- Security notice
- Instructions

### 2. Password Reset Email
**Used for:** Password recovery
**Includes:**
- Reset link
- Expiry time (30 minutes)
- Security notice
- Instructions

### 3. Welcome Email
**Used for:** New user signup
**Includes:**
- Personalized greeting
- Role-specific features
- Next steps
- Support contact

### 4. Password Changed Email
**Used for:** Password update confirmation
**Includes:**
- Confirmation message
- Security notice
- Recommendations

---

## 🚀 Usage in Code

### Send OTP Email
```javascript
const { sendOTPEmail } = require('./services/emailService');

await sendOTPEmail(
  'user@example.com',
  'John Doe',
  '123456',
  10  // expiry in minutes
);
```

### Send Password Reset Email
```javascript
const { sendPasswordResetEmail } = require('./services/emailService');

await sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  'https://smartassistant.app/reset-password?token=xyz',
  30  // expiry in minutes
);
```

### Send Welcome Email
```javascript
const { sendWelcomeEmail } = require('./services/emailService');

await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'elder'  // role: elder, caregiver, or volunteer
);
```

### Send Password Changed Email
```javascript
const { sendPasswordChangedEmail } = require('./services/emailService');

await sendPasswordChangedEmail(
  'user@example.com',
  'John Doe'
);
```

### Send Custom Email
```javascript
const { sendEmail } = require('./services/emailService');

await sendEmail(
  'user@example.com',
  'Subject Line',
  '<html>Email content here</html>'
);
```

---

## ✅ Verification

### Test Email Configuration
```bash
# Run the email verification test
npm run test:email
```

### Check Email Logs
```bash
# View email sending logs
tail -f logs/app.log | grep "email"
```

### Test Email Sending
```javascript
// In your test file
const { verifyEmailConfiguration } = require('./services/emailService');

const isConfigured = await verifyEmailConfiguration();
console.log('Email service configured:', isConfigured);
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** - Use .env file and add to .gitignore
2. **Use App Passwords** - For Gmail, use app-specific passwords, not your main password
3. **Enable 2FA** - Always enable two-factor authentication on email accounts
4. **Limit permissions** - Use service accounts with minimal permissions
5. **Monitor logs** - Check email sending logs regularly
6. **Rate limiting** - Implement rate limiting to prevent abuse

---

## 🐛 Troubleshooting

### Email Not Sending

**Problem:** "Error: Invalid login"
**Solution:**
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure you're using App Password, not regular password
- Check if 2FA is enabled

**Problem:** "Error: connect ECONNREFUSED"
**Solution:**
- Verify EMAIL_HOST and EMAIL_PORT
- Check if SMTP server is accessible
- Verify firewall settings

**Problem:** "Error: 535 5.7.8 Username and password not accepted"
**Solution:**
- For Gmail: Generate new App Password
- For Outlook: Enable "Allow less secure apps"
- For custom SMTP: Verify credentials with provider

### Emails Going to Spam

**Solution:**
1. Add SPF record to your domain
2. Add DKIM signature
3. Add DMARC policy
4. Use proper "From" address
5. Include unsubscribe link

---

## 📊 Email Service Architecture

```
User Action (Signup, Password Reset, etc.)
        ↓
Controller/Service
        ↓
Email Service (emailService.js)
        ↓
Nodemailer Transporter
        ↓
SMTP Server (Gmail, Outlook, etc.)
        ↓
User's Email Inbox
```

---

## 🔄 Integration with Auth Flow

### Signup Flow
```
1. User submits signup form
2. Create user in database
3. Generate OTP
4. Send OTP email
5. User verifies OTP
6. Send welcome email
7. Account activated
```

### Password Reset Flow
```
1. User clicks "Forgot Password"
2. User enters email
3. Generate reset token
4. Send password reset email
5. User clicks link in email
6. User enters new password
7. Send password changed confirmation email
```

---

## 📈 Monitoring & Analytics

### Email Sending Metrics
- Total emails sent
- Delivery rate
- Bounce rate
- Open rate
- Click rate

### Logs to Monitor
```bash
# View all email logs
grep "email" logs/app.log

# View failed emails
grep "❌" logs/app.log | grep "email"

# View successful emails
grep "✅" logs/app.log | grep "email"
```

---

## 🚀 Production Deployment

### Before Going Live

1. **Use Production Email Account**
   - Create dedicated email account for production
   - Enable 2FA
   - Generate app password

2. **Update Environment Variables**
   - Set EMAIL_USER and EMAIL_PASSWORD
   - Update EMAIL_FROM with production domain
   - Set NODE_ENV=production

3. **Configure DNS Records**
   - Add SPF record
   - Add DKIM record
   - Add DMARC policy

4. **Test Email Delivery**
   - Send test emails to multiple providers
   - Check spam folder
   - Verify email formatting

5. **Set Up Monitoring**
   - Monitor email sending logs
   - Set up alerts for failures
   - Track delivery metrics

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review email service logs
3. Contact your email provider
4. Open an issue on GitHub

---

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Outlook SMTP Settings](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95340)
- [SPF, DKIM, DMARC Guide](https://www.mailgun.com/blog/email/spf-dkim-dmarc-explained/)

---

**Last Updated:** April 2026
**Version:** 1.0
