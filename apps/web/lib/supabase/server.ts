import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getSupabasePublicKey, getSupabaseUrl } from '@/lib/supabase/env';

/**
 * Server Components, Server Actions, Route Handlers — uses cookies for session.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublicKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; refresh happens via middleware.
        }
      },
    },
  });
}
