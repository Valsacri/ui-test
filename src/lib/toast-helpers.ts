/**
 * Toast Notification Helpers
 * Enhanced toast notifications with consistent styling
 */

import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

// ========================================
// SUCCESS TOASTS
// ========================================

export const toastSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    duration: 3000,
    className: 'border-l-4 border-green-500',
  });
};

// ========================================
// ERROR TOASTS
// ========================================

export const toastError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    duration: 4000,
    className: 'border-l-4 border-red-500',
  });
};

// ========================================
// WARNING TOASTS
// ========================================

export const toastWarning = (message: string, description?: string) => {
  return toast.warning(message, {
    description,
    duration: 3500,
    className: 'border-l-4 border-yellow-500',
  });
};

// ========================================
// INFO TOASTS
// ========================================

export const toastInfo = (message: string, description?: string) => {
  return toast.info(message, {
    description,
    duration: 3000,
    className: 'border-l-4 border-blue-500',
  });
};

// ========================================
// LOADING TOASTS
// ========================================

export const toastLoading = (message: string) => {
  return toast.loading(message, {
    duration: Infinity,
    className: 'border-l-4 border-gray-400',
  });
};

// ========================================
// PROMISE TOASTS (for async operations)
// ========================================

export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: 3000,
  });
};

// ========================================
// CUSTOM ACTION TOASTS
// ========================================

export const toastAction = (
  message: string,
  actionLabel: string,
  onAction: () => void,
  description?: string
) => {
  return toast(message, {
    description,
    duration: 5000,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  });
};

// ========================================
// SPECIFIC USE CASES
// ========================================

export const toastJoinActivity = (activityName: string) => {
  return toastSuccess('Successfully joined!', `You're now registered for ${activityName}`);
};

export const toastLeaveActivity = (activityName: string) => {
  return toastInfo('Left activity', `You've been removed from ${activityName}`);
};

export const toastAddToCart = (itemName: string) => {
  return toastSuccess('Added to cart', `${itemName} has been added to your cart`);
};

export const toastBooking = (facilityName: string) => {
  return toastSuccess('Booking request sent!', `We'll confirm your ${facilityName} booking shortly`);
};

export const toastConnect = (personName: string) => {
  return toastSuccess('Connection request sent', `${personName} will be notified`);
};

export const toastDisconnect = (personName: string) => {
  return toastInfo('Disconnected', `You're no longer connected with ${personName}`);
};

export const toastSave = (itemType: string = 'Changes') => {
  return toastSuccess(`${itemType} saved`, 'Your changes have been saved successfully');
};

export const toastDelete = (itemType: string = 'Item') => {
  return toastSuccess(`${itemType} deleted`, 'The item has been removed');
};

export const toastCopy = (content: string = 'Content') => {
  return toastSuccess('Copied to clipboard', `${content} has been copied`);
};
