'use client'

import { Calculator, TrendingUp, PiggyBank } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Master Your
            <span className="text-slate-600"> Financial Future</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl">
            Learn essential financial skills with our practical guides, calculators, and tools designed to help you make smarter money decisions.
          </p>
         
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => scrollToSection('budget-rule')}
            >
              Start Learning
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('calculator')}
            >
              View Calculator
            </Button>
          </div>
         
          <div className="flex flex-col md:flex-row gap-8 mt-16 w-full">
            <div 
              className="flex flex-col items-center text-center flex-1 cursor-pointer hover:bg-slate-50 p-4 rounded-lg transition-colors"
              onClick={() => scrollToSection('calculator')}
            >
              <div className="bg-slate-100 p-3 rounded-full mb-4">
                <Calculator className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Smart Budgeting</h3>
              <p className="text-slate-600">Learn the 50/30/20 rule and create budgets that work</p>
            </div>
           
            <div 
              className="flex flex-col items-center text-center flex-1 cursor-pointer hover:bg-slate-50 p-4 rounded-lg transition-colors"
              onClick={() => scrollToSection('unit-pricing')}
            >
              <div className="bg-slate-100 p-3 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Unit Pricing</h3>
              <p className="text-slate-600">Compare prices effectively and save on purchases</p>
            </div>
           
            <div 
              className="flex flex-col items-center text-center flex-1 cursor-pointer hover:bg-slate-50 p-4 rounded-lg transition-colors"
              onClick={() => scrollToSection('savings')}
            >
              <div className="bg-slate-100 p-3 rounded-full mb-4">
                <PiggyBank className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Emergency Fund</h3>
              <p className="text-slate-600">Build financial security with strategic saving</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}