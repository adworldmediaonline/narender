'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '../../../lib/auth-client';

const formSchema = z.object({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  otp: z.string(),
});

// Separate component for the form that uses search params
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      otp: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await authClient.emailOtp.resetPassword(
      {
        email: email || '', // required
        otp: values.otp, // required
        password: values.password, // required
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push('/sign-in');
        },
        onError: ctx => {
          setIsLoading(false);
          setError(ctx.error?.message);
        },
      }
    );
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      </pre>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} type="password" />
              </FormControl>
              <FormDescription>This is your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </Form>
  );
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-10">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
