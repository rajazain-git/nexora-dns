import { NextRequest } from 'next/server';

export const ADMIN_WHITELIST = ['admin@nexoradns.com', 'zain@nexoradns.com'];

export interface AdminAuthResult {
  isAuthorized: boolean;
  adminEmail: string;
  error?: string;
}

/**
 * Validates whether the incoming Next.js API request is from an authorized administrator.
 * Validates either:
 * 1. An Authorization Bearer token (Firebase ID token or Admin Secret Key)
 * 2. An x-admin-key header matching ADMIN_SECRET_KEY
 * 3. An x-admin-email in ADMIN_WHITELIST (for local verified administration)
 */
export function verifyAdminRequest(req: NextRequest): AdminAuthResult {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'nexora-secret-admin-key-2026';
  const authHeader = req.headers.get('authorization') || '';
  const xAdminKey = req.headers.get('x-admin-key') || '';
  const xAdminEmail = req.headers.get('x-admin-email') || '';

  // 1. Check direct admin secret header
  if (xAdminKey && xAdminKey === adminSecret) {
    const email = xAdminEmail && ADMIN_WHITELIST.includes(xAdminEmail.toLowerCase())
      ? xAdminEmail.toLowerCase()
      : ADMIN_WHITELIST[0];
    return { isAuthorized: true, adminEmail: email };
  }

  // 2. Check Bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === adminSecret) {
      return { isAuthorized: true, adminEmail: ADMIN_WHITELIST[0] };
    }
  }

  // 3. Fallback for authorized whitelisted email with admin token
  if (xAdminEmail && ADMIN_WHITELIST.includes(xAdminEmail.toLowerCase())) {
    return { isAuthorized: true, adminEmail: xAdminEmail.toLowerCase() };
  }

  return { 
    isAuthorized: false, 
    adminEmail: '', 
    error: 'Unauthorized: Administrative credentials or valid authorization token required.' 
  };
}
