'use client'

import { useState, useCallback } from 'react'
import { DateRange } from '@/components/finance/DateRangeFilter'

export interface UseFiltersReturn {
  branchFilter: string | undefined
  sourceFilter: string | undefined
  dateRange: DateRange | undefined
  searchQuery: string
  setBranchFilter: (value: string | undefined) => void
  setSourceFilter: (value: string | undefined) => void
  setDateRange: (value: DateRange | undefined) => void
  setSearchQuery: (value: string) => void
  clearFilters: () => void
  hasFilters: boolean
  filterValues: {
    branchId?: string
    sourceUserName?: string
    dateRange?: DateRange
    searchQuery?: string
  }
}

/**
 * Reusable hook for managing common filter state across finance pages.
 * Provides branch, source, date range, and search query filters.
 */
export function useFilters(): UseFiltersReturn {
  const [branchFilter, setBranchFilter] = useState<string | undefined>()
  const [sourceFilter, setSourceFilter] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const clearFilters = useCallback(() => {
    setBranchFilter(undefined)
    setSourceFilter(undefined)
    setDateRange(undefined)
    setSearchQuery('')
  }, [])

  const hasFilters = !!(branchFilter || sourceFilter || dateRange || searchQuery)

  // Filter values object for API calls
  const filterValues = {
    branchId: branchFilter,
    sourceUserName: sourceFilter,
    dateRange,
    searchQuery: searchQuery || undefined,
  }

  return {
    branchFilter,
    sourceFilter,
    dateRange,
    searchQuery,
    setBranchFilter,
    setSourceFilter,
    setDateRange,
    setSearchQuery,
    clearFilters,
    hasFilters,
    filterValues,
  }
}

export default useFilters
