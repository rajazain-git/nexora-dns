import { NextRequest, NextResponse } from 'next/server';
import { generateLicenseKey } from '@/lib/store-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, productId } = body;

    if (!orderId || !productId) {
      return NextResponse.json({ error: 'orderId and productId are required.' }, { status: 400 });
    }

    const licenseKey = generateLicenseKey();

    return NextResponse.json({
      success: true,
      provisioned: {
        orderId,
        productId,
        licenseKey,
        primaryIP: '185.193.125.10',
        secondaryIP: '185.193.125.11',
        dotHost: 'core.nexoradns.com',
        dohUrl: `https://doh.nexoradns.com/dns-query?key=${licenseKey}`,
        provisionedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'DNS provision service error.' }, { status: 500 });
  }
}
