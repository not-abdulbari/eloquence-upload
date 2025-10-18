import { supabase } from './supabase';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyAdminLogin(email: string, password: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('email', email)
    .eq('password_hash', passwordHash)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export function setAdminSession(email: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_logged_in', 'true');
  }
}

export function getAdminSession(): string | null {
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
      return localStorage.getItem('admin_email');
    }
  }
  return null;
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_logged_in');
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
