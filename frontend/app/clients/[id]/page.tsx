'use client'

import { use } from 'react'
import Link from 'next/link'
import { useClient, useClientProfile, useDeleteClient } from '@/lib/queries'
import { ClientForm } from '@/components/clients/ClientForm'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ClientPageProps {
  params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const { data: client, isLoading: clientLoading } = useClient(id)
  const { data: profile, isLoading: profileLoading } = useClientProfile(id)
  const deleteClient = useDeleteClient()

  const isLoading = clientLoading || profileLoading

  async function handleDelete() {
    if (!confirm(`Delete "${client?.name}"? This cannot be undone.`)) return
    try {
      await deleteClient.mutateAsync(id)
      toast.success('Client deleted')
      router.push('/')
    } catch {
      toast.error('Failed to delete client')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-100" />
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-gray-500">Client not found.</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <Badge variant={client.status}>{client.status}</Badge>
            </div>
            {client.industry && (
              <p className="text-sm text-gray-500">{client.industry}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/clients/${id}/sessions`}>
            <Button variant="outline" size="sm">
              Sessions
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            isLoading={deleteClient.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Profile version badge */}
      {profile && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Profile v{profile.version} &middot; Last updated{' '}
            {new Date(profile.updated_at * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ClientForm mode="edit" client={client} profile={profile} />
      </div>
    </div>
  )
}
