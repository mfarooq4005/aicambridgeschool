import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold text-foreground">AI Cambridge School</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {user ? (
          <>
            Signed in as <strong className="text-foreground">{user.email ?? user.id}</strong>
          </>
        ) : (
          <>
            Not signed in. Supabase session refresh runs via{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">middleware.ts</code> — add login
            UI (M01) next.
          </>
        )}
      </p>
    </main>
  );
}
