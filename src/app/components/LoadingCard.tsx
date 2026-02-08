import { Card, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { motion } from 'motion/react';

// ========================================
// LOADING CARD COMPONENTS
// Enhanced skeleton loaders for consistent loading states
// ========================================

/**
 * Loading state for activity cards
 */
export function LoadingActivityCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for goal cards
 */
export function LoadingGoalCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for product cards
 */
export function LoadingProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for facility/service cards
 */
export function LoadingFacilityCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for person/user cards
 */
export function LoadingPersonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for squad cards
 */
export function LoadingSquadCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Loading state for list items
 */
export function LoadingListItem() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg"
    >
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </motion.div>
  );
}

/**
 * Loading state for stat cards
 */
export function LoadingStatCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Generic loading grid - shows multiple loading cards
 */
export function LoadingGrid({ 
  count = 6, 
  CardComponent = LoadingActivityCard 
}: { 
  count?: number;
  CardComponent?: React.ComponentType;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
}

/**
 * Generic loading list - shows multiple loading items
 */
export function LoadingList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingListItem key={i} />
      ))}
    </div>
  );
}