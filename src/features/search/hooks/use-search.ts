'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchProducts } from '../services/searchProducts'
import { getRecommendations } from '../services/getRecommendations'
import { getTrendingProducts } from '../services/getTrendingProducts'
import { getRelatedProducts } from '../services/getRelatedProducts'
import { saveSearchHistory } from '../services/saveSearchHistory'
import { getRecentSearches } from '../services/getRecentSearches'
import { getRecentlyViewed, saveRecentlyViewed } from '../services/getRecentlyViewed'
import { SearchFilters, SortOption } from '../types'

// ============================================================
// Query Keys
// ============================================================
export const searchKeys = {
  all: ['search'] as const,
  results: (term: string, filters: SearchFilters, sort: SortOption, page: number) =>
    ['search', 'results', term, filters, sort, page] as const,
  recommendations: () => ['search', 'recommendations'] as const,
  trending: () => ['search', 'trending'] as const,
  related: (productId: string) => ['search', 'related', productId] as const,
  recent: () => ['search', 'recent'] as const,
  viewed: () => ['search', 'viewed'] as const,
}

// ============================================================
// Hooks
// ============================================================

export function useSearchProducts(
  searchTerm: string,
  filters: SearchFilters = {},
  sort: SortOption = 'newest',
  page: number = 1,
  limit: number = 12
) {
  return useQuery({
    queryKey: searchKeys.results(searchTerm, filters, sort, page),
    queryFn: () => searchProducts(searchTerm, filters, sort, page, limit),
    placeholderData: (previousData) => previousData, // keep previous data for smooth filtering
  })
}

export function useRecommendations(limit?: number) {
  return useQuery({
    queryKey: searchKeys.recommendations(),
    queryFn: () => getRecommendations(limit),
  })
}

export function useTrendingProducts(limit?: number) {
  return useQuery({
    queryKey: searchKeys.trending(),
    queryFn: () => getTrendingProducts(limit),
  })
}

export function useRelatedProducts(productId: string, category: string, limit?: number) {
  return useQuery({
    queryKey: searchKeys.related(productId),
    queryFn: () => getRelatedProducts(productId, category, limit),
    enabled: !!productId && !!category,
  })
}

export function useRecentSearches() {
  return useQuery({
    queryKey: searchKeys.recent(),
    queryFn: getRecentSearches,
  })
}

export function useRecentlyViewed() {
  return useQuery({
    queryKey: searchKeys.viewed(),
    queryFn: getRecentlyViewed,
  })
}

export function useSaveSearchHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (searchTerm: string) => saveSearchHistory(searchTerm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.recent() })
    },
  })
}

export function useSaveRecentlyViewed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => saveRecentlyViewed(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.viewed() })
    },
  })
}
