'use client';

import { createBrowserClient } from '@supabase/ssr';

import { getSupabasePublicKey, getSupabaseUrl } from '@/lib/supabase/env';

/** Client Components — call once per browser context (e.g. in a provider). */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublicKey());
}
