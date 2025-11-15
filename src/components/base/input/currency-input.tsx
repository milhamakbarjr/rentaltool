/**
 * Currency Input Component
 *
 * Specialized input for Indonesian currency (Rupiah) with automatic formatting
 * Formats numbers with dots as thousand separators (e.g., 1.000.000)
 */

'use client'

import { InputBase } from './input'
import { InputGroup } from './input-group'
import { formatIndonesianNumber, parseIndonesianNumber } from '@/lib/utils'

interface CurrencyInputProps {
  label: string
  placeholder?: string
  size?: 'sm' | 'md'
  value: number | null | undefined
  onChange: (value: number | null) => void
  isDisabled?: boolean
  hint?: string
  isInvalid?: boolean
}

export function CurrencyInput({
  label,
  placeholder = '0',
  size = 'md',
  value,
  onChange,
  isDisabled = false,
  hint,
  isInvalid = false,
}: CurrencyInputProps) {
  const handleChange = (inputValue: string) => {
    // Allow empty input
    if (inputValue === '') {
      onChange(null)
      return
    }

    // Parse the formatted input back to number
    const parsed = parseIndonesianNumber(inputValue)
    onChange(parsed)
  }

  // Format the display value
  const displayValue = formatIndonesianNumber(value)

  return (
    <InputGroup
      size={size}
      label={label}
      hint={hint}
      leadingAddon={<InputGroup.Prefix>Rp</InputGroup.Prefix>}
    >
      <InputBase
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        isDisabled={isDisabled}
      />
    </InputGroup>
  )
}
