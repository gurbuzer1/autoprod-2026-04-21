'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import type { Client, ContextResponse } from '@/types'

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const [copying, setCopying] = useState(false)

  async function handleCopyContext() {
    setCopying(true)
    try {
      const { data } = await api.get<ContextResponse>(`/context/${client.slug}`)
      await navigator.clipboard.writeText(data.context_text)
      toast.success(`Context copied for ${client.name}`)
    } catch {
      toast.error(`Failed to copy context for ${client.name}`)
    } finally {
      setCopying(false)
    }
  }

  const statusVariant = client.status as 'active' | 'paused' | 'archived'
  const created = new Date(client.created_at * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{client.name}</CardTitle>
          <Badge variant={statusVariant}>{client.status}</Badge>
        </div>
        {client.industry && (
          <p className="text-xs text-gray-500 mt-1">{client.industry}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-xs text-gray-400">Added {created}</p>
      </CardContent>

      <CardFooter className="gap-2 pt-2 border-t border-gray-100">
        <Button
          variant="default"
          size="sm"
          isLoading={copying}
          onClick={handleCopyContext}
          className="flex-1"
        >
          {!copying && (
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          Copy Context
        </Button>
        <Link href={`/clients/${client.id}`}>
          <Button variant="outline" size="sm">Edit</Button>
        </Link>
        <Link href={`/clients/${client.id}/sessions`}>
          <Button variant="ghost" size="sm" title="Sessions">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
