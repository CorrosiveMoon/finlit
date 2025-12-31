import mongoose, { Schema, Model } from 'mongoose'

export interface BudgetItem {
  name: string
  amount: number
  isRecurring?: boolean
  frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
  recurringType?: 'subscription' | 'investment' | 'installment' | 'other'
  provider?: string // For subscriptions (e.g., Netflix, Spotify)
}

export interface BudgetTemplate {
  _id?: string
  userId: string // Will be localStorage ID for now, later Clerk user ID
  templateName: string
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  needsItems: BudgetItem[]
  wantsItems: BudgetItem[]
  savingsItems: BudgetItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface MonthlyBudget {
  _id?: string
  userId: string
  month: number // 1-12
  year: number
  income: number
  templateId?: string // Reference to template used
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  needsItems: BudgetItem[]
  wantsItems: BudgetItem[]
  savingsItems: BudgetItem[]
  actualNeeds: number
  actualWants: number
  actualSavings: number
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

const BudgetItemSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  isRecurring: { type: Boolean, default: false },
  frequency: { 
    type: String, 
    enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  recurringType: {
    type: String,
    enum: ['subscription', 'investment', 'installment', 'other'],
    default: 'other'
  },
  provider: { type: String }
}, { _id: false })

const BudgetTemplateSchema = new Schema<BudgetTemplate>({
  userId: { type: String, required: true, index: true },
  templateName: { type: String, required: true },
  needsPercentage: { type: Number, required: true, default: 50 },
  wantsPercentage: { type: Number, required: true, default: 30 },
  savingsPercentage: { type: Number, required: true, default: 20 },
  needsItems: [BudgetItemSchema],
  wantsItems: [BudgetItemSchema],
  savingsItems: [BudgetItemSchema]
}, {
  timestamps: true
})

const MonthlyBudgetSchema = new Schema<MonthlyBudget>({
  userId: { type: String, required: true, index: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  income: { type: Number, required: true, default: 0 },
  templateId: { type: String },
  needsPercentage: { type: Number, required: true, default: 50 },
  wantsPercentage: { type: Number, required: true, default: 30 },
  savingsPercentage: { type: Number, required: true, default: 20 },
  needsItems: [BudgetItemSchema],
  wantsItems: [BudgetItemSchema],
  savingsItems: [BudgetItemSchema],
  actualNeeds: { type: Number, default: 0 },
  actualWants: { type: Number, default: 0 },
  actualSavings: { type: Number, default: 0 },
  notes: { type: String }
}, {
  timestamps: true
})

// Compound index for unique month/year per user
MonthlyBudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true })

export const BudgetTemplateModel: Model<BudgetTemplate> = 
  mongoose.models.BudgetTemplate || mongoose.model<BudgetTemplate>('BudgetTemplate', BudgetTemplateSchema)

export const MonthlyBudgetModel: Model<MonthlyBudget> = 
  mongoose.models.MonthlyBudget || mongoose.model<MonthlyBudget>('MonthlyBudget', MonthlyBudgetSchema)
