import { API } from './api';
export const tokenKey = 'nv_token';

export async function api<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;
  const res = await fetch(API + path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401 && !path.startsWith('/auth/login')) {
    localStorage.removeItem(tokenKey);
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Request failed');
  return data;
}

/** Uploads an image, returns the stored path (e.g. /uploads/abc.png). */
export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(API + '/upload', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem(tokenKey)}` }, body: fd });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Upload failed');
  return data.path;
}
