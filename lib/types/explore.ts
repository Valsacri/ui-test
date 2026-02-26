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
// Paginated response wrapper (Spring Boot Page)
// ---------------------------------------------------------------------------

export interface Page<T> {
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
