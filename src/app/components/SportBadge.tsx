import { cn } from '@/app/components/ui/utils';

interface SportBadgeProps {
  sport: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SportBadge({ 
  sport, 
  level, 
  icon, 
  size = 'md',
  className 
}: SportBadgeProps) {
  // Map sport names to icons if not provided
  const sportIcons: Record<string, string> = {
    'Running': '🏃',
    'Cycling': '🚴',
    'Basketball': '🏀',
    'Soccer': '⚽',
    'Yoga': '🧘',
    'Swimming': '🏊',
    'Tennis': '🎾',
    'CrossFit': '🏋️',
    'Hiking': '🥾',
    'Rock Climbing': '🧗'
  };

  const sportIcon = icon || sportIcons[sport] || '🏃';

  // Calculate number of active dashes based on level
  const levelDashes = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  }[level];

  const sizes = {
    sm: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      dash: 'w-[14px] h-1'
    },
    md: {
      container: 'w-20 h-20',
      icon: 'text-3xl',
      dash: 'w-[18px] h-1.5'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'text-4xl',
      dash: 'w-[22px] h-2'
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* Main badge container with white background */}
      <div className={cn(
        'relative bg-white rounded-[20px] flex items-center justify-center',
        currentSize.container
      )}>
        {/* Sport icon */}
        <span className={currentSize.icon}>
          {sportIcon}
        </span>

        {/* Corner dashes - 8 total positions, filled based on level */}
        {/* Top-left corner */}
        <div className={cn(
          'absolute top-0 left-0 rounded-tl-[20px]',
          currentSize.dash,
          levelDashes >= 1 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Top-right corner */}
        <div className={cn(
          'absolute top-0 right-0 rounded-tr-[20px]',
          currentSize.dash,
          levelDashes >= 2 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Bottom-right corner */}
        <div className={cn(
          'absolute bottom-0 right-0 rounded-br-[20px]',
          currentSize.dash,
          levelDashes >= 3 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Bottom-left corner - always inactive for 3-level system */}
        <div className={cn(
          'absolute bottom-0 left-0 rounded-bl-[20px]',
          currentSize.dash,
          'bg-gray-200'
        )} />

        {/* Top center */}
        <div className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2',
          currentSize.dash,
          levelDashes >= 1 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Right center */}
        <div className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 rotate-90',
          currentSize.dash,
          levelDashes >= 2 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Bottom center */}
        <div className={cn(
          'absolute bottom-0 left-1/2 -translate-x-1/2',
          currentSize.dash,
          levelDashes >= 3 ? 'bg-[#FC8936]' : 'bg-gray-200'
        )} />
        
        {/* Left center - always inactive for 3-level system */}
        <div className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 rotate-90',
          currentSize.dash,
          'bg-gray-200'
        )} />
      </div>
    </div>
  );
}
