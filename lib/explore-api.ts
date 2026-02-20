import apiClient from './api'

// ---------------------------------------------------------------------------
// Backend DTO types (matching the Java DTOs)
// ---------------------------------------------------------------------------

export interface ActivityDto {
  id: string
  name: string
  description: string
  type: string
  status: string
  organizerId: string
  organizerName: string
  organizerAvatar: string
  facilityId: string
  sportId: string
  sportName: string
  startDateTime: string
  endDateTime: string
  maxParticipants: number
  currentParticipants: number
  pricePerPerson: number
  currency: string
  coverImage: string
  eventPoster: string
  imageUrls: string[]
  location: string
  address: string
  city: string
  state: string
  country: string
  difficultyLevel: string
  tags: string[]
  latitude: number
  longitude: number
  isFeatured: boolean
  rating: number
  reviewCount: number
}

export interface FacilityDto {
  id: string
  name: string
  description: string
  businessId: string
  ownerId: string
  ownerName: string
  sports: string[]
  grounds: string[]
  city: string
  state: string
  postalCode: string
  country: string
  address: string
  latitude: number
  longitude: number
  openingHours: Record<string, string>
  amenities: string[]
  coverImage: string
  imageUrls: string[]
  rating: number
  reviewCount: number
  isVerified: boolean
  isActive: boolean
  capacity: number
  pricePerHour: number
}

export interface ServiceListingDto {
  id: string
  name: string
  providerId: string
  providerName: string
  providerAvatar: string
  duration: string
  price: number
  currency: string
  rating: number
  reviews: number
  image: string
  imageUrls?: string[]
  category: string
  verified: boolean
  description: string
  address?: string
  offerings?: string[]
}

export interface BusinessResponseDto {
  id: string
  name: string
  type: string
  username: string
  owner: { id: string; firstName: string; lastName: string; profilePicture: string }
  staffCount: number
  bio: string
  avatar: string
  cover: string
  address: string
  city: string
  state: string
  zipCode: string
  verifiedAt: number | null
}

export interface UserDto {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  profilePicture: string
  bio: string
  role: string
  status: string
}

// ---------------------------------------------------------------------------
// Frontend card data types (matching card component props)
// ---------------------------------------------------------------------------

export interface ActivityCardData {
  id: string
  title: string
  sport: string
  date: string
  time: string
  location: string
  price: number
  currency: string
  spots: number
  totalSpots: number
  image: string
  rating: number
  reviews: number
  organizer: string
  organizerAvatar: string
  tags: string[]
  description: string
}

export interface FacilityCardData {
  id: string
  name: string
  type: string
  location: string
  coordinates: [number, number]
  rating: number
  reviews: number
  pricePerHour: number
  currency: string
  image: string
  imageUrls?: string[]
  amenities: string[]
  hours: string
  sports: string[]
  available: boolean
  capacity: number
  description: string
}

export interface ServiceCardData {
  id: string
  name: string
  provider: string
  providerAvatar: string
  duration: string
  price: number
  currency: string
  rating: number
  reviews: number
  image: string
  imageUrls?: string[]
  category: string
  verified: boolean
  description: string
  address?: string
  offerings?: string[]
}

export interface BusinessCardData {
  id: string
  name: string
  type: string
  location: string
  rating: number
  reviews: number
  image: string
  followers: number
  activities: number
  verified: boolean
}

export interface PersonCardData {
  id: string
  name: string
  sport: string
  role: string
  location: string
  followers: number
  rating: number
  avatar: string
  verified: boolean
  bio: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDate(value: unknown): Date | null {
  if (!value) return null
  if (Array.isArray(value)) {
    // Java LocalDateTime serialized as array: [year, month, day, hour, minute, second?]
    const [y, m, d, h = 0, min = 0, s = 0] = value as number[]
    const date = new Date(y, m - 1, d, h, min, s)
    return isNaN(date.getTime()) ? null : date
  }
  const date = new Date(value as string)
  return isNaN(date.getTime()) ? null : date
}

function formatDate(dateStr: unknown): string {
  const date = parseDate(dateStr)
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(startStr: unknown, endStr: unknown): string {
  const start = parseDate(startStr)
  if (!start) return ''
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const end = parseDate(endStr)
  if (end) {
    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${startTime} - ${endTime}`
  }
  return startTime
}

function formatOpeningHours(hours: Record<string, string> | null): string {
  if (!hours || Object.keys(hours).length === 0) return 'Hours not available'
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const todayIdx = new Date().getDay()
  const todayKey = days[(todayIdx + 6) % 7]
  return hours[todayKey] || Object.values(hours)[0] || 'Hours not available'
}

function getInitials(name: string): string {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ---------------------------------------------------------------------------
// Mapper functions (Backend DTO → Frontend card data)
// ---------------------------------------------------------------------------

export function mapActivity(dto: ActivityDto): ActivityCardData {
  return {
    id: dto.id,
    title: dto.name || 'Untitled Activity',
    sport: dto.sportName || dto.sportId || 'General',
    date: formatDate(dto.startDateTime),
    time: formatTime(dto.startDateTime, dto.endDateTime),
    location: dto.location || dto.city || 'Location TBD',
    price: dto.pricePerPerson || 0,
    currency: dto.currency || '$',
    spots: Math.max(0, (dto.maxParticipants || 0) - (dto.currentParticipants || 0)),
    totalSpots: dto.maxParticipants || 0,
    image: dto.coverImage || dto.imageUrls?.[0] || '',
    rating: dto.rating || 0,
    reviews: dto.reviewCount || 0,
    organizer: dto.organizerName || 'Unknown',
    organizerAvatar: dto.organizerAvatar || getInitials(dto.organizerName || ''),
    tags: dto.tags || [],
    description: dto.description || '',
  }
}

export function mapFacility(dto: FacilityDto): FacilityCardData {
  return {
    id: dto.id,
    name: dto.name || 'Unnamed Facility',
    type: dto.sports?.join(', ') || 'Sports Facility',
    location: [dto.address, dto.city].filter(Boolean).join(', ') || 'Location TBD',
    coordinates: [dto.latitude || 0, dto.longitude || 0],
    rating: dto.rating || 0,
    reviews: dto.reviewCount || 0,
    pricePerHour: dto.pricePerHour || 0,
    currency: '$',
    image: dto.coverImage || dto.imageUrls?.[0] || '',
    imageUrls: dto.imageUrls,
    amenities: dto.amenities || [],
    hours: formatOpeningHours(dto.openingHours),
    sports: dto.sports || [],
    available: dto.isActive !== false,
    capacity: dto.capacity || 0,
    description: dto.description || '',
  }
}

export function mapService(dto: ServiceListingDto): ServiceCardData {
  return {
    id: dto.id,
    name: dto.name || 'Unnamed Service',
    provider: dto.providerName || 'Unknown Provider',
    providerAvatar: dto.providerAvatar || getInitials(dto.providerName || ''),
    duration: dto.duration || '',
    price: dto.price || 0,
    currency: dto.currency || '$',
    rating: dto.rating || 0,
    reviews: dto.reviews || 0,
    image: dto.image || '',
    imageUrls: dto.imageUrls,
    category: dto.category || 'General',
    verified: dto.verified || false,
    description: dto.description || '',
    address: dto.address,
    offerings: dto.offerings,
  }
}

export function mapBusiness(dto: BusinessResponseDto): BusinessCardData {
  return {
    id: dto.id,
    name: dto.name || 'Unnamed Business',
    type: dto.type || 'Sports Business',
    location: [dto.address, dto.city].filter(Boolean).join(', ') || 'Location TBD',
    rating: 0,
    reviews: 0,
    image: dto.cover || dto.avatar || '',
    followers: 0,
    activities: 0,
    verified: !!dto.verifiedAt,
  }
}

export function mapPerson(dto: UserDto): PersonCardData {
  const fullName = [dto.firstName, dto.lastName].filter(Boolean).join(' ') || dto.username || 'Unknown'
  return {
    id: dto.id,
    name: fullName,
    sport: 'Athlete',
    role: dto.role === 'USER' ? 'Member' : dto.role || 'Member',
    location: '',
    followers: 0,
    rating: 0,
    avatar: dto.profilePicture || getInitials(fullName),
    verified: dto.status === 'ACTIVE',
    bio: dto.bio || '',
  }
}

// ---------------------------------------------------------------------------
// Paginated response wrapper (Spring Boot Page)
// ---------------------------------------------------------------------------

interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

export interface ExploreParams {
  query?: string
  sport?: string
  rating?: string
}

// ---------------------------------------------------------------------------
// API fetch functions
// ---------------------------------------------------------------------------

export async function fetchActivities(params?: ExploreParams): Promise<ActivityCardData[]> {
  try {
    let response
    if (params?.query) {
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

    const response = await apiClient.get<Page<UserDto>>('/users', { params: queryParams })
    return (response.data?.content || []).map(mapPerson)
  } catch (error) {
    console.error('Failed to fetch people:', error)
    return []
  }
}
