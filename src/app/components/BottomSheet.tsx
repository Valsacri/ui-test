import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { zIndex, iconSize } from '@/lib/design-system';

/**
 * BottomSheet Component
 * Mobile-optimized slide-up panel for filters, forms, and actions
 */

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
  height = 'auto',
}: BottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[95vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${zIndex.modalBackdrop}`}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl ${zIndex.modal} ${heightClasses[height]} flex flex-col`}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className={iconSize.md} />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * MobileFilterSheet
 * Specialized bottom sheet for filter controls
 */
interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear?: () => void;
  children: ReactNode;
}

export function MobileFilterSheet({
  isOpen,
  onClose,
  onApply,
  onClear,
  children,
}: MobileFilterSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      height="auto"
      footer={
        <div className="flex gap-2">
          {onClear && (
            <Button variant="outline" onClick={onClear} className="flex-1">
              Clear All
            </Button>
          )}
          <Button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-[#003C66] to-[#005A99] hover:from-[#002A4A] hover:to-[#004580] text-white"
          >
            Apply Filters
          </Button>
        </div>
      }
    >
      {children}
    </BottomSheet>
  );
}
