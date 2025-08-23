'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BudgetBreakdown from '@/components/calculators/budget-breakdown'
import BudgetTemplate from '@/components/calculators/budget-template'

const currencies = [
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
]

export default function BudgetCalculator() {
  const [income, setIncome] = useState('')
  const [calculated, setCalculated] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [showCurrencies, setShowCurrencies] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  
  const monthlyIncome = parseFloat(income) || 0
  const needs = monthlyIncome * 0.5
  const wants = monthlyIncome * 0.3
  const savings = monthlyIncome * 0.2
  
  const handleCalculate = () => {
    if (monthlyIncome > 0) {
      setCalculated(true)
    }
  }
  
  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency)
    setShowCurrencies(false)
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
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowCurrencies(!showCurrencies)}
                      className="w-full sm:w-32 justify-between"
                    >
                      {selectedCurrency.symbol} {selectedCurrency.code}
                      <span className="ml-2">▼</span>
                    </Button>
                    {showCurrencies && (
                      <div className="absolute top-full mt-1 w-full sm:w-64 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => handleCurrencySelect(currency)}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
                          >
                            <span>{currency.symbol} {currency.code}</span>
                            <span className="text-sm text-slate-500">{currency.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
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