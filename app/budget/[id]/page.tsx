'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUserId } from '@/lib/hooks/useUserId'
import { getRecurringTypeIcon, getRecurringTypeLabel } from '@/lib/utils'
import { useCurrency, CurrencySelect, formatCurrency } from '@/components/ui/currency-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

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
  userId: string
  month: number
  year: number
  income: number
  templateId?: string
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  needsItems: BudgetItem[]
  wantsItems: BudgetItem[]
  savingsItems: BudgetItem[]
  actualNeeds: number
  actualWants: number
  actualSavings: number
  notes?: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MonthlyBudgetPage() {
  const params = useParams()
  const router = useRouter()
  const userId = useUserId()
  const { currency, setCurrency, symbol } = useCurrency()
  const [budget, setBudget] = useState<MonthlyBudget | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (userId && params.id) {
      fetchBudget()
    }
  }, [userId, params.id])

  const fetchBudget = async () => {
    try {
      const response = await fetch(`/api/budgets`)
      const data = await response.json()
      const foundBudget = data.budgets.find((b: MonthlyBudget) => b._id === params.id)
      
      if (foundBudget) {
        console.log('Fetched budget:', {
          month: foundBudget.month,
          year: foundBudget.year,
          needsItems: foundBudget.needsItems?.length || 0,
          wantsItems: foundBudget.wantsItems?.length || 0,
          savingsItems: foundBudget.savingsItems?.length || 0,
          actualSavings: foundBudget.actualSavings
        })
        setBudget(foundBudget)
      } else {
        console.log('Budget not found with id:', params.id)
      }
    } catch (error) {
      console.error('Error fetching budget:', error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const saveBudget = async () => {
    if (!budget) return

    setSaving(true)
    try {
      // Calculate actual totals
      const actualNeeds = budget.needsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
      const actualWants = budget.wantsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
      const actualSavings = budget.savingsItems.reduce((sum, item) => sum + (item.amount || 0), 0)

      console.log('💾 Attempting to save budget...')
      console.log('Budget data:', {
        _id: budget._id,
        month: budget.month,
        year: budget.year,
        income: budget.income,
        needsItems: budget.needsItems.length,
        wantsItems: budget.wantsItems.length,
        savingsItems: budget.savingsItems.length,
        actualNeeds,
        actualWants,
        actualSavings
      })

      const payload = {
        ...budget,
        actualNeeds,
        actualWants,
        actualSavings
      }

      console.log('📤 Sending PUT request to /api/budgets')
      
      const response = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📡 Response status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Budget saved successfully!', data.budget)
        setShowSuccessToast(true)
        setHasUnsavedChanges(false)
        setTimeout(() => setShowSuccessToast(false), 3000)
        fetchBudget()
      } else {
        const error = await response.json()
        console.error('❌ Save failed with status:', response.status)
        console.error('Error details:', error)
        alert(`Failed to save budget: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('💥 Exception while saving budget:')
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('Error message:', error instanceof Error ? error.message : String(error))
      console.error('Full error:', error)
      alert(`Failed to save budget: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateBudgetField = (field: keyof MonthlyBudget, value: any) => {
    if (!budget) return
    setBudget({ ...budget, [field]: value })
    setHasUnsavedChanges(true)
  }

  // Auto-save with debounce
  useEffect(() => {
    if (!budget || initialLoad || !hasUnsavedChanges) return

    const autoSaveTimer = setTimeout(async () => {
      setIsAutoSaving(true)
      try {
        const actualNeeds = budget.needsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
        const actualWants = budget.wantsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
        const actualSavings = budget.savingsItems.reduce((sum, item) => sum + (item.amount || 0), 0)

        const payload = {
          ...budget,
          actualNeeds,
          actualWants,
          actualSavings
        }

        const response = await fetch('/api/budgets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          setShowSuccessToast(true)
          setHasUnsavedChanges(false)
          setTimeout(() => setShowSuccessToast(false), 3000)
        }
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsAutoSaving(false)
      }
    }, 2000)

    return () => clearTimeout(autoSaveTimer)
  }, [budget, initialLoad, hasUnsavedChanges])

  const updateItem = (
    category: 'needsItems' | 'wantsItems' | 'savingsItems',
    index: number,
    field: keyof BudgetItem,
    value: any
  ) => {
    if (!budget) return
    const items = [...budget[category]]
    items[index] = { ...items[index], [field]: value }
    setBudget({ ...budget, [category]: items })
    setHasUnsavedChanges(true)
  }

  const addItem = (category: 'needsItems' | 'wantsItems' | 'savingsItems') => {
    if (!budget) return
    const newItem: BudgetItem = { 
      name: '', 
      amount: 0, 
      isRecurring: false, 
      frequency: 'monthly',
      recurringType: 'other',
      provider: ''
    }
    setBudget({ ...budget, [category]: [...budget[category], newItem] })
    setHasUnsavedChanges(true)
  }

  const removeItem = (category: 'needsItems' | 'wantsItems' | 'savingsItems', index: number) => {
    if (!budget) return
    const items = budget[category].filter((_, i) => i !== index)
    setBudget({ ...budget, [category]: items })
    setHasUnsavedChanges(true)
  }

  const handlePercentageChange = (type: 'needs' | 'wants' | 'savings', value: number) => {
    if (!budget) return

    if (type === 'needs') {
      const remaining = 100 - value
      const wantsRatio = budget.wantsPercentage / (budget.wantsPercentage + budget.savingsPercentage) || 0.5
      setBudget({
        ...budget,
        needsPercentage: value,
        wantsPercentage: Math.round(remaining * wantsRatio),
        savingsPercentage: remaining - Math.round(remaining * wantsRatio)
      })
    } else if (type === 'wants') {
      const remaining = 100 - value
      const needsRatio = budget.needsPercentage / (budget.needsPercentage + budget.savingsPercentage) || 0.5
      setBudget({
        ...budget,
        wantsPercentage: value,
        needsPercentage: Math.round(remaining * needsRatio),
        savingsPercentage: remaining - Math.round(remaining * needsRatio)
      })
    } else {
      const remaining = 100 - value
      const needsRatio = budget.needsPercentage / (budget.needsPercentage + budget.wantsPercentage) || 0.5
      setBudget({
        ...budget,
        savingsPercentage: value,
        needsPercentage: Math.round(remaining * needsRatio),
        wantsPercentage: remaining - Math.round(remaining * needsRatio)
      })
    }
    setHasUnsavedChanges(true)
  }

  if (loading) {
    return <div className="container mx-auto p-6"><div className="text-center py-12">Loading...</div></div>
  }

  if (!budget) {
    return <div className="container mx-auto p-6"><div className="text-center py-12">Budget not found</div></div>
  }

  const targetNeeds = budget.income * (budget.needsPercentage / 100)
  const targetWants = budget.income * (budget.wantsPercentage / 100)
  const targetSavings = budget.income * (budget.savingsPercentage / 100)

  const actualNeeds = budget.needsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const actualWants = budget.wantsItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const actualSavings = budget.savingsItems.reduce((sum, item) => sum + (item.amount || 0), 0)

  const totalAllocated = actualNeeds + actualWants + actualSavings
  const remaining = budget.income - totalAllocated

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Saved successfully!</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/budget">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              {MONTHS[budget.month - 1]} {budget.year}
            </h1>
            <p className="text-slate-600">Monthly Budget Details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAutoSaving && (
            <span className="text-sm text-slate-500 animate-pulse">Auto-saving...</span>
          )}
          <Button onClick={saveBudget} disabled={saving || isAutoSaving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Budget'}
          </Button>
        </div>
      </div>

      {/* Income Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monthly Income</CardTitle>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-slate-600">{symbol}</span>
            <Input
              type="number"
              value={budget.income === 0 ? '' : budget.income}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || value === '-') {
                  updateBudgetField('income', 0)
                } else {
                  const parsed = parseFloat(value)
                  if (!isNaN(parsed) && parsed >= 0) {
                    updateBudgetField('income', parsed)
                  }
                }
              }}
              className="max-w-xs text-2xl font-bold"
              placeholder="0"
              min="0"
              step="any"
            />
            <span className="text-slate-600">per month</span>
          </div>
        </CardContent>
      </Card>

      {/* Budget Rule Customization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Budget Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Needs:</label>
              <Input
                type="number"
                value={budget.needsPercentage}
                onChange={(e) => handlePercentageChange('needs', parseInt(e.target.value) || 0)}
                className="w-20 text-center"
                min="0"
                max="100"
              />
              <span className="text-slate-600">%</span>
              <span className="text-sm text-slate-500">({formatCurrency(targetNeeds, currency)})</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Wants:</label>
              <Input
                type="number"
                value={budget.wantsPercentage}
                onChange={(e) => handlePercentageChange('wants', parseInt(e.target.value) || 0)}
                className="w-20 text-center"
                min="0"
                max="100"
              />
              <span className="text-slate-600">%</span>
              <span className="text-sm text-slate-500">({formatCurrency(targetWants, currency)})</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Savings:</label>
              <Input
                type="number"
                value={budget.savingsPercentage}
                onChange={(e) => handlePercentageChange('savings', parseInt(e.target.value) || 0)}
                className="w-20 text-center"
                min="0"
                max="100"
              />
              <span className="text-slate-600">%</span>
              <span className="text-sm text-slate-500">({formatCurrency(targetSavings, currency)})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Needs */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center justify-between">
              <span>Needs ({budget.needsPercentage}%)</span>
              <Badge variant={actualNeeds > targetNeeds ? 'destructive' : 'outline'}>
                {formatCurrency(actualNeeds, currency)} / {formatCurrency(targetNeeds, currency)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {budget.needsItems.map((item, index) => (
                <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem('needsItems', index, 'name', e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.amount || ''}
                      onChange={(e) => updateItem('needsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('needsItems', index)}
                      className="px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={item.isRecurring || false}
                          onChange={(e) => updateItem('needsItems', index, 'isRecurring', e.target.checked)}
                          className="rounded"
                        />
                        <span>Recurring</span>
                      </label>
                      {item.isRecurring && (
                        <>
                          <select
                            value={item.frequency || 'monthly'}
                            onChange={(e) => updateItem('needsItems', index, 'frequency', e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                          <select
                            value={item.recurringType || 'other'}
                            onChange={(e) => updateItem('needsItems', index, 'recurringType', e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          >
                            <option value="subscription">📺 Subscription</option>
                            <option value="investment">💰 Investment</option>
                            <option value="installment">💳 Installment</option>
                            <option value="other">🔄 Other</option>
                          </select>
                        </>
                      )}
                    </div>
                    {item.isRecurring && item.recurringType === 'subscription' && (
                      <Input
                        placeholder="Provider (e.g., Netflix, Spotify)"
                        value={item.provider || ''}
                        onChange={(e) => updateItem('needsItems', index, 'provider', e.target.value)}
                        className="text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem('needsItems')} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wants */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <span>Wants ({budget.wantsPercentage}%)</span>
              <Badge variant={actualWants > targetWants ? 'destructive' : 'outline'}>
                {formatCurrency(actualWants, currency)} / {formatCurrency(targetWants, currency)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {budget.wantsItems.map((item, index) => (
                <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem('wantsItems', index, 'name', e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.amount || ''}
                      onChange={(e) => updateItem('wantsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('wantsItems', index)}
                      className="px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isRecurring || false}
                        onChange={(e) => updateItem('wantsItems', index, 'isRecurring', e.target.checked)}
                        className="rounded"
                      />
                      <span>Recurring</span>
                    </label>
                    {item.isRecurring && (
                      <>
                        <select
                          value={item.frequency || 'monthly'}
                          onChange={(e) => updateItem('wantsItems', index, 'frequency', e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <select
                          value={item.recurringType || 'other'}
                          onChange={(e) => updateItem('wantsItems', index, 'recurringType', e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="subscription">📺 Subscription</option>
                          <option value="investment">💰 Investment</option>
                          <option value="installment">💳 Installment</option>
                          <option value="other">🔄 Other</option>
                        </select>
                      </>
                    )}
                  </div>
                  {item.isRecurring && item.recurringType === 'subscription' && (
                    <Input
                      placeholder="Provider (e.g., Netflix, Spotify)"
                      value={item.provider || ''}
                      onChange={(e) => updateItem('wantsItems', index, 'provider', e.target.value)}
                      className="text-xs"
                    />
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem('wantsItems')} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Savings */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center justify-between">
              <span>Savings ({budget.savingsPercentage}%)</span>
              <Badge variant={actualSavings < targetSavings ? 'destructive' : 'outline'}>
                {formatCurrency(actualSavings, currency)} / {formatCurrency(targetSavings, currency)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {budget.savingsItems.map((item, index) => (
                <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem('savingsItems', index, 'name', e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.amount || ''}
                      onChange={(e) => updateItem('savingsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('savingsItems', index)}
                      className="px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isRecurring || false}
                        onChange={(e) => updateItem('savingsItems', index, 'isRecurring', e.target.checked)}
                        className="rounded"
                      />
                      <span>Recurring</span>
                    </label>
                    {item.isRecurring && (
                      <>
                        <select
                          value={item.frequency || 'monthly'}
                          onChange={(e) => updateItem('savingsItems', index, 'frequency', e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <select
                          value={item.recurringType || 'other'}
                          onChange={(e) => updateItem('savingsItems', index, 'recurringType', e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="subscription">📺 Subscription</option>
                          <option value="investment">💰 Investment</option>
                          <option value="installment">💳 Installment</option>
                          <option value="other">🔄 Other</option>
                        </select>
                      </>
                    )}
                  </div>
                  {item.isRecurring && item.recurringType === 'subscription' && (
                    <Input
                      placeholder="Provider (e.g., service name)"
                      value={item.provider || ''}
                      onChange={(e) => updateItem('savingsItems', index, 'provider', e.target.value)}
                      className="text-xs"
                    />
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem('savingsItems')} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Total Income</div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(budget.income, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Total Allocated</div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalAllocated, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Remaining</div>
              <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(remaining, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Percentage Used</div>
              <div className="text-2xl font-bold text-slate-900">
                {budget.income > 0 ? ((totalAllocated / budget.income) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
