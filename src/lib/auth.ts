import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';

import prisma from './prisma';
import { sendOTPEmail } from './send-email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
        defaultValue: 'user',
        required: false,
      },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      allowedAttempts: 3,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {
        try {
          let subject = '';
          let message = '';
          let actionText = '';

          // Configure email based on type
          switch (type) {
            case 'sign-in':
              subject = 'Sign in to your account';
              message = 'Use this code to sign in to your account';
              actionText =
                'Enter this code on the sign-in page to access your account.';
              break;

            case 'email-verification':
              subject = 'Verify your email address';
              message =
                'Welcome! Please verify your email address with this code';
              actionText =
                'Enter this code on the verification page to complete your account setup.';
              break;

            case 'forget-password':
              subject = 'Reset your password';
              message = 'Use this code to reset your password';
              actionText =
                'Enter this code on the password reset page to create a new password.';
              break;

            default:
              subject = 'Verification code';
              message = 'Use this verification code';
              actionText =
                'Enter this code to complete the verification process.';
          }

          // Send email using reusable template
          await sendOTPEmail(email, subject, otp, message, {
            appName: 'Jimmy',
            actionText,
            footerText:
              'This is an automated message from Jimmy App. Please do not reply to this email.',
            expiresIn: 10,
            attempts: 3,
          });

          console.log('✅ OTP EMAIL COMPLETED!');
        } catch (error) {
          console.error('❌ OTP EMAIL FAILED:', error);
          throw error;
        }
      },
    }),
  ],
});
