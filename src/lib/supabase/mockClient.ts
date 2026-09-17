/* eslint-disable @typescript-eslint/no-explicit-any */
import { MOCK_USER, MOCK_BRAND_PROFILE, MOCK_CREATORS, MOCK_CAMPAIGNS } from "../mock/data";

function createMockQueryBuilder(table: string) {
  let tableData: any[] = [];
  if (table === "creator_profiles") tableData = [...MOCK_CREATORS];
  else if (table === "campaigns") tableData = [...MOCK_CAMPAIGNS];
  else if (table === "brand_profiles" || table === "profiles") tableData = [{ ...MOCK_BRAND_PROFILE }];
  else tableData = [];

  const builder: any = {
    _data: tableData,
    select: (_cols?: string) => builder,
    order: (_col?: string, _opts?: any) => builder,
    limit: (n: number) => {
      builder._data = builder._data.slice(0, n);
      return builder;
    },
    eq: (col: string, val: any) => {
      builder._data = builder._data.filter((item: any) => item[col] === val || item[col] === undefined);
      return builder;
    },
    in: (col: string, vals: any[]) => {
      builder._data = builder._data.filter((item: any) => vals.includes(item[col]));
      return builder;
    },
    single: async () => ({
      data: builder._data[0] || (table === "brand_profiles" ? { ...MOCK_BRAND_PROFILE } : null),
      error: null,
    }),
    maybeSingle: async () => ({
      data: builder._data[0] || (table === "brand_profiles" ? { ...MOCK_BRAND_PROFILE } : null),
      error: null,
    }),
    insert: async (records: any) => {
      const items = Array.isArray(records) ? records : [records];
      const inserted = items.map((r, i) => ({ id: `mock-ins-${Date.now()}-${i}`, ...r, created_at: new Date().toISOString() }));
      return {
        data: Array.isArray(records) ? inserted : inserted[0],
        error: null,
        select: (_s?: string) => ({
          single: async () => ({ data: inserted[0], error: null }),
          data: Array.isArray(records) ? inserted : inserted[0],
          error: null
        })
      };
    },
    update: async (updates: any) => ({
      data: { ...(builder._data[0] || {}), ...updates },
      error: null,
      eq: (_c: string, _v: any) => ({
        data: { ...(builder._data[0] || {}), ...updates },
        error: null,
      }),
    }),
    upsert: async (records: any) => ({
      data: records,
      error: null,
    }),
    delete: () => builder,
    then: (resolve: (res: any) => void) => resolve({ data: builder._data, error: null, count: builder._data.length }),
  };

  return builder;
}

export function createMockSupabaseClient(): any {
  return {
    auth: {
      getUser: async () => ({
        data: { user: MOCK_USER },
        error: null,
      }),
      getSession: async () => ({
        data: { session: { user: MOCK_USER, access_token: "mock-token" } },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: MOCK_USER, session: { user: MOCK_USER } },
        error: null,
      }),
      signInWithOAuth: async () => {
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard";
        }
        return { data: {}, error: null };
      },
      signInWithOtp: async () => ({
        data: {},
        error: null,
      }),
      verifyOtp: async () => ({
        data: { user: MOCK_USER, session: { user: MOCK_USER } },
        error: null,
      }),
      signUp: async () => ({
        data: { user: MOCK_USER, session: { user: MOCK_USER } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Trigger with initial mock session
        try {
          callback("SIGNED_IN", { user: MOCK_USER });
        } catch {}
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
    from: (table: string) => createMockQueryBuilder(table),
    storage: {
      from: () => ({
        upload: async (_path: string, _file: any) => ({ data: { path: `mock/path/${Date.now()}` }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300` } }),
      }),
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({ unsubscribe: () => {} }),
      }),
      subscribe: () => {},
      unsubscribe: () => {},
    }),
  };
}
