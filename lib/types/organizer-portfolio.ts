export interface OrganizerPortfolioEventDto {
  id: string
  name: string
  date: string
  location: string
  attendance: number
  mediaReach: number
  engagementRate: number
  geographicReach: string[]
  partnerLogoUrls: string[]
  deliverablesCompleted: string[]
  sponsorReachGenerated: number
  photoUrls: string[]
  documentUrls: string[]
  mediaLinks: string[]
  socialLinks: string[]
  testimonials: OrganizerPortfolioTestimonialDto[]
}

export interface OrganizerPortfolioTestimonialDto {
  author: string
  role: string
  text: string
}

export interface OrganizerPortfolioOverviewDto {
  totalEvents: number
  totalAttendance: number
  totalMediaReach: number
  averageEngagementRate: number
}

export interface OrganizerPortfolioDto {
  businessId: string
  overview: OrganizerPortfolioOverviewDto
  events: OrganizerPortfolioEventDto[]
}

export interface CreateOrganizerPortfolioEventCommand {
  name: string
  date: string
  location: string
  attendance: number
  mediaReach: number
  engagementRate: number
  geographicReach: string[]
  partnerLogoUrls: string[]
  deliverablesCompleted: string[]
  sponsorReachGenerated: number
}

export interface AddOrganizerPortfolioLinksCommand {
  urls: string[]
}

export interface AddOrganizerPortfolioTestimonialCommand {
  author: string
  role: string
  text: string
}
