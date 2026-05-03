'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export function MvpCreateSchool() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/v1/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage('School created.');
        setName('');
        setSlug('');
        router.refresh();
      } else {
        setMessage(JSON.stringify(json.error ?? json));
      }
    } catch {
      setMessage('Network error — is the API running? (`npm run api`)');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex w-full max-w-md flex-col gap-2 rounded-lg border border-border p-4 text-left"
    >
      <p className="text-xs font-medium text-muted-foreground">MVP: create school (API + DB)</p>
      <label className="text-sm">
        Name
        <input
          className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          placeholder="Al Qalam Cambridge"
          required
        />
      </label>
      <label className="text-sm">
        Slug (URL-safe)
        <input
          className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
          value={slug}
          onChange={(ev) => setSlug(ev.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="al-qalam"
          required
        />
      </label>
      <Button type="submit" size="sm" disabled={busy}>
        {busy ? 'Saving…' : 'Create school'}
      </Button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </form>
  );
}
