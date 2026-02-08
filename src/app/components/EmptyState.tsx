import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface EmptyStateProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon: LucideIcon;
  
  /**
   * Main title/heading
   */
  title: string;
  
  /**
   * Description text
   */
  description: string;
  
  /**
   * Optional primary action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
  };
  
  /**
   * Optional secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom class names
   */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      iconBg: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      iconBg: 'w-28 h-28',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      iconBg: 'w-32 h-32',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${classes.container} ${className}`}
    >
      {/* Icon with gradient background */}
      <div
        className={`${classes.iconBg} rounded-full bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center mb-6`}
      >
        <Icon className={`${classes.icon} text-[#003C66]`} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className={`${classes.title} font-semibold text-gray-900 mb-2`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${classes.description} text-gray-600 max-w-md mb-6`}>
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'lg' ? 'lg' : 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={size === 'lg' ? 'lg' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
