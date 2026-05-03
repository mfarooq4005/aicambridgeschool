import { createClient } from '@/lib/supabase/server';
import { MvpCreateSchool } from '@/components/shared/mvp-create-school';

type SchoolRow = {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
};

async function fetchSchools(): Promise<
  { ok: true; data: SchoolRow[] } | { ok: false; reason: string }
> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  try {
    const res = await fetch(`${base}/v1/schools`, { next: { revalidate: 0 } });
    const json: unknown = await res.json();
    if (
      typeof json === 'object' &&
      json !== null &&
      'success' in json &&
      (json as { success: boolean }).success &&
      'data' in json
    ) {
      return { ok: true, data: (json as { data: SchoolRow[] }).data };
    }
    return { ok: false, reason: 'bad_response' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const schools = await fetchSchools();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="flex w-full max-w-lg flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">AI Cambridge School</h1>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          {user ? (
            <>
              Signed in as <strong className="text-foreground">{user.email ?? user.id}</strong>
            </>
          ) : (
            <>
              Not signed in (optional for MVP). Data below uses the <strong>Express API</strong> +
              Postgres.
            </>
          )}
        </p>

        <section className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-card-foreground">
          <h2 className="text-sm font-semibold">Schools (from API)</h2>
          {schools.ok ? (
            <ul className="mt-2 list-inside list-disc text-sm">
              {schools.data.length === 0 ? (
                <li className="text-muted-foreground">No schools yet — create one below.</li>
              ) : (
                schools.data.map((s) => (
                  <li key={s.id}>
                    {s.name}{' '}
                    <span className="text-muted-foreground">
                      ({s.slug}) · {s.city}
                    </span>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-destructive">
              Could not load schools ({schools.reason}). Run{' '}
              <code className="rounded bg-muted px-1 text-xs">npm run api</code> and set{' '}
              <code className="rounded bg-muted px-1 text-xs">DATABASE_URL</code> then{' '}
              <code className="rounded bg-muted px-1 text-xs">
                npm run db:push --workspace=@ai-cambridge-school/database
              </code>
              .
            </p>
          )}
        </section>

        <MvpCreateSchool />

        <p className="max-w-md text-center text-xs text-muted-foreground">
          Full ERP is phased in the context doc — this MVP gets you deployable API + DB + UI loop
          quickly.
        </p>
      </div>
    </main>
  );
}
