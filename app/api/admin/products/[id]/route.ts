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

function friendlyError(msg: string): string {
  if (msg.includes('order_items')) return 'Cannot delete — this product has orders. Remove it from orders first or set its status to "archived" instead.';
  if (msg.includes('cart_items')) return 'Cannot delete — this product is in customer carts. Try again later or archive the product instead.';
  if (msg.includes('wishlist')) return 'Cannot delete — this product is on customer wishlists. Remove wishlist entries first or archive the product.';
  if (msg.includes('review')) return 'Cannot delete — this product has reviews. Delete the reviews first or archive the product.';
  if (msg.includes('violates foreign key')) return 'Cannot delete — other records reference this product. Archive it instead.';
  return msg;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdminClient = await verifyAdmin(request);
    if (!supabaseAdminClient) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Clean up related records that we own, then delete the product
    await supabaseAdmin.from('wishlist_items').delete().eq('product_id', id);
    await supabaseAdmin.from('cart_items').delete().eq('product_id', id);
    await supabaseAdmin.from('reviews').delete().eq('product_id', id);
    await supabaseAdmin.from('product_images').delete().eq('product_id', id);
    await supabaseAdmin.from('product_variants').delete().eq('product_id', id);

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin delete product:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
