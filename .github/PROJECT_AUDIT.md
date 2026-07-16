# AgroMarket Project Audit & Contributor Readiness Report 🔍

This report details a professional maintainer audit of the AgroMarket project, reviewing its structure, architecture, security, performance, documentation, and overall readiness for the **Drips Wave** program.

---

## 1. Executive Summary

AgroMarket has a robust feature-complete implementation featuring Next.js 16 App Router, Supabase RLS schema, React Query server caching, and Stellar payments. However, as an open-source repository, several structural improvements, documentation gaps, and architectural refactoring opportunities must be addressed to ensure a seamless developer experience (DX) for contributors.

---

## 2. Comprehensive Review

### 📁 Folder Structure & Architecture
* **Strengths:** Consistent use of a feature-based architecture under `src/features/` with isolated services, components, types, and custom hooks.
* **Findings:**
  - *Stale Files:* Discarded mock structures in the project root should be removed.
  - *Next.js Route Cache warnings:* The `/admin` folder triggers dynamic caching warning due to layout paths mapping.
  - *Feature Coupling:* Certain services (e.g. `sendEmailNotification.ts`) should be generic utility wrappers instead of coupled features.

### 🔒 Security & RLS
* **Strengths:** Supabase RLS is enabled on all tables, and update/delete policies restrict operations to `auth.uid() = user_id`.
* **Findings:**
  - *Public Read Policies:* Ensure reviews with `reported = true` are filtered out database-side instead of relying on client-side filters.
  - *Credential Leak Checks:* Ensure `.env.example` contains no mock keys and gitignore explicitly covers all local variables.

### ♿ Accessibility (a11y)
* **Strengths:** Reusable buttons and form labels are mostly structured using descriptive tags.
* **Findings:**
  - *Focus Indicators:* Outline rings on interactive RatingStars and dropdown options are missing focus-visible classes.
  - *Color Contrast:* Alert dialog headers and subtext use standard muted text color styles that require high contrast checks.

### ⚡ Performance & Caching
* **Strengths:** TanStack Query handles caching and query keys optimization dynamically.
* **Findings:**
  - *Image Optimization:* Produces images use default HTML img tags instead of Next.js Image component wrappers.
  - *Database Indexing:* The `products` table has category and seller indexes, but lacks price and location indexes which will lead to sequential scans under heavy search load.

### 📝 Documentation & Testing
* **Strengths:** README and Contributing guides are highly comprehensive.
* **Findings:**
  - *Test Mock Coverage:* Unit tests cover auth and cart logic, but lack mocks for Stellar payments Horizon envelopes.
  - *Inline Comments:* Complex wallet signer callbacks require cleaner inline documentation.

---

## 3. Prioritized Improvement Roadmap

### 👶 Good First Issue (Low Priority)
1. **Remove unused imports across UI components:** Clean up ESLint warnings in `/components/ui/` components.
2. **Add document links to issues:** Add direct contributing guidelines links inside issue templates description.
3. **Format relative time boundary tests:** Expand Vitest coverage to cover edge time zones.
4. **Fix outline focus rings on RatingStars:** Add `focus-visible:ring-2` to stars buttons.

### 🟢 Beginner (Medium Priority)
5. **Convert product images to Next.js Image:** Replace `<img>` tags in ProductCard with `<Image>` wrappers for lazy loading.
6. **Add database index on product location:** Add `CREATE INDEX idx_products_location ON products(location)` to improve search query velocity.
7. **Limit cart quantity to max stock:** Disable increment buttons in the cart overview when quantity reaches maximum available stock.

### 🟠 Intermediate (High Priority)
8. **Stellar Horizon mock builder for tests:** Create a mock helper file simulating Horizon envelope signers to resolve payment test suites.
9. **Soft delete flag implementation:** Refactor admin moderations resolved reports to set `is_removed = true` rather than executing rows deletion.
10. **Debounce search term input wrapper:** Implement custom input debouncer hook to throttle database query loads.

### 🔴 Advanced (Critical Priority)
11. **Escrow lock automation trigger:** Implement DB triggers automatically reducing product quantities upon successful Stellar transaction validations.
12. **pgvector recommendations database migration:** Add pgvector similarity checks to support personalized recommendations on public product list views.
