# AgroMarket Open Source Community Plan & Issues Directory 🌾

This document prepares AgroMarket for programs like **Drips Wave** and open-source scaling by defining the project board configurations, standard issue labels, and a comprehensive directory of **50 curated issues** ready to be imported.

---

## 🎨 GitHub Labels Directory

| Label Group | Label Name | Color | Description |
|-------------|------------|-------|-------------|
| **Issue Category** | `bug` | `#d73a4a` | Something isn't working correctly. |
| | `enhancement` | `#a2eeef` | New feature or code enhancement proposal. |
| | `documentation` | `#0075ca` | Improvements or additions to documentation. |
| | `performance` | `#8f44ad` | Latency, memory, or db optimization task. |
| | `accessibility` | `#1abc9c` | Accessibility, keyboard focus, screen reader fixes. |
| **Difficulty** | `good first issue` | `#7057ff` | Suitable for first-time repository contributors. |
| | `difficulty: beginner` | `#3498db` | Easy tasks matching standard JS/React knowledge. |
| | `difficulty: intermediate` | `#e67e22` | Requires understanding features interactions / hooks. |
| | `difficulty: advanced` | `#e74c3c` | Complex DB/blockchain design, performance optimization. |
| **Priority** | `priority: low` | `#2ecc71` | Trivial bugs, doc typos, styling polish. |
| | `priority: medium` | `#f1c40f` | Normal feature backlog or core components fixes. |
| | `priority: high` | `#e74c3c` | Production blocking bugs, auth lapses, payment failures. |
| **Program Tracks** | `drips-wave` | `#2c3e50` | Open-source reward tasks under the Drips Wave program. |

---

## 📅 Milestones & Project Boards

### Milestone v1.1.0: Discovery & Reputation Polishing
- Target completion of reviews, ratings aggregates, global search query performance, and basic recommendations.

### Project Board Columns
1. **Backlog** (All open issues)
2. **Ready for Work** (Assigned, scoped issues with clear acceptance criteria)
3. **In Progress** (Active branch creation)
4. **In Review** (PR submitted, undergoing code review)
5. **Done** (Merged to master)

---

## 📋 50 Open Issues Directory

### 👶 Good First Issue (15 Issues)

#### Issue 1: Fix ESLint warnings in NotificationBell
- **Description:** Clean up standard ESLint warnings, unused imports, or formatting warnings in the notification bell component.
- **Acceptance Criteria:** Component passes `npm run lint` cleanly.
- **Files Affected:** [`src/features/notifications/components/NotificationBell.tsx`](file:///c:/Users/Ososanwo%20Idris/agromarket/src/features/notifications/components/NotificationBell.tsx)
- **Labels:** `good first issue`, `bug`, `priority: low`

#### Issue 2: Add ARIA labels to button component
- **Description:** Extend standard Button props to enforce descriptive aria-label requirements for screen readers.
- **Acceptance Criteria:** WCAG contrast/label compliance is maintained on interactive buttons.
- **Files Affected:** [`src/components/ui/button.tsx`](file:///c:/Users/Ososanwo%20Idris/agromarket/src/components/ui/button.tsx)
- **Labels:** `good first issue`, `accessibility`, `priority: low`

#### Issue 3: Correct walkthrough typos
- **Description:** Correct spelling mistakes, folder names references, and formatting in the feature walkthrough markdown file.
- **Acceptance Criteria:** File contains no typos and links resolve correctly.
- **Files Affected:** [`walkthrough.md`](file:///c:/Users/Ososanwo%20Idris/agromarket/walkthrough.md)
- **Labels:** `good first issue`, `documentation`, `priority: low`

#### Issue 4: Responsive paddings on marketplace details page
- **Description:** Increase horizontal padding on mobile viewports for the product detail content layout to prevent edge clip.
- **Acceptance Criteria:** Looks balanced on mobile viewports down to 320px width.
- **Files Affected:** `src/app/marketplace/[id]/page.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 5: Add unit test for formatRelativeTime helper
- **Description:** Write comprehensive unit test assertions verifying time calculations (just now, mins, hours, days ago) for the relative time helper.
- **Acceptance Criteria:** Vitest test suite runs and passes assertions successfully.
- **Files Affected:** `src/features/reviews/components/ReviewCard.tsx`
- **Labels:** `good first issue`, `test`, `priority: low`

#### Issue 6: Add currency symbol (₦) helper
- **Description:** Extract currency formatting logic to a global helper and apply to all marketplace prices to maintain formatting parity.
- **Acceptance Criteria:** Prices render formatted with thousands separators (e.g. ₦1,500.00).
- **Files Affected:** `src/lib/utils.ts`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 7: Add placeholder input guides on notification preferences form
- **Description:** Add descriptive hints under form input labels showing format requirements for email/phone settings.
- **Acceptance Criteria:** Form renders inline helper descriptions beneath input elements.
- **Files Affected:** `src/features/notifications/components/NotificationPreferencesForm.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 8: Minimum length constraint on product title
- **Description:** Add Zod schema validations requiring product titles to be at least 3 characters.
- **Acceptance Criteria:** Submissions fail validation if product title is too short.
- **Files Affected:** `src/features/products/schemas/index.ts`
- **Labels:** `good first issue`, `enhancement`, `priority: low`

#### Issue 9: Add a scroll-to-top button on search results page
- **Description:** Render a floating scroll-to-top button when users scroll down the product results list.
- **Acceptance Criteria:** Scroll-to-top button is visible only after scrolling past 400px down.
- **Files Affected:** `src/app/search/page.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 10: Cart clear confirmation modal
- **Description:** Prompt users with a simple browser confirm before clearing all items from the shopping cart.
- **Acceptance Criteria:** Cart is only cleared if user clicks confirm/OK.
- **Files Affected:** `src/features/checkout/components/CartOverview.tsx`
- **Labels:** `good first issue`, `enhancement`, `priority: low`

#### Issue 11: Active search filters badge counter
- **Description:** Render a badge showing count of currently active search filters.
- **Acceptance Criteria:** Badge count updates dynamically when filters are cleared.
- **Files Affected:** `src/features/search/components/ActiveFilters.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 12: RatingStars outline focus states
- **Description:** Apply visible outline focus rings on interactive star components when using keyboard tab keys.
- **Acceptance Criteria:** Focus ring renders when keyboard navigates star triggers.
- **Files Affected:** `src/features/reviews/components/RatingStars.tsx`
- **Labels:** `good first issue`, `accessibility`, `priority: low`

#### Issue 13: Validate phone format in profiles schema
- **Description:** Enforce regex patterns matching Nigerian phone numbers (+234 or 080...) in profiles schemas.
- **Acceptance Criteria:** Invalid formats fail form submission.
- **Files Affected:** `src/features/profile/schemas/index.ts`
- **Labels:** `good first issue`, `enhancement`, `priority: low`

#### Issue 14: Dynamic copyright year in footer
- **Description:** Make the copyright year in the footer dynamically match the current year.
- **Acceptance Criteria:** Footer copyright year updates automatically.
- **Files Affected:** `src/components/layout/Footer.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

#### Issue 15: Loading indicator on profile biography saving
- **Description:** Add loading spinners to the save button during bio update mutations.
- **Acceptance Criteria:** Save button shows loading status until promise resolves.
- **Files Affected:** `src/features/profile/components/BioForm.tsx`
- **Labels:** `good first issue`, `style`, `priority: low`

---

### 🟢 Beginner (15 Issues)

#### Issue 16: Navbar theme toggles (Light/Dark)
- **Description:** Add a responsive toggle button in the main layout navbar supporting switching between light and dark modes.
- **Acceptance Criteria:** App theme changes instantly on toggle click and persists preference.
- **Files Affected:** `src/components/layout/Navbar.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 17: Search history order by recency
- **Description:** Ensure search history queries order history rows descending by creation date.
- **Acceptance Criteria:** Newest search terms always show first in suggestions popover.
- **Files Affected:** `src/features/search/services/getRecentSearches.ts`
- **Labels:** `difficulty: beginner`, `bug`, `priority: low`

#### Issue 18: Buyer dashboard price filter for orders
- **Description:** Allow buyers to filter their orders list based on total order price range.
- **Acceptance Criteria:** User can inputs min/max bounds and list filters instantly.
- **Files Affected:** `src/features/buyer/components/OrdersList.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 19: Export CSV of reviews on seller dashboard
- **Description:** Add an export button to let sellers download their reviews history in CSV format.
- **Acceptance Criteria:** Downloads a structured CSV matching reviews schema.
- **Files Affected:** `src/features/seller/components/SellerReviews.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 20: Seller dashboard product catalog pagination
- **Description:** Implement pagination controls on the seller product list view.
- **Acceptance Criteria:** Shows a maximum of 10 items per page with next/prev buttons.
- **Files Affected:** `src/features/seller/components/ProductCatalog.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 21: Delivery date estimator on product page
- **Description:** Render an estimated delivery timeline banner on the product details page.
- **Acceptance Criteria:** Estimates timeline dynamically (e.g. 2-3 days for local, 5-7 days for state cross-transit).
- **Files Affected:** `src/app/marketplace/[id]/page.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 22: Filter out Suspended Users' listings
- **Description:** Modify marketplace queries to filter out listings created by suspended profiles.
- **Acceptance Criteria:** Products from suspended users do not render in marketplace results.
- **Files Affected:** `src/features/search/services/searchProducts.ts`
- **Labels:** `difficulty: beginner`, `bug`, `priority: medium`

#### Issue 23: Persist checkout products state in localStorage
- **Description:** Cache the current checkout items list in localStorage to recover from page reloads.
- **Acceptance Criteria:** Items persist and restore on refresh during checkout.
- **Files Affected:** `src/features/checkout/hooks/use-checkout.ts`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 24: Limit avatar upload sizes to 2MB
- **Description:** Check file size properties before triggering Supabase avatar storage uploads.
- **Acceptance Criteria:** Uploads above 2MB fail with descriptive validation warnings.
- **Files Affected:** `src/features/profile/services/uploadAvatar.ts`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: medium`

#### Issue 25: Confirmation modal for review deletions
- **Description:** Replace standard confirm statements with a stylized dialog modal when deleting reviews.
- **Acceptance Criteria:** Triggering delete opens dialog; confirming clears it.
- **Files Affected:** `src/features/reviews/components/ReviewCard.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 26: Product availability stock status badges
- **Description:** Render distinct badges (e.g. green: In Stock, orange: Low Stock < 5 units, red: Out of Stock) on produce cards.
- **Acceptance Criteria:** Stock quantities map correctly to badges.
- **Files Affected:** `src/features/marketplace/components/ProductCard.tsx`
- **Labels:** `difficulty: beginner`, `style`, `priority: low`

#### Issue 27: Validate image URLs in product form schemas
- **Description:** Add Zod validations ensuring listing image inputs are valid URL formats.
- **Acceptance Criteria:** Form throws validation errors on invalid URLs.
- **Files Affected:** `src/features/products/schemas/index.ts`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: medium`

#### Issue 28: Log product views into local storage
- **Description:** Write visited product IDs to local storage to feed basic offline recently viewed states.
- **Acceptance Criteria:** Visiting product appends ID to local array storage.
- **Files Affected:** `src/app/marketplace/[id]/page.tsx`
- **Labels:** `difficulty: beginner`, `enhancement`, `priority: low`

#### Issue 29: Order timeline tracking checklist
- **Description:** Add an active progress tracker (Pending -> Confirmed -> Dispatched -> Delivered) on the buyer order detail view.
- **Acceptance Criteria:** Timeline progress reflects DB order status fields correctly.
- **Files Affected:** `src/features/orders/components/OrderDetailCard.tsx`
- **Labels:** `difficulty: beginner`, `style`, `priority: low`

#### Issue 30: Merchant key verification logger
- **Description:** Check if Stellar public keys correspond to testnet structure at boot.
- **Acceptance Criteria:** Warns in developer console if keys mismatch standard length/format.
- **Files Affected:** `src/lib/stellar/client.ts`
- **Labels:** `difficulty: beginner`, `chore`, `priority: low`

---

### 🟠 Intermediate (12 Issues)

#### Issue 31: Resend email adapter for notifications
- **Description:** Implement a pluggable Resend adapter inside the notifications module email helper.
- **Acceptance Criteria:** Emails route via Resend client when `EMAIL_PROVIDER=resend`.
- **Files Affected:** [`src/features/notifications/services/sendEmailNotification.ts`](file:///c:/Users/Ososanwo%20Idris/agromarket/src/features/notifications/services/sendEmailNotification.ts)
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: medium`

#### Issue 32: SendGrid email adapter
- **Description:** Add a SendGrid client wrapper adapter in email notification service.
- **Acceptance Criteria:** Emails send via SendGrid Horizon client when `EMAIL_PROVIDER=sendgrid`.
- **Files Affected:** [`src/features/notifications/services/sendEmailNotification.ts`](file:///c:/Users/Ososanwo%20Idris/agromarket/src/features/notifications/services/sendEmailNotification.ts)
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: medium`

#### Issue 33: Integrate browser push notifications
- **Description:** Request browser notifications permission and show system alerts on database updates.
- **Acceptance Criteria:** Triggering notification creates system push notification if permission granted.
- **Files Affected:** `src/features/notifications/hooks/use-notifications.ts`
- **Labels:** `difficulty: intermediate`, `accessibility`, `priority: medium`

#### Issue 34: Stellar Expert transaction lookup links
- **Description:** Add clickable transaction hash buttons linking to Stellar Expert horizon ledger block explorer.
- **Acceptance Criteria:** Clicking hash opens explorer in new tab.
- **Files Affected:** `src/features/orders/components/InvoiceCard.tsx`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: low`

#### Issue 35: Ratings breakdown metrics on admin page
- **Description:** Add rating breakdown graphs to admin overview KPIs statistics.
- **Acceptance Criteria:** Displays count charts for average platform rating distribution.
- **Files Affected:** `src/app/admin/page.tsx`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: medium`

#### Issue 36: Soft delete reports & reviews moderation
- **Description:** Alter admin moderation functions to flag reported reviews instead of purging rows.
- **Acceptance Criteria:** Flagging sets `reported = true` and leaves comments in DB.
- **Files Affected:** `src/features/admin/services/resolveReport.ts`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: medium`

#### Issue 37: Related products horizontal carousel
- **Description:** Add a related items carousel at the bottom of product details pages.
- **Acceptance Criteria:** Pulls 4 relevant listings from same category.
- **Files Affected:** `src/app/marketplace/[id]/page.tsx`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: low`

#### Issue 38: Automatic cache invalidations on cart additions
- **Description:** Ensure cart badge count updates immediately when product is added from marketplace lists.
- **Acceptance Criteria:** Cart updates instantly across pages.
- **Files Affected:** `src/features/checkout/hooks/use-cart.ts`
- **Labels:** `difficulty: intermediate`, `bug`, `priority: medium`

#### Issue 39: Seller verification queue page
- **Description:** Create an admin dashboard layout showing list of pending sellers awaiting review.
- **Acceptance Criteria:** Admins can view uploaded docs and click verify.
- **Files Affected:** `src/app/admin/sellers/page.tsx`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: medium`

#### Issue 40: Database triggers for review moderation alerts
- **Description:** Trigger system notification when a single product receives more than 3 abuse reports.
- **Acceptance Criteria:** Automatically adds alert notification in admin logs.
- **Files Affected:** `supabase/migrations/10_reviews_schema.sql`
- **Labels:** `difficulty: intermediate`, `enhancement`, `priority: high`

#### Issue 41: Debounce search queries to prevent rate limits
- **Description:** Enforce debouncing on input queries targeting Horizon API lookup fields.
- **Acceptance Criteria:** Fast typing only triggers database search once input pauses.
- **Files Affected:** `src/features/search/components/SearchBar.tsx`
- **Labels:** `difficulty: intermediate`, `performance`, `priority: medium`

#### Issue 42: Mobile navigation sidebar slide-out
- **Description:** Create a mobile-friendly sliding navigation menu overlay.
- **Acceptance Criteria:** Smooth transitions and accessible keyboard locks.
- **Files Affected:** `src/components/layout/Navbar.tsx`
- **Labels:** `difficulty: intermediate`, `style`, `priority: low`

---

### 🔴 Advanced (8 Issues)

#### Issue 43: Stellar multi-asset anchor payments (USDC)
- **Description:** Extend checkout payment envelope generation to support USDC path payments alongside native XLM.
- **Acceptance Criteria:** Users can choose XLM or USDC and checkout executes valid trustline operations.
- **Files Affected:** `src/features/checkout/services/processPayment.ts`
- **Labels:** `difficulty: advanced`, `enhancement`, `priority: high`, `drips-wave`

#### Issue 44: Offline-first PWA caching for farm catalogs
- **Description:** Configure service worker caching for marketplace products to support browsing in low-connectivity rural regions.
- **Acceptance Criteria:** Page loads catalog items from Cache Storage when offline.
- **Files Affected:** `public/sw.js` (to create), `src/app/layout.tsx`
- **Labels:** `difficulty: advanced`, `performance`, `priority: medium`, `drips-wave`

#### Issue 45: Automated delivery signature matching via escrow
- **Description:** Secure order payouts using Stellar multi-signature transaction releases.
- **Acceptance Criteria:** Funds release to seller only after buyer confirms receipt.
- **Files Affected:** `src/features/checkout/services/processEscrow.ts`
- **Labels:** `difficulty: advanced`, `enhancement`, `priority: high`, `drips-wave`

#### Issue 46: pgvector similarity recommendations engine
- **Description:** Integrate Supabase `pgvector` to load product recommendations based on product title/category embeddings.
- **Acceptance Criteria:** Shows contextually matched products.
- **Files Affected:** `supabase/migrations/11_search_recommendations_schema.sql`, `src/features/search/services/getRecommendations.ts`
- **Labels:** `difficulty: advanced`, `performance`, `priority: medium`, `drips-wave`

#### Issue 47: Automated Stellar refund trigger
- **Description:** Implement refund Horizon queries executing refunds when order status transitions to cancelled.
- **Acceptance Criteria:** Cancelling order triggers refund Horizon envelope.
- **Files Affected:** `src/features/orders/services/cancelOrder.ts`
- **Labels:** `difficulty: advanced`, `enhancement`, `priority: high`, `drips-wave`

#### Issue 48: Escrow locks matching payment receipt
- **Description:** Implement database triggers locking stock quantities when payment hash completes validation.
- **Acceptance Criteria:** Stock reduces immediately when payment hash completes verification.
- **Files Affected:** `supabase/migrations/04_checkout_order_schema.sql`
- **Labels:** `difficulty: advanced`, `bug`, `priority: high`, `drips-wave`

#### Issue 49: Real-time seller chat system
- **Description:** Implement real-time farmer-to-buyer messaging using Supabase PostgreSQL Broadcast publication channels.
- **Acceptance Criteria:** Messages display instantly on active panels without refresh.
- **Files Affected:** `src/features/chat/` (to create)
- **Labels:** `difficulty: advanced`, `enhancement`, `priority: high`, `drips-wave`

#### Issue 50: Admin platform metrics visualization charts
- **Description:** Integrate recharts or custom SVG charts to display sales transaction velocities.
- **Acceptance Criteria:** Charts reflect real-time monthly payouts correctly.
- **Files Affected:** `src/app/admin/analytics/page.tsx`
- **Labels:** `difficulty: advanced`, `style`, `priority: medium`
