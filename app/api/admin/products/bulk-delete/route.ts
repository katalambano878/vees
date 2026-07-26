import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';


async function verifyAdmin(request: Request) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!authToken) return null;
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(authToken);
  if (error || !user) return null;
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) return null;
  return supabaseAdmin;
}

export async function POST(request: Request) {
  try {
    const supabaseAdminClient = await verifyAdmin(request);
    if (!supabaseAdminClient) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids as string[] : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'ids array required' }, { status: 400 });
    }

    let deleted = 0;
    const errors: string[] = [];

    for (const id of ids) {
      await supabaseAdmin.from('wishlist_items').delete().eq('product_id', id);
      await supabaseAdmin.from('cart_items').delete().eq('product_id', id);
      await supabaseAdmin.from('reviews').delete().eq('product_id', id);
      await supabaseAdmin.from('product_images').delete().eq('product_id', id);
      await supabaseAdmin.from('product_variants').delete().eq('product_id', id);
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
      if (error) {
        errors.push(`Product ${id}: ${error.message}`);
      } else {
        deleted++;
      }
    }

    if (errors.length > 0 && deleted === 0) {
      return NextResponse.json({ error: `Failed to delete products. ${errors[0]}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, deleted, failed: errors.length });
  } catch (e) {
    console.error('Admin bulk delete products:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
