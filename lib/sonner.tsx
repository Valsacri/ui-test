'use client'

import type { ReactElement, ReactNode } from 'react'
import { toast as hotToast } from 'react-hot-toast'

type SonnerLikeOptions = {
  id?: string | number
  duration?: number
  description?: ReactNode
}

const renderMessage = (
  message: ReactNode,
  description?: ReactNode
): ReactElement => {
  const safeMessage = message ?? ""
  const normalizedMessage =
    typeof safeMessage === "number" ||
    typeof safeMessage === "bigint" ||
    typeof safeMessage === "boolean"
      ? String(safeMessage)
      : (safeMessage as Exclude<ReactNode, number | bigint | boolean | null | undefined>)

  if (!description) return <span>{normalizedMessage}</span>
  return (
    <div className="flex flex-col gap-0.5">
      <span>{normalizedMessage}</span>
      <span className="text-xs opacity-80">{description}</span>
    </div>
  )
}

const baseOptions = (data?: SonnerLikeOptions) => ({
  id: typeof data?.id === 'number' ? String(data.id) : data?.id,
  duration: data?.duration ?? 4000,
})

const sonnerToast = Object.assign(
  (message: ReactNode, data?: SonnerLikeOptions) => hotToast(renderMessage(message, data?.description), baseOptions(data)),
  {
    success: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast.success(renderMessage(message, data?.description), baseOptions(data)),
    error: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast.error(renderMessage(message, data?.description), baseOptions(data)),
    info: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast(renderMessage(message, data?.description), { ...baseOptions(data), icon: 'i' }),
    warning: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast(renderMessage(message, data?.description), { ...baseOptions(data), icon: '!' }),
    loading: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast.loading(renderMessage(message, data?.description), { ...baseOptions(data), duration: data?.duration ?? Infinity }),
    promise: hotToast.promise,
    dismiss: hotToast.dismiss,
    custom: hotToast.custom,
    message: (message: ReactNode, data?: SonnerLikeOptions) =>
      hotToast(renderMessage(message, data?.description), baseOptions(data)),
  }
)

export const toast = sonnerToast
export const Toaster = () => null
