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
