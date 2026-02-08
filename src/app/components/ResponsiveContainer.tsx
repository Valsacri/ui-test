import { ReactNode } from 'react';
import { responsive } from '@/lib/design-system';

/**
 * ResponsiveContainer Component
 * Pre-configured responsive containers for consistent layouts
 */

interface ResponsiveContainerProps {
  children: ReactNode;
  size?: 'content' | 'reading' | 'full';
  padding?: boolean;
  className?: string;
}

export function ResponsiveContainer({
  children,
  size = 'reading',
  padding = true,
  className = '',
}: ResponsiveContainerProps) {
  const sizeClasses = {
    content: responsive.maxContent,
    reading: responsive.maxReading,
    full: 'w-full',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${padding ? responsive.containerPadding : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveGrid Component
 * Grid that adapts to screen size
 */
interface ResponsiveGridProps {
  children: ReactNode;
  columns?: 'auto' | 'two' | 'three' | 'four';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveGrid({
  children,
  columns = 'three',
  gap = 'md',
  className = '',
}: ResponsiveGridProps) {
  const columnClasses = {
    auto: responsive.gridAuto,
    two: responsive.gridTwo,
    three: responsive.gridThree,
    four: responsive.gridFour,
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * ResponsiveStack Component
 * Flex container that stacks on mobile
 */
interface ResponsiveStackProps {
  children: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
  className?: string;
}

export function ResponsiveStack({
  children,
  gap = 'md',
  align = 'center',
  justify = 'start',
  className = '',
}: ResponsiveStackProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex ${responsive.stackOnMobile} ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * MobileOnly / DesktopOnly Components
 * Conditional rendering based on screen size
 */
export function MobileOnly({ children }: { children: ReactNode }) {
  return <div className={responsive.hideOnDesktop}>{children}</div>;
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  return <div className={responsive.hideOnMobile}>{children}</div>;
}
