'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, DollarSign, Menu, Building2 } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (!isHomePage) {
      // If not on home page, navigate to home first
      return
    }
    // If on home page, smooth scroll
    e.preventDefault()
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">FinLit</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <SignedIn>
              <Link href="/budget" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                My Budget
              </Link>
            </SignedIn>
            <Link 
              href="/#calculator" 
              onClick={(e) => handleSectionClick(e, '#calculator')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Calculator
            </Link>
            <Link 
              href="/#unit-pricing" 
              onClick={(e) => handleSectionClick(e, '#unit-pricing')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Unit Pricing
            </Link>
            <Link 
              href="/#savings" 
              onClick={(e) => handleSectionClick(e, '#savings')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Savings
            </Link>
            <Link 
              href="/real-estate"
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Building2 className="h-4 w-4 text-teal-600" />
              Real Estate 101
            </Link>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}