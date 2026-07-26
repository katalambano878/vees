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
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    // Check for child categories
    const { data: children } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);

    if (children && children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete — this category has sub-categories. Delete or reassign them first.' },
        { status: 400 }
      );
    }

    // Check for products in this category
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete — this category has products. Move or delete them first.' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin delete category:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
