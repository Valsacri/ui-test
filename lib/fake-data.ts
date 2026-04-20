/**
 * Hardcoded fake users and businesses for development/testing.
 * This replaces the authentication system and provides mock data.
 */

export interface FakeUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface FakeBusiness {
    id: string;
    name: string;
    bio: string;
    city: string;
    state: string;
    address?: string;
    avatar?: string;
    rating: number;
    followers: number;
    ownerId: string;
}

// Hardcoded fake users
export const FAKE_USERS: Record<string, FakeUser> = {
    user1: {
        id: 'user1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
    },
    user2: {
        id: 'user2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
    },
    user3: {
        id: 'user3',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        username: 'mikej',
    },
};

// Hardcoded fake businesses
export const FAKE_BUSINESSES: FakeBusiness[] = [
    {
        id: 'biz1',
        name: 'Urban Events Co',
        bio: 'Professional event planning and management for corporate and personal events.',
        city: 'New York',
        state: 'NY',
        address: '123 Main St',
        avatar: '/api/placeholder/64/64',
        rating: 4.8,
        followers: 1250,
        ownerId: 'user1',
    },
    {
        id: 'biz2',
        name: 'Creative Productions',
        bio: 'Full-service video production and creative content studio.',
        city: 'Los Angeles',
        state: 'CA',
        address: '456 Sunset Blvd',
        avatar: '/api/placeholder/64/64',
        rating: 4.6,
        followers: 890,
        ownerId: 'user1',
    },
    {
        id: 'biz3',
        name: 'Digital Marketing Pro',
        bio: 'Social media management and digital marketing strategies for small businesses.',
        city: 'San Francisco',
        state: 'CA',
        address: '789 Market St',
        avatar: '/api/placeholder/64/64',
        rating: 4.7,
        followers: 2100,
        ownerId: 'user2',
    },
    {
        id: 'biz4',
        name: 'Photography & Design',
        bio: 'Professional photography, graphic design, and brand identity services.',
        city: 'Boston',
        state: 'MA',
        address: '321 Newbury St',
        avatar: '/api/placeholder/64/64',
        rating: 4.9,
        followers: 3450,
        ownerId: 'user2',
    },
    {
        id: 'biz5',
        name: 'Tech Consulting Ltd',
        bio: 'IT consulting, software development, and digital transformation services.',
        city: 'Seattle',
        state: 'WA',
        address: '555 Pike St',
        avatar: '/api/placeholder/64/64',
        rating: 4.5,
        followers: 1680,
        ownerId: 'user3',
    },
];

// Default active user (the one who's always logged in)
export const DEFAULT_FAKE_USER = FAKE_USERS.user1;

// Get businesses for a specific user
export function getFakeBusinessesForUser(userId: string): FakeBusiness[] {
    return FAKE_BUSINESSES.filter(b => b.ownerId === userId);
}

// Get a specific business by ID
export function getFakeBusinessById(id: string): FakeBusiness | undefined {
    return FAKE_BUSINESSES.find(b => b.id === id);
}

// Team member data
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    joinDate: string;
    businessId: string;
}

export const FAKE_TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'tm1',
        name: 'Sarah Chen',
        email: 'sarah@urbaneventco.com',
        role: 'Event Manager',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-01-15',
        businessId: 'biz1',
    },
    {
        id: 'tm2',
        name: 'Marcus Brown',
        email: 'marcus@urbaneventco.com',
        role: 'Coordinator',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-03-20',
        businessId: 'biz1',
    },
    {
        id: 'tm3',
        name: 'Emily Wong',
        email: 'emily@urbaneventco.com',
        role: 'Marketing',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-06-10',
        businessId: 'biz1',
    },
    {
        id: 'tm4',
        name: 'David Lee',
        email: 'david@creative.com',
        role: 'Video Producer',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-02-05',
        businessId: 'biz2',
    },
    {
        id: 'tm5',
        name: 'Lisa Torres',
        email: 'lisa@creative.com',
        role: 'Cinematographer',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-04-12',
        businessId: 'biz2',
    },
];

// Resources (products, services, facilities, human resources)
export interface BusinessResource {
    id: string;
    businessId: string;
    type: 'product' | 'service' | 'facility' | 'human';
    name: string;
    description: string;
    image?: string;
}

export const FAKE_RESOURCES: BusinessResource[] = [
    // Products for biz1
    {
        id: 'res1',
        businessId: 'biz1',
        type: 'product',
        name: 'Event Planning Package - Standard',
        description: 'Comprehensive event planning for up to 100 guests',
        image: '/api/placeholder/100/100',
    },
    {
        id: 'res2',
        businessId: 'biz1',
        type: 'product',
        name: 'Event Planning Package - Premium',
        description: 'Full-service event planning for 100-500 guests',
        image: '/api/placeholder/100/100',
    },
    // Services for biz1
    {
        id: 'res3',
        businessId: 'biz1',
        type: 'service',
        name: 'Venue Coordination',
        description: 'Professional venue selection and coordination',
        image: '/api/placeholder/100/100',
    },
    {
        id: 'res4',
        businessId: 'biz1',
        type: 'service',
        name: 'Catering Management',
        description: 'Full catering coordination with trusted vendors',
        image: '/api/placeholder/100/100',
    },
    // Facilities for biz1
    {
        id: 'res5',
        businessId: 'biz1',
        type: 'facility',
        name: 'Event Planning Office',
        description: 'Main office in Manhattan',
        image: '/api/placeholder/100/100',
    },
    {
        id: 'res6',
        businessId: 'biz1',
        type: 'facility',
        name: 'Equipment Storage',
        description: 'Full storage facility for event equipment and supplies',
        image: '/api/placeholder/100/100',
    },
    // Products for biz2
    {
        id: 'res7',
        businessId: 'biz2',
        type: 'product',
        name: 'Corporate Video Production',
        description: 'Professional corporate video packages',
        image: '/api/placeholder/100/100',
    },
    {
        id: 'res8',
        businessId: 'biz2',
        type: 'service',
        name: 'Video Editing',
        description: 'Post-production video editing and color grading',
        image: '/api/placeholder/100/100',
    },
];

// Campaign data
export interface Campaign {
    id: string;
    businessId: string;
    name: string;
    description: string;
    budget: number;
    logo?: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    targetEvents: string[];
    createdAt: string;
    startDate?: string;
    endDate?: string;
}

export const FAKE_CAMPAIGNS: Campaign[] = [
    {
        id: 'camp1',
        businessId: 'biz1',
        name: 'Summer Events 2024',
        description: 'Brand visibility campaign for summer events',
        budget: 5000,
        logo: '/api/placeholder/100/100',
        status: 'active',
        targetEvents: ['wedding', 'corporate', 'festival'],
        createdAt: '2024-04-01',
        startDate: '2024-05-01',
        endDate: '2024-08-31',
    },
    {
        id: 'camp2',
        businessId: 'biz1',
        name: 'Holiday Events 2024',
        description: 'Holiday season campaign with special branding',
        budget: 3000,
        logo: '/api/placeholder/100/100',
        status: 'draft',
        targetEvents: ['holiday', 'birthday', 'anniversary'],
        createdAt: '2024-04-15',
    },
    {
        id: 'camp3',
        businessId: 'biz2',
        name: 'Production Showcase',
        description: 'Showcase creative production capabilities',
        budget: 7500,
        logo: '/api/placeholder/100/100',
        status: 'active',
        targetEvents: ['conference', 'trade_show', 'festival'],
        createdAt: '2024-03-20',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
    },
];

// Get team members for a business
export function getFakeTeamMembersForBusiness(businessId: string): TeamMember[] {
    return FAKE_TEAM_MEMBERS.filter(tm => tm.businessId === businessId);
}

// Get resources for a business
export function getFakeResourcesForBusiness(businessId: string, type?: string): BusinessResource[] {
    let resources = FAKE_RESOURCES.filter(r => r.businessId === businessId);
    if (type) {
        resources = resources.filter(r => r.type === type);
    }
    return resources;
}

// Get campaigns for a business
export function getFakeCampaignsForBusiness(businessId: string): Campaign[] {
    return FAKE_CAMPAIGNS.filter(c => c.businessId === businessId);
}
