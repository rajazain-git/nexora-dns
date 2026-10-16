import { NextRequest, NextResponse } from 'next/server';
import { generateOrderId, generateLicenseKey, getStoredProducts, validateCoupon, createOrder } from '@/lib/store-db';
import { INITIAL_PRODUCTS } from '@/lib/products';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerEmail, customerName, customerPhone, paymentMethod, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart must contain at least one item.' }, { status: 400 });
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json({ error: 'Customer name and email are required.' }, { status: 400 });
    }

    // Verify item prices from live product catalog (Never trust client prices!)
    const activeProducts = getStoredProducts();
    let calculatedSubtotalPKR = 0;
    const verifiedItems = [];

    for (const item of items) {
      const genuineProduct = activeProducts.find((p) => p.id === item.productId) || INITIAL_PRODUCTS.find((p) => p.id === item.productId);
      if (!genuineProduct) {
        return NextResponse.json({ error: `Product ID ${item.productId} is invalid.` }, { status: 400 });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedSubtotalPKR += genuineProduct.pricePKR * qty;

      verifiedItems.push({
        productId: genuineProduct.id,
        productName: genuineProduct.name,
        price: genuineProduct.pricePKR,
        quantity: qty,
        duration: genuineProduct.durationLabel,
      });
    }

    // Calculate discount if coupon present
    let discountAmountPKR = 0;
    if (couponCode) {
      const couponCheck = validateCoupon(couponCode, calculatedSubtotalPKR, verifiedItems[0]?.productId.includes('ios') ? 'ios' : 'android');
      if (couponCheck.valid && couponCheck.discountAmount) {
        discountAmountPKR = couponCheck.discountAmount;
      }
    }

    const finalTotalPKR = Math.max(0, calculatedSubtotalPKR - discountAmountPKR);
    const isFree = finalTotalPKR === 0;

    const newOrder = createOrder({
      customerId: `guest-${Math.random().toString(36).substring(2, 8)}`,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerName: customerName.trim(),
      customerPhone: customerPhone ? customerPhone.trim() : '',
      items: verifiedItems,
      subtotal: calculatedSubtotalPKR,
      discountAmount: discountAmountPKR,
      totalAmount: finalTotalPKR,
      currency: 'PKR',
      couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
      paymentMethod: isFree ? 'sandbox' : (paymentMethod || 'easypaisa'),
      paymentStatus: isFree ? 'verified' : 'pending',
      fulfillmentStatus: isFree ? 'fulfilled' : 'pending',
      paymentProof: {
        notes: isFree ? 'Automated trial provisioned' : 'Awaiting payment verification',
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error processing checkout.' }, { status: 500 });
  }
}
