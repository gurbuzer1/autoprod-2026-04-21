'use client'

import Link from 'next/link'
import { useClients } from '@/lib/queries'
import { ClientCard } from './ClientCard'
import { Button } from '@/components/ui/Button'

export function ClientGrid() {
  const { data: clients, isLoading, isError, error } = useClients()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-lg bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          Failed to load clients.{' '}
          {error instanceof Error ? error.message : 'Please try again.'}
        </p>
      </div>
    )
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="mt-4 text-base font-medium text-gray-900">No clients yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first client profile.
        </p>
        <div className="mt-6">
          <Link href="/clients/new">
            <Button variant="default">Create First Client</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}
