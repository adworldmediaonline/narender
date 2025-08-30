import nodemailer, { SentMessageInfo } from 'nodemailer';

// Types for different email configurations
export interface EmailConfig {
  provider: 'gmail' | 'smtp' | 'ethereal' | 'custom';
  from?: string;
  fromName?: string;
}

export interface GmailConfig extends EmailConfig {
  provider: 'gmail';
  user: string;
  pass: string;
}

export interface SmtpConfig extends EmailConfig {
  provider: 'smtp';
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
}

export interface EtherealConfig extends EmailConfig {
  provider: 'ethereal';
}

export interface CustomConfig extends EmailConfig {
  provider: 'custom';
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  service?: string;
}

export type EmailProviderConfig =
  | GmailConfig
  | SmtpConfig
  | EtherealConfig
  | CustomConfig;

// Default configuration using environment variables
const getDefaultConfig = (): EmailProviderConfig => {
  const provider = (process.env.EMAIL_PROVIDER ||
    'ethereal') as EmailConfig['provider'];

  switch (provider) {
    case 'gmail':
      return {
        provider: 'gmail',
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME || 'App',
      } as GmailConfig;

    case 'smtp':
      return {
        provider: 'smtp',
        host: process.env.EMAIL_HOST!,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME || 'App',
      } as SmtpConfig;

    case 'custom':
      return {
        provider: 'custom',
        host: process.env.EMAIL_HOST!,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
        service: process.env.EMAIL_SERVICE,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME || 'App',
      } as CustomConfig;

    case 'ethereal':
    default:
      return {
        provider: 'ethereal',
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME || 'Test App',
      } as EtherealConfig;
  }
};

// Create transporter based on configuration
const createTransporter = async (config: EmailProviderConfig) => {
  switch (config.provider) {
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

    case 'smtp':
      return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure || false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

    case 'custom':
      const customTransport: Record<string, unknown> = {
        host: config.host,
        port: config.port,
        secure: config.secure || false,
      };

      if (config.service) {
        customTransport.service = config.service;
      }

      if (config.user && config.pass) {
        customTransport.auth = {
          user: config.user,
          pass: config.pass,
        };
      }

      return nodemailer.createTransport(customTransport);

    case 'ethereal':
    default:
      // Create a test account for Ethereal
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
  }
};

// Main sendEmail function with optional configuration
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  config?: Partial<EmailProviderConfig>
) => {
  // Merge provided config with defaults
  const finalConfig: EmailProviderConfig = {
    ...getDefaultConfig(),
    ...config,
  } as EmailProviderConfig;

  // Create transporter
  const transporter = await createTransporter(finalConfig);

  // Determine from address
  let fromAddress: string;
  if (finalConfig.from) {
    fromAddress = finalConfig.fromName
      ? `"${finalConfig.fromName}" <${finalConfig.from}>`
      : finalConfig.from;
  } else if (finalConfig.provider === 'ethereal') {
    // For Ethereal, we need to get the test account user
    const testAccount = await nodemailer.createTestAccount();
    fromAddress = finalConfig.fromName
      ? `"${finalConfig.fromName}" <${testAccount.user}>`
      : testAccount.user;
  } else {
    throw new Error('From address is required for non-Ethereal providers');
  }

  // Send email
  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    ...(html && { html }),
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);

  // Log preview URL for Ethereal
  if (finalConfig.provider === 'ethereal') {
    const previewUrl = nodemailer.getTestMessageUrl(info as SentMessageInfo);
    console.log('Preview URL: %s', previewUrl);
    return {
      messageId: info.messageId,
      previewUrl,
      provider: finalConfig.provider,
    };
  }

  return {
    messageId: info.messageId,
    provider: finalConfig.provider,
  };
};

// Convenience functions for specific providers
export const sendGmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  user?: string,
  pass?: string
) => {
  const config: Partial<GmailConfig> = {
    provider: 'gmail',
    user: user || process.env.EMAIL_USER!,
    pass: pass || process.env.EMAIL_PASSWORD!,
  };
  return sendEmail(to, subject, text, html, config);
};

export const sendSmtp = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  host?: string,
  port?: number,
  user?: string,
  pass?: string
) => {
  const config: Partial<SmtpConfig> = {
    provider: 'smtp',
    host: host || process.env.EMAIL_HOST!,
    port: port || parseInt(process.env.EMAIL_PORT || '587'),
    user: user || process.env.EMAIL_USER!,
    pass: pass || process.env.EMAIL_PASSWORD!,
  };
  return sendEmail(to, subject, text, html, config);
};

export const sendEthereal = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const config: Partial<EtherealConfig> = {
    provider: 'ethereal',
  };
  return sendEmail(to, subject, text, html, config);
};

// Reusable HTML templates for common email types
export interface EmailTemplateOptions {
  appName?: string;
  otp?: string;
  message?: string;
  actionText?: string;
  footerText?: string;
  expiresIn?: number;
  attempts?: number;
}

export const createOTPEmailTemplate = ({
  appName = 'Your App',
  otp,
  message,
  actionText = 'Enter this code on the verification page to complete your account setup.',
  footerText,
  expiresIn = 10,
  attempts = 3,
}: EmailTemplateOptions) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${appName}!</h2>
      <p>${message}:</p>
      ${
        otp
          ? `
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 8px; border: 2px dashed #007bff;">
        ${otp}
      </div>
      `
          : ''
      }
      <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #1976d2;"><strong>⏰ This code will expire in ${expiresIn} minutes</strong></p>
        <p style="margin: 5px 0 0 0; color: #1976d2;">🔄 You have ${attempts} attempts to enter the correct code</p>
      </div>
      <p>${actionText}</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        ${
          footerText ||
          `This is an automated message from ${appName}. Please do not reply to this email.`
        }
      </p>
    </div>
  `;
};

// Convenience function for sending OTP emails
export const sendOTPEmail = async (
  to: string,
  subject: string,
  otp: string,
  message: string,
  options?: Partial<EmailTemplateOptions>
) => {
  const html = createOTPEmailTemplate({
    otp,
    message,
    ...options,
  });

  return sendEmail(to, subject, '', html);
};
