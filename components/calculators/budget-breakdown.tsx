import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Currency {
  code: string
  symbol: string
  name: string
}

interface BudgetBreakdownProps {
  income: number
  needs: number
  wants: number
  savings: number
  currency: Currency
}

export default function BudgetBreakdown({ income, needs, wants, savings, currency }: BudgetBreakdownProps) {
  const formatCurrency = (amount: number) => {
    // Handle special cases for currencies that don't use decimals
    const minimumFractionDigits = ['JPY', 'KRW'].includes(currency.code) ? 0 : 2
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits,
      }).format(amount)
    } catch {
      // Fallback for unsupported currencies
      return `${currency.symbol}${amount.toFixed(minimumFractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
  }
  
  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>Your Budget Breakdown</span>
            <Badge variant="outline" className="text-2xl font-bold px-4 py-2">
              {formatCurrency(income)}/month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-red-50 rounded-lg flex-1">
              <div className="text-3xl font-bold text-red-600 mb-2">{formatCurrency(needs)}</div>
              <div className="text-lg font-semibold text-slate-900 mb-1">Needs (50%)</div>
              <div className="text-sm text-slate-600">Essential expenses</div>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg flex-1">
              <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(wants)}</div>
              <div className="text-lg font-semibold text-slate-900 mb-1">Wants (30%)</div>
              <div className="text-sm text-slate-600">Discretionary spending</div>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-lg flex-1">
              <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(savings)}</div>
              <div className="text-lg font-semibold text-slate-900 mb-1">Savings (20%)</div>
              <div className="text-sm text-slate-600">Future planning</div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-4">Next Steps:</h4>
            <div className="flex flex-col space-y-2 text-slate-600">
              <div>• Track your actual spending for a month</div>
              <div>• Compare your expenses to these target amounts</div>
              <div>• Adjust your spending habits to align with your budget rule</div>
              <div>• Start with building an emergency fund from your savings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}