'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, DollarSign, Shield, Calendar, CheckCircle, AlertCircle, Home, PieChart, Users, Info } from 'lucide-react'
import Link from 'next/link'

export default function RealEstatePage() {
  // Calculator state - simplified
  const [sharePrice, setSharePrice] = useState('10212')
  const [numShares, setNumShares] = useState('1')
  const [downPayment, setDownPayment] = useState('10212')
  const [monthlyInstallment, setMonthlyInstallment] = useState('10212')
  const [installmentMonths, setInstallmentMonths] = useState('24')
  const [bulkPayment1, setBulkPayment1] = useState('19118')
  const [bulkPayment2, setBulkPayment2] = useState('0')
  const [targetROI] = useState('80')

  // Calculations
  const calculations = useMemo(() => {
    const share = parseFloat(sharePrice) || 0
    const shares = parseFloat(numShares) || 0
    const down = parseFloat(downPayment) || 0
    const monthly = parseFloat(monthlyInstallment) || 0
    const months = parseInt(installmentMonths) || 0
    const bulk1 = parseFloat(bulkPayment1) || 0
    const bulk2 = parseFloat(bulkPayment2) || 0
    const roi = parseFloat(targetROI) || 80

    const totalFromInstallments = monthly * months
    const totalFromBulkPayments = bulk1 + bulk2
    const totalInvestment = down + totalFromInstallments + totalFromBulkPayments

    // Calculate payment timeline
    const timeline: { month: number; payment: number; cumulative: number; type: string }[] = []
    
    // Down payment at month 0
    timeline.push({ month: 0, payment: down, cumulative: down, type: 'Down Payment' })

    // Add monthly installments
    for (let month = 1; month <= months; month++) {
      const prevCumulative = timeline[timeline.length - 1]?.cumulative || 0
      timeline.push({
        month,
        payment: monthly,
        cumulative: prevCumulative + monthly,
        type: 'Monthly Installment'
      })
    }

    // Add bulk payments (at mid-point and end if both exist)
    if (bulk1 > 0) {
      const bulk1Month = Math.floor(months * 0.6) || 12
      const existing = timeline.find(t => t.month === bulk1Month)
      if (existing) {
        existing.payment += bulk1
        existing.type = 'Installment + Bulk'
        // Recalculate cumulative from this point
        for (let i = timeline.findIndex(t => t.month === bulk1Month); i < timeline.length; i++) {
          if (i === timeline.findIndex(t => t.month === bulk1Month)) {
            timeline[i].cumulative = (timeline[i - 1]?.cumulative || 0) + timeline[i].payment
          } else {
            timeline[i].cumulative = timeline[i - 1].cumulative + timeline[i].payment
          }
        }
      } else {
        const prevCumulative = timeline.filter(t => t.month < bulk1Month).reduce((max, t) => Math.max(max, t.cumulative), 0)
        timeline.push({
          month: bulk1Month,
          payment: bulk1,
          cumulative: prevCumulative + bulk1,
          type: 'Bulk Payment'
        })
        timeline.sort((a, b) => a.month - b.month)
      }
    }

    if (bulk2 > 0) {
      const bulk2Month = months + 6
      timeline.push({
        month: bulk2Month,
        payment: bulk2,
        cumulative: timeline[timeline.length - 1].cumulative + bulk2,
        type: 'Bulk Payment'
      })
    }

    // Recalculate cumulative properly
    timeline.sort((a, b) => a.month - b.month)
    let cumulative = 0
    timeline.forEach(t => {
      cumulative += t.payment
      t.cumulative = cumulative
    })

    // Calculate exit scenarios (80% ROI)
    const exitScenarios: {
      year: number
      investedTillDate: number
      targetResalePrice: number
      cashDownPayment: number
      remainingInstallments: number
      returnPerShare: number
      grossProfit: number
      roiPercent: number
    }[] = []

    for (let year = 1; year <= 5; year++) {
      const monthsElapsed = year * 12
      const investedTillDate = timeline
        .filter(t => t.month <= monthsElapsed)
        .reduce((sum, t) => sum + t.payment, 0)

      // Calculate target resale price for ROI
      const targetResalePrice = investedTillDate * (1 + roi / 100)
      const returnPerShare = targetResalePrice
      const grossProfit = returnPerShare - investedTillDate
      const roiPercent = investedTillDate > 0 ? (grossProfit / investedTillDate) * 100 : 0

      // Cash you get back
      const cashDownPayment = targetResalePrice
      
      // Remaining installments (what you won't pay)
      const remainingPayments = timeline
        .filter(t => t.month > monthsElapsed)
        .reduce((sum, t) => sum + t.payment, 0)

      exitScenarios.push({
        year,
        investedTillDate,
        targetResalePrice,
        cashDownPayment,
        remainingInstallments: remainingPayments,
        returnPerShare,
        grossProfit,
        roiPercent
      })
    }

    return {
      totalInvestment,
      timeline,
      exitScenarios,
      totalFromInstallments,
      totalFromBulkPayments
    }
  }, [sharePrice, numShares, downPayment, monthlyInstallment, installmentMonths, bulkPayment1, bulkPayment2, targetROI])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              <strong>Educational Content Only:</strong> This page is not affiliated with Nawy or Nawy Shares. 
              All content is for educational purposes to help you understand real estate investing concepts.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-teal-100 rounded-full">
              <Building2 className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Nawy Fractional Real Estate Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            Understand how Nawy&apos;s fractional property investment works - buy shares in premium properties 
            with flexible payment plans and target 80% ROI exit strategy.
          </p>
          <Badge variant="outline" className="text-sm px-4 py-2 border-teal-300 text-teal-700">
            Learn • Don&apos;t Invest Without Research
          </Badge>
        </div>

        {/* How It Works Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Info className="h-6 w-6 text-teal-600" />
              How Nawy Fractional Investment Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">📊 Share-Based Investment</h3>
                <p className="text-slate-700">
                  Instead of buying an entire property, you purchase <strong>shares</strong> in premium real estate. 
                  Each share has a fixed price (e.g., EGP 10,212 per share). You can buy as many shares as you want, 
                  making real estate accessible without needing millions.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">💳 Flexible Payment Plans</h3>
                <p className="text-slate-700">
                  Nawy offers flexible payment structures: a <strong>down payment</strong>, followed by 
                  <strong> monthly installments</strong> (which may have different phases), and sometimes 
                  <strong> bulk payments</strong> at specific dates. This spreads your investment over time.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">🎯 80% ROI Exit Strategy</h3>
                <p className="text-slate-700">
                  Nawy aims to sell the property when it reaches <strong>80% ROI</strong> on your total invested amount, 
                  or at <strong>property delivery</strong> (whichever comes first). This means the earlier the property 
                  exits, the less you&apos;ve paid in, but you still get an 80% return on what you&apos;ve invested.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">💰 No More Payments After Exit</h3>
                <p className="text-slate-700">
                  If the property exits early (e.g., in year 2), you <strong>stop paying</strong> the remaining installments. 
                  You receive your cash return, and the remaining payment obligations are canceled. The earlier the exit, 
                  the less capital you tie up.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Key Concept: Time vs. Return Trade-off
              </h4>
              <p className="text-sm text-blue-800">
                <strong>Earlier exit (e.g., Year 1-2):</strong> Lower total invested, 80% ROI on smaller amount, quicker returns.
                <br />
                <strong>Later exit (e.g., Year 4-5):</strong> More capital invested over time, 80% ROI on larger amount, higher absolute profit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Calculator */}
        <Card className="mb-12 border-2 border-teal-200">
          <CardHeader className="bg-teal-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-orange-600" />
              Nawy Investment Calculator
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Calculate your approximate investment and projected returns (based on 80% ROI exit strategy)
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Basic Investment Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Investment</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price Per Share (EGP)
                  </label>
                  <Input
                    type="number"
                    value={sharePrice}
                    onChange={(e) => setSharePrice(e.target.value)}
                    placeholder="10212"
                  />
                  <p className="text-xs text-slate-500 mt-1">How much does one share cost?</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Shares
                  </label>
                  <Input
                    type="number"
                    value={numShares}
                    onChange={(e) => setNumShares(e.target.value)}
                    placeholder="1"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-1">How many shares to buy?</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Down Payment (EGP)
                  </label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="10212"
                  />
                  <p className="text-xs text-slate-500 mt-1">Initial payment you make now</p>
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Plan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Installment (EGP)
                  </label>
                  <Input
                    type="number"
                    value={monthlyInstallment}
                    onChange={(e) => setMonthlyInstallment(e.target.value)}
                    placeholder="10212"
                  />
                  <p className="text-xs text-slate-500 mt-1">Amount you pay each month</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Months
                  </label>
                  <Input
                    type="number"
                    value={installmentMonths}
                    onChange={(e) => setInstallmentMonths(e.target.value)}
                    placeholder="24"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-1">How many monthly payments?</p>
                </div>
              </div>
            </div>

            {/* Bulk Payments - Optional */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Bulk Payments <span className="text-sm font-normal text-slate-500">(Optional)</span>
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Large one-time payments (if your payment plan includes them, otherwise leave at 0)
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bulk Payment 1 (EGP)
                  </label>
                  <Input
                    type="number"
                    value={bulkPayment1}
                    onChange={(e) => setBulkPayment1(e.target.value)}
                    placeholder="19118 or 0"
                  />
                  <p className="text-xs text-slate-500 mt-1">First large payment (or 0)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bulk Payment 2 (EGP)
                  </label>
                  <Input
                    type="number"
                    value={bulkPayment2}
                    onChange={(e) => setBulkPayment2(e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">Second large payment (or 0)</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-lg border-2 border-teal-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Investment Summary</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Down Payment</p>
                  <p className="text-xl font-bold text-orange-600">
                    E£{parseFloat(downPayment || '0').toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Monthly Installments</p>
                  <p className="text-xl font-bold text-teal-600">
                    E£{calculations.totalFromInstallments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-500">
                    ({installmentMonths} × E£{parseFloat(monthlyInstallment || '0').toLocaleString('en-US', { maximumFractionDigits: 0 })})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Bulk Payments</p>
                  <p className="text-xl font-bold text-amber-600">
                    E£{calculations.totalFromBulkPayments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-slate-300">
                  <p className="text-sm text-slate-600 mb-1">Total (if held to end)</p>
                  <p className="text-2xl font-bold text-slate-900">
                    E£{calculations.totalInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6 text-teal-600" />
              Payment Timeline
            </CardTitle>
            <p className="text-slate-600 text-sm">Month-by-month breakdown of your payments</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left p-3 font-semibold text-slate-900">Month</th>
                    <th className="text-left p-3 font-semibold text-slate-900">Payment Type</th>
                    <th className="text-right p-3 font-semibold text-slate-900">Amount (EGP)</th>
                    <th className="text-right p-3 font-semibold text-slate-900">Cumulative (EGP)</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.timeline.slice(0, 20).map((item, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-900">
                        {item.month === 0 ? 'Now' : `Month ${item.month}`}
                      </td>
                      <td className="p-3 text-slate-700">{item.type}</td>
                      <td className="p-3 text-right font-semibold text-orange-600">
                        E£{item.payment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right font-semibold text-teal-600">
                        E£{item.cumulative.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {calculations.timeline.length > 20 && (
                <p className="text-sm text-slate-500 mt-3 text-center">
                  Showing first 20 payments. Total timeline: {calculations.timeline.length} payments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exit Scenarios - 80% ROI */}
        <Card className="mb-12 border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Exit Scenarios at {targetROI}% ROI
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Projected returns if property exits at different years (whichever comes first: {targetROI}% ROI or delivery)
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-green-300 bg-green-50">
                    <th className="text-left p-3 font-semibold text-slate-900">Exit Year</th>
                    <th className="text-right p-3 font-semibold text-slate-900">You Invested</th>
                    <th className="text-right p-3 font-semibold text-slate-900">You Receive</th>
                    <th className="text-right p-3 font-semibold text-slate-900">Your Profit</th>
                    <th className="text-right p-3 font-semibold text-slate-900">Payments Saved<br/>(You Won&apos;t Pay)</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.exitScenarios.map((scenario, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-green-50">
                      <td className="p-3 font-semibold text-slate-900">Year {scenario.year}</td>
                      <td className="p-3 text-right text-slate-700">
                        E£{scenario.investedTillDate.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right font-bold text-green-700">
                        E£{scenario.cashDownPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right font-bold text-green-600">
                        +E£{scenario.grossProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        <br />
                        <span className="text-xs text-slate-600">({scenario.roiPercent.toFixed(0)}% ROI)</span>
                      </td>
                      <td className="p-3 text-right text-orange-600 font-semibold">
                        E£{scenario.remainingInstallments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Read This Table
              </h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>You Invested:</strong> How much you&apos;ve paid by that year.
                </p>
                <p>
                  <strong>You Receive:</strong> Cash returned when property sells (at {targetROI}% ROI).
                </p>
                <p>
                  <strong>Your Profit:</strong> The gain you make on your investment.
                </p>
                <p>
                  <strong>Payments Saved:</strong> If property exits early, you stop paying the rest - that&apos;s money you keep!
                </p>
                <p className="pt-2 border-t border-blue-300 font-semibold">
                  💡 Example: If it exits in Year 2, you get {targetROI}% profit on what you&apos;ve paid + you avoid paying the remaining years!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Example from Images */}
        <Card className="mb-12 bg-gradient-to-br from-teal-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl">Real Example: 3BR Luxury Apartment</CardTitle>
            <p className="text-slate-600">Based on actual Nawy property listing</p>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Property Details</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li><strong>Location:</strong> Modon Ras El Hekma</li>
                    <li><strong>Type:</strong> 3 Bedroom Luxury Apartment</li>
                    <li><strong>Property Value:</strong> EGP 47,466,078</li>
                    <li><strong>Unit Price per Share:</strong> EGP 43,150,974</li>
                    <li><strong>Shares Available:</strong> 15 shares</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Investment Structure</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li><strong>Price per Share:</strong> EGP 10,212</li>
                    <li><strong>Down Payment:</strong> EGP 10,212</li>
                    <li><strong>Monthly (Jan-Sep 2026):</strong> EGP 10,212</li>
                    <li><strong>Monthly (Starting 2027):</strong> EGP 4,302</li>
                    <li><strong>Bulk Payments:</strong> EGP 19,118 (Sep 2027 & 2028)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Example Exit Scenario (Year 1)</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Invested Till Date</p>
                    <p className="text-xl font-bold text-slate-900">EGP 111,821</p>
                  </div>
                  <div>
                    <p className="text-green-700">Return Per Share</p>
                    <p className="text-xl font-bold text-green-600">EGP 201,279</p>
                  </div>
                  <div>
                    <p className="text-green-700">Gross Profit</p>
                    <p className="text-xl font-bold text-green-700">+EGP 89,457</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Considerations */}
        <Card className="mb-12 border-2 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-amber-600" />
              Important Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">⚠️ Market Risk</h4>
                <p className="text-sm text-slate-600">
                  Real estate values can fluctuate. The 80% ROI target is not guaranteed and depends on market conditions, 
                  property appreciation, and economic factors. Property values can also decrease.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">⏰ Liquidity & Exit Timing</h4>
                <p className="text-sm text-slate-600">
                  You cannot predict exactly when the property will exit. It could be earlier or later than expected. 
                  Unlike stocks, you cannot easily sell your shares at will - you must wait for Nawy&apos;s exit strategy or find a buyer.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">💰 Payment Commitment</h4>
                <p className="text-sm text-slate-600">
                  You are committing to a payment plan. Make sure you can afford the monthly installments and bulk payments. 
                  Missing payments could result in penalties or loss of your investment.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">🏗️ Construction & Delivery Risk</h4>
                <p className="text-sm text-slate-600">
                  Off-plan properties carry completion risk. Delays can happen, and in rare cases, projects may not complete as planned. 
                  Always research the developer&apos;s track record.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">📚 Do Your Research</h4>
                <p className="text-sm text-slate-600">
                  This calculator is educational only. Always verify all numbers with Nawy directly, read all contracts carefully, 
                  understand all fees, and consult with financial advisors before investing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action - Educational */}
        <Card className="bg-slate-900 text-white">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Build Your Financial Foundation?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Before investing in real estate or any asset, make sure you have a solid budget, emergency fund, and clear financial goals. 
              Start building your financial literacy today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#calculator">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Try Budget Calculator
                </Button>
              </Link>
              <Link href="/budget">
                <Button size="lg" variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                  Create My Budget
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="mt-12 p-6 bg-slate-100 rounded-lg border-2 border-slate-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
            <div className="space-y-2 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Disclaimer & Content Rights</p>
              <p>
                This educational page is not affiliated with, endorsed by, or connected to Nawy or Nawy Shares in any way. 
                All content about Nawy Shares is provided for educational purposes only to help users understand 
                fractional real estate investing concepts.
              </p>
              <p>
                All information, names, and concepts related to Nawy Shares are the intellectual property of 
                Nawy and/or Nawy Shares. This page is purely educational and should not be considered as 
                financial advice or an endorsement to invest.
              </p>
              <p className="font-semibold">
                Always conduct your own research, verify all information directly with Nawy, and consult with licensed financial advisors before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
