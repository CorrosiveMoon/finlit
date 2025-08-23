import Link from 'next/link'
import { Calculator, DollarSign, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">FinLit</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#budget-rule" className="text-slate-600 hover:text-slate-900 transition-colors">
              50/30/20 Rule
            </Link>
            <Link href="#calculator" className="text-slate-600 hover:text-slate-900 transition-colors">
              Calculator
            </Link>
            <Link href="#unit-pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Unit Pricing
            </Link>
            <Link href="#savings" className="text-slate-600 hover:text-slate-900 transition-colors">
              Savings
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}