export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export const ORIGIN = API.replace(/\/api\/?$/, '');

/** Uploaded files are stored as /uploads/xxx — resolve them against the API server. */
export const img = (src?: string, fallback = '') => {
  if (!src) return fallback;
  return src.startsWith('/uploads') ? ORIGIN + src : src;
};

/** Server-side GET with a safe fallback (site still renders if API is down). */
export async function get<T = any>(path: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(API + path, { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()) as T;
  } catch {
    return fallback;
  }
}
