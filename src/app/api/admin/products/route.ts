import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getStoredProducts, saveProduct, deleteProduct } from '@/lib/store-db';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  const products = getStoredProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const product: Product = await req.json();

    // Strict Free Fire Mobile Platform Validation
    if (product.platform !== 'android' && product.platform !== 'ios') {
      return NextResponse.json({ 
        error: "Invalid platform. NEXORA DNS exclusively supports 'android' or 'ios' Free Fire mobile packages." 
      }, { status: 400 });
    }

    if (!product.name || !product.name.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    if (product.pricePKR < 0) {
      return NextResponse.json({ error: 'Price must be greater than or equal to 0 PKR.' }, { status: 400 });
    }

    saveProduct(product, auth.adminEmail);
    return NextResponse.json({ success: true, product, message: 'Product saved successfully.' });
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const deleted = deleteProduct(id, auth.adminEmail);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
