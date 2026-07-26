import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase-admin';


type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  payment_status: string;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  total: number;
  shipping_address: Record<string, any> | null;
  metadata: Record<string, any> | null;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderRef: string }> }
) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`pay-order:${clientId}`, RATE_LIMITS.payment);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { orderRef } = await params;
    if (!orderRef) {
      return NextResponse.json({ error: 'Missing order reference' }, { status: 400 });
    }

    const url = new URL(req.url);
    const token = url.searchParams.get('token') || '';
    const authToken = req.headers.get('authorization')?.replace('Bearer ', '');

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, user_id, email, payment_status, subtotal, tax_total, shipping_total, discount_total, total, shipping_address, metadata')
      .or(`id.eq.${orderRef},order_number.eq.${orderRef}`)
      .maybeSingle();

    const order = orderData as OrderRow | null;

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let authorized = false;

    // Token-based guest access (from payment reminder links)
    const expectedToken = String(order.metadata?.payment_access_token || '');
    if (token && expectedToken && token === expectedToken) {
      authorized = true;
    }

    // Authenticated owner fallback
    if (!authorized && authToken) {
      const { data: userData } = await supabaseAdmin.auth.getUser(authToken);
      if (userData?.user?.id && order.user_id === userData.user.id) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized to view this order' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        payment_status: order.payment_status,
        subtotal: order.subtotal,
        tax_total: order.tax_total,
        shipping_total: order.shipping_total,
        discount_total: order.discount_total,
        total: order.total,
        shipping_address: order.shipping_address,
        metadata: {
          first_name: order.metadata?.first_name || null,
          last_name: order.metadata?.last_name || null,
        },
      },
    });
  } catch (error) {
    console.error('Pay order lookup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
