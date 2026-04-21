'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useApiTokens, useCreateToken, useDeleteToken } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { ApiToken } from '@/types'

function TokenRow({ token, onDelete }: { token: ApiToken; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false)

  const created = new Date(token.created_at * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const lastUsed = token.last_used_at
    ? new Date(token.last_used_at * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Never'

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{token.label}</p>
        <p className="text-xs text-gray-400">
          Created {created} &middot; Last used: {lastUsed}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {confirming ? (
          <>
            <span className="text-xs text-gray-500">Confirm delete?</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(token.id)}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  )
}

export function TokenManager() {
  const [newLabel, setNewLabel] = useState('')
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null)

  const { data: tokens, isLoading } = useApiTokens()
  const createToken = useCreateToken()
  const deleteToken = useDeleteToken()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newLabel.trim()) {
      toast.error('Token label is required')
      return
    }
    try {
      const result = await createToken.mutateAsync({ label: newLabel.trim() })
      setNewTokenValue(result.token)
      setNewLabel('')
      toast.success('API token created')
    } catch {
      toast.error('Failed to create token')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteToken.mutateAsync(id)
      toast.success('Token revoked')
    } catch {
      toast.error('Failed to revoke token')
    }
  }

  return (
    <div className="space-y-6">
      {/* Create new token */}
      <form onSubmit={handleCreate} className="space-y-3">
        <Label htmlFor="token_label">Create New Token</Label>
        <div className="flex gap-2">
          <Input
            id="token_label"
            placeholder="Token label (e.g. Claude Desktop, Cursor)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" isLoading={createToken.isPending}>
            Generate
          </Button>
        </div>
      </form>

      {/* Show newly generated token once */}
      {newTokenValue && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
          <p className="text-sm font-medium text-green-800">New token generated — copy it now!</p>
          <p className="text-xs text-green-700">This value will not be shown again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-white border border-green-200 px-3 py-2 text-xs font-mono text-gray-800 overflow-x-auto">
              {newTokenValue}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(newTokenValue)
                toast.success('Token copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNewTokenValue(null)}
            className="text-gray-500"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Token list */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Existing Tokens</p>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : tokens && tokens.length > 0 ? (
          <div className="space-y-2">
            {tokens.map((token) => (
              <TokenRow key={token.id} token={token} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 rounded-lg border border-dashed border-gray-200 p-4 text-center">
            No API tokens yet.
          </p>
        )}
      </div>
    </div>
  )
}
