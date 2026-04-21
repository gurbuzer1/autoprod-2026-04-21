'use client'

import Link from 'next/link'
import { useClients } from '@/lib/queries'
import { ClientGrid } from '@/components/dashboard/ClientGrid'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { data: clients } = useClients()
  const activeCount = clients?.filter((c) => c.status === 'active').length ?? 0
  const total = clients?.length ?? 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total > 0
              ? `${total} client${total !== 1 ? 's' : ''} · ${activeCount} active`
              : 'Manage your client context profiles'}
          </p>
        </div>
        <Link href="/clients/new">
          <Button variant="default">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Client
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {clients && clients.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Clients', value: total, color: 'text-gray-900' },
            { label: 'Active', value: clients.filter((c) => c.status === 'active').length, color: 'text-green-600' },
            { label: 'Paused / Archived', value: clients.filter((c) => c.status !== 'active').length, color: 'text-yellow-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Client grid */}
      <ClientGrid />
    </div>
  )
}
