import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/store-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, platform } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please provide a valid coupon code.' }, { status: 400 });
    }

    const subtotalPKR = Number(body.subtotal ?? body.subtotalPKR) || 0;
    const result = validateCoupon(code, subtotalPKR, platform);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon code.' }, { status: 500 });
  }
}
