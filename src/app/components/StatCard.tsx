import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { spacing, elevation, iconSize } from '@/lib/design-system';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon: LucideIcon;
  
  /**
   * Label for the stat
   */
  label: string;
  
  /**
   * Main value to display
   */
  value: string | number;
  
  /**
   * Optional change percentage
   */
  change?: {
    value: number;
    isPositive: boolean;
  };
  
  /**
   * Optional subtitle/description
   */
  subtitle?: string;
  
  /**
   * Icon color (defaults to primary)
   */
  iconColor?: string;
  
  /**
   * Icon background color (defaults to blue gradient)
   */
  iconBgColor?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Custom class name
   */
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  subtitle,
  iconColor = 'text-[#003C66]',
  iconBgColor = 'bg-gradient-to-br from-blue-50 to-blue-100',
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
    >
      <Card 
        className={`${elevation.low} hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Header with icon and label */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`${iconSize.md} ${iconColor}`} />
            </div>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {change && (
              <span className={`flex items-center gap-0.5 text-sm font-semibold ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.isPositive ? (
                  <ArrowUp className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" />
                )}
                {Math.abs(change.value)}%
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Grid layout for stat cards
 */
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, columns = 4, className = '' }: StatGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${spacing.md} ${className}`}>
      {children}
    </div>
  );
}
