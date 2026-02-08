import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { iconSize, spacing } from '@/lib/design-system';

/**
 * Toast Notification Component
 * Enhanced toast notifications with consistent design system styling
 */

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
  },
  warning: {
    bg: 'bg-orange-50 border-orange-200',
    icon: AlertCircle,
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-900',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
  },
};

export function Toast({ type, title, description, action, onClose }: ToastProps) {
  const style = toastStyles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${style.bg} border rounded-lg shadow-lg p-4 max-w-md w-full`}
    >
      <div className={`flex items-start ${spacing.sm}`}>
        <Icon className={`${iconSize.md} ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${style.titleColor}`}>{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
          {action && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 h-8"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <XCircle className={iconSize.sm} />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Toast Container Component
 * Renders all active toasts in a stacked layout
 */
export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Confirmation Dialog Component
 * Enhanced confirmation dialog with consistent styling
 */
export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={spacing.md}>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          <div className={`flex justify-end ${spacing.xs} mt-6`}>
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
