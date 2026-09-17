import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'server-only';

export const getVectorStoreClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server environment.");
  }

  // Uses Service Role Key ONLY for API routes (Server-side)
  return createClient(url, key, {
    auth: { persistSession: false }
  });
};

import { createMockSupabaseClient } from './mockClient';

let _supabaseAdmin: SupabaseClient<any, "public", any> | null = null;

export function getSupabaseAdmin(): SupabaseClient<any, "public", any> {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return createMockSupabaseClient();
  }

  _supabaseAdmin = createClient<any, "public", any>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _supabaseAdmin;
}

export const supabaseAdmin: SupabaseClient<any, "public", any> = new Proxy({} as SupabaseClient<any, "public", any>, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});


