import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/store-db';

// Rate Limiter: Track IP attempts (max 5 requests per 3 minutes)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3 * 60 * 1000 });
    return false;
  }
  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) {
    return true;
  }
  entry.count += 1;
  return false;
}

function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***.com';
  const name = parts[0];
  const domain = parts[1];
  const visible = name.slice(0, 1) + '***' + (name.length > 2 ? name.slice(-1) : '');
  return `${visible}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    
    // Check Rate Limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Too many tracking attempts. For your security, please wait 3 minutes before trying again.',
          isRateLimited: true
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { orderId, emailOrPhone } = body;

    if (!orderId || !emailOrPhone) {
      return NextResponse.json(
        { error: 'Please enter both your Order Reference and customer Email or Phone number.' },
        { status: 400 }
      );
    }

    const cleanOrderId = orderId.toString().trim().toUpperCase();
    const cleanAuth = emailOrPhone.toString().trim().toLowerCase().replace(/[\s-]/g, '');

    const order = getOrderById(cleanOrderId);
    if (!order) {
      return NextResponse.json(
        { error: 'No order matched the provided reference and contact information. Please verify your order receipt.' },
        { status: 404 }
      );
    }

    // Verify dual-factor ownership against Order records
    const orderEmail = order.customerEmail.toLowerCase().trim();
    const orderPhoneClean = order.customerPhone.replace(/[\s-]/g, '');
    const phoneLast4 = orderPhoneClean.slice(-4);

    const matchesEmail = cleanAuth === orderEmail;
    const matchesPhoneFull = cleanAuth === orderPhoneClean;
    const matchesPhoneLast4 = cleanAuth.length >= 4 && cleanAuth.endsWith(phoneLast4);

    if (!matchesEmail && !matchesPhoneFull && !matchesPhoneLast4) {
      return NextResponse.json(
        { error: 'No order matched the provided reference and contact information. Please verify your order receipt.' },
        { status: 404 }
      );
    }

    // Construct Server-Verified Sanitized Order Timeline
    const timeline = [
      {
        step: 'Order Received',
        description: 'Order created with unique reference.',
        timestamp: order.createdAt,
        completed: true,
        current: false,
      }
    ];

    if (order.paymentStatus === 'pending') {
      timeline.push({
        step: 'Payment Pending',
        description: 'Awaiting manual administrator verification of Transaction ID (TID).',
        timestamp: order.createdAt,
        completed: false,
        current: true,
      });
      timeline.push({
        step: 'Fulfillment & Provisioning',
        description: 'Dedicated Free Fire Anycast credentials generated upon payment confirmation.',
        timestamp: '',
        completed: false,
        current: false,
      });
    } else if (order.paymentStatus === 'verified') {
      timeline.push({
        step: 'Payment Verified',
        description: `Verified via ${order.paymentMethod.toUpperCase()}${order.paymentProof?.transactionId ? ` (TID: ${order.paymentProof.transactionId})` : ''}`,
        timestamp: order.paymentProof?.verifiedAt || order.updatedAt,
        completed: true,
        current: order.fulfillmentStatus !== 'fulfilled',
      });

      if (order.fulfillmentStatus === 'fulfilled') {
        timeline.push({
          step: 'Delivered',
          description: 'DNS routing active and configuration profile issued.',
          timestamp: order.updatedAt,
          completed: true,
          current: true,
        });
      } else {
        timeline.push({
          step: 'Fulfillment Processing',
          description: 'Assigning Anycast edge resolver node.',
          timestamp: order.updatedAt,
          completed: false,
          current: true,
        });
      }
    } else if (order.paymentStatus === 'failed') {
      timeline.push({
        step: 'Payment Verification Failed',
        description: 'Transaction ID could not be reconciled with banking records. Support review required.',
        timestamp: order.updatedAt,
        completed: false,
        current: true,
      });
    } else if (order.paymentStatus === 'refunded') {
      timeline.push({
        step: 'Order Refunded',
        description: `Refund of Rs. ${order.refundDetails?.amount || order.totalAmount} processed.`,
        timestamp: order.refundDetails?.refundedAt || order.updatedAt,
        completed: true,
        current: true,
      });
    }

    // Scrub and sanitize response: NEVER return private payment tokens, internal admin notes, or full raw PII
    const sanitizedOrder = {
      orderId: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      currency: order.currency,
      totalAmount: order.totalAmount,
      maskedCustomerEmail: maskEmail(order.customerEmail),
      items: order.items.map(it => ({
        productName: it.productName,
        duration: it.duration,
        quantity: it.quantity,
        price: it.price
      })),
      timeline,
      assignedConfigurations: order.paymentStatus === 'verified' && order.fulfillmentStatus === 'fulfilled'
        ? order.assignedConfigurations.map(c => ({
            productName: c.productName,
            dotHost: c.dotHost,
            dohUrl: c.dohUrl,
            licenseKey: c.licenseKey,
            expiresAt: c.expiresAt,
            setupGuideUrl: c.setupGuideUrl,
          }))
        : []
    };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder
    });

  } catch (error: any) {
    console.error('Order tracking API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while verifying order status.' },
      { status: 500 }
    );
  }
}
