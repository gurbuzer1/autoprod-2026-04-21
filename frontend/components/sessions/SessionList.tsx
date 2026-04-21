'use client'

import { useSessions } from '@/lib/queries'
import type { Session } from '@/types'

interface SessionListProps {
  clientId: string
}

function SessionCard({ session }: { session: Session }) {
  const started = new Date(session.started_at * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
            {session.tool_name}
          </span>
          <span
            className={[
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              session.status === 'active'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600',
            ].join(' ')}
          >
            {session.status}
          </span>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{started}</span>
      </div>

      {session.summary && (
        <p className="text-sm text-gray-700 leading-relaxed">{session.summary}</p>
      )}

      {session.raw_notes && (
        <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Raw Notes</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {session.raw_notes}
          </p>
        </div>
      )}
    </div>
  )
}

export function SessionList({ clientId }: SessionListProps) {
  const { data: sessions, isLoading, isError } = useSessions(clientId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load sessions. Please try again.
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
        <svg
          className="mx-auto h-10 w-10 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-3 text-sm text-gray-500">No sessions yet. Add your first session notes.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
