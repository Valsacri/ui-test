'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      gap={12}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'group toast group-[.toaster]:backdrop-blur-xl group-[.toaster]:bg-white/90 dark:group-[.toaster]:bg-[#0a1628]/90 group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-white/20 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_8px_32px_rgba(0,60,102,0.12),0_2px_8px_rgba(0,0,0,0.06)] group-[.toaster]:rounded-2xl group-[.toaster]:px-4 group-[.toaster]:py-3.5 group-[.toaster]:min-h-[56px] group-[.toaster]:items-start',
          title:
            'group-[.toast]:text-[13px] group-[.toast]:font-semibold group-[.toast]:tracking-[-0.01em] group-[.toast]:leading-tight',
          description:
            'group-[.toast]:text-[12px] group-[.toast]:text-muted-foreground group-[.toast]:mt-0.5 group-[.toast]:leading-snug',
          actionButton:
            'group-[.toast]:bg-[#003C66] group-[.toast]:text-white group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:shadow-sm group-[.toast]:hover:bg-[#005A99] group-[.toast]:transition-colors',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:hover:bg-muted/80 group-[.toast]:transition-colors',
          closeButton:
            'group-[.toast]:bg-transparent group-[.toast]:border-none group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground group-[.toast]:transition-colors group-[.toast]:opacity-60 group-[.toast]:hover:opacity-100',
          success:
            'group-[.toaster]:!bg-emerald-50/95 dark:group-[.toaster]:!bg-emerald-950/90 group-[.toaster]:!border-emerald-200/50 dark:group-[.toaster]:!border-emerald-800/30 group-[.toaster]:!text-emerald-900 dark:group-[.toaster]:!text-emerald-100 [&_[data-title]]:!text-emerald-900 dark:[&_[data-title]]:!text-emerald-100 [&_[data-description]]:!text-emerald-700 dark:[&_[data-description]]:!text-emerald-300 [&_[data-icon]_svg]:!text-emerald-600 dark:[&_[data-icon]_svg]:!text-emerald-400',
          error:
            'group-[.toaster]:!bg-red-50/95 dark:group-[.toaster]:!bg-red-950/90 group-[.toaster]:!border-red-200/50 dark:group-[.toaster]:!border-red-800/30 group-[.toaster]:!text-red-900 dark:group-[.toaster]:!text-red-100 [&_[data-title]]:!text-red-900 dark:[&_[data-title]]:!text-red-100 [&_[data-description]]:!text-red-700 dark:[&_[data-description]]:!text-red-300 [&_[data-icon]_svg]:!text-red-600 dark:[&_[data-icon]_svg]:!text-red-400',
          warning:
            'group-[.toaster]:!bg-amber-50/95 dark:group-[.toaster]:!bg-amber-950/90 group-[.toaster]:!border-amber-200/50 dark:group-[.toaster]:!border-amber-800/30 group-[.toaster]:!text-amber-900 dark:group-[.toaster]:!text-amber-100 [&_[data-title]]:!text-amber-900 dark:[&_[data-title]]:!text-amber-100 [&_[data-description]]:!text-amber-700 dark:[&_[data-description]]:!text-amber-300 [&_[data-icon]_svg]:!text-amber-600 dark:[&_[data-icon]_svg]:!text-amber-400',
          info:
            'group-[.toaster]:!bg-sky-50/95 dark:group-[.toaster]:!bg-sky-950/90 group-[.toaster]:!border-sky-200/50 dark:group-[.toaster]:!border-sky-800/30 group-[.toaster]:!text-sky-900 dark:group-[.toaster]:!text-sky-100 [&_[data-title]]:!text-sky-900 dark:[&_[data-title]]:!text-sky-100 [&_[data-description]]:!text-sky-700 dark:[&_[data-description]]:!text-sky-300 [&_[data-icon]_svg]:!text-sky-600 dark:[&_[data-icon]_svg]:!text-sky-400',
        },
      }}
      icons={{
        success: (
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-emerald-500/15 dark:bg-emerald-400/15">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ),
        error: (
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-red-500/15 dark:bg-red-400/15">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        ),
        warning: (
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-amber-500/15 dark:bg-amber-400/15">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3.5V6.5M6 8.5H6.005" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        ),
        info: (
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-sky-500/15 dark:bg-sky-400/15">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 5V8.5M6 3.5H6.005" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }
