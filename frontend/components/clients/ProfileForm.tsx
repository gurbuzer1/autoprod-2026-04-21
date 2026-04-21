'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { ContextProfile } from '@/types'

export type ProfileFormData = Omit<ContextProfile, 'id' | 'client_id' | 'version' | 'updated_at'>

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>
  onChange: (data: ProfileFormData) => void
}

export function ProfileForm({ initialData, onChange }: ProfileFormProps) {
  const [constraints, setConstraints] = useState<string[]>(initialData?.constraints ?? [''])
  const [toneExamples, setToneExamples] = useState<string[]>(initialData?.tone_examples ?? [''])
  const [fields, setFields] = useState({
    brand_voice: initialData?.brand_voice ?? '',
    target_audience: initialData?.target_audience ?? '',
    project_status: initialData?.project_status ?? '',
    background: initialData?.background ?? '',
  })

  function notify(
    newFields = fields,
    newConstraints = constraints,
    newTone = toneExamples
  ) {
    onChange({
      ...newFields,
      constraints: newConstraints.filter(Boolean),
      tone_examples: newTone.filter(Boolean),
    })
  }

  function handleField(key: keyof typeof fields, value: string) {
    const updated = { ...fields, [key]: value }
    setFields(updated)
    notify(updated)
  }

  function updateListItem(
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string,
    notifyFn: (v: string[]) => void
  ) {
    const updated = list.map((item, i) => (i === index ? value : item))
    setList(updated)
    notifyFn(updated)
  }

  function addListItem(list: string[], setList: (v: string[]) => void) {
    setList([...list, ''])
  }

  function removeListItem(
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    notifyFn: (v: string[]) => void
  ) {
    const updated = list.filter((_, i) => i !== index)
    setList(updated)
    notifyFn(updated)
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="brand_voice">Brand Voice</Label>
        <Textarea
          id="brand_voice"
          rows={3}
          placeholder="Describe the client's brand voice and communication style..."
          value={fields.brand_voice}
          onChange={(e) => handleField('brand_voice', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="target_audience">Target Audience</Label>
        <Textarea
          id="target_audience"
          rows={2}
          placeholder="Who is the client trying to reach?"
          value={fields.target_audience}
          onChange={(e) => handleField('target_audience', e.target.value)}
        />
      </div>

      <div>
        <Label>Constraints</Label>
        <div className="space-y-2">
          {constraints.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder={`Constraint ${i + 1}`}
                value={c}
                onChange={(e) =>
                  updateListItem(constraints, setConstraints, i, e.target.value, (v) =>
                    notify(fields, v, toneExamples)
                  )
                }
              />
              {constraints.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeListItem(constraints, setConstraints, i, (v) =>
                      notify(fields, v, toneExamples)
                    )
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem(constraints, setConstraints)}
          >
            + Add Constraint
          </Button>
        </div>
      </div>

      <div>
        <Label>Tone Examples</Label>
        <div className="space-y-2">
          {toneExamples.map((ex, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder={`Tone example ${i + 1}`}
                value={ex}
                onChange={(e) =>
                  updateListItem(toneExamples, setToneExamples, i, e.target.value, (v) =>
                    notify(fields, constraints, v)
                  )
                }
              />
              {toneExamples.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeListItem(toneExamples, setToneExamples, i, (v) =>
                      notify(fields, constraints, v)
                    )
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem(toneExamples, setToneExamples)}
          >
            + Add Tone Example
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="project_status">Project Status</Label>
        <Input
          id="project_status"
          placeholder="e.g. MVP launch in 6 weeks, v2 in progress"
          value={fields.project_status}
          onChange={(e) => handleField('project_status', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="background">Background</Label>
        <Textarea
          id="background"
          rows={4}
          placeholder="Additional context, history, or notes about this client..."
          value={fields.background}
          onChange={(e) => handleField('background', e.target.value)}
        />
      </div>
    </div>
  )
}
