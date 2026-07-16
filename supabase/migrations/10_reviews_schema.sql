-- ============================================================
-- Migration 10: Reviews, Ratings & Reputation
-- ============================================================

-- ============================================================
-- Reviews Table
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating           SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title            TEXT,
  comment          TEXT NOT NULL,
  seller_response  TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  helpful_count    INT NOT NULL DEFAULT 0,
  reported         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One review per buyer per product per order
  UNIQUE (order_id, product_id, buyer_id)
);

-- Indexes
CREATE INDEX idx_reviews_product_id  ON reviews(product_id);
CREATE INDEX idx_reviews_seller_id   ON reviews(seller_id);
CREATE INDEX idx_reviews_buyer_id    ON reviews(buyer_id);
CREATE INDEX idx_reviews_rating      ON reviews(rating);
CREATE INDEX idx_reviews_created_at  ON reviews(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at();

-- ============================================================
-- Review Reports Table
-- ============================================================
CREATE TYPE review_report_status AS ENUM ('pending', 'dismissed', 'actioned');
CREATE TYPE review_report_reason  AS ENUM (
  'spam',
  'fake_review',
  'offensive_content',
  'irrelevant',
  'other'
);

CREATE TABLE IF NOT EXISTS review_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id    UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  reported_by  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason       review_report_reason NOT NULL,
  notes        TEXT,
  status       review_report_status NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One report per user per review
  UNIQUE (review_id, reported_by)
);

CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX idx_review_reports_status    ON review_reports(status);

-- ============================================================
-- Review Helpful Votes (prevents duplicate votes)
-- ============================================================
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "reviews_insert_buyer"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "reviews_update_buyer_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = buyer_id);

CREATE POLICY "reviews_delete_buyer_own"
  ON reviews FOR DELETE
  USING (
    auth.uid() = buyer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- review_reports
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_reports_insert_authenticated"
  ON review_reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "review_reports_select_own_or_admin"
  ON review_reports FOR SELECT
  USING (
    auth.uid() = reported_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- review_helpful_votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "helpful_votes_select_all"
  ON review_helpful_votes FOR SELECT USING (true);

CREATE POLICY "helpful_votes_insert_own"
  ON review_helpful_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "helpful_votes_delete_own"
  ON review_helpful_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Seller Reputation View
-- Automatically aggregates avg rating, total reviews,
-- and response rate whenever queried.
-- ============================================================
CREATE OR REPLACE VIEW seller_reputation AS
SELECT
  seller_id,
  COUNT(*)::INT                                      AS total_reviews,
  ROUND(AVG(rating)::NUMERIC, 2)                    AS average_rating,
  COUNT(*) FILTER (WHERE rating = 5)::INT           AS five_star,
  COUNT(*) FILTER (WHERE rating = 4)::INT           AS four_star,
  COUNT(*) FILTER (WHERE rating = 3)::INT           AS three_star,
  COUNT(*) FILTER (WHERE rating = 2)::INT           AS two_star,
  COUNT(*) FILTER (WHERE rating = 1)::INT           AS one_star,
  COUNT(*) FILTER (WHERE seller_response IS NOT NULL)::INT AS responses,
  CASE
    WHEN COUNT(*) > 0
    THEN ROUND(
      (COUNT(*) FILTER (WHERE seller_response IS NOT NULL)::NUMERIC / COUNT(*)) * 100, 1
    )
    ELSE 0
  END                                               AS response_rate_pct
FROM reviews
WHERE reported = false
GROUP BY seller_id;

-- ============================================================
-- Product Rating View
-- ============================================================
CREATE OR REPLACE VIEW product_rating_summary AS
SELECT
  product_id,
  COUNT(*)::INT                                  AS total_reviews,
  ROUND(AVG(rating)::NUMERIC, 2)                AS average_rating,
  COUNT(*) FILTER (WHERE rating = 5)::INT       AS five_star,
  COUNT(*) FILTER (WHERE rating = 4)::INT       AS four_star,
  COUNT(*) FILTER (WHERE rating = 3)::INT       AS three_star,
  COUNT(*) FILTER (WHERE rating = 2)::INT       AS two_star,
  COUNT(*) FILTER (WHERE rating = 1)::INT       AS one_star,
  COUNT(*) FILTER (WHERE verified_purchase)::INT AS verified_count
FROM reviews
WHERE reported = false
GROUP BY product_id;
