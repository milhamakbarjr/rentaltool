/**
 * Currency Input Component
 *
 * Specialized input for Indonesian currency (Rupiah) with automatic formatting.
 * Formats numbers with dots as thousand separators (e.g., 1.000.000).
 *
 * Follows the same pattern as PaymentInput for consistency and reliability.
 */

'use client'

import { useControlledState } from '@react-stately/utils'
import { HintText } from '@/components/base/input/hint-text'
import type { InputBaseProps } from '@/components/base/input/input'
import { InputBase, TextField } from '@/components/base/input/input'
import { Label } from '@/components/base/input/label'
import { InputGroup } from './input-group'
import { formatIndonesianNumber, parseIndonesianNumber } from '@/lib/utils'

/**
 * Format Indonesian currency number for display.
 * Converts 1000000 -> "1.000.000"
 */
export const formatCurrencyDisplay = (value: number | null | undefined): string => {
  return formatIndonesianNumber(value)
}

interface CurrencyInputProps extends Omit<InputBaseProps, 'icon' | 'value' | 'onChange' | 'defaultValue'> {
  /** Current value as a number */
  value?: number | null
  /** Default value as a number */
  defaultValue?: number | null
  /** Callback when value changes, receives parsed number */
  onChange?: (value: number | null) => void
  /** Label for the input */
  label?: string
  /** Hint text displayed below the input */
  hint?: string
}

export const CurrencyInput = ({
  onChange,
  value,
  defaultValue,
  label,
  hint,
  size = 'md',
  placeholder = '0',
  isDisabled,
  isInvalid,
  isRequired,
  isReadOnly,
  ...props
}: CurrencyInputProps) => {
  // Use controlled state with React Stately for proper state management
  const [currencyValue, setCurrencyValue] = useControlledState(
    value,
    defaultValue ?? null,
    (newValue) => {
      onChange?.(newValue)
    }
  )

  // Handle input changes: parse formatted input back to number
  const handleInputChange = (formattedInput: string) => {
    if (formattedInput === '') {
      setCurrencyValue(null)
      return
    }

    const parsed = parseIndonesianNumber(formattedInput)
    setCurrencyValue(parsed)
  }

  // Format the current value for display
  const displayValue = formatCurrencyDisplay(currencyValue)

  return (
    <InputGroup
      size={size}
      label={label}
      hint={hint}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      leadingAddon={<InputGroup.Prefix>Rp</InputGroup.Prefix>}
    >
      <InputBase
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
      />
    </InputGroup>
  )
}

CurrencyInput.displayName = 'CurrencyInput'
