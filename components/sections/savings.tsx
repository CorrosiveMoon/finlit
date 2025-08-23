'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import EmergencyFundCalculator from '@/components/calculators/emergency-fund-calculator'

export default function Savings() {
  const [showEmergencyCalculator, setShowEmergencyCalculator] = useState(false)
  const currency = { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' }

  return (
    <div id="savings" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Building Your Financial Foundation
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl">
            Learn why saving matters and how to build an emergency fund that protects your financial future.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Why Save Money?
                    <Badge variant="outline">Essential</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 text-slate-600">
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">•</span>
                      <span>Be prepared for unexpected expenses without going into debt</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">•</span>
                      <span>Work towards long-term financial goals and dreams</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">•</span>
                      <span>Reduce stress and anxiety about money</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">•</span>
                      <span>Build financial security and independence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Savings Tips</CardTitle>
                  <CardDescription>Simple strategies to boost your savings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-900">Budget First:</span> Use the 50/30/20 rule to allocate 20% to savings
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Automate:</span> Set up automatic transfers to your savings account
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Separate Account:</span> Keep savings in a different account to avoid temptation
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Start Small:</span> Even E£500/month creates a savings habit that grows
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Emergency Fund Priority
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </CardTitle>
                  <CardDescription>
                    Your first savings goal should be an emergency fund
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-6">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Target Amount:</h4>
                      <p className="text-slate-600 mb-2">
                        3-6 months of essential living expenses
                      </p>
                      <p className="text-sm text-slate-500">
                        Include only needs like rent, utilities, groceries, and transportation. 
                        Exclude wants like dining out and entertainment.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Real Life Example:</h4>
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly rent:</span>
                          <span>E£8,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilities:</span>
                          <span>E£1,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Groceries:</span>
                          <span>E£3,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transportation:</span>
                          <span>E£2,000</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Monthly essentials:</span>
                          <span>E£14,700</span>
                        </div>
                        <div className="flex justify-between text-green-700 font-semibold">
                          <span>Emergency fund goal:</span>
                          <span>E£44,100 - E£88,200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => setShowEmergencyCalculator(!showEmergencyCalculator)}
                      className="w-full"
                      variant="outline"
                    >
                      {showEmergencyCalculator ? 'Hide Emergency Fund Calculator' : 'Calculate Your Emergency Fund'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Breaking Down Your 20% Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-slate-900 mb-2">Priority 1: Emergency Fund</h5>
                      <p className="text-slate-600 text-sm">
                        Direct most or all of your 20% savings here until you reach 3-6 months of expenses
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-slate-900 mb-2">Priority 2: Other Goals</h5>
                      <p className="text-slate-600 text-sm">
                        Once emergency fund is complete, allocate to retirement, debt payoff, or other goals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showEmergencyCalculator && (
            <div className="mt-12">
              <EmergencyFundCalculator currency={currency} />
            </div>
          )}
          
          <div className="mt-12 p-8 bg-white rounded-lg border-2 border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">
              Remember: Every Pound Counts
            </h3>
            <p className="text-slate-600 text-center max-w-3xl mx-auto">
              Whether you save E£500 or E£5,000 per month, the important thing is to start. Savings snowball over time, 
              and building the habit is more valuable than the initial amount. Small, consistent contributions 
              create powerful long-term results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}