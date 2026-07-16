-- ============================================================================
-- DATABASE SEED SCRIPT FOR AGROMARKET (REALISTIC NIGERIAN AGRICULTURAL DATA)
-- ============================================================================

-- Enable pgcrypto extension if not active
create extension if not exists pgcrypto;

-- Clear existing data (in order of dependency)
truncate table public.reviews cascade;
truncate table public.notifications cascade;
truncate table public.payments cascade;
truncate table public.order_items cascade;
truncate table public.orders cascade;
truncate table public.cart_items cascade;
truncate table public.products cascade;
delete from auth.users;

-- ============================================================
-- 1. SEED AUTH USERS (31 Users total: 20 Buyers, 10 Sellers, 1 Admin)
-- ============================================================

-- We generate UUIDs and insert them directly into auth.users.
-- The trigger 'on_auth_user_created' will automatically propagate public.profiles.

-- Admin
INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, updated_at, email_confirmed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@agromarket.org',
  crypt('password123', gen_salt('bf')),
  '{"full_name": "AgroMarket Administrator", "avatar_url": null}',
  now(), now(), now()
);

UPDATE public.profiles 
SET role = 'admin', full_name = 'AgroMarket Administrator', location = 'Lagos'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- 10 Sellers
-- We will use loops or explicit inserts. Explicit inserts are cleaner for static seeds.
INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, updated_at, email_confirmed_at) VALUES
('10000000-0000-0000-0000-000000000001', 'bello.farms@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Bello Farms Ltd."}', now(), now(), now()),
('10000000-0000-0000-0000-000000000002', 'chidi.agri@outlook.com', crypt('password123', gen_salt('bf')), '{"full_name": "Chidi Agrobusiness Services"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000003', 'eke.organics@yahoo.com', crypt('password123', gen_salt('bf')), '{"full_name": "Eke Organic Foods"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000004', 'ibrahim.livestock@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Ibrahim Livestock & Poultry"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000005', 'funmi.veggies@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Funmi Fresh Veggies"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000006', 'adebayo.cocoa@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Adebayo Cocoa Merchants"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000007', 'danladi.grains@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Danladi Grains Hub"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000008', 'nwachukwu.yam@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Nwachukwu Yam Exporters"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000009', 'okoro.dairy@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "Okoro Dairy & Milk Products"}', now(), now(), now()),
('10000000-0000-0000-0000-000000000010', 'agrotech.equip@gmail.com', crypt('password123', gen_salt('bf')), '{"full_name": "AgroTech Equipment Ltd."}', now(), now(), now());

UPDATE public.profiles SET
  role = 'seller',
  location = CASE id
    WHEN '10000000-0000-0000-0000-000000000001' THEN 'Ibadan, Oyo'
    WHEN '10000000-0000-0000-0000-000000000002' THEN 'Enugu, Enugu'
    WHEN '10000000-0000-0000-0000-000000000003' THEN 'Owerri, Imo'
    WHEN '10000000-0000-0000-0000-000000000004' THEN 'Kano, Kano'
    WHEN '10000000-0000-0000-0000-000000000005' THEN 'Ilorin, Kwara'
    WHEN '10000000-0000-0000-0000-000000000006' THEN 'Akure, Ondo'
    WHEN '10000000-0000-0000-0000-000000000007' THEN 'Kaduna, Kaduna'
    WHEN '10000000-0000-0000-0000-000000000008' THEN 'Abakaliki, Ebonyi'
    WHEN '10000000-0000-0000-0000-000000000009' THEN 'Jos, Plateau'
    ELSE 'Lagos, Lagos'
  END,
  phone = '+234803' || round(random() * 8999999 + 1000000)::text,
  bio = 'Premium verified seller on AgroMarket supplying high quality agricultural products.'
WHERE id IN (
  '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000010'
);

-- 20 Buyers
INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, updated_at, email_confirmed_at) VALUES
('20000000-0000-0000-0000-000000000001', 'buyer1@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Abiola Yusuf"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000002', 'buyer2@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Emeka Obi"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000003', 'buyer3@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Hadiza Umar"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000004', 'buyer4@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Tunde Bakare"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000005', 'buyer5@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Ngozi Adebayo"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000006', 'buyer6@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Mustapha Musa"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000007', 'buyer7@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Chioma Nze"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000008', 'buyer8@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Olawale Johnson"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000009', 'buyer9@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Fatima Bello"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000010', 'buyer10@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Kenechukwu Eze"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000011', 'buyer11@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Segun Alao"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000012', 'buyer12@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Blessing Udoh"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000013', 'buyer13@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Aminu Duru"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000014', 'buyer14@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Kemi Falana"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000015', 'buyer15@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Uche Gabriel"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000016', 'buyer16@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Aisha Garba"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000017', 'buyer17@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Joy Opara"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000018', 'buyer18@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Babatunde Lawal"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000019', 'buyer19@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Rita Onyeka"}', now(), now(), now()),
('20000000-0000-0000-0000-000000000020', 'buyer20@agromarket.org', crypt('password123', gen_salt('bf')), '{"full_name": "Alhassan Ibrahim"}', now(), now(), now());

UPDATE public.profiles SET
  role = 'buyer',
  location = CASE (random() * 5)::int
    WHEN 0 THEN 'Lagos, Lagos'
    WHEN 1 THEN 'Abuja, FCT'
    WHEN 2 THEN 'Port Harcourt, Rivers'
    WHEN 3 THEN 'Ibadan, Oyo'
    WHEN 4 THEN 'Enugu, Enugu'
    ELSE 'Kano, Kano'
  END,
  phone = '+234803' || round(random() * 8999999 + 1000000)::text
WHERE id IN (
  '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000010',
  '20000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000018',
  '20000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000020'
);

-- ============================================================
-- 2. SEED PRODUCTS (100 products spread across categories and 10 sellers)
-- ============================================================

-- Helper procedure/loop to insert 100 products.
-- Category map: Vegetables, Fruits, Grains, Livestock, Dairy, Farm Equipment, Tubers (Cassava/Yam/Cocoa)
DO $$
DECLARE
  v_seller_ids UUID[] := ARRAY[
    '10000000-0000-0000-0000-000000000001'::UUID, '10000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000003'::UUID, '10000000-0000-0000-0000-000000000004'::UUID,
    '10000000-0000-0000-0000-000000000005'::UUID, '10000000-0000-0000-0000-000000000006'::UUID,
    '10000000-0000-0000-0000-000000000007'::UUID, '10000000-0000-0000-0000-000000000008'::UUID,
    '10000000-0000-0000-0000-000000000009'::UUID, '10000000-0000-0000-0000-000000000010'::UUID
  ];
  v_categories TEXT[] := ARRAY['Vegetables', 'Fruits', 'Grains', 'Livestock', 'Dairy', 'Farm Equipment', 'Yam', 'Cassava', 'Cocoa'];
  v_titles TEXT[] := ARRAY[
    'Fresh Habanero Pepper (Ata Rodo)', 'Organic Ugu Leaves', 'Sweet Potato Tubers', 'Fresh Spinach (Shoko)',
    'Nigerian Mangoes (Sherry)', 'Premium Yellow Maize', 'Local White Beans (Oloyin)', 'White Yam Tubers',
    'Unrefined Cocoa Beans', 'Fresh Tomatoes (Derica)', 'Local Rice (Ofada)', 'Sorghum Seeds',
    'Dry Cassava Chips', 'Fresh Eggs (Crate)', 'Local Cow Milk (Nono)', 'Smoked Catfish',
    'Manual Cassava Peeler', 'Handheld Fertilizer Spreader', 'Broiler Chickens (Live)', 'Fresh Goat Meat',
    'Local Honey', 'Garri (White)', 'Garri (Yellow)', 'Plantain Bunch', 'Avocado Pear',
    'Palm Oil (Gallon)', 'Groundnut Oil (Gallon)', 'Ginger Roots', 'Garlic Bulbs', 'Fresh Okra'
  ];
  v_units TEXT[] := ARRAY['Bag', 'Bunch', 'Kg', 'Crate', 'Ctn', 'Litre', 'Unit'];
  v_seller_idx INT;
  v_cat_idx INT;
  v_title_idx INT;
  v_unit_idx INT;
  v_price NUMERIC;
  v_qty NUMERIC;
  v_loc TEXT;
  v_title TEXT;
BEGIN
  FOR i IN 1..100 LOOP
    v_seller_idx := ((i - 1) % 10) + 1;
    v_cat_idx := ((i - 1) % 9) + 1;
    v_title_idx := ((i - 1) % 30) + 1;
    v_unit_idx := ((i - 1) % 7) + 1;
    
    v_price := (500 + (i * 250))::NUMERIC;
    v_qty := (10 + (i * 2))::NUMERIC;
    
    v_title := v_titles[v_title_idx] || ' - Grade ' || ((i % 3) + 1)::text;
    
    v_loc := CASE v_seller_idx
      WHEN 1 THEN 'Ibadan, Oyo'
      WHEN 2 THEN 'Enugu, Enugu'
      WHEN 3 THEN 'Owerri, Imo'
      WHEN 4 THEN 'Kano, Kano'
      WHEN 5 THEN 'Ilorin, Kwara'
      WHEN 6 THEN 'Akure, Ondo'
      WHEN 7 THEN 'Kaduna, Kaduna'
      WHEN 8 THEN 'Abakaliki, Ebonyi'
      WHEN 9 THEN 'Jos, Plateau'
      ELSE 'Lagos, Lagos'
    END;

    INSERT INTO public.products (id, seller_id, title, description, category, price, quantity, unit, location, image_url, status, is_removed)
    VALUES (
      ('30000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::UUID,
      v_seller_ids[v_seller_idx],
      v_title,
      'High-quality, freshly processed farm produce directly from ' || v_loc || '. Inspected for premium organic quality.',
      v_categories[v_cat_idx],
      v_price,
      v_qty,
      v_units[v_unit_idx],
      v_loc,
      null,
      'active',
      false
    );
  END LOOP;
END $$;

-- ============================================================
-- 3. SEED ORDERS & ORDER ITEMS (30 Orders from buyers)
-- ============================================================
DO $$
DECLARE
  v_buyer_ids UUID[] := ARRAY[
    '20000000-0000-0000-0000-000000000001'::UUID, '20000000-0000-0000-0000-000000000002'::UUID,
    '20000000-0000-0000-0000-000000000003'::UUID, '20000000-0000-0000-0000-000000000004'::UUID,
    '20000000-0000-0000-0000-000000000005'::UUID, '20000000-0000-0000-0000-000000000006'::UUID,
    '20000000-0000-0000-0000-000000000007'::UUID, '20000000-0000-0000-0000-000000000008'::UUID,
    '20000000-0000-0000-0000-000000000009'::UUID, '20000000-0000-0000-0000-000000000010'::UUID
  ];
  v_prod_id UUID;
  v_seller_id UUID;
  v_price NUMERIC;
  v_total NUMERIC;
  v_buyer_id UUID;
  v_order_id UUID;
  v_status TEXT;
BEGIN
  FOR i IN 1..30 LOOP
    v_order_id := ('40000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::UUID;
    v_buyer_id := v_buyer_ids[((i - 1) % 10) + 1];
    
    -- Status distribution
    v_status := CASE (i % 6)
      WHEN 0 THEN 'delivered'
      WHEN 1 THEN 'confirmed'
      WHEN 2 THEN 'processing'
      WHEN 3 THEN 'dispatched'
      WHEN 4 THEN 'cancelled'
      ELSE 'pending'
    END;

    -- Pick a product (e.g. ID matching product #i)
    SELECT id, seller_id, price INTO v_prod_id, v_seller_id, v_price 
    FROM public.products 
    WHERE id = ('30000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::UUID;

    v_total := v_price * 2;

    -- Order
    INSERT INTO public.orders (id, buyer_id, total_price, order_status, delivery_address, delivery_phone, created_at)
    VALUES (
      v_order_id,
      v_buyer_id,
      v_total,
      v_status,
      'No. ' || i::text || ' Gbagi Market Road, Ibadan',
      '+23480399988' || LPAD(i::text, 2, '0'),
      now() - (i || ' days')::interval
    );

    -- Order Item
    INSERT INTO public.order_items (order_id, product_id, seller_id, quantity, unit_price, total_price)
    VALUES (
      v_order_id,
      v_prod_id,
      v_seller_id,
      2,
      v_price,
      v_total
    );

    -- Payment (if not pending/cancelled)
    IF v_status NOT IN ('pending', 'cancelled') THEN
      INSERT INTO public.payments (order_id, payment_method, payment_status, amount, transaction_hash)
      VALUES (
        v_order_id,
        'stellar_xlm',
        'completed',
        v_total,
        'hash_' || md5(v_order_id::text)
      );
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- 4. SEED REVIEWS (50 Reviews for completed/delivered orders)
-- ============================================================
DO $$
DECLARE
  v_order_record RECORD;
  v_item_record RECORD;
  v_review_count INT := 0;
  v_rating INT;
  v_comment TEXT;
BEGIN
  -- Select delivered orders to review
  FOR v_order_record IN 
    SELECT id, buyer_id FROM public.orders WHERE order_status = 'delivered'
  LOOP
    -- Get items inside the order
    FOR v_item_record IN 
      SELECT product_id, seller_id, unit_price FROM public.order_items WHERE order_id = v_order_record.id
    LOOP
      v_review_count := v_review_count + 1;
      EXIT WHEN v_review_count > 50;

      v_rating := ((v_review_count % 3) + 3); -- Ratings will be 3, 4, or 5 stars
      v_comment := CASE v_rating
        WHEN 5 THEN 'Exceptional produce quality! Delivery was extremely fast, and the packaging was clean. Highly recommended.'
        WHEN 4 THEN 'Very fresh produce. The seller was responsive and transaction was smooth. Will buy again.'
        ELSE 'Decent quality. The delivery took slightly longer than expected but the produce arrived intact.'
      END;

      INSERT INTO public.reviews (
        order_id, product_id, seller_id, buyer_id, rating, title, comment, verified_purchase, helpful_count, reported
      ) VALUES (
        v_order_record.id,
        v_item_record.product_id,
        v_item_record.seller_id,
        v_order_record.buyer_id,
        v_rating,
        CASE v_rating WHEN 5 THEN 'Perfect!' WHEN 4 THEN 'Good Quality' ELSE 'Okay Experience' END,
        v_comment,
        true,
        (v_review_count % 5),
        false
      );
    END LOOP;
    EXIT WHEN v_review_count > 50;
  END LOOP;
END $$;

-- ============================================================
-- 5. SEED CART ITEMS & NOTIFICATIONS
-- ============================================================
-- Create cart items for the first 5 buyers
INSERT INTO public.cart_items (user_id, product_id, quantity) VALUES
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000005', 3),
('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000012', 1),
('20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000015', 5),
('20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000022', 2),
('20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000030', 1);

-- Create notifications for first 10 buyers
INSERT INTO public.notifications (user_id, title, message, type, is_read) VALUES
('20000000-0000-0000-0000-000000000001', 'Order Placed', 'Your order #40000000-0000-0000-0000-000000000001 has been placed successfully.', 'order_status', false),
('20000000-0000-0000-0000-000000000002', 'Payment Confirmed', 'Payment of ₦15,000 for your order was successfully settled on Stellar network.', 'payment', true),
('20000000-0000-0000-0000-000000000003', 'Welcome to AgroMarket', 'Your account has been fully verified and setup. Welcome!', 'system', false),
('20000000-0000-0000-0000-000000000004', 'Order Dispatched', 'Your fresh vegetables have been dispatched from the farm and are on the way.', 'order_status', false),
('20000000-0000-0000-0000-000000000005', 'Payment Failed', 'Stellar horizon nodes returned a path payment mismatch. Please retry checkout.', 'payment', false);
