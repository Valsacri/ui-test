export type HelpDocSection = {
  title: string
  bullets: string[]
}

export type HelpDocArticle = {
  id: string
  title: string
  category: "Getting Started" | "Activities" | "Campaigns" | "Resources" | "Operations"
  summary: string
  readTime: string
  updatedAt: string
  tags: string[]
  sections: HelpDocSection[]
}

export const HELP_DOC_ARTICLES: HelpDocArticle[] = [
  {
    id: "getting-started-business",
    title: "Business Workspace: First 30 Minutes",
    category: "Getting Started",
    summary: "Set up your business profile, key pages, and first publish-ready assets.",
    readTime: "6 min",
    updatedAt: "2026-04-01",
    tags: ["onboarding", "business", "setup", "profile"],
    sections: [
      {
        title: "What this covers",
        bullets: [
          "How to complete business onboarding and choose the right business mode.",
          "What to configure first so customers can trust your profile quickly.",
          "How to avoid common setup mistakes that block bookings and visibility.",
        ],
      },
      {
        title: "Recommended setup order",
        bullets: [
          "Create your business profile with clear name, logo, and complete contact data.",
          "Add at least one activity and one resource (facility/product/service).",
          "Review pricing, media, and descriptions for consistency before publishing.",
          "Launch a campaign only after activity/resource pages are complete.",
        ],
      },
    ],
  },
  {
    id: "create-activity-playbook",
    title: "Create Activity Playbook",
    category: "Activities",
    summary: "Use the step-based activity flow effectively from basic info to review.",
    readTime: "7 min",
    updatedAt: "2026-04-01",
    tags: ["activity", "schedule", "location", "sponsorship"],
    sections: [
      {
        title: "Before you publish",
        bullets: [
          "Use a specific title and include sport, level, and expected outcome.",
          "Set realistic capacity and schedule to reduce cancellation risk.",
          "Double-check location and contact details for day-of operations.",
        ],
      },
      {
        title: "Quality checklist",
        bullets: [
          "Add an event cover image and concise description.",
          "Validate date/time and any recurring sessions.",
          "Review pricing and sponsorship tiers for clarity.",
          "Use the review step to confirm everything matches your goal.",
        ],
      },
    ],
  },
  {
    id: "campaigns-end-to-end",
    title: "Campaigns End-to-End Guide",
    category: "Campaigns",
    summary: "Plan, launch, and optimize campaigns with a repeatable process.",
    readTime: "8 min",
    updatedAt: "2026-04-01",
    tags: ["campaign", "audience", "budget", "creative", "kpi"],
    sections: [
      {
        title: "Campaign lifecycle",
        bullets: [
          "Define a single primary objective (awareness, bookings, engagement).",
          "Set budget and schedule that can gather enough learning data.",
          "Pick target audience and launch with at least one strong creative.",
          "Use KPI review to pause weak variants and scale winners.",
        ],
      },
      {
        title: "Optimization principles",
        bullets: [
          "Avoid major edits too early while campaigns are in learning.",
          "Refresh creatives if performance health degrades.",
          "Track conversions and compare campaign periods consistently.",
        ],
      },
    ],
  },
  {
    id: "resources-facility",
    title: "Facilities: Setup and Booking Readiness",
    category: "Resources",
    summary: "Configure facilities with location, opening hours, and amenities.",
    readTime: "5 min",
    updatedAt: "2026-04-01",
    tags: ["facility", "hours", "amenities", "booking"],
    sections: [
      {
        title: "Must-have fields",
        bullets: [
          "Accurate address, city/state, and contact details.",
          "Opening hours configured for all active business days.",
          "Capacity and reservation constraints that match real operations.",
        ],
      },
      {
        title: "Conversion tips",
        bullets: [
          "Upload clear cover and supporting images.",
          "List amenities and grounds to reduce pre-booking questions.",
          "Keep pricing transparent and easy to compare.",
        ],
      },
    ],
  },
  {
    id: "resources-product",
    title: "Products: Catalog and Merchandising Basics",
    category: "Resources",
    summary: "Create product listings with clear pricing, brand, and availability.",
    readTime: "4 min",
    updatedAt: "2026-04-01",
    tags: ["product", "catalog", "pricing", "stock"],
    sections: [
      {
        title: "Listing essentials",
        bullets: [
          "Use category/subcategory to improve discoverability.",
          "Keep price and original price consistent with your offer policy.",
          "Set stock status correctly to avoid failed customer expectations.",
        ],
      },
      {
        title: "Presentation standards",
        bullets: [
          "Lead with your best image as cover.",
          "Use feature bullets to communicate fit, quality, and use case quickly.",
        ],
      },
    ],
  },
  {
    id: "resources-service",
    title: "Services: Offer Design and Clarity",
    category: "Resources",
    summary: "Publish services with clear duration, pricing, and scope.",
    readTime: "4 min",
    updatedAt: "2026-04-01",
    tags: ["service", "duration", "offerings", "address"],
    sections: [
      {
        title: "Service definition",
        bullets: [
          "Define the category and exact duration so customers know what they buy.",
          "Specify address/location context (onsite/remote/hybrid where relevant).",
          "List included offerings to reduce ambiguity before booking.",
        ],
      },
      {
        title: "Trust & conversion",
        bullets: [
          "Use plain-language descriptions and expected outcomes.",
          "Attach high-quality visuals tied to the actual service experience.",
        ],
      },
    ],
  },
  {
    id: "team-and-operations",
    title: "Team, Roles, and Daily Operations",
    category: "Operations",
    summary: "Coordinate team members, attendance, and customer workflows.",
    readTime: "6 min",
    updatedAt: "2026-04-01",
    tags: ["team", "attendance", "operations", "customers"],
    sections: [
      {
        title: "Operational flow",
        bullets: [
          "Assign team members with clear role ownership for activities/resources.",
          "Use attendance and customer pages to monitor delivery quality.",
          "Document recurring issues and update workflows every 2-4 weeks.",
        ],
      },
      {
        title: "Support readiness",
        bullets: [
          "Keep a simple incident playbook for cancellations and no-shows.",
          "Use support/contact channels for unresolved platform issues.",
        ],
      },
    ],
  },
]

export const HELP_DOC_CATEGORIES = [
  "All",
  "Getting Started",
  "Activities",
  "Campaigns",
  "Resources",
  "Operations",
] as const

