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
} from '@/lib/types/explore'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function parseDate(value: unknown): Date | null {
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

export function formatDate(dateStr: unknown): string {
    const date = parseDate(dateStr)
    if (!date) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(startStr: unknown, endStr: unknown): string {
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

export function formatOpeningHours(hours: Record<string, string> | null): string {
    if (!hours || Object.keys(hours).length === 0) return 'Hours not available'
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const todayIdx = new Date().getDay()
    const todayKey = days[(todayIdx + 6) % 7]
    return hours[todayKey] || Object.values(hours)[0] || 'Hours not available'
}

export function getInitials(name: string): string {
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
