import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { 
  getStoredOrders, 
  verifyPayment, 
  refundOrder, 
  addOrderAdminNote, 
  manuallyFulfillOrder, 
  exportOrdersToCSV 
} from '@/lib/store-db';

export async function GET(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const orders = getStoredOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, orderId, notes, amount, reason, note } = body;

    if (action === 'verify_payment') {
      if (!orderId || !notes) {
        return NextResponse.json({ error: 'Order ID and legitimate verification audit notes are strictly required.' }, { status: 400 });
      }
      const updated = verifyPayment(orderId, auth.adminEmail, notes);
      if (!updated) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated, message: 'Payment verified and DNS provisioned.' });
    }

    if (action === 'refund') {
      if (!orderId || amount === undefined || !reason) {
        return NextResponse.json({ error: 'Order ID, refund amount, and reason are required.' }, { status: 400 });
      }
      const updated = refundOrder(orderId, auth.adminEmail, Number(amount), reason);
      if (!updated) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated, message: 'Refund recorded successfully.' });
    }

    if (action === 'add_note') {
      if (!orderId || !note) {
        return NextResponse.json({ error: 'Order ID and note text are required.' }, { status: 400 });
      }
      const updated = addOrderAdminNote(orderId, auth.adminEmail, note);
      if (!updated) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated, message: 'Note added successfully.' });
    }

    if (action === 'manual_fulfill') {
      if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
      }
      const updated = manuallyFulfillOrder(orderId, auth.adminEmail);
      if (!updated) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated, message: 'DNS credentials provisioned successfully.' });
    }

    if (action === 'export_csv') {
      const csv = exportOrdersToCSV();
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="nexora_orders_${new Date().toISOString().slice(0, 10)}.csv"`
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
