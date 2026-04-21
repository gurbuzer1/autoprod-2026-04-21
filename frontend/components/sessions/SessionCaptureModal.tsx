'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useCreateSession } from '@/lib/queries'

const TOOL_OPTIONS = [
  'Claude',
  'ChatGPT',
  'Gemini',
  'Copilot',
  'Cursor',
  'Perplexity',
  'Notion AI',
  'Other',
]

interface SessionCaptureModalProps {
  clientId: string
  open: boolean
  onClose: () => void
}

export function SessionCaptureModal({ clientId, open, onClose }: SessionCaptureModalProps) {
  const [rawNotes, setRawNotes] = useState('')
  const [toolName, setToolName] = useState(TOOL_OPTIONS[0])

  const createSession = useCreateSession(clientId)

  function reset() {
    setRawNotes('')
    setToolName(TOOL_OPTIONS[0])
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rawNotes.trim()) {
      toast.error('Please enter session notes')
      return
    }

    try {
      await createSession.mutateAsync({
        raw_notes: rawNotes.trim(),
        tool_name: toolName,
        started_at: Math.floor(Date.now() / 1000),
        status: 'completed',
      })
      toast.success('Session notes saved')
      handleClose()
    } catch {
      toast.error('Failed to save session notes')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Add Session Notes">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="tool_name">AI Tool Used</Label>
          <Select
            id="tool_name"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
          >
            {TOOL_OPTIONS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="raw_notes">Session Notes</Label>
          <Textarea
            id="raw_notes"
            rows={6}
            placeholder="Paste your session notes, key decisions, prompts used, or anything worth remembering from this session..."
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            className="min-h-[140px]"
          />
          <p className="mt-1 text-xs text-gray-400">
            These notes will be saved and can be used for context in future sessions.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={createSession.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="default" isLoading={createSession.isPending}>
            Save Notes
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
