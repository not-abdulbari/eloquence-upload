// Simple authentication utilities for admin dashboard

// In a production environment, you would use a proper authentication system
// This is a simplified version for development purposes

// Store admin credentials. For client-side use we read public env vars so they can
// be configured in `.env.local` during development. These are fallbacks and not
// secure for production — replace with a proper auth system before production.
const ADMIN_USERNAME = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_USERNAME) || 'admin';
const ADMIN_PASSWORD = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_PASSWORD) || 'eloquence25admin';

// Session storage key
const AUTH_TOKEN_KEY = 'eloquence_admin_auth_token';

// Generate a simple token (in production, use JWT or similar)
function generateAuthToken(username: string): string {
  return btoa(`${username}:${Date.now()}`);
}

// Check if the provided credentials are valid
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Login function - returns a token if successful
export function login(username: string, password: string): string | null {
  if (validateCredentials(username, password)) {
    const token = generateAuthToken(username);
    // Store token in session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return token;
  }
  return null;
}

// Logout function
export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!sessionStorage.getItem(AUTH_TOKEN_KEY);
  }
  return false;
}

// Get current auth token
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

// Convenience wrappers used by admin UI components
export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  // In production this would call a secure backend. Here we just validate locally.
  return Promise.resolve(validateCredentials(username, password));
}

export function setAdminSession(username: string): void {
  const token = generateAuthToken(username);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    try {
      sessionStorage.setItem('eloquence_admin_email', username);
    } catch (e) {
      // ignore
    }
  }
}

export function isAdminLoggedIn(): boolean {
  return isAuthenticated();
}

export function clearAdminSession(): void {
  logout();
}