import { createClient } from "../supabase/client";

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers || {});
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  headers.set("Content-Type", "application/json");

  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const apiClient = {
  get: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body: any, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: "DELETE" }),
};
