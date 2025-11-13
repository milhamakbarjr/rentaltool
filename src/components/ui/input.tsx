/**
 * Input Component
 *
 * Simple input component with consistent styling
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed sm:text-sm',
          className
        )}
        style={{
          borderColor: 'var(--border-color-primary)',
          backgroundColor: 'var(--background-color-primary)',
          color: 'var(--text-color-primary)',
          ...style
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
