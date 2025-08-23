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

interface EmergencyFundCalculatorProps {
  currency: Currency
}

export default function EmergencyFundCalculator({ currency }: EmergencyFundCalculatorProps) {
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlySavings, setMonthlySavings] = useState('')
  const [targetMonths, setTargetMonths] = useState(6)
  const [calculated, setCalculated] = useState(false)

  const expenses = parseFloat(monthlyExpenses) || 0
  const current = parseFloat(currentSavings) || 0
  const monthly = parseFloat(monthlySavings) || 0
  
  const targetAmount = expenses * targetMonths
  const remaining = Math.max(0, targetAmount - current)
  const monthsToReach = monthly > 0 ? Math.ceil(remaining / monthly) : 0
  const progressPercentage = targetAmount > 0 ? Math.min(100, (current / targetAmount) * 100) : 0

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

  const handleCalculate = () => {
    if (expenses > 0) {
      setCalculated(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Emergency Fund Calculator
          <Badge variant="outline">Essential</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Monthly Essential Expenses ({currency.symbol})
              </label>
              <Input
                type="number"
                placeholder="Rent, utilities, groceries, etc."
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Current Emergency Savings ({currency.symbol})
              </label>
              <Input
                type="number"
                placeholder="What you have saved now"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Monthly Savings Contribution ({currency.symbol})
              </label>
              <Input
                type="number"
                placeholder="How much you can save monthly"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Target Months of Expenses
              </label>
              <div className="flex gap-2">
                {[3, 6, 9, 12].map((months) => (
                  <Button
                    key={months}
                    variant={targetMonths === months ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTargetMonths(months)}
                  >
                    {months}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Emergency Fund
          </Button>

          {calculated && expenses > 0 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatCurrency(targetAmount)}
                  </div>
                  <div className="text-sm text-slate-600">Target Amount</div>
                  <div className="text-xs text-slate-500">
                    {targetMonths} months of expenses
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(current)}
                  </div>
                  <div className="text-sm text-slate-600">Current Savings</div>
                  <div className="text-xs text-slate-500">
                    {progressPercentage.toFixed(1)}% of target
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {formatCurrency(remaining)}
                  </div>
                  <div className="text-sm text-slate-600">Still Needed</div>
                  <div className="text-xs text-slate-500">
                    {monthly > 0 ? `${monthsToReach} months to reach` : 'Set monthly savings'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Progress Visualization</h4>
                <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{currency.symbol}0</span>
                  <span className="font-semibold">{progressPercentage.toFixed(1)}% Complete</span>
                  <span>{formatCurrency(targetAmount)}</span>
                </div>
              </div>

              {monthly > 0 && remaining > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Savings Plan</h4>
                  <div className="text-slate-600 space-y-1">
                    <div>• Save {formatCurrency(monthly)} per month</div>
                    <div>• Reach your goal in {monthsToReach} months</div>
                    <div>• Target completion: {new Date(Date.now() + monthsToReach * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Emergency Fund Tips</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>• Keep emergency funds in a separate, easily accessible savings account</div>
                  <div>• Only use emergency funds for true emergencies (job loss, medical bills, major repairs)</div>
                  <div>• Start small - even {formatCurrency(500)} is better than nothing</div>
                  <div>• Automate transfers to build your fund consistently</div>
                  <div>• Review and adjust your target amount annually</div>
                </div>
              </div>

              {progressPercentage >= 100 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                  <p className="text-green-700 text-sm">
                    You&#39;ve reached your emergency fund goal! You now have {targetMonths} months of expenses saved. 
                    Consider maintaining this amount and directing future savings toward other financial goals like retirement or investments.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}