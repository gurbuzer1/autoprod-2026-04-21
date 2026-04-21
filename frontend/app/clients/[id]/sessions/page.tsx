'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useClient, useSessions } from '@/lib/queries'
import { SessionList } from '@/components/sessions/SessionList'
import { SessionCaptureModal } from '@/components/sessions/SessionCaptureModal'
import { Button } from '@/components/ui/Button'

interface SessionsPageProps {
  params: Promise<{ id: string }>
}

export default function SessionsPage({ params }: SessionsPageProps) {
  const { id } = use(params)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: client, isLoading: clientLoading } = useClient(id)
  const { data: sessions } = useSessions(id)

  if (clientLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/clients/${id}`}>
            <Button variant="ghost" size="sm">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Session Memory</h1>
            {client && (
              <p className="text-sm text-gray-500">
                {client.name} &middot; {sessions?.length ?? 0} session{sessions?.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <Button variant="default" onClick={() => setModalOpen(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Session Notes
        </Button>
      </div>

      {/* Sessions */}
      <SessionList clientId={id} />

      {/* Modal */}
      <SessionCaptureModal
        clientId={id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
