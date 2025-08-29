'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function Page() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <h1>Dashboard Home Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button onClick={() => refetch()}>Refetch</Button>
    </div>
  );
}
