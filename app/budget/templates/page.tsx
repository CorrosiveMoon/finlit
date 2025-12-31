'use client'

import { useState, useEffect } from 'react'
import { useUserId } from '@/lib/hooks/useUserId'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'

interface BudgetItem {
  name: string
  amount: number
  isRecurring?: boolean
  frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
  recurringType?: 'subscription' | 'investment' | 'installment' | 'other'
  provider?: string
}

interface BudgetTemplate {
  _id?: string
  userId: string
  templateName: string
  needsPercentage: number
  wantsPercentage: number
  savingsPercentage: number
  needsItems: BudgetItem[]
  wantsItems: BudgetItem[]
  savingsItems: BudgetItem[]
}

export default function TemplatesPage() {
  const userId = useUserId()
  const [templates, setTemplates] = useState<BudgetTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<BudgetTemplate | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchTemplates()
    }
  }, [userId])

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/templates`)
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewTemplate = () => {
    setEditingTemplate({
      userId,
      templateName: 'New Template',
      needsPercentage: 50,
      wantsPercentage: 30,
      savingsPercentage: 20,
      needsItems: [
        { name: 'Rent/Mortgage', amount: 0, isRecurring: true, frequency: 'monthly' },
        { name: 'Utilities', amount: 0, isRecurring: true, frequency: 'monthly' },
        { name: 'Groceries', amount: 0 }
      ],
      wantsItems: [
        { name: 'Dining out', amount: 0 },
        { name: 'Entertainment', amount: 0 }
      ],
      savingsItems: [
        { name: 'Emergency fund', amount: 0, isRecurring: true, frequency: 'monthly' },
        { name: 'Investments', amount: 0, isRecurring: true, frequency: 'monthly' }
      ]
    })
    setIsCreating(true)
  }

  const saveTemplate = async () => {
    if (!editingTemplate) return

    try {
      const method = editingTemplate._id ? 'PUT' : 'POST'
      const response = await fetch('/api/templates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate)
      })

      if (response.ok) {
        fetchTemplates()
        setEditingTemplate(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      await fetch(`/api/templates?templateId=${templateId}`, {
        method: 'DELETE'
      })
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const duplicateTemplate = (template: BudgetTemplate) => {
    const newTemplate = {
      ...template,
      _id: undefined,
      templateName: `${template.templateName} (Copy)`
    }
    setEditingTemplate(newTemplate)
    setIsCreating(true)
  }

  const updateTemplateField = (field: keyof BudgetTemplate, value: any) => {
    if (!editingTemplate) return
    setEditingTemplate({ ...editingTemplate, [field]: value })
  }

  const updateItem = (
    category: 'needsItems' | 'wantsItems' | 'savingsItems',
    index: number,
    field: keyof BudgetItem,
    value: any
  ) => {
    if (!editingTemplate) return
    const items = [...editingTemplate[category]]
    items[index] = { ...items[index], [field]: value }
    setEditingTemplate({ ...editingTemplate, [category]: items })
  }

  const addItem = (category: 'needsItems' | 'wantsItems' | 'savingsItems') => {
    if (!editingTemplate) return
    const newItem: BudgetItem = { 
      name: '', 
      amount: 0, 
      isRecurring: false, 
      frequency: 'monthly',
      recurringType: 'other',
      provider: ''
    }
    setEditingTemplate({ ...editingTemplate, [category]: [...editingTemplate[category], newItem] })
  }

  const removeItem = (category: 'needsItems' | 'wantsItems' | 'savingsItems', index: number) => {
    if (!editingTemplate) return
    const items = editingTemplate[category].filter((_, i) => i !== index)
    setEditingTemplate({ ...editingTemplate, [category]: items })
  }

  if (loading) {
    return <div className="container mx-auto p-6"><div className="text-center py-12">Loading...</div></div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/budget">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Budget Templates</h1>
            <p className="text-slate-600">Create and manage reusable budget templates</p>
          </div>
        </div>
        <Button onClick={createNewTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Template Editor */}
      {editingTemplate && (
        <Card className="mb-6 border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle>{isCreating ? 'Create New Template' : 'Edit Template'}</CardTitle>
              <div className="flex gap-2">
                <Button onClick={saveTemplate}>Save</Button>
                <Button variant="outline" onClick={() => { setEditingTemplate(null); setIsCreating(false); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <Input
                  value={editingTemplate.templateName}
                  onChange={(e) => updateTemplateField('templateName', e.target.value)}
                  placeholder="e.g., Standard Budget, Tight Budget, etc."
                />
              </div>

              {/* Percentages */}
              <div>
                <label className="block text-sm font-medium mb-3">Budget Distribution</label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Needs:</span>
                    <Input
                      type="number"
                      value={editingTemplate.needsPercentage}
                      onChange={(e) => updateTemplateField('needsPercentage', parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span>%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Wants:</span>
                    <Input
                      type="number"
                      value={editingTemplate.wantsPercentage}
                      onChange={(e) => updateTemplateField('wantsPercentage', parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span>%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Savings:</span>
                    <Input
                      type="number"
                      value={editingTemplate.savingsPercentage}
                      onChange={(e) => updateTemplateField('savingsPercentage', parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Needs */}
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Needs Items</h4>
                  <div className="space-y-2">
                    {editingTemplate.needsItems.map((item, index) => (
                      <div key={index} className="space-y-2 p-2 bg-red-50 rounded">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Name"
                            value={item.name}
                            onChange={(e) => updateItem('needsItems', index, 'name', e.target.value)}
                            className="flex-1 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={item.amount || ''}
                            onChange={(e) => updateItem('needsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-24 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('needsItems', index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={item.isRecurring || false}
                              onChange={(e) => updateItem('needsItems', index, 'isRecurring', e.target.checked)}
                            />
                            Recurring
                          </label>
                          {item.isRecurring && (
                            <select
                              value={item.frequency || 'monthly'}
                              onChange={(e) => updateItem('needsItems', index, 'frequency', e.target.value)}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addItem('needsItems')} className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Wants */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">Wants Items</h4>
                  <div className="space-y-2">
                    {editingTemplate.wantsItems.map((item, index) => (
                      <div key={index} className="space-y-2 p-2 bg-blue-50 rounded">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Name"
                            value={item.name}
                            onChange={(e) => updateItem('wantsItems', index, 'name', e.target.value)}
                            className="flex-1 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={item.amount || ''}
                            onChange={(e) => updateItem('wantsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-24 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('wantsItems', index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={item.isRecurring || false}
                              onChange={(e) => updateItem('wantsItems', index, 'isRecurring', e.target.checked)}
                            />
                            Recurring
                          </label>
                          {item.isRecurring && (
                            <select
                              value={item.frequency || 'monthly'}
                              onChange={(e) => updateItem('wantsItems', index, 'frequency', e.target.value)}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addItem('wantsItems')} className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Savings */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Savings Items</h4>
                  <div className="space-y-2">
                    {editingTemplate.savingsItems.map((item, index) => (
                      <div key={index} className="space-y-2 p-2 bg-green-50 rounded">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Name"
                            value={item.name}
                            onChange={(e) => updateItem('savingsItems', index, 'name', e.target.value)}
                            className="flex-1 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={item.amount || ''}
                            onChange={(e) => updateItem('savingsItems', index, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-24 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('savingsItems', index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={item.isRecurring || false}
                              onChange={(e) => updateItem('savingsItems', index, 'isRecurring', e.target.checked)}
                            />
                            Recurring
                          </label>
                          {item.isRecurring && (
                            <select
                              value={item.frequency || 'monthly'}
                              onChange={(e) => updateItem('savingsItems', index, 'frequency', e.target.value)}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addItem('savingsItems')} className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">No templates yet. Create your first template to get started!</p>
            <Button onClick={createNewTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{template.templateName}</span>
                  <Badge variant="outline" className="text-xs">
                    {template.needsPercentage}/{template.wantsPercentage}/{template.savingsPercentage}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-600">Needs items:</span>
                    <span className="font-medium ml-2">{template.needsItems.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Wants items:</span>
                    <span className="font-medium ml-2">{template.wantsItems.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Savings items:</span>
                    <span className="font-medium ml-2">{template.savingsItems.length}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => { setEditingTemplate(template); setIsCreating(false); }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => template._id && deleteTemplate(template._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
