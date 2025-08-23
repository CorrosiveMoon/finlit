import Hero from '@/components/sections/hero'
import BudgetRule from '@/components/sections/budget-rule'
import UnitPricing from '@/components/sections/unit-pricing'
import Savings from '@/components/sections/savings'
import BudgetCalculator from '@/components/sections/budget-calculator'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <BudgetRule />
      <BudgetCalculator />
      <UnitPricing />
      <Savings />
    </div>
  )
}