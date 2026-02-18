"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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

interface ExploreState {
  activities: ActivityCardData[]
  facilities: FacilityCardData[]
  services: ServiceCardData[]
  businesses: BusinessCardData[]
  people: PersonCardData[]
  loading: boolean
  error: string | null
}

const DEFAULT_FILTERS: ExploreFilterState = {
  contentTypes: [],
  distance: 10,
  rating: "Any",
}

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [activeSport, setActiveSport] = useState("All Sports")
  const [sidebarFilters, setSidebarFilters] = useState<ExploreFilterState>(DEFAULT_FILTERS)
  const [state, setState] = useState<ExploreState>({
    activities: [],
    facilities: [],
    services: [],
    businesses: [],
    people: [],
    loading: true,
    error: null,
  })

  const abortRef = useRef<AbortController | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchData = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState(prev => ({ ...prev, loading: true, error: null }))

    const params: ExploreParams = {
      query: debouncedQuery || undefined,
      sport: activeSport,
      rating: sidebarFilters.rating,
    }

    const visibleTypes = sidebarFilters.contentTypes.length > 0
      ? sidebarFilters.contentTypes.map(t => t.toLowerCase())
      : ["activities", "facilities", "services", "businesses", "people"]

    try {
      const [
        activitiesData,
        facilitiesData,
        servicesData,
        businessesData,
        peopleData,
      ] = await Promise.all([
        visibleTypes.includes("activities") ? fetchActivities(params) : Promise.resolve([]),
        visibleTypes.includes("facilities") ? fetchFacilities(params) : Promise.resolve([]),
        visibleTypes.includes("services") ? fetchServices(params) : Promise.resolve([]),
        visibleTypes.includes("businesses") ? fetchBusinesses(params) : Promise.resolve([]),
        visibleTypes.includes("people") ? fetchPeople(params) : Promise.resolve([]),
      ])

      if (controller.signal.aborted) return

      setState({
        activities: activitiesData,
        facilities: facilitiesData,
        services: servicesData,
        businesses: businessesData,
        people: peopleData,
        loading: false,
        error: null,
      })
    } catch {
      if (controller.signal.aborted) return
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load explore data. Please try again.",
      }))
    }
  }, [debouncedQuery, activeSport, sidebarFilters])

  useEffect(() => {
    fetchData()
    return () => { abortRef.current?.abort() }
  }, [fetchData])

  const applyFilters = useCallback((filters: ExploreFilterState) => {
    setSidebarFilters(filters)
  }, [])

  const resetFilters = useCallback(() => {
    setSidebarFilters(DEFAULT_FILTERS)
    setSearchQuery("")
    setActiveSport("All Sports")
    setActiveTab("All")
  }, [])

  const totalResults =
    state.activities.length +
    state.facilities.length +
    state.services.length +
    state.businesses.length +
    state.people.length

  return {
    ...state,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    activeSport,
    setActiveSport,
    sidebarFilters,
    applyFilters,
    resetFilters,
    refetch: fetchData,
    totalResults,
  }
}
