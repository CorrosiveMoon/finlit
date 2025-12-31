import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { MonthlyBudgetModel } from '@/lib/models'

// GET monthly budgets for a user
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    await dbConnect()
    
    const query: { userId: string; year?: number; month?: number } = { userId: clerkUserId }
    if (year) query.year = parseInt(year)
    if (month) query.month = parseInt(month)

    const budgets = await MonthlyBudgetModel.find(query).sort({ year: -1, month: -1 })
    
    return NextResponse.json({ budgets })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

// POST create new monthly budget
export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/budgets - Creating new budget')
    
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      console.log('❌ Unauthorized - No Clerk user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ Authenticated user:', clerkUserId)

    const body = await request.json()
    console.log('📄 Request body:', {
      month: body.month,
      year: body.year,
      income: body.income,
      needsItems: body.needsItems?.length || 0,
      wantsItems: body.wantsItems?.length || 0,
      savingsItems: body.savingsItems?.length || 0
    })
    
    console.log('🔌 Connecting to MongoDB...')
    await dbConnect()
    console.log('✅ MongoDB connected')
    
    // Check if budget for this month already exists
    const existing = await MonthlyBudgetModel.findOne({
      userId: clerkUserId,
      month: body.month,
      year: body.year
    })

    if (existing) {
      console.log('⚠️ Budget already exists for this month')
      return NextResponse.json({ error: 'Budget for this month already exists' }, { status: 409 })
    }

    // Use Clerk user ID instead of the one from the request body
    console.log('💾 Creating budget in database...')
    const budget = await MonthlyBudgetModel.create({
      ...body,
      userId: clerkUserId
    })
    
    console.log('✅ Budget created successfully!', budget._id)
    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error('💥 Error creating budget:')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Full error:', error)
    return NextResponse.json({ 
      error: 'Failed to create budget', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// PUT update monthly budget
export async function PUT(request: NextRequest) {
  try {
    console.log('📥 PUT /api/budgets - Updating budget')
    
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      console.log('❌ Unauthorized - No Clerk user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ Authenticated user:', clerkUserId)

    const body = await request.json()
    const { _id, ...updateData } = body

    console.log('📄 Update request:', {
      _id,
      month: updateData.month,
      year: updateData.year,
      income: updateData.income,
      needsItems: updateData.needsItems?.length || 0,
      wantsItems: updateData.wantsItems?.length || 0,
      savingsItems: updateData.savingsItems?.length || 0,
      actualNeeds: updateData.actualNeeds,
      actualWants: updateData.actualWants,
      actualSavings: updateData.actualSavings
    })

    if (!_id) {
      console.log('❌ No budget ID provided')
      return NextResponse.json({ error: 'Budget ID required' }, { status: 400 })
    }

    console.log('🔌 Connecting to MongoDB...')
    await dbConnect()
    console.log('✅ MongoDB connected')
    
    // Find the budget and verify ownership
    console.log('🔍 Finding budget with ID:', _id)
    const existingBudget = await MonthlyBudgetModel.findById(_id)
    
    if (!existingBudget) {
      console.log('❌ Budget not found')
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }
    
    console.log('✅ Budget found, owner:', existingBudget.userId)
    
    if (existingBudget.userId !== clerkUserId) {
      console.log('❌ Unauthorized - User does not own this budget')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    console.log('💾 Updating budget...')
    const budget = await MonthlyBudgetModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )

    console.log('✅ Budget updated successfully!')
    return NextResponse.json({ budget })
  } catch (error) {
    console.error('💥 Error updating budget:')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Full error:', error)
    return NextResponse.json({ 
      error: 'Failed to update budget',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE monthly budget(s)
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const budgetId = searchParams.get('budgetId')
    const year = searchParams.get('year')
    const resetYear = searchParams.get('resetYear')

    await dbConnect()

    // If resetYear is true, delete all budgets for user and year
    if (resetYear === 'true' && year) {
      const result = await MonthlyBudgetModel.deleteMany({
        userId: clerkUserId,
        year: parseInt(year)
      })
      
      return NextResponse.json({ 
        success: true, 
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} budget(s) for ${year}`
      })
    }

    // Otherwise, delete single budget by ID
    if (!budgetId) {
      return NextResponse.json({ error: 'Budget ID required' }, { status: 400 })
    }

    // Verify ownership before deleting
    const budget = await MonthlyBudgetModel.findById(budgetId)
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }
    
    if (budget.userId !== clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await MonthlyBudgetModel.findByIdAndDelete(budgetId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
