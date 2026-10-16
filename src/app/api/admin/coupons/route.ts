import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getStoredCoupons, saveCoupon, deleteCoupon } from '@/lib/store-db';
import { Coupon } from '@/types';

export async function GET(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const coupons = getStoredCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const coupon: Coupon = await req.json();

    if (!coupon.code || !coupon.code.trim()) {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    coupon.code = coupon.code.trim().toUpperCase();

    if (coupon.discountPercentage < 0 || coupon.discountPercentage > 100) {
      return NextResponse.json({ error: 'Discount percentage must be between 0 and 100.' }, { status: 400 });
    }

    saveCoupon(coupon, auth.adminEmail);
    return NextResponse.json({ success: true, coupon, message: 'Coupon saved successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const deleted = deleteCoupon(code, auth.adminEmail);
    if (!deleted) {
      return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
