import { DollarSign } from 'lucide-react'

export default function Footer() {
  return (
    <div className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-slate-700" />
            <span className="text-lg font-semibold text-slate-900">FinLit</span>
          </div>
          <p className="text-slate-600 text-center max-w-md">
            Empowering financial literacy through education and practical tools.
          </p>
          
          {/* Khan Academy Credit */}
          <div className="text-center p-4 bg-white rounded-lg border border-slate-200 max-w-md">
            <p className="text-sm text-slate-600 mb-2">Educational content adapted from:</p>
            <a 
              href="https://www.khanacademy.org/college-careers-more/financial-literacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Khan Academy Financial Literacy
            </a>
            <p className="text-xs text-slate-500 mt-1">
              Learn more at khanacademy.org
            </p>
          </div>
          
          <div className="text-sm text-slate-500">
            © 2025 Financial Literacy Hub. Built for education.
          </div>
        </div>
      </div>
    </div>
  )
}