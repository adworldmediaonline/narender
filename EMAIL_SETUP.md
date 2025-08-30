# Email Configuration Guide

## Environment Variables Setup

Add these variables to your `.env` file:

### 1. **Ethereal (Development/Testing)**

```bash
EMAIL_PROVIDER=ethereal
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

✅ **Ready to use immediately!**

### 2. **Gmail Setup**

```bash
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

**Gmail Setup Steps:**

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) as `EMAIL_PASSWORD`

### 3. **SMTP Provider Setup**

```bash
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

**Common SMTP Providers:**

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.us-east-1.amazonaws.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`

### 4. **Custom Provider Setup**

```bash
EMAIL_PROVIDER=custom
EMAIL_HOST=mail.your-custom-provider.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_SERVICE=your-service-name
EMAIL_USER=your-custom-username
EMAIL_PASSWORD=your-custom-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

## Quick Start Examples

### Development (Ethereal)

```bash
# Just add this to your .env file
EMAIL_PROVIDER=ethereal
```

### Production (Gmail)

```bash
EMAIL_PROVIDER=gmail
EMAIL_USER=myapp@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # App Password
EMAIL_FROM=noreply@myapp.com
EMAIL_FROM_NAME=My App
```

### Production (SendGrid)

```bash
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@myapp.com
EMAIL_FROM_NAME=My App
```

## Testing Your Setup

After setting up environment variables, test with:

```typescript
import { sendEmail, sendOTPEmail } from '@/lib/send-email';

// Basic email test
await sendEmail(
  'test@example.com',
  'Test Email',
  'This is a test message',
  '<h1>Test</h1><p>This is a test</p>'
);

// OTP Email test (recommended for auth)
await sendOTPEmail(
  'test@example.com',
  'Verify Your Account',
  '123456',
  'Please verify your account with this code',
  {
    appName: 'Your App Name',
    actionText: 'Enter this code to complete verification',
    expiresIn: 10,
    attempts: 3,
  }
);
```

For Ethereal, you'll get a preview URL in the console to view the sent email.

## Security Notes

- Never commit `.env` files to version control
- Use App Passwords for Gmail instead of regular passwords
- Store API keys securely
- Use environment-specific configurations (dev vs production)

## Troubleshooting

**Gmail Issues:**

- Make sure 2FA is enabled
- Use App Password, not regular password
- Check Gmail security settings

**SMTP Issues:**

- Verify host and port with your provider
- Check if SSL/TLS is required
- Ensure credentials are correct

**General Issues:**

- Check console logs for error messages
- Verify environment variables are loaded correctly
- Test with Ethereal first to ensure code works
