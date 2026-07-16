-- ============================================================================
-- CONSOLIDATED DATABASE SCHEMA MIGRATION FOR AGROMARKET
-- ============================================================================

-- ============================================================
-- UTILITIES & SHARED TRIGGERS
-- ============================================================

-- Function to automatically manage updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  bio         TEXT,
  phone       TEXT,
  location    TEXT,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  category    TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity    NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit        TEXT NOT NULL,
  location    TEXT NOT NULL,
  image_url   TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_removed  BOOLEAN NOT NULL DEFAULT false,
  is_flagged  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_all_active"
  ON public.products FOR SELECT USING (is_removed = false AND status = 'active');

CREATE POLICY "products_select_own_seller"
  ON public.products FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "products_insert_seller"
  ON public.products FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller'
    )
  );

CREATE POLICY "products_update_own"
  ON public.products FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "products_delete_own"
  ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Trigger for updated_at
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 3. CART_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity    NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);

-- RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_select_own"
  ON public.cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_own"
  ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_own"
  ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_delete_own"
  ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER trg_cart_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 4. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id         UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  total_price      NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  order_status     TEXT NOT NULL DEFAULT 'pending' CHECK (
    order_status IN ('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled')
  ),
  delivery_address TEXT NOT NULL,
  delivery_phone   TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_buyer"
  ON public.orders FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "orders_insert_buyer"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders_update_buyer"
  ON public.orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Trigger for updated_at
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 5. ORDER_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  seller_id   UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  quantity    NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller ON public.order_items(seller_id);

-- RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order items select rule: accessible if order belongs to buyer OR seller is the item owner
CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT USING (
    auth.uid() = seller_id 
    OR EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert"
  ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid()
    )
  );

-- ============================================================
-- 6. PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
  payment_method   TEXT NOT NULL DEFAULT 'stellar_xlm' CHECK (payment_method IN ('stellar_xlm', 'fiat')),
  payment_status   TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  amount           NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  transaction_hash TEXT, -- Stellar transaction transaction envelope hash
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_hash ON public.payments(transaction_hash);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_related"
  ON public.payments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid()
    )
  );

CREATE POLICY "payments_insert_buyer"
  ON public.payments FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('order_status', 'payment', 'system', 'review')),
  is_read     BOOLEAN NOT NULL DEFAULT false,
  archived    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- 8. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id        UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  seller_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating            SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title             TEXT,
  comment           TEXT NOT NULL,
  seller_response   TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  helpful_count     INT NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  reported          BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, product_id, buyer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller ON public.reviews(seller_id);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT USING (reported = false);

CREATE POLICY "reviews_insert_buyer"
  ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = buyer_id AND EXISTS (
      SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid() AND order_status = 'delivered'
    )
  );

CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "reviews_delete_own_or_admin"
  ON public.reviews FOR DELETE USING (
    auth.uid() = buyer_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
