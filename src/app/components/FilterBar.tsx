import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useState } from 'react';

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
      {/* Search Input (expandable) */}
      {search && (
        <>
          {showSearch ? (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={search.placeholder || 'Search...'}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {search.value && (
                <button
                  onClick={() => search.onChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="shrink-0"
            >
              <Search className="w-4 h-4" />
            </Button>
          )}
        </>
      )}

      {!inline && <div className="flex-1" />}

      {/* Filter Toggle Button */}
      {showToggle && filters.length > 0 && (
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToggleFilters(!showFilters)}
          className="gap-2 relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
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
      )}

      {/* Custom Actions */}
      {!inline && actions}
    </>
  );

  // If inline mode, only return the controls without wrapper
  if (inline) {
    return <>{controlsContent}</>;
  }

  return (
    <div className="space-y-3">
      {/* Top Bar: Search and Filter Toggle */}
      <div className="flex items-center gap-2 -mx-6 px-6">
        {controlsContent}
      </div>

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 -mx-6 px-6">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                {filter.label}
              </label>
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="bg-white border-gray-300 h-9">
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
                className="text-sm text-muted-foreground hover:text-gray-900 h-9"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}