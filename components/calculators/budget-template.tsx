'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Currency {
  code: string
  symbol: string
  name: string
}

interface BudgetItem {
  name: string
  amount: string
}

interface BudgetTemplateProps {
  currency: Currency
  income: number
}

export default function BudgetTemplate({ currency, income }: BudgetTemplateProps) {
  const [needsPercentage, setNeedsPercentage] = useState(50)
  const [wantsPercentage, setWantsPercentage] = useState(30)
  const [savingsPercentage, setSavingsPercentage] = useState(20)
  
  const [needsItems, setNeedsItems] = useState<BudgetItem[]>([
    { name: 'Rent/Mortgage', amount: '' },
    { name: 'Utilities', amount: '' },
    { name: 'Groceries', amount: '' },
    { name: 'Transportation', amount: '' },
    { name: 'Insurance', amount: '' },
    { name: 'Phone', amount: '' }
  ])
  
  const [wantsItems, setWantsItems] = useState<BudgetItem[]>([
    { name: 'Eating out', amount: '' },
    { name: 'Entertainment', amount: '' },
    { name: 'Gym membership', amount: '' },
    { name: 'Streaming services', amount: '' },
    { name: 'Shopping', amount: '' }
  ])
  
  const [savingsItems, setSavingsItems] = useState<BudgetItem[]>([
    { name: 'Emergency fund', amount: '' },
    { name: 'Retirement', amount: '' },
    { name: 'Investments', amount: '' }
  ])

  const targetNeeds = income * (needsPercentage / 100)
  const targetWants = income * (wantsPercentage / 100)
  const targetSavings = income * (savingsPercentage / 100)
  
  const actualNeeds = needsItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const actualWants = wantsItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const actualSavings = savingsItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  
  // Calculate actual percentages of income
  const actualNeedsPercentage = income > 0 ? (actualNeeds / income) * 100 : 0
  const actualWantsPercentage = income > 0 ? (actualWants / income) * 100 : 0
  const actualSavingsPercentage = income > 0 ? (actualSavings / income) * 100 : 0
  
  const formatCurrency = (amount: number) => {
    const minimumFractionDigits = ['JPY', 'KRW'].includes(currency.code) ? 0 : 2
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits,
      }).format(amount)
    } catch {
      return `${currency.symbol}${amount.toFixed(minimumFractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
  }

  const updateNeedsItem = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...needsItems]
    updated[index][field] = value
    setNeedsItems(updated)
  }

  const updateWantsItem = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...wantsItems]
    updated[index][field] = value
    setWantsItems(updated)
  }

  const updateSavingsItem = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...savingsItems]
    updated[index][field] = value
    setSavingsItems(updated)
  }

  const addNeedsItem = () => setNeedsItems([...needsItems, { name: '', amount: '' }])
  const addWantsItem = () => setWantsItems([...wantsItems, { name: '', amount: '' }])
  const addSavingsItem = () => setSavingsItems([...savingsItems, { name: '', amount: '' }])

  const resetPercentages = () => {
    setNeedsPercentage(50)
    setWantsPercentage(30)
    setSavingsPercentage(20)
  }

  const handlePercentageChange = (type: 'needs' | 'wants' | 'savings', value: number) => {
    if (type === 'needs') {
      setNeedsPercentage(value)
      const remaining = 100 - value
      const wantsRatio = wantsPercentage / (wantsPercentage + savingsPercentage)
      setWantsPercentage(Math.round(remaining * wantsRatio))
      setSavingsPercentage(remaining - Math.round(remaining * wantsRatio))
    } else if (type === 'wants') {
      setWantsPercentage(value)
      const remaining = 100 - value
      const needsRatio = needsPercentage / (needsPercentage + savingsPercentage)
      setNeedsPercentage(Math.round(remaining * needsRatio))
      setSavingsPercentage(remaining - Math.round(remaining * needsRatio))
    } else {
      setSavingsPercentage(value)
      const remaining = 100 - value
      const needsRatio = needsPercentage / (needsPercentage + wantsPercentage)
      setNeedsPercentage(Math.round(remaining * needsRatio))
      setWantsPercentage(remaining - Math.round(remaining * needsRatio))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Budget Template
            <Badge variant="outline">Interactive</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-4">Customize Your Budget Rule</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Needs:</label>
                <Input
                  type="number"
                  value={needsPercentage}
                  onChange={(e) => handlePercentageChange('needs', parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />
                <span>%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Wants:</label>
                <Input
                  type="number"
                  value={wantsPercentage}
                  onChange={(e) => handlePercentageChange('wants', parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />
                <span>%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Savings:</label>
                <Input
                  type="number"
                  value={savingsPercentage}
                  onChange={(e) => handlePercentageChange('savings', parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />
                <span>%</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetPercentages}>
                Reset to 50/30/20
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Needs Column */}
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="text-lg font-semibold text-slate-900">
                  Needs ({needsPercentage}%)
                </h3>
                <div className="text-sm text-slate-600">
                  {formatCurrency(actualNeeds)} / {formatCurrency(targetNeeds)}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-fit ${
                      actualNeeds > targetNeeds 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : actualNeeds === targetNeeds
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    {actualNeedsPercentage.toFixed(1)}% of income
                  </Badge>
                  {actualNeeds > targetNeeds && (
                    <Badge variant="outline" className="text-xs w-fit bg-red-50 text-red-700 border-red-200">
                      {((actualNeeds - targetNeeds) / income * 100).toFixed(1)}% over
                    </Badge>
                  )}
                  {actualNeeds < targetNeeds && actualNeeds > 0 && (
                    <Badge variant="outline" className="text-xs w-fit bg-green-50 text-green-700 border-green-200">
                      {((targetNeeds - actualNeeds) / income * 100).toFixed(1)}% under
                    </Badge>
                  )}
                </div>
              </div>
              {needsItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Expense name"
                    value={item.name}
                    onChange={(e) => updateNeedsItem(index, 'name', e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.amount}
                    onChange={(e) => updateNeedsItem(index, 'amount', e.target.value)}
                    className="w-20 text-sm"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addNeedsItem} className="w-full">
                Add Item
              </Button>
            </div>

            {/* Wants Column */}
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900">
                  Wants ({wantsPercentage}%)
                </h3>
                <div className="text-sm text-slate-600">
                  {formatCurrency(actualWants)} / {formatCurrency(targetWants)}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-fit ${
                      actualWants > targetWants 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : actualWants === targetWants
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    {actualWantsPercentage.toFixed(1)}% of income
                  </Badge>
                  {actualWants > targetWants && (
                    <Badge variant="outline" className="text-xs w-fit bg-red-50 text-red-700 border-red-200">
                      {((actualWants - targetWants) / income * 100).toFixed(1)}% over
                    </Badge>
                  )}
                  {actualWants < targetWants && actualWants > 0 && (
                    <Badge variant="outline" className="text-xs w-fit bg-green-50 text-green-700 border-green-200">
                      {((targetWants - actualWants) / income * 100).toFixed(1)}% under
                    </Badge>
                  )}
                </div>
              </div>
              {wantsItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Expense name"
                    value={item.name}
                    onChange={(e) => updateWantsItem(index, 'name', e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.amount}
                    onChange={(e) => updateWantsItem(index, 'amount', e.target.value)}
                    className="w-20 text-sm"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addWantsItem} className="w-full">
                Add Item
              </Button>
            </div>

            {/* Savings Column */}
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-slate-900">
                  Savings ({savingsPercentage}%)
                </h3>
                <div className="text-sm text-slate-600">
                  {formatCurrency(actualSavings)} / {formatCurrency(targetSavings)}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-fit ${
                      actualSavings > targetSavings 
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : actualSavings === targetSavings
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {actualSavingsPercentage.toFixed(1)}% of income
                  </Badge>
                  {actualSavings > targetSavings && (
                    <Badge variant="outline" className="text-xs w-fit bg-green-50 text-green-700 border-green-200">
                      {((actualSavings - targetSavings) / income * 100).toFixed(1)}% over
                    </Badge>
                  )}
                  {actualSavings < targetSavings && actualSavings >= 0 && (
                    <Badge variant="outline" className="text-xs w-fit bg-red-50 text-red-700 border-red-200">
                      {((targetSavings - actualSavings) / income * 100).toFixed(1)}% under
                    </Badge>
                  )}
                </div>
              </div>
              {savingsItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Savings goal"
                    value={item.name}
                    onChange={(e) => updateSavingsItem(index, 'name', e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.amount}
                    onChange={(e) => updateSavingsItem(index, 'amount', e.target.value)}
                    className="w-20 text-sm"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addSavingsItem} className="w-full">
                Add Item
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Budget Summary</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total Income:</span>
                <div className="font-semibold">{formatCurrency(income)}</div>
              </div>
              <div>
                <span className="text-slate-600">Total Allocated:</span>
                <div className="font-semibold">{formatCurrency(actualNeeds + actualWants + actualSavings)}</div>
              </div>
              <div>
                <span className="text-slate-600">Remaining:</span>
                <div className={`font-semibold ${income - (actualNeeds + actualWants + actualSavings) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(income - (actualNeeds + actualWants + actualSavings))}
                </div>
              </div>
              <div>
                <span className="text-slate-600">Percentage Used:</span>
                <div className="font-semibold">
                  {((actualNeeds + actualWants + actualSavings) / income * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}