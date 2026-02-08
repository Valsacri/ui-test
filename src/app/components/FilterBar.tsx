import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { MobileFilterSheet } from './BottomSheet';
import { touchTarget, responsive, iconSize } from '@/lib/design-system';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  /**
   * Unique identifier for the filter
   */
  id: string;
  
  /**
   * Label to display for this filter
   */
  label: string;
  
  /**
   * Available options for this filter
   */
  options: FilterOption[];
  
  /**
   * Current selected value
   */
  value: string;
  
  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
}

interface FilterBarProps {
  /**
   * Array of filter configurations
   */
  filters?: FilterConfig[];
  
  /**
   * Search functionality
   */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  
  /**
   * Whether filters are expanded by default
   */
  defaultExpanded?: boolean;
  
  /**
   * Custom actions to display on the right
   */
  actions?: React.ReactNode;
  
  /**
   * Callback when filters are cleared
   */
  onClear?: () => void;
  
  /**
   * Whether to show the filter toggle button (default: true if filters exist)
   */
  showToggle?: boolean;
  
  /**
   * Control the expanded state externally
   */
  showFilters?: boolean;
  
  /**
   * Callback when filter visibility changes
   */
  onToggleFilters?: (show: boolean) => void;
  
  /**
   * Whether to render controls inline (for use with PageHeader filterControls prop)
   */
  inline?: boolean;
}

export function FilterBar({
  filters = [],
  search,
  defaultExpanded = false,
  actions,
  onClear,
  showToggle = true,
  showFilters: controlledShowFilters,
  onToggleFilters,
  inline = false,
}: FilterBarProps) {
  const [internalShowFilters, setInternalShowFilters] = useState(defaultExpanded);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const showFilters = controlledShowFilters !== undefined ? controlledShowFilters : internalShowFilters;
  
  const handleToggleFilters = (value: boolean) => {
    if (onToggleFilters) {
      onToggleFilters(value);
    } else {
      setInternalShowFilters(value);
    }
  };

  // Count active filters
  const activeFilterCount = filters.filter(f => f.value && f.value !== 'all').length;
  const hasActiveFilters = activeFilterCount > 0 || (search?.value && search.value.length > 0);

  const handleClearAll = () => {
    filters.forEach(filter => filter.onChange('all'));
    if (search?.onChange) {
      search.onChange('');
    }
    if (onClear) {
      onClear();
    }
  };

  const controlsContent = (
    <>
      {/* Search Input (always visible on desktop, expandable on mobile) */}
      {search && (
        <>
          {showSearch || window.innerWidth >= 768 ? (
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconSize.sm} text-gray-400`} />
              <Input
                type="text"
                placeholder={search.placeholder || 'Search...'}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                className="pl-10 pr-10"
                autoFocus={showSearch && window.innerWidth < 768}
              />
              {search.value && (
                <button
                  onClick={() => search.onChange('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 ${touchTarget.sm} -m-2 p-2`}
                >
                  <X className={iconSize.sm} />
                </button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSearch(true)}
              className={`shrink-0 ${touchTarget.md} md:hidden`}
            >
              <Search className={iconSize.md} />
            </Button>
          )}
        </>
      )}

      {!inline && <div className="flex-1" />}

      {/* Filter Toggle Button - Desktop shows panel, Mobile shows bottom sheet */}
      {showToggle && filters.length > 0 && (
        <>
          {/* Desktop: Toggle panel */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleToggleFilters(!showFilters)}
            className={`gap-2 relative ${responsive.hideOnMobile} ${touchTarget.md}`}
          >
            <SlidersHorizontal className={iconSize.sm} />
            Filters
            {activeFilterCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 h-5 min-w-5 px-1.5 bg-[#FC8936] text-white border-none"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Mobile: Open bottom sheet */}
          <Button
            variant={activeFilterCount > 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowMobileFilters(true)}
            className={`gap-2 relative ${responsive.hideOnDesktop} ${touchTarget.md}`}
          >
            <SlidersHorizontal className={iconSize.sm} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 h-5 min-w-5 px-1.5 bg-[#FC8936] text-white border-none"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </>
      )}

      {/* Custom Actions */}
      {!inline && actions}
    </>
  );

  // Filter content to be reused
  const filterContent = (
    <div className="grid grid-cols-1 gap-4">
      {filters.map((filter) => (
        <div key={filter.id} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {filter.label}
          </label>
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className={`bg-white border-gray-300 ${touchTarget.md}`}>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value} className={touchTarget.md}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );

  // If inline mode, only return the controls without wrapper
  if (inline) {
    return <>{controlsContent}</>;
  }

  return (
    <>
      <div className="space-y-3">
        {/* Top Bar: Search and Filter Toggle */}
        <div className="flex items-center gap-2">
          {controlsContent}
        </div>

        {/* Desktop Filter Panel */}
        {showFilters && filters.length > 0 && (
          <div className={`${responsive.hideOnMobile} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3`}>
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  {filter.label}
                </label>
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className={`bg-white border-gray-300 ${touchTarget.md}`}>
                    <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value} className={touchTarget.sm}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className={`text-sm text-gray-600 hover:text-gray-900 ${touchTarget.md}`}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <MobileFilterSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        onApply={() => {}}
        onClear={hasActiveFilters ? handleClearAll : undefined}
      >
        {filterContent}
      </MobileFilterSheet>
    </>
  );
}