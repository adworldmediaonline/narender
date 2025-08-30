'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const formSchema = z.object({
  email: z.email({
    message: 'Invalid email address.',
  }),
});

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.forgetPassword.emailOtp(
      {
        email: values.email,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push(
            `/reset-password?email=${encodeURIComponent(values.email)}`
          );
          setIsLoading(false);
        },
        onError: ctx => {
          setIsLoading(false);
          setError(ctx.error.message);
        },
      }
    );
  }
  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <div className="w-full max-w-md">{error && <p>{error}</p>}</div>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold">
          Forget Password <Link href="/forget-password">Forget Password</Link>
        </h1>
        <p className="text-sm text-muted-foreground">
          Forget password to your account to get started.
        </p>
      </div>
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
