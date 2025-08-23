import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BudgetRule() {
  return (
    <div id="budget-rule" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The 50/30/20 Rule
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl">
            A simple budgeting framework that divides your income into three essential categories for balanced financial health.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors flex-1">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="text-4xl font-bold text-slate-900 mb-2">50%</div>
              <CardTitle className="text-2xl text-slate-900">Needs</CardTitle>
              <CardDescription className="text-slate-600">Essential expenses</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2 text-slate-600">
                <div>• Rent or mortgage</div>
                <div>• Utilities</div>
                <div>• Groceries</div>
                <div>• Transportation</div>
                <div>• Insurance</div>
                <div>• Basic clothing</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors flex-1">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="text-4xl font-bold text-slate-900 mb-2">30%</div>
              <CardTitle className="text-2xl text-slate-900">Wants</CardTitle>
              <CardDescription className="text-slate-600">Discretionary spending</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2 text-slate-600">
                <div>• Entertainment</div>
                <div>• Dining out</div>
                <div>• Hobbies</div>
                <div>• Shopping</div>
                <div>• Travel</div>
                <div>• Subscriptions</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors flex-1">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="text-4xl font-bold text-slate-900 mb-2">20%</div>
              <CardTitle className="text-2xl text-slate-900">Savings</CardTitle>
              <CardDescription className="text-slate-600">Future planning</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2 text-slate-600">
                <div>• Emergency fund</div>
                <div>• Retirement savings</div>
                <div>• Debt repayment</div>
                <div>• Investment accounts</div>
                <div>• Future goals</div>
                <div>• College fund</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-slate-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">How to Implement the 50/30/20 Rule</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-3">Step 1-4: Calculate Your Budget</h4>
                <div className="flex flex-col space-y-2 text-slate-600">
                  <div>1. Determine your monthly after-tax income</div>
                  <div>2. Multiply by 0.50 for needs budget</div>
                  <div>3. Multiply by 0.30 for wants budget</div>
                  <div>4. Multiply by 0.20 for savings budget</div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-3">Step 5-7: Track & Adjust</h4>
                <div className="flex flex-col space-y-2 text-slate-600">
                  <div>5. Record your actual spending</div>
                  <div>6. Compare expenses to your budget</div>
                  <div>7. Adjust categories as needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}