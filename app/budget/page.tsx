'use client'

import { useState, useEffect } from 'react'
import { useUserId } from '@/lib/hooks/useUserId'
import { getAllRecurringItems } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Calendar, TrendingUp, DollarSign, Trash2 } from 'lucide-react'
import { useCurrency, formatCurrency } from '@/components/ui/currency-select'

interface BudgetItem {
  name: string
  amount: number
  isRecurring?: boolean
  frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
  recurringType?: 'subscription' | 'investment' | 'installment' | 'other'
  provider?: string
}

interface MonthlyBudget {
  _id: string
  month: number
  year: number
  income: number
  actualNeeds: number
  actualWants: number
  actualSavings: number
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  needsItems?: BudgetItem[]
  wantsItems?: BudgetItem[]
  savingsItems?: BudgetItem[]
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function BudgetDashboard() {
  const userId = useUserId()
  const { currency } = useCurrency()
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([])
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [resetting, setResetting] = useState(false)

  // Generate year options: current year + 4 future years
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userId) {
      fetchBudgets()
    }
  }, [userId, selectedYear])

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?year=${selectedYear}`)
      const data = await response.json()
      setBudgets(data.budgets || [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBudgetForMonth = async (month: number) => {
    try {
      // Find the most recent previous budget to copy recurring items from
      // For current year, look for any previous month
      const previousBudgets = budgets
        .filter(b => b.year === selectedYear && b.month < month)
        .sort((a, b) => b.month - a.month)
      
      console.log(`Creating budget for month ${month}:`)
      console.log('Available budgets:', budgets.map(b => ({ month: b.month, year: b.year })))
      console.log('Previous budgets found:', previousBudgets.map(b => ({ month: b.month, hasNeeds: b.needsItems?.length, hasWants: b.wantsItems?.length, hasSavings: b.savingsItems?.length })))
      
      let needsItems: BudgetItem[] = []
      let wantsItems: BudgetItem[] = []
      let savingsItems: BudgetItem[] = []
      let income = 0
      let needsPercentage = 50
      let wantsPercentage = 30
      let savingsPercentage = 20
      
      if (previousBudgets.length > 0) {
        const previousBudget = previousBudgets[0]
        
        console.log('Using previous budget from month:', previousBudget.month)
        console.log('Previous budget items:', {
          needsItems: previousBudget.needsItems?.length || 0,
          wantsItems: previousBudget.wantsItems?.length || 0,
          savingsItems: previousBudget.savingsItems?.length || 0
        })
        
        // Get recurring items that should appear in this month
        const recurringItems = getAllRecurringItems(
          previousBudget.needsItems || [],
          previousBudget.wantsItems || [],
          previousBudget.savingsItems || [],
          previousBudget.month,
          month
        )
        
        console.log('Recurring items found:', {
          needsItems: recurringItems.needsItems.length,
          wantsItems: recurringItems.wantsItems.length,
          savingsItems: recurringItems.savingsItems.length
        })
        
        needsItems = recurringItems.needsItems
        wantsItems = recurringItems.wantsItems
        savingsItems = recurringItems.savingsItems
        
        // Copy income and percentages from previous month
        income = previousBudget.income
        needsPercentage = previousBudget.needsPercentage
        wantsPercentage = previousBudget.wantsPercentage
        savingsPercentage = previousBudget.savingsPercentage
      }
      
      // Calculate actual totals from the items
      const actualNeeds = needsItems.reduce((sum: number, item: BudgetItem) => sum + (item.amount || 0), 0)
      const actualWants = wantsItems.reduce((sum: number, item: BudgetItem) => sum + (item.amount || 0), 0)
      const actualSavings = savingsItems.reduce((sum: number, item: BudgetItem) => sum + (item.amount || 0), 0)
      
      console.log('Creating budget for month', month, 'with:', {
        needsItems: needsItems.length,
        wantsItems: wantsItems.length,
        savingsItems: savingsItems.length,
        actualNeeds,
        actualWants,
        actualSavings
      })
      
      console.log('📤 Sending POST request to /api/budgets')
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          month,
          year: selectedYear,
          income,
          needsPercentage,
          wantsPercentage,
          savingsPercentage,
          needsItems,
          wantsItems,
          savingsItems,
          actualNeeds,
          actualWants,
          actualSavings
        })
      })

      console.log('📡 Response status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Budget created successfully!', data.budget)
        fetchBudgets()
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to create budget:', errorData)
        alert(`Failed to create budget: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('💥 Error creating budget:', error)
      alert(`Error creating budget: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }

  const resetYearBudgets = async () => {
    const confirmMessage = `Are you sure you want to delete ALL budgets for ${selectedYear}?\n\nThis will permanently remove:\n- All ${budgets.length} budget(s) created for this year\n- All items, income, and expenses data\n\nThis action cannot be undone!`
    
    if (!confirm(confirmMessage)) {
      return
    }

    setResetting(true)
    try {
      const response = await fetch(
        `/api/budgets?year=${selectedYear}&resetYear=true`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully deleted ${data.deletedCount} budget(s) for ${selectedYear}`)
        setBudgets([])
      } else {
        alert('Failed to reset budgets')
      }
    } catch (error) {
      console.error('Error resetting budgets:', error)
      alert('Error resetting budgets')
    } finally {
      setResetting(false)
    }
  }

  const getBudgetForMonth = (month: number) => {
    return budgets.find(b => b.month === month && b.year === selectedYear)
  }

  const totalIncome = budgets.reduce((sum, b) => sum + b.income, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.actualNeeds + b.actualWants + b.actualSavings, 0)
  const totalSaved = budgets.reduce((sum, b) => sum + b.actualSavings, 0)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Budget Dashboard</h1>
          <p className="text-slate-600">Manage your monthly budgets</p>
        </div>
        <div className="flex gap-3">
          <Link href="/budget/templates">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Templates
            </Button>
          </Link>
          <Link href="/budget/overview">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Year Overview
            </Button>
          </Link>
          {budgets.length > 0 && (
            <Button 
              variant="outline" 
              onClick={resetYearBudgets}
              disabled={resetting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {resetting ? 'Resetting...' : 'Reset Year'}
            </Button>
          )}
        </div>
      </div>

      {/* Year Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year} {year === currentYear ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Income ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {formatCurrency(totalIncome, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {formatCurrency(totalSpent, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalSaved, currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Budget Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((monthName, index) => {
              const month = index + 1
              const budget = getBudgetForMonth(month)
              const isCurrentMonth = month === new Date().getMonth() + 1

              return (
                <Card 
                  key={month} 
                  className={`${isCurrentMonth ? 'ring-2 ring-blue-500' : ''} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{monthName}</CardTitle>
                      {isCurrentMonth && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {budget ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold">{formatCurrency(budget.income, currency)}</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Needs:</span>
                            <span className="font-medium">{formatCurrency(budget.actualNeeds, currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wants:</span>
                            <span className="font-medium">{formatCurrency(budget.actualWants, currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Savings:</span>
                            <span className="font-medium text-green-600">{formatCurrency(budget.actualSavings, currency)}</span>
                          </div>
                        </div>
                        <Link href={`/budget/${budget._id}`} className="block">
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-500">No budget created yet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => createBudgetForMonth(month)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Budget
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
