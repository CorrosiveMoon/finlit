'use client'

import { useState } from 'react'

export const CURRENCIES = [
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

interface CurrencySelectProps {
  value: CurrencyCode
  onChange: (currency: CurrencyCode) => void
  className?: string
}

export function CurrencySelect({ value, onChange, className = '' }: CurrencySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CurrencyCode)}
      className={`rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {CURRENCIES.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.symbol} {currency.name}
        </option>
      ))}
    </select>
  )
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return CURRENCIES.find(c => c.code === code)?.symbol || 'E£'
}

export function formatCurrency(amount: number, code: CurrencyCode): string {
  const symbol = getCurrencySymbol(code)
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Hook to persist currency selection
export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-currency')
      if (saved && CURRENCIES.some(c => c.code === saved)) {
        return saved as CurrencyCode
      }
    }
    return 'EGP' // Default to Egyptian Pound
  })

  const updateCurrency = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  return { currency, setCurrency: updateCurrency, symbol: getCurrencySymbol(currency) }
}
