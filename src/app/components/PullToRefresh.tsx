import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { RefreshCw } from 'lucide-react';

/**
 * PullToRefresh Component
 * Mobile pull-to-refresh gesture for lists/feeds
 */

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const y = useMotionValue(0);
  
  // Transform icon rotation based on pull distance
  const rotate = useTransform(y, [0, threshold], [0, 360]);
  const scale = useTransform(y, [0, threshold], [0.5, 1]);
  const opacity = useTransform(y, [0, threshold], [0.3, 1]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh from top of page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        // Prevent default scroll when pulling down
        e.preventDefault();
        // Apply resistance as you pull further
        const resistance = Math.min(diff * 0.5, threshold * 1.5);
        y.set(resistance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;
      
      setIsPulling(false);
      const currentPull = y.get();

      if (currentPull >= threshold) {
        // Trigger refresh
        setIsRefreshing(true);
        y.set(threshold);
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          // Animate back to start
          y.set(0);
        }
      } else {
        // Snap back
        y.set(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, disabled, onRefresh, y, threshold]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: y,
          opacity,
        }}
      >
        <motion.div
          style={{
            rotate: isRefreshing ? undefined : rotate,
            scale,
          }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003C66] text-white"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
