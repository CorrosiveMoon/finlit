import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BudgetItem } from './models'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get recurring items from a budget that should appear in the target month
 * @param items - Array of budget items
 * @param sourceMonth - Month the items are from (1-12)
 * @param targetMonth - Month to populate to (1-12)
 * @returns Array of items that should recur in the target month
 */
export function getRecurringItemsForMonth(
  items: BudgetItem[],
  sourceMonth: number,
  targetMonth: number
): BudgetItem[] {
  return items
    .filter((item) => item.isRecurring)
    .filter((item) => shouldRecurInMonth(item, sourceMonth, targetMonth))
    .map((item) => ({ ...item })) // Create a copy
}

/**
 * Determine if a recurring item should appear in the target month
 */
function shouldRecurInMonth(
  item: BudgetItem,
  sourceMonth: number,
  targetMonth: number
): boolean {
  if (!item.frequency) return true // Default to recurring every month

  const monthDiff = targetMonth - sourceMonth
  
  switch (item.frequency) {
    case 'weekly':
    case 'bi-weekly':
      // These recur every month
      return true
    
    case 'monthly':
      // Recurs every month
      return true
    
    case 'quarterly':
      // Recurs every 3 months
      return monthDiff % 3 === 0
    
    case 'yearly':
      // Only recurs in the same month next year
      return monthDiff === 12
    
    default:
      return true
  }
}

/**
 * Get all recurring items from a previous month's budget
 */
export function getAllRecurringItems(
  needsItems: BudgetItem[],
  wantsItems: BudgetItem[],
  savingsItems: BudgetItem[],
  sourceMonth: number,
  targetMonth: number
) {
  return {
    needsItems: getRecurringItemsForMonth(needsItems, sourceMonth, targetMonth),
    wantsItems: getRecurringItemsForMonth(wantsItems, sourceMonth, targetMonth),
    savingsItems: getRecurringItemsForMonth(savingsItems, sourceMonth, targetMonth)
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currencyCode = 'USD'): string {
  const minimumFractionDigits = ['JPY', 'KRW'].includes(currencyCode) ? 0 : 2
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(minimumFractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
}

/**
 * Get icon for recurring type
 */
export function getRecurringTypeIcon(type?: string): string {
  switch (type) {
    case 'subscription':
      return '📺'
    case 'investment':
      return '💰'
    case 'installment':
      return '💳'
    default:
      return '🔄'
  }
}

/**
 * Get label for recurring type
 */
export function getRecurringTypeLabel(type?: string): string {
  switch (type) {
    case 'subscription':
      return 'Subscription'
    case 'investment':
      return 'Investment'
    case 'installment':
      return 'Installment'
    default:
      return 'Recurring'
  }
}
