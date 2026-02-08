import { Home, Compass, Calendar, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { touchTarget, zIndex, iconSize } from '@/lib/design-system';

/**
 * MobileNav Component
 * Bottom navigation bar for mobile devices
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  badge?: number;
}

interface MobileNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function MobileNav({ items, activeItem, onItemClick }: MobileNavProps) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 ${zIndex.fixed} md:hidden`}>
      <div className="flex items-center justify-around px-2 pb-safe">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onItemClick(item.id);
                item.onClick();
              }}
              className={`flex flex-col items-center justify-center ${touchTarget.md} px-3 py-2 relative transition-colors ${
                isActive ? 'text-[#003C66]' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className={`${iconSize.lg} ${isActive ? 'fill-[#003C66]' : ''}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FC8936] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-[#003C66]' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -top-[1px] left-0 right-0 h-0.5 bg-[#003C66]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * MobileMenuButton
 * Hamburger menu button for mobile sidebar toggle
 */
interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function MobileMenuButton({ onClick, isOpen = false }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`${touchTarget.md} md:hidden p-2`}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className={iconSize.lg} />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className={iconSize.lg} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

/**
 * MobileSidebar
 * Slide-in sidebar for mobile navigation
 */
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function MobileSidebar({
  isOpen,
  onClose,
  children,
  side = 'left',
}: MobileSidebarProps) {
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
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${zIndex.modalBackdrop} md:hidden`}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: side === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? '-100%' : '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-[280px] bg-white ${zIndex.modal} shadow-xl overflow-y-auto md:hidden`}
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end p-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className={`${touchTarget.md} p-2`}
                >
                  <X className={iconSize.lg} />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
