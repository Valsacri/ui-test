import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ReactNode } from 'react';

interface PageHeaderProps {
  /**
   * Main title of the page
   */
  title: string;
  
  /**
   * Optional subtitle/description
   */
  subtitle?: string;
  
  /**
   * Optional back button handler
   */
  onBack?: () => void;
  
  /**
   * Optional back button text (defaults to "Back")
   */
  backText?: string;
  
  /**
   * Actions to display on the right side (buttons, filters, etc.)
   */
  actions?: ReactNode;
  
  /**
   * Optional icon to display before the title
   */
  icon?: ReactNode;
  
  /**
   * Optional content to display below the header (like filters)
   */
  children?: ReactNode;
  
  /**
   * Optional filter controls to display inline with title (search/filter buttons)
   */
  filterControls?: ReactNode;
  
  /**
   * Whether to wrap in a card (default: true)
   */
  variant?: 'card' | 'simple';
  
  /**
   * Custom class names
   */
  className?: string;
  
  /**
   * Enable search input
   */
  showSearch?: boolean;
  
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  
  /**
   * Search value
   */
  searchValue?: string;
  
  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;
  
  /**
   * Enable filter button
   */
  showFilter?: boolean;
  
  /**
   * Filter click handler
   */
  onFilterClick?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  backText = 'Back',
  actions,
  icon,
  children,
  filterControls,
  variant = 'card',
  className = '',
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showFilter = false,
  onFilterClick,
}: PageHeaderProps) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate inline-block">{title}</h1>
              {subtitle && !filterControls && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {filterControls && (
          <div className="flex items-center gap-2 shrink-0">
            {filterControls}
          </div>
        )}

        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
      
      {subtitle && filterControls && (
        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
      )}
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
      
      {(showSearch || showFilter) && (
        <div className="flex gap-3 mt-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="pl-10"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
          {showFilter && (
            <Button variant="outline" size="icon" onClick={onFilterClick}>
              <Filter className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (variant === 'simple') {
    return (
      <div className={`${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      {content}
    </div>
  );
}