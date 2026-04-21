'use client'

import Link from 'next/link'
import { ClientForm } from '@/components/clients/ClientForm'
import { Button } from '@/components/ui/Button'

export default function NewClientPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Client</h1>
          <p className="text-sm text-gray-500">Create a client profile and context template</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ClientForm mode="create" />
      </div>
    </div>
  )
}
