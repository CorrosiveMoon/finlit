'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

export default function UnitPriceCalculator() {
  const [product1, setProduct1] = useState({ price: '', size: '', name: '' })
  const [product2, setProduct2] = useState({ price: '', size: '', name: '' })
  const [calculated, setCalculated] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [showCurrencies, setShowCurrencies] = useState(false)
  
  const calculateUnitPrice = (price: string, size: string) => {
    const p = parseFloat(price)
    const s = parseFloat(size)
    return p && s ? p / s : 0
  }
  
  const unitPrice1 = calculateUnitPrice(product1.price, product1.size)
  const unitPrice2 = calculateUnitPrice(product2.price, product2.size)
  
  const handleCalculate = () => {
    if (unitPrice1 > 0 && unitPrice2 > 0) {
      setCalculated(true)
    }
  }
  
  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency)
    setShowCurrencies(false)
  }
  
  const formatPrice = (price: number) => {
    const minimumFractionDigits = ['JPY', 'KRW'].includes(selectedCurrency.code) ? 0 : 2
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedCurrency.code,
        minimumFractionDigits,
        maximumFractionDigits: 3,
      }).format(price)
    } catch {
      return `${selectedCurrency.symbol}${price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Price Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
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
              <p className="text-sm text-slate-600">
                Compare products in {selectedCurrency.name}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col space-y-4 flex-1">
              <h4 className="font-semibold text-slate-900">Product 1</h4>
              <Input
                placeholder="Product name (optional)"
                value={product1.name}
                onChange={(e) => setProduct1({...product1, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder={`Price (${selectedCurrency.symbol})`}
                value={product1.price}
                onChange={(e) => setProduct1({...product1, price: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Size (g, kg, L, etc.)"
                value={product1.size}
                onChange={(e) => setProduct1({...product1, size: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col space-y-4 flex-1">
              <h4 className="font-semibold text-slate-900">Product 2</h4>
              <Input
                placeholder="Product name (optional)"
                value={product2.name}
                onChange={(e) => setProduct2({...product2, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder={`Price (${selectedCurrency.symbol})`}
                value={product2.price}
                onChange={(e) => setProduct2({...product2, price: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Size (g, kg, L, etc.)"
                value={product2.size}
                onChange={(e) => setProduct2({...product2, size: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <Button onClick={handleCalculate} className="w-full mt-6">
          Compare Unit Prices
        </Button>
        
        {calculated && (
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className={`p-4 rounded-lg border-2 flex-1 ${
              unitPrice1 < unitPrice2 ? 'border-green-500 bg-green-50' : 'border-slate-200'
            }`}>
              <h5 className="font-semibold text-slate-900 mb-2">
                {product1.name || 'Product 1'}
              </h5>
              <div className="flex flex-col space-y-1">
                <span className="text-slate-600">
                  {selectedCurrency.symbol}{product1.price} for {product1.size} units
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {formatPrice(unitPrice1)} per unit
                  </span>
                  {unitPrice1 < unitPrice2 && (
                    <Badge className="bg-green-100 text-green-800">Best Deal!</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 flex-1 ${
              unitPrice2 < unitPrice1 ? 'border-green-500 bg-green-50' : 'border-slate-200'
            }`}>
              <h5 className="font-semibold text-slate-900 mb-2">
                {product2.name || 'Product 2'}
              </h5>
              <div className="flex flex-col space-y-1">
                <span className="text-slate-600">
                  {selectedCurrency.symbol}{product2.price} for {product2.size} units
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {formatPrice(unitPrice2)} per unit
                  </span>
                  {unitPrice2 < unitPrice1 && (
                    <Badge className="bg-green-100 text-green-800">Best Deal!</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {calculated && unitPrice1 > 0 && unitPrice2 > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h5 className="font-semibold text-slate-900 mb-2">Savings Analysis:</h5>
            <p className="text-slate-600">
              {unitPrice1 < unitPrice2 
                ? `Product 1 saves you ${formatPrice(unitPrice2 - unitPrice1)} per unit (${(((unitPrice2 - unitPrice1) / unitPrice2) * 100).toFixed(1)}% cheaper)`
                : unitPrice2 < unitPrice1
                ? `Product 2 saves you ${formatPrice(unitPrice1 - unitPrice2)} per unit (${(((unitPrice1 - unitPrice2) / unitPrice1) * 100).toFixed(1)}% cheaper)`
                : 'Both products have the same unit price!'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}