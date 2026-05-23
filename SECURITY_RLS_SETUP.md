# Supabase Row Level Security (RLS) Setup — CRITICAL

## Why This Is Urgent

Your Supabase anon key is public (visible in browser JavaScript). Without RLS, **anyone** can query ALL your tables directly using that key. This is likely how the attacker accessed your customer data.

## How to Enable RLS

Go to your Supabase Dashboard:
**https://supabase.com/dashboard** (select your project)

Navigate to: **Database → Tables** (or **Table Editor**)

For EACH table below, click on the table, go to **RLS** (or **Policies**), and:
1. **Enable RLS** (toggle it ON)
2. **Add the policies listed below**
3. If a policy with the same name already exists, delete/replace it instead of creating a duplicate (Postgres will throw `policy ... already exists`).

> **Important:** The service role key always bypasses RLS, so your API routes (`/api/admin/*`) using `SUPABASE_SERVICE_ROLE_KEY` are unaffected. But admin pages that use the **browser anon key** (like `ProductForm`, `Settings`) need explicit admin write policies or they will break.

---

## Admin Helper Policy (reused across many tables)

Many tables below need an "admins can do everything" policy.

Use the helper function from your schema migration: `public.is_admin_or_staff()`.
Do **not** use `SELECT ... FROM profiles` directly inside other table policies if you can avoid it; that pattern is easy to misconfigure and can cause recursion issues on `profiles`.

This is the safer pattern:

```sql
-- Reusable: check if current user is admin or staff
CREATE POLICY "Admins full access"
ON <table_name> FOR ALL
USING (public.is_admin_or_staff())
WITH CHECK (public.is_admin_or_staff());
```

---

## Table: `profiles`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin/staff can view all profiles (needed for admin panel)
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (public.is_admin_or_staff());
```

---

## Table: `orders`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Guest checkout: user_id may be null, but only allow setting user_id to yourself
CREATE POLICY "Users can create orders"
ON orders FOR INSERT
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Admins can do everything (view all, update status, etc.)
CREATE POLICY "Admins full access on orders"
ON orders FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `order_items`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert order items"
ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

CREATE POLICY "Admins full access on order_items"
ON order_items FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `order_status_history`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own order history"
ON order_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access on order_status_history"
ON order_status_history FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `products`

### Enable RLS: YES

```sql
-- Public: only active products visible
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (status = 'active');

-- Admins can view ALL products (including draft, archived) and write
CREATE POLICY "Admins full access on products"
ON products FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

> **NOTE:** Removed `status IS NULL` and `status = 'published'` from the old policy — draft products with a null status should NOT be publicly visible.

---

## Table: `product_images`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view product images"
ON product_images FOR SELECT
USING (true);

-- Admins can insert/update/delete images (ProductForm uses anon key)
CREATE POLICY "Admins full access on product_images"
ON product_images FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `product_variants`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view product variants"
ON product_variants FOR SELECT
USING (true);

CREATE POLICY "Admins full access on product_variants"
ON product_variants FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `categories`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (status = 'active' OR status IS NULL);

CREATE POLICY "Admins full access on categories"
ON categories FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `reviews`

### Enable RLS: YES

```sql
-- Public can only see approved reviews
CREATE POLICY "Public can view approved reviews"
ON reviews FOR SELECT
USING (status = 'approved');

-- Users can insert reviews BUT only as themselves, and status must be 'pending'
CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND status = 'pending'
);

-- Users can update/delete their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- Admins can do everything (moderate, approve, delete)
CREATE POLICY "Admins full access on reviews"
ON reviews FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

> **LOOPHOLE FIXED:** Old policy allowed any logged-in user to insert a review with `status = 'approved'` and as ANY `user_id`. New policy enforces `user_id = auth.uid()`. Reviews should be inserted as `status = 'pending'` in the code (see code fix below).

---

## Table: `review_images`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view review images"
ON review_images FOR SELECT
USING (true);

CREATE POLICY "Users can insert own review images"
ON review_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_images.review_id
    AND reviews.user_id = auth.uid()
  )
);
```

---

## Table: `addresses`

### Enable RLS: YES

```sql
CREATE POLICY "Users can manage own addresses"
ON addresses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## Table: `cart_items`

### Enable RLS: YES

```sql
CREATE POLICY "Users can manage own cart"
ON cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access on cart_items"
ON cart_items FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `wishlist_items`

### Enable RLS: YES

```sql
CREATE POLICY "Users can manage own wishlist"
ON wishlist_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access on wishlist_items"
ON wishlist_items FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `coupons`

### Enable RLS: YES

```sql
-- Public can view active coupons (for coupon code validation at checkout)
CREATE POLICY "Public can view active coupons"
ON coupons FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins full access on coupons"
ON coupons FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `customers`

### Enable RLS: YES

```sql
-- No public access — admins only
CREATE POLICY "Admins full access on customers"
ON customers FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `support_tickets`

### Enable RLS: YES

```sql
CREATE POLICY "Users can manage own tickets"
ON support_tickets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access on support_tickets"
ON support_tickets FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `support_messages`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own ticket messages"
ON support_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = support_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to own tickets"
ON support_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = support_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access on support_messages"
ON support_messages FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `return_requests`

### Enable RLS: YES

```sql
CREATE POLICY "Users can manage own returns"
ON return_requests FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access on return_requests"
ON return_requests FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `return_items`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own return items"
ON return_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND return_requests.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert return items"
ON return_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND return_requests.user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access on return_items"
ON return_items FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `notifications`

### Enable RLS: YES

```sql
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins full access on notifications"
ON notifications FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `banners`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view active banners"
ON banners FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins full access on banners"
ON banners FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

> **FIXED:** Removed `active IS NULL` — banners with no active flag should not be visible.

---

## Table: `store_settings`

### Enable RLS: YES

```sql
-- Public read (the storefront reads settings like site_name, contact info)
CREATE POLICY "Public can read store settings"
ON store_settings FOR SELECT
USING (true);

-- Only admins can write
CREATE POLICY "Admins can write store settings"
ON store_settings FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `store_modules`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view modules"
ON store_modules FOR SELECT
USING (true);

CREATE POLICY "Admins full access on store_modules"
ON store_modules FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `blog_posts`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view published posts"
ON blog_posts FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins full access on blog_posts"
ON blog_posts FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Tables: `pages`, `cms_content`, `site_settings`

### Enable RLS: YES

```sql
-- Public read for CMS content
CREATE POLICY "Public can read pages"
ON pages FOR SELECT
USING (true);

CREATE POLICY "Public can read cms_content"
ON cms_content FOR SELECT
USING (true);

CREATE POLICY "Public can read site_settings"
ON site_settings FOR SELECT
USING (true);

-- Admin write on all three
CREATE POLICY "Admins full access on pages"
ON pages FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));

CREATE POLICY "Admins full access on cms_content"
ON cms_content FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));

CREATE POLICY "Admins full access on site_settings"
ON site_settings FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));
```

---

## Tables: `navigation_menus`, `navigation_items`

### Enable RLS: YES

```sql
CREATE POLICY "Public can view navigation"
ON navigation_menus FOR SELECT USING (true);

CREATE POLICY "Public can view navigation items"
ON navigation_items FOR SELECT USING (true);

CREATE POLICY "Admins full access on navigation_menus"
ON navigation_menus FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));

CREATE POLICY "Admins full access on navigation_items"
ON navigation_items FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));
```

---

## Table: `contact_submissions`

### Enable RLS: YES

```sql
-- Anyone (even anonymous) can submit a contact form
CREATE POLICY "Anyone can insert contact submissions"
ON contact_submissions FOR INSERT
WITH CHECK (true);

-- Only admins can read submissions
CREATE POLICY "Admins can read contact submissions"
ON contact_submissions FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Table: `audit_logs`

### Enable RLS: YES

```sql
-- No public access — admins only
CREATE POLICY "Admins full access on audit_logs"
ON audit_logs FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
);
```

---

## Loopholes Found & Fixed

### 1. Reviews auto-approved (CRITICAL)

**Problem:** `ProductReviews.tsx` inserts reviews with `status: 'approved'` directly from the browser. Any user could write a review and it would appear immediately, even fake 5-star reviews.

**Fix:** The code should insert with `status: 'pending'`, and only admins can approve. See the code change in `components/ProductReviews.tsx`.

### 2. Missing tables (15 tables had no RLS policies)

**Problem:** The original doc only covered 10 tables. These 15 tables were unprotected:
- `addresses`, `product_variants`, `coupons`, `order_status_history`, `cart_items`, `wishlist_items`, `review_images`, `blog_posts`, `support_tickets`, `support_messages`, `return_requests`, `return_items`, `notifications`, `contact_submissions`, `audit_logs`

Plus CMS tables: `pages`, `site_settings`, `cms_content`, `navigation_menus`, `navigation_items`, `store_settings`

**Fix:** All tables now have policies above.

### 3. Admin pages use browser anon key (WILL BREAK)

**Problem:** `ProductForm`, `admin/settings`, and other admin pages use the browser Supabase client (anon key). Enabling RLS without admin write policies would break the entire admin panel.

**Fix:** Every table that admins write to now has an "Admins full access" policy.

### 4. Products policy too permissive

**Problem:** Old policy: `status = 'active' OR status = 'published' OR status IS NULL` — products with no status would be publicly visible (e.g. incomplete drafts).

**Fix:** Changed to `status = 'active'` only. Admins have separate full-access policy to see all products.

### 5. Banners policy too permissive

**Problem:** `active IS NULL` allowed banners without an active flag to show publicly.

**Fix:** Changed to `active = true` only.

### 6. Reviews could be posted as another user

**Problem:** Old INSERT policy was just `auth.uid() IS NOT NULL` — a logged-in user could set `user_id` to any UUID.

**Fix:** New policy enforces `user_id = auth.uid()`.

---

## Environment Variable to Add

Add to your `.env.local`:
```
MOOLRE_CALLBACK_SECRET=<get this from Moolre dashboard or generate a strong random string>
```

This is used to verify payment callbacks are actually from Moolre.

---

## Verification

After setting up RLS, test by:
1. Open browser DevTools console on your store
2. Try: `const { data } = await supabase.from('customers').select('*')`
3. It should return an empty array or error — NOT customer data
4. Try: `const { data } = await supabase.from('orders').select('*')`
5. Should only return orders belonging to the logged-in user (or empty)
6. Try: `const { data } = await supabase.from('products').select('*')`
7. Should only return active products (no drafts or archived)
8. Log in as admin → verify you can still add/edit products, update settings, manage orders

---

## Summary of Changes Made in Code

1. **Payment verify endpoint** — No longer trusts `fromRedirect` flag; only Moolre API verification
2. **Payment initiation** — Amount fetched from database, never trusted from client
3. **Payment callback** — Secret verification mandatory when configured; amount mismatches rejected
4. **Middleware** — Server-side auth check for all `/admin` routes
5. **Notifications API** — All sensitive types require admin auth; contact form validated
6. **Order tracking** — Email verification now required (mandatory)
7. **Test SMS** — Requires admin auth token
8. **HTML sanitization** — All user input escaped before HTML injection
9. **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy added
10. **Reviews** — Changed from auto-approved to pending status on submission
