// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import UnitPriceCalculator from '@/components/calculators/unit-price-calculator'

// export default function UnitPricing() {
//   const [showCalculator, setShowCalculator] = useState(false)
  
//   return (
//     <div id="unit-pricing" className="py-20 bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
//             Unit Pricing Mastery
//           </h2>
//           <p className="text-xl text-slate-600 max-w-3xl">
//             Learn to compare products effectively and make smarter purchasing decisions by understanding per-unit costs.
//           </p>
//         </div>
        
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col lg:flex-row gap-12 items-start">
//             <div className="flex-1">
//               <h3 className="text-2xl font-semibold text-slate-900 mb-6">Why Unit Pricing Matters</h3>
//               <div className="flex flex-col space-y-4 text-slate-600">
//                 <p>
//                   Unit pricing tells you how much you're paying per gram, per kilogram, or per liter. This simple concept can help you save significant money by identifying the best deals.
//                 </p>
//                 <p>
//                   Many stores display unit prices on shelf tags, but when they don't, you can easily calculate it yourself using our calculator.
//                 </p>
//               </div>
              
//               <div className="mt-8 p-6 bg-slate-50 rounded-lg">
//                 <h4 className="font-semibold text-slate-900 mb-4">Quick Example:</h4>
//                 <div className="flex flex-col space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span>Small cereal box (500g): E£45</span>
//                     <Badge variant="outline">E£0.09/g</Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span>Large cereal box (1kg): E£80</span>
//                     <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
//                       E£0.08/g ✓ Better deal
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
              
//               <Button 
//                 onClick={() => setShowCalculator(!showCalculator)}
//                 className="mt-6"
//                 size="lg"
//               >
//                 {showCalculator ? 'Hide Calculator' : 'Try Unit Price Calculator'}
//               </Button>
//             </div>
            
//             <div className="flex-1">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Unit Pricing Tips</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col space-y-3 text-slate-600">
//                     <div className="flex items-start">
//                       <span className="text-slate-900 font-semibold mr-2">1.</span>
//                       <span>Always check unit prices before assuming bulk is cheaper</span>
//                     </div>
//                     <div className="flex items-start">
//                       <span className="text-slate-900 font-semibold mr-2">2.</span>
//                       <span>Compare the same units (don't mix grams with kilograms)</span>
//                     </div>
//                     <div className="flex items-start">
//                       <span className="text-slate-900 font-semibold mr-2">3.</span>
//                       <span>Consider if you'll actually use larger quantities</span>
//                     </div>
//                     <div className="flex items-start">
//                       <span className="text-slate-900 font-semibold mr-2">4.</span>
//                       <span>Factor in storage space and expiration dates</span>
//                     </div>
//                     <div className="flex items-start">
//                       <span className="text-slate-900 font-semibold mr-2">5.</span>
//                       <span>Use your phone calculator when shelf tags don't show unit prices</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
          
//           {showCalculator && (
//             <div className="mt-12">
//               <UnitPriceCalculator />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UnitPriceCalculator from '@/components/calculators/unit-price-calculator'

export default function UnitPricing() {
  const [showCalculator, setShowCalculator] = useState(false)
  
  return (
    <div id="unit-pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Unit Pricing Mastery
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl">
            Learn to compare products effectively and make smarter purchasing decisions by understanding per-unit costs.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Why Unit Pricing Matters</h3>
              <div className="flex flex-col space-y-4 text-slate-600">
                <p>
                  Unit pricing tells you how much you&#39;re paying per gram, per kilogram, or per liter. This simple concept can help you save significant money by identifying the best deals.
                </p>
                <p>
                  Many stores display unit prices on shelf tags, but when they don&#39;t, you can easily calculate it yourself using our calculator.
                </p>
              </div>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-4">Quick Example:</h4>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Small cereal box (500g): E£45</span>
                    <Badge variant="outline">E£0.09/g</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Large cereal box (1kg): E£80</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      E£0.08/g ✓ Better deal
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowCalculator(!showCalculator)}
                className="mt-6"
                size="lg"
              >
                {showCalculator ? 'Hide Calculator' : 'Try Unit Price Calculator'}
              </Button>
            </div>
            
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Pricing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-3 text-slate-600">
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">1.</span>
                      <span>Always check unit prices before assuming bulk is cheaper</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">2.</span>
                      <span>Compare the same units (don&#39;t mix grams with kilograms)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">3.</span>
                      <span>Consider if you&#39;ll actually use larger quantities</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">4.</span>
                      <span>Factor in storage space and expiration dates</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-900 font-semibold mr-2">5.</span>
                      <span>Use your phone calculator when shelf tags don&#39;t show unit prices</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showCalculator && (
            <div className="mt-12">
              <UnitPriceCalculator />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}