# Search, Recommendations & Discovery Module Walkthrough

Detailed overview of the newly implemented Search, Filtering, Recommendations, and Product Discovery module, including files created, database schema, search architecture, recommendations generation, and filtering mechanism.

---

## 1. Database Schema (`supabase/migrations/11_search_recommendations_schema.sql`)
Implemented two core tables for user telemetry and history tracking:
- `search_history` table: Records search terms entered by logged-in users with a capping trigger keeping only the last 10 unique searches.
- `recently_viewed` table: Records product pages visited by the user to populate the dynamic discovery carousel.

---

## 2. Types & Schema Definitions
- `src/features/search/types/index.ts`: Standard TypeScript interfaces matching the filters, sorting options, suggestions, history, and recently viewed.

---

## 3. Database Services (`src/features/search/services/`)
- `searchProducts.ts`: Performs ILIKE pattern matching across product titles, descriptions, categories, and location fields. Supports price limits, category filters, and location dropdown constraints.
- `getRecommendations.ts`: Personalizes picks using recent search terms and falls back to top-rated items.
- `getTrendingProducts.ts`: Fetches products ordered by creation/activity levels.
- `getRelatedProducts.ts`: Loads category-matched items excluding the active product's ID.
- `saveSearchHistory.ts` & `getRecentSearches.ts`: Manages user search history.
- `getRecentlyViewed.ts`: Captures and returns recently-viewed logs.

---

## 4. Hooks (`src/features/search/hooks/use-search.ts`)
Hooks built on top of TanStack Query:
- `useSearchProducts(searchTerm, filters, sort, page)`
- `useRecommendations()`
- `useTrendingProducts()`
- `useRelatedProducts(productId, category)`
- `useRecentSearches()`
- `useRecentlyViewed()`
- `useSaveSearchHistory()`
- `useSaveRecentlyViewed()`

---

## 5. UI Components & App Pages
- **SearchBar**: Global search box with recent and popular search popovers.
- **FilterSidebar**: Left filter bar containing category lists, price ranges, locations, and status filters.
- **FilterDrawer**: Responsive mobile drawer overlay.
- **SortDropdown**: Ordering options (price, rating, date).
- **ActiveFilters**: Clearable badges displaying active search query limits.
- **RecommendationCarousel**: Horizontal scrollable product queues.
- **CategoryGrid**: Curated categories with visually rich gradients.
- **Pages**:
  - `/search`: Main search results panel.
  - `/categories/[category]`: Category slug browse view.
  - `/recommendations`: Personalized product hub.
  - `/trending`: List of popular listings.
