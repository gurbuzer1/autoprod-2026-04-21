'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClients } from '@/lib/queries'

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}

function NavItem({ href, label, icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-white/10 text-white'
          : 'text-slate-300 hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      {icon}
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: clients } = useClients()

  return (
    <aside className="flex h-screen w-60 flex-col bg-[#1e1e2e] border-r border-white/10 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-white font-semibold text-base tracking-tight">ContextVault</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <NavItem
          href="/"
          label="Dashboard"
          active={pathname === '/'}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        <NavItem
          href="/clients/new"
          label="New Client"
          active={pathname === '/clients/new'}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />
        <NavItem
          href="/settings"
          label="Settings"
          active={pathname === '/settings'}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        {/* Client list */}
        {clients && clients.length > 0 && (
          <div className="mt-4">
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Clients
            </p>
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className={[
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors truncate',
                  pathname === `/clients/${client.id}`
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                <span className="truncate">{client.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-xs text-slate-500">ContextVault MVP</p>
      </div>
    </aside>
  )
}
