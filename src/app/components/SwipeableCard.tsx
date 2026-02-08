import { ReactNode, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';

/**
 * SwipeableCard Component
 * Enables swipe gestures for mobile interactions (like "swipe to delete")
 */

interface SwipeAction {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  onAction: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  threshold = 100,
  disabled = false,
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  
  // Transform opacity based on drag distance
  const leftOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightOpacity = useTransform(x, [-threshold, 0], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Check if swiped past threshold
    if (info.offset.x > threshold && leftAction) {
      leftAction.onAction();
    } else if (info.offset.x < -threshold && rightAction) {
      rightAction.onAction();
    }
    
    // Reset position
    x.set(0);
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left action background */}
      {leftAction && (
        <motion.div
          className={`absolute inset-y-0 left-0 flex items-center justify-start px-6 ${leftAction.bgColor}`}
          style={{ opacity: leftOpacity }}
        >
          <div className="flex items-center gap-2">
            <leftAction.icon className={`w-6 h-6 ${leftAction.color}`} />
            <span className={`font-semibold ${leftAction.color}`}>
              {leftAction.label}
            </span>
          </div>
        </motion.div>
      )}

      {/* Right action background */}
      {rightAction && (
        <motion.div
          className={`absolute inset-y-0 right-0 flex items-center justify-end px-6 ${rightAction.bgColor}`}
          style={{ opacity: rightOpacity }}
        >
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${rightAction.color}`}>
              {rightAction.label}
            </span>
            <rightAction.icon className={`w-6 h-6 ${rightAction.color}`} />
          </div>
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`relative bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Example usage:
 * 
 * <SwipeableCard
 *   leftAction={{
 *     icon: Archive,
 *     label: 'Archive',
 *     color: 'text-blue-600',
 *     bgColor: 'bg-blue-100',
 *     onAction: () => console.log('Archived'),
 *   }}
 *   rightAction={{
 *     icon: Trash2,
 *     label: 'Delete',
 *     color: 'text-red-600',
 *     bgColor: 'bg-red-100',
 *     onAction: () => console.log('Deleted'),
 *   }}
 * >
 *   <YourCardContent />
 * </SwipeableCard>
 */
