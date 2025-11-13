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
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'block w-full rounded-md border-[--border-color-primary] bg-[--background-color-primary] px-3 py-2 text-[--text-color-primary] shadow-sm focus:border-[--border-color-brand] focus:outline-none focus:ring-1 focus:ring-[--ring-color-brand] disabled:cursor-not-allowed disabled:bg-[--background-color-disabled] disabled:text-[--text-color-disabled] sm:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
