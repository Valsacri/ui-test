import apiClient from './api'
import { mapActivity, mapFacility, mapService, mapBusiness, mapPerson } from './mappers/explore-mappers'

// Re-export types and mappers for backward compatibility
export type {
  ActivityDto,
  FacilityDto,
  ServiceListingDto,
  BusinessResponseDto,
  UserDto,
  ActivityCardData,
  FacilityCardData,
  ServiceCardData,
  BusinessCardData,
  PersonCardData,
  Page,
  ExploreParams,
} from './types/explore'

export {
  mapActivity,
  mapFacility,
  mapService,
  mapBusiness,
  mapPerson,
  parseDate,
  formatDate,
  formatTime,
  formatOpeningHours,
  getInitials,
} from './mappers/explore-mappers'

import type {
  ActivityDto,
  FacilityDto,
  ServiceListingDto,
  BusinessResponseDto,
  UserDto,
  ActivityCardData,
  FacilityCardData,
  ServiceCardData,
  BusinessCardData,
  PersonCardData,
  Page,
  ExploreParams,
} from './types/explore'

// ---------------------------------------------------------------------------
// API fetch functions
// ---------------------------------------------------------------------------

export async function fetchActivities(params?: ExploreParams): Promise<ActivityCardData[]> {
  try {
    let response
    if (params?.hostSquadId) {
      response = await apiClient.get<ActivityDto[]>('/v1/activities', {
        params: { hostSquadId: params.hostSquadId },
      })
    } else if (params?.query) {
      response = await apiClient.get<ActivityDto[]>('/v1/activities/search', {
        params: { query: params.query },
      })
    } else if (params?.sport && params.sport !== 'All Sports') {
      response = await apiClient.get<ActivityDto[]>('/v1/activities/search', {
        params: { query: params.sport },
      })
    } else {
      response = await apiClient.get<ActivityDto[]>('/v1/activities')
    }

    let results = (response.data || []).map(mapActivity)

    if (params?.hostSquadId && params?.query?.trim()) {
      const q = params.query.trim().toLowerCase()
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.sport.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    }

    if (params?.hostSquadId && params?.sport && params.sport !== 'All Sports') {
      const s = params.sport.toLowerCase()
      results = results.filter((a) => a.sport.toLowerCase().includes(s))
    }

    if (params?.rating && params.rating !== 'Any') {
      const minRating = parseFloat(params.rating.replace('+', ''))
      results = results.filter(a => a.rating >= minRating)
    }
    return results
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return []
  }
}

export async function fetchFacilities(params?: ExploreParams): Promise<FacilityCardData[]> {
  try {
    const queryParams: Record<string, string> = {}
    if (params?.query) {
      queryParams.query = params.query
    } else if (params?.sport && params.sport !== 'All Sports') {
      queryParams.query = params.sport
    }

    const response = await apiClient.get<FacilityDto[]>('/v1/facilities', { params: queryParams })
    let results = (response.data || []).map(mapFacility)

    if (params?.rating && params.rating !== 'Any') {
      const minRating = parseFloat(params.rating.replace('+', ''))
      results = results.filter(f => f.rating >= minRating)
    }
    return results
  } catch (error) {
    console.error('Failed to fetch facilities:', error)
    return []
  }
}

export async function fetchServices(params?: ExploreParams): Promise<ServiceCardData[]> {
  try {
    let response
    if (params?.query) {
      response = await apiClient.get<ServiceListingDto[]>('/v1/services/search', {
        params: { query: params.query },
      })
    } else if (params?.sport && params.sport !== 'All Sports') {
      response = await apiClient.get<ServiceListingDto[]>('/v1/services/search', {
        params: { query: params.sport },
      })
    } else {
      response = await apiClient.get<ServiceListingDto[]>('/v1/services')
    }

    let results = (response.data || []).map(mapService)

    if (params?.rating && params.rating !== 'Any') {
      const minRating = parseFloat(params.rating.replace('+', ''))
      results = results.filter(s => s.rating >= minRating)
    }
    return results
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export async function fetchBusinesses(params?: ExploreParams): Promise<BusinessCardData[]> {
  try {
    const queryParams: Record<string, string> = {}
    if (params?.query) {
      queryParams.search = params.query
    } else if (params?.sport && params.sport !== 'All Sports') {
      queryParams.search = params.sport
    }

    const response = await apiClient.get<Page<BusinessResponseDto>>('/v1/businesses', { params: queryParams })
    const data = response.data?.content || []
    let results = data.map(mapBusiness)

    if (params?.rating && params.rating !== 'Any') {
      const minRating = parseFloat(params.rating.replace('+', ''))
      results = results.filter(b => b.rating >= minRating)
    }
    return results
  } catch (error) {
    console.error('Failed to fetch businesses:', error)
    return []
  }
}

export async function fetchPeople(params?: ExploreParams): Promise<PersonCardData[]> {
  try {
    const queryParams: Record<string, string> = {}
    if (params?.query) {
      queryParams.query = params.query
    } else if (params?.sport && params.sport !== 'All Sports') {
      queryParams.query = params.sport
    }

    const response = await apiClient.get<Page<UserDto>>('/v1/users', { params: queryParams })
    return (response.data?.content || []).map(mapPerson)
  } catch (error) {
    console.error('Failed to fetch people:', error)
    return []
  }
}
