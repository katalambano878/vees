import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function verifyAdmin(request: Request) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!authToken) return null;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabase.auth.getUser(authToken);
  if (error || !user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) return null;
  return supabase;
}

export async function POST(request: Request) {
  try {
    const supabase = await verifyAdmin(request);
    if (!supabase) {
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
      await supabase.from('wishlist_items').delete().eq('product_id', id);
      await supabase.from('cart_items').delete().eq('product_id', id);
      await supabase.from('reviews').delete().eq('product_id', id);
      await supabase.from('product_images').delete().eq('product_id', id);
      await supabase.from('product_variants').delete().eq('product_id', id);
      const { error } = await supabase.from('products').delete().eq('id', id);
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
