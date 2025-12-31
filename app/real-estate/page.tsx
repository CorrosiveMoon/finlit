'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, DollarSign, Shield, Calendar, CheckCircle, AlertCircle, Home, PieChart, Users } from 'lucide-react'
import Link from 'next/link'

export default function RealEstatePage() {
  const [propertyValue, setPropertyValue] = useState('3000000')
  const [ownershipPercent, setOwnershipPercent] = useState('5')
  const [installmentMonths, setInstallmentMonths] = useState('18')

  const calcPropertyValue = parseFloat(propertyValue) || 0
  const calcOwnership = parseFloat(ownershipPercent) || 0
  const calcMonths = parseFloat(installmentMonths) || 0

  const yourInvestment = calcPropertyValue * (calcOwnership / 100)
  const downPayment = yourInvestment * 0.1
  const monthlyInstallment = calcMonths > 0 ? (yourInvestment - downPayment) / calcMonths : 0
  
  // Example appreciation (20% increase)
  const futureValue = calcPropertyValue * 1.2
  const yourFutureShare = futureValue * (calcOwnership / 100)
  const capitalGain = yourFutureShare - yourInvestment

  // Example rental income (assuming 10k EGP/month rent)
  const monthlyRent = calcPropertyValue * 0.0033 // ~0.33% of property value
  const yourRentalIncome = monthlyRent * (calcOwnership / 100)

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
            Understanding Real Estate Investing
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            Learn how fractional real estate investment works with platforms like Nawy Shares - 
            a way to invest in premium properties starting from just 5% ownership.
          </p>
          <Badge variant="outline" className="text-sm px-4 py-2 border-teal-300 text-teal-700">
            Learn • Don&apos;t Invest Without Research
          </Badge>
        </div>

        {/* What is Nawy Shares */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Home className="h-6 w-6 text-teal-600" />
              What is Nawy Shares?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Nawy Shares is a fractional real estate investment platform targeting the Egyptian market. 
              Instead of buying an entire property (which may cost millions), you can invest in just a portion 
              of a property - starting from as little as 5% ownership.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-slate-900">Fractional Ownership</h4>
                </div>
                <p className="text-sm text-slate-600">Own a percentage of premium properties instead of the entire unit</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-slate-900">Lower Entry Barrier</h4>
                </div>
                <p className="text-sm text-slate-600">Start investing with significantly less capital than traditional real estate</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-slate-900">Diversification</h4>
                </div>
                <p className="text-sm text-slate-600">Spread your investment across multiple properties and locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works - 4 Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How Nawy Shares Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <Card className="border-t-4 border-t-teal-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
                    1
                  </div>
                  <CardTitle className="text-lg">Choose</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-700 font-semibold">Choose Investment</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Browse premium projects</li>
                  <li>• Review unit details</li>
                  <li>• Select ownership % (5%+)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-t-4 border-t-teal-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
                    2
                  </div>
                  <CardTitle className="text-lg">Checkout</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-700 font-semibold">Pay Down Payment</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Upload national ID</li>
                  <li>• Add your address</li>
                  <li>• Pay online via card</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-t-4 border-t-teal-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
                    3
                  </div>
                  <CardTitle className="text-lg">Sign</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-700 font-semibold">Sign Reservation Form</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Form delivered by courier</li>
                  <li>• Sign at your convenience</li>
                  <li>• Within 1 week delivery</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-t-4 border-t-teal-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
                    4
                  </div>
                  <CardTitle className="text-lg">Grow</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-700 font-semibold">Watch Investment Grow</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• You&apos;re now an investor</li>
                  <li>• Nawy manages returns</li>
                  <li>• Track your investment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Calculator */}
        <Card className="mb-12 border-2 border-teal-200">
          <CardHeader className="bg-teal-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-orange-600" />
              Investment Calculator
            </CardTitle>
            <p className="text-slate-600 text-sm">Calculate your potential investment and returns</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Total Value (EGP)
                </label>
                <Input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  placeholder="3000000"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Ownership %
                </label>
                <Input
                  type="number"
                  value={ownershipPercent}
                  onChange={(e) => setOwnershipPercent(e.target.value)}
                  placeholder="5"
                  min="5"
                  max="100"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Installment Period (Months)
                </label>
                <Input
                  type="number"
                  value={installmentMonths}
                  onChange={(e) => setInstallmentMonths(e.target.value)}
                  placeholder="18"
                  min="1"
                  className="text-lg"
                />
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Breakdown */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  Payment Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Your Investment:</span>
                    <span className="font-bold text-lg text-slate-900">
                      E£{yourInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-slate-600">Down Payment (10%):</span>
                    <span className="font-semibold text-orange-600">
                      E£{downPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Monthly Installment:</span>
                    <span className="font-semibold text-teal-600">
                      E£{monthlyInstallment.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500 border-t pt-2">
                    <span>Over {installmentMonths} months</span>
                  </div>
                </div>
              </div>

              {/* Potential Returns */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Potential Returns (Example)
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Property appreciates to:</span>
                    <span className="font-bold text-slate-900">
                      E£{futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-slate-600">Your share value:</span>
                    <span className="font-semibold text-green-600">
                      E£{yourFutureShare.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Capital Gain:</span>
                    <span className="font-bold text-lg text-green-700">
                      +E£{capitalGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-slate-600">Monthly Rental Income:</span>
                    <span className="font-semibold text-teal-600">
                      E£{yourRentalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Returns shown are examples assuming 20% property appreciation and average rental yields. 
                Actual returns vary based on market conditions, location, and property type. Always do your own research.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How You Get Returns */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-teal-600" />
              How You Get Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Capital Appreciation</h4>
                <p className="text-sm text-slate-600">
                  Sell your share when property value increases. If a 3M property grows to 3.6M, 
                  your 5% share (150k) becomes 180k - a 30k profit.
                </p>
              </div>

              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Rental Income</h4>
                <p className="text-sm text-slate-600">
                  Receive your percentage of monthly rent. If Nawy rents the property for 10k/month, 
                  you get 5% = 500 EGP/month passive income.
                </p>
              </div>

              <div className="p-6 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Exit Options</h4>
                <p className="text-sm text-slate-600">
                  Sell your shares to other investors through Nawy&apos;s platform, or wait until 
                  property delivery to exit with full capital appreciation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-teal-600" />
              Key Benefits of Fractional Real Estate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Real estate exposure without needing millions in capital',
                'Fractional ownership lowers entry barrier significantly',
                'Diversify across multiple properties and locations',
                'Professional management by Nawy handles everything',
                'Potential for both capital gains and rental income',
                'Access to premium off-plan projects in prime areas'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real Example Scenario */}
        <Card className="mb-12 bg-gradient-to-br from-teal-50 to-orange-50 border-2 border-teal-200">
          <CardHeader>
            <CardTitle className="text-2xl">Real Example Scenario</CardTitle>
            <p className="text-slate-600">See how a typical investment might work</p>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">The Property</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>Location:</strong> Off-plan apartment in New Cairo</li>
                    <li><strong>Total Value:</strong> E£3,000,000</li>
                    <li><strong>Your Share:</strong> 5% ownership</li>
                    <li><strong>Your Investment:</strong> E£150,000</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Payment Structure</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>Down Payment:</strong> E£15,000 (10% upfront)</li>
                    <li><strong>Installments:</strong> E£7,500/month</li>
                    <li><strong>Duration:</strong> 18 months</li>
                    <li><strong>Total Paid:</strong> E£150,000</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Your Process</h4>
                <ol className="space-y-2 text-slate-700">
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">1.</span>
                    <span>Select the unit and 5% ownership on the platform</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">2.</span>
                    <span>Pay E£15,000 down payment online</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">3.</span>
                    <span>Sign the reservation form when delivered</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">4.</span>
                    <span>Pay E£7,500 monthly installments for 18 months</span>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
                <h4 className="font-semibold text-green-900 mb-2">Potential Outcome (Example)</h4>
                <p className="text-sm text-green-800">
                  If property value increases from E£3M to E£3.6M, your 5% share grows from E£150k to E£180k 
                  = <strong>E£30,000 profit</strong>. Plus, if property generates E£10k/month rent, 
                  you receive <strong>E£500/month passive income</strong>.
                </p>
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
                  Real estate values can go down as well as up. Property appreciation is not guaranteed, 
                  especially in volatile markets or economic downturns.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">⏰ Liquidity</h4>
                <p className="text-sm text-slate-600">
                  Unlike stocks, real estate is not easily sold. You may need to wait for property completion 
                  or find another investor willing to buy your share.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">🏗️ Construction Risk</h4>
                <p className="text-sm text-slate-600">
                  Off-plan properties carry completion risk. Delays can happen, though reputable developers 
                  typically deliver on commitments.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">💰 Do Your Research</h4>
                <p className="text-sm text-slate-600">
                  Always research the developer, location, market trends, and platform thoroughly. 
                  Diversify your investments and never invest more than you can afford to lose.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action - Educational */}
        <Card className="bg-slate-900 text-white">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Learn More About Budgeting?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Before investing in anything, make sure you have a solid budget and emergency fund. 
              Start building your financial foundation today.
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
                Always conduct your own research and consult with licensed financial advisors before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
