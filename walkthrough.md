# Reviews, Ratings & Reputation Module Walkthrough

Detailed overview of the newly implemented Reviews, Ratings, and Reputation module, including files created, database schema, verification mechanisms, and reputation calculations.

---

## 1. Database Schema (`supabase/migrations/10_reviews_schema.sql`)
Implemented three core tables and two aggregated database views for performance-oriented ratings calculations:
- `reviews` table: Stores review ratings (1–5), optional title, comment, verified status, seller responses, and helpful counts.
- `review_reports` table: Allows buyers/sellers to report reviews for spam/abuse/offensive content.
- `review_helpful_votes` table: Tracks buyer helpful marks to prevent double-voting.
- `seller_reputation` view: Aggregates seller ratings, total reviews count, and seller response rate percentage.
- `product_rating_summary` view: Aggregates product rating distribution, verified review counts, and overall average score.

---

## 2. Types & Schema Definitions
- `src/features/reviews/types/index.ts`: Standard TypeScript interfaces matching Supabase tables and views.
- `src/features/reviews/schemas/index.ts`: Strict Zod validation rules enforcing rating checks, character length, and response limits.

---

## 3. Database Services (`src/features/reviews/services/`)
- `createReview.ts`: Validates that a buyer has actually ordered the product, the order is delivered, and they haven't reviewed it yet (enforcing verified purchases on the server side).
- `updateReview.ts`: Authenticates owner before modifying title, stars, or comments.
- `deleteReview.ts`: Restricts deletions to the author or admins.
- `getProductReviews.ts`: Loads product-specific reviews with stars filter, search query, and sorting selection.
- `getSellerReviews.ts`: Loads seller-specific reviews.
- `getUnreviewedItems.ts`: Locates delivered items purchased by the buyer that are awaiting reviews.
- `markHelpful.ts`: Toggles helpful votes on reviews and updates counters.
- `reportReview.ts`: Flags review and saves report notes.
- `respondToReview.ts`: Handles seller-written replies.

---

## 4. Hooks (`src/features/reviews/hooks/use-reviews.ts`)
Hooks built on top of TanStack Query:
- `useProductReviews(productId, filters)`
- `useProductRatingSummary(productId)`
- `useSellerReviews(sellerId, filters)`
- `useSellerReputation(sellerId)`
- `useMyReviews()`
- `useUnreviewedItems()`
- `useCreateReview()`, `useUpdateReview()`, `useDeleteReview()`, `useMarkHelpful()`, `useReportReview()`, `useRespondToReview()`

---

## 5. UI Components & App Pages
- **Rating Stars**: Interactive star inputs and static displays.
- **Rating Breakdown**: Horizontal rating distribution percentages (5★ down to 1★).
- **Review Card & List**: Displays user avatar, date, star count, comment, edit/delete controls, helpful toggles, and report triggers.
- **Seller Response**: Handles professional inline seller feedback submission.
- **Pages**:
  - `/reviews`: Inbox history with tabs: "Pending Reviews" and "Reviews Written".
  - `/reviews/[id]`: Form where users input stars and write feedback.
  - `/seller/[id]/reviews`: Public reputation score breakdown and seller reviews.
  - `/product/[id]/reviews`: Detailed list of product reviews.
