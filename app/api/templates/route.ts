import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { BudgetTemplateModel } from '@/lib/models'

// GET all templates for a user
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const templates = await BudgetTemplateModel.find({ userId: clerkUserId }).sort({ createdAt: -1 })
    
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST create new template
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    await dbConnect()
    const template = await BudgetTemplateModel.create({
      ...body,
      userId: clerkUserId
    })
    
    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

// PUT update template
export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    await dbConnect()
    
    // Verify ownership before updating
    const existingTemplate = await BudgetTemplateModel.findById(_id)
    
    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    
    if (existingTemplate.userId !== clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const template = await BudgetTemplateModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

// DELETE template
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const templateId = searchParams.get('templateId')

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    await dbConnect()
    
    // Verify ownership before deleting
    const template = await BudgetTemplateModel.findById(templateId)
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    
    if (template.userId !== clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await BudgetTemplateModel.findByIdAndDelete(templateId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
