'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BudgetBreakdown from '@/components/calculators/budget-breakdown'
import BudgetTemplate from '@/components/calculators/budget-template'
import { useCurrency, CurrencySelect, CURRENCIES, type CurrencyCode } from '@/components/ui/currency-select'

export default function BudgetCalculator() {
  const [income, setIncome] = useState('')
  const [calculated, setCalculated] = useState(false)
  const { currency, setCurrency } = useCurrency()
  const [showTemplate, setShowTemplate] = useState(false)
  
  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  const monthlyIncome = parseFloat(income) || 0
  const needs = monthlyIncome * 0.5
  const wants = monthlyIncome * 0.3
  const savings = monthlyIncome * 0.2
  
  const handleCalculate = () => {
    if (monthlyIncome > 0) {
      setCalculated(true)
    }
  }

  return (
    <div id="calculator" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Budget Calculator
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl">
            Enter your monthly income to see your personalized budget breakdown and create a detailed budget template.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Calculate Your Budget</CardTitle>
              <CardDescription>
                Enter your monthly after-tax income to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-64">
                    <CurrencySelect value={currency} onChange={setCurrency} className="w-full" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Monthly income (after taxes in ${selectedCurrency.code})`}
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleCalculate} size="lg">
                    Calculate Budget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {calculated && monthlyIncome > 0 && (
            <>
              <BudgetBreakdown
                income={monthlyIncome}
                needs={needs}
                wants={wants}
                savings={savings}
                currency={selectedCurrency}
              />
              
              <div className="mt-8">
                <Button 
                  onClick={() => setShowTemplate(!showTemplate)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {showTemplate ? 'Hide Budget Template' : 'Create Detailed Budget Template'}
                </Button>
              </div>
              
              {showTemplate && (
                <div className="mt-8">
                  <BudgetTemplate currency={selectedCurrency} income={monthlyIncome} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}