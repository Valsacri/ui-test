/**
 * Sporgates Design System Constants
 * Centralized design tokens for consistent UI
 */

// ========================================
// SPACING SYSTEM
// ========================================
export const spacing = {
  xs: 'gap-2',    // 8px - Tight spacing (icon + text, compact lists)
  sm: 'gap-3',    // 12px - Small spacing (form fields, card content)
  md: 'gap-4',    // 16px - Medium spacing (card sections, default)
  lg: 'gap-6',    // 24px - Large spacing (page sections, major groups)
  xl: 'gap-8',    // 32px - Extra large (page layout, hero sections)
} as const;

export const padding = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

export const marginBottom = {
  xs: 'mb-2',
  sm: 'mb-3',
  md: 'mb-4',
  lg: 'mb-6',
  xl: 'mb-8',
} as const;

// ========================================
// ELEVATION SYSTEM (Shadows & Borders)
// ========================================
export const elevation = {
  none: '',
  flat: 'border border-gray-200',                                    // Level 0 - Flat cards
  low: 'border border-gray-200 shadow-sm',                          // Level 1 - Subtle elevation
  medium: 'border border-gray-200 shadow-md',                       // Level 2 - Cards, dropdowns
  high: 'shadow-lg border border-gray-100',                         // Level 3 - Modals, important cards
  floating: 'shadow-xl border border-gray-100',                     // Level 4 - Floating elements
} as const;

// ========================================
// BUTTON HIERARCHY
// ========================================
export const buttonVariants = {
  primary: 'default',      // Main CTAs, important actions
  secondary: 'secondary',  // Secondary actions
  outline: 'outline',      // Alternative actions, filters
  ghost: 'ghost',          // Tertiary, icon buttons, less important
  destructive: 'destructive', // Delete, remove, dangerous actions
} as const;

// ========================================
// CARD STYLES
// ========================================
export const cardStyles = {
  default: 'bg-white rounded-lg border border-gray-200 shadow-sm',
  elevated: 'bg-white rounded-lg shadow-md border border-gray-100',
  flat: 'bg-white rounded-lg border border-gray-200',
  interactive: 'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer',
} as const;

// ========================================
// TYPOGRAPHY SCALE
// ========================================
export const typography = {
  pageTitle: 'text-3xl font-bold text-gray-900',
  sectionTitle: 'text-2xl font-bold text-gray-900',
  cardTitle: 'text-xl font-semibold text-gray-900',
  heading: 'text-lg font-semibold text-gray-900',
  subheading: 'text-base font-medium text-gray-700',
  body: 'text-base text-gray-700',
  bodySm: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
  label: 'text-sm font-medium text-gray-700',
} as const;

// ========================================
// ICON SIZES
// ========================================
export const iconSize = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

// ========================================
// BRAND COLORS (from theme)
// ========================================
export const colors = {
  primary: '#003C66',
  primaryHover: '#002A4A',
  secondary: '#FC8936',
  secondaryHover: '#E67825',
} as const;

// ========================================
// TRANSITION CLASSES
// ========================================
export const transitions = {
  default: 'transition-all duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
  colors: 'transition-colors duration-200',
  shadow: 'transition-shadow duration-200',
} as const;

// ========================================
// RESPONSIVE BREAKPOINTS
// ========================================
export const breakpoints = {
  mobile: '640px',   // sm
  tablet: '768px',   // md
  desktop: '1024px', // lg
  wide: '1280px',    // xl
} as const;

// ========================================
// MOBILE-FIRST UTILITIES
// ========================================
export const touchTarget = {
  sm: 'min-h-[40px] min-w-[40px]',    // Small touch targets
  md: 'min-h-[44px] min-w-[44px]',    // Standard (iOS/Android recommended)
  lg: 'min-h-[48px] min-w-[48px]',    // Large touch targets
} as const;

export const responsive = {
  // Hide on mobile, show on desktop
  hideOnMobile: 'hidden md:block',
  hideOnDesktop: 'block md:hidden',
  
  // Container padding that adapts
  containerPadding: 'px-4 md:px-6 lg:px-8',
  
  // Grid layouts that adapt
  gridAuto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  gridTwo: 'grid-cols-1 md:grid-cols-2',
  gridThree: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  gridFour: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  
  // Flex direction that changes
  stackOnMobile: 'flex-col md:flex-row',
  
  // Text sizes that scale
  responsiveText: 'text-base md:text-lg',
  responsiveTitle: 'text-2xl md:text-3xl lg:text-4xl',
  
  // Max widths for content
  maxContent: 'max-w-7xl mx-auto',
  maxReading: 'max-w-4xl mx-auto',
} as const;

// ========================================
// BORDER RADIUS
// ========================================
export const radius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

// ========================================
// FOCUS STYLES (Accessibility)
// ========================================
export const focus = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-[#003C66]/30 focus:ring-offset-2',
  ringInset: 'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#003C66]/30',
} as const;

// ========================================
// Z-INDEX SCALE
// ========================================
export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modalBackdrop: 'z-40',
  modal: 'z-50',
  popover: 'z-50',
  toast: 'z-50',
  tooltip: 'z-60',
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Combines design system classes safely
 */
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get spacing class by size
 */
export function getSpacing(size: keyof typeof spacing = 'md'): string {
  return spacing[size];
}

/**
 * Get elevation class by level
 */
export function getElevation(level: keyof typeof elevation = 'low'): string {
  return elevation[level];
}

/**
 * Check if screen is mobile (client-side only)
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if screen is tablet or smaller
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024;
}