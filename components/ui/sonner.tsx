'use client'

import { useTheme } from 'next-themes'
import { Toaster as HotToaster } from 'react-hot-toast'

type ToasterProps = React.ComponentProps<typeof HotToaster>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const hotTheme = theme === 'system' ? undefined : theme

  return (
    <HotToaster
      position="top-center"
      reverseOrder={false}
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          border: '1px solid hsl(var(--border))',
          background: hotTheme === 'dark' ? '#0f172a' : '#ffffff',
          color: hotTheme === 'dark' ? '#e2e8f0' : '#0f172a',
          boxShadow: '0 12px 30px rgba(2, 8, 23, 0.12)',
          fontSize: '13px',
          padding: '12px 14px',
        },
        success: {
          style: {
          },
        },
        error: {
          style: {
          },
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
