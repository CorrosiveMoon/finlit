'use client'

import { useState, useEffect } from 'react'
import { useUserId } from '@/lib/hooks/useUserId'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCurrency, formatCurrency } from '@/components/ui/currency-select'

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
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const COLORS = {
  needs: '#ef4444',
  wants: '#3b82f6',
  savings: '#10b981',
  income: '#8b5cf6'
}

export default function BudgetOverview() {
  const userId = useUserId()
  const { currency } = useCurrency()
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([])
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

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

  // Prepare data for charts
  const monthlyData = MONTHS.map((monthName, index) => {
    const budget = budgets.find(b => b.month === index + 1)
    return {
      month: monthName,
      income: budget?.income || 0,
      needs: budget?.actualNeeds || 0,
      wants: budget?.actualWants || 0,
      savings: budget?.actualSavings || 0,
      total: (budget?.actualNeeds || 0) + (budget?.actualWants || 0) + (budget?.actualSavings || 0)
    }
  })

  // Calculate totals
  const totalIncome = budgets.reduce((sum, b) => sum + b.income, 0)
  const totalNeeds = budgets.reduce((sum, b) => sum + b.actualNeeds, 0)
  const totalWants = budgets.reduce((sum, b) => sum + b.actualWants, 0)
  const totalSavings = budgets.reduce((sum, b) => sum + b.actualSavings, 0)
  const totalSpent = totalNeeds + totalWants + totalSavings

  // Pie chart data for distribution
  const distributionData = [
    { name: 'Needs', value: totalNeeds, color: COLORS.needs },
    { name: 'Wants', value: totalWants, color: COLORS.wants },
    { name: 'Savings', value: totalSavings, color: COLORS.savings }
  ].filter(item => item.value > 0)

  // Average percentages
  const avgNeedsPercent = budgets.length > 0 
    ? budgets.reduce((sum, b) => sum + (b.actualNeeds / b.income * 100), 0) / budgets.filter(b => b.income > 0).length
    : 0
  const avgWantsPercent = budgets.length > 0 
    ? budgets.reduce((sum, b) => sum + (b.actualWants / b.income * 100), 0) / budgets.filter(b => b.income > 0).length
    : 0
  const avgSavingsPercent = budgets.length > 0 
    ? budgets.reduce((sum, b) => sum + (b.actualSavings / b.income * 100), 0) / budgets.filter(b => b.income > 0).length
    : 0

  if (loading) {
    return <div className="container mx-auto p-6"><div className="text-center py-12">Loading...</div></div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/budget">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-slate-900">Year Overview</h1>
          <p className="text-slate-600">Analyze your spending patterns and trends</p>
        </div>
        {/* Year Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Year:</label>
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

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">No budget data available for {selectedYear}</p>
            <Link href="/budget">
              <Button>Create Your First Budget</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(totalIncome, currency)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {budgets.length} months tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {formatCurrency(totalNeeds, currency)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Avg: {avgNeedsPercent.toFixed(1)}% of income
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Wants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalWants, currency)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Avg: {avgWantsPercent.toFixed(1)}% of income
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalSavings, currency)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Avg: {avgSavingsPercent.toFixed(1)}% of income
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income vs Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke={COLORS.income} strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="total" stroke="#64748b" strokeWidth={2} name="Total Spent" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // @ts-expect-error - recharts label prop type mismatch
                      label={(entry) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown by Month */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="needs" fill={COLORS.needs} name="Needs" />
                    <Bar dataKey="wants" fill={COLORS.wants} name="Wants" />
                    <Bar dataKey="savings" fill={COLORS.savings} name="Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Spending Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Income:</span>
                      <span className="font-semibold">${totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Spent:</span>
                      <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Left Over:</span>
                      <span className={`font-semibold ${totalIncome - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(totalIncome - totalSpent).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-slate-600">Savings Rate:</span>
                      <span className="font-semibold text-green-600">
                        {totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Average Monthly</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Income:</span>
                      <span className="font-semibold">
                        ${budgets.length > 0 ? (totalIncome / budgets.length).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Needs:</span>
                      <span className="font-semibold text-red-600">
                        ${budgets.length > 0 ? (totalNeeds / budgets.length).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Wants:</span>
                      <span className="font-semibold text-blue-600">
                        ${budgets.length > 0 ? (totalWants / budgets.length).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Savings:</span>
                      <span className="font-semibold text-green-600">
                        ${budgets.length > 0 ? (totalSavings / budgets.length).toFixed(2) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendations</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  {avgNeedsPercent > 60 && (
                    <li>• Your needs spending is above 60%. Consider finding ways to reduce essential expenses.</li>
                  )}
                  {avgSavingsPercent < 15 && (
                    <li>• Try to increase your savings rate to at least 20% for better financial security.</li>
                  )}
                  {avgWantsPercent > 35 && (
                    <li>• Your wants spending is high. Look for areas where you can cut back on discretionary expenses.</li>
                  )}
                  {avgSavingsPercent >= 20 && (
                    <li>• Great job! You&apos;re meeting the recommended 20% savings rate. Keep it up! 🎉</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
