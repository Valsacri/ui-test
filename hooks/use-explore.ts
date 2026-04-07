"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import useSWR from "swr"
import {
  fetchActivities,
  fetchFacilities,
  fetchServices,
  fetchBusinesses,
  fetchPeople,
  type ActivityCardData,
  type FacilityCardData,
  type ServiceCardData,
  type BusinessCardData,
  type PersonCardData,
  type ExploreParams,
} from "@/lib/explore-api"

export interface ExploreFilterState {
  contentTypes: string[]
  distance: number
  rating: string
}

const DEFAULT_FILTERS: ExploreFilterState = {
  contentTypes: [],
  distance: 10,
  rating: "Any",
}

// SWR fetcher wrappers — each section gets its own cached SWR call
const activitiesFetcher = (_key: string, params: ExploreParams) => fetchActivities(params)
const facilitiesFetcher = (_key: string, params: ExploreParams) => fetchFacilities(params)
const servicesFetcher = (_key: string, params: ExploreParams) => fetchServices(params)
const businessesFetcher = (_key: string, params: ExploreParams) => fetchBusinesses(params)
const peopleFetcher = (_key: string, params: ExploreParams) => fetchPeople(params)

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [activeSport, setActiveSport] = useState("All Sports")
  const [sidebarFilters, setSidebarFilters] = useState<ExploreFilterState>(DEFAULT_FILTERS)
  /** When set, Explore activities are limited to this host squad. */
  const [hostSquadId, setHostSquadId] = useState<string | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build the SWR key from current filter state — changes trigger re-fetch
  const params: ExploreParams = useMemo(() => ({
    query: debouncedQuery || undefined,
    sport: activeSport,
    rating: sidebarFilters.rating,
    hostSquadId: hostSquadId || undefined,
  }), [debouncedQuery, activeSport, sidebarFilters.rating, hostSquadId])

  // Determine which content types to show
  const visibleTypes = useMemo(() => {
    return sidebarFilters.contentTypes.length > 0
      ? sidebarFilters.contentTypes.map(t => t.toLowerCase())
      : ["activities", "facilities", "services", "businesses", "people"]
  }, [sidebarFilters.contentTypes])

  // SWR key serialization: [section, params] — null key skips fetch
  const swrConfig = { revalidateOnFocus: false, dedupingInterval: 5000 }

  const { data: activities = [], isLoading: loadingActivities } = useSWR(
    visibleTypes.includes("activities") ? ["explore-activities", params] : null,
    ([, p]) => fetchActivities(p),
    swrConfig,
  )

  const { data: facilities = [], isLoading: loadingFacilities } = useSWR(
    visibleTypes.includes("facilities") ? ["explore-facilities", params] : null,
    ([, p]) => fetchFacilities(p),
    swrConfig,
  )

  const { data: services = [], isLoading: loadingServices } = useSWR(
    visibleTypes.includes("services") ? ["explore-services", params] : null,
    ([, p]) => fetchServices(p),
    swrConfig,
  )

  const { data: businesses = [], isLoading: loadingBusinesses } = useSWR(
    visibleTypes.includes("businesses") ? ["explore-businesses", params] : null,
    ([, p]) => fetchBusinesses(p),
    swrConfig,
  )

  const { data: people = [], isLoading: loadingPeople } = useSWR(
    visibleTypes.includes("people") ? ["explore-people", params] : null,
    ([, p]) => fetchPeople(p),
    swrConfig,
  )

  const loading = loadingActivities || loadingFacilities || loadingServices || loadingBusinesses || loadingPeople

  const applyFilters = useCallback((filters: ExploreFilterState) => {
    setSidebarFilters(filters)
  }, [])

  const resetFilters = useCallback(() => {
    setSidebarFilters(DEFAULT_FILTERS)
    setSearchQuery("")
    setActiveSport("All Sports")
    setActiveTab("All")
    setHostSquadId(null)
  }, [])

  const totalResults =
    activities.length +
    facilities.length +
    services.length +
    businesses.length +
    people.length

  return {
    activities,
    facilities,
    services,
    businesses,
    people,
    loading,
    error: null as string | null, // SWR handles errors per-request
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    activeSport,
    setActiveSport,
    sidebarFilters,
    applyFilters,
    resetFilters,
    refetch: () => { }, // SWR auto-revalidates via key changes
    totalResults,
    hostSquadId,
    setHostSquadId,
  }
}
