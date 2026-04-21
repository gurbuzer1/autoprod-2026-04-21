'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ProfileForm, type ProfileFormData } from './ProfileForm'
import { useCreateClient, useUpdateClient, useUpsertProfile } from '@/lib/queries'
import type { Client, ContextProfile } from '@/types'

interface ClientFormProps {
  mode: 'create' | 'edit'
  client?: Client
  profile?: ContextProfile
}

export function ClientForm({ mode, client, profile }: ClientFormProps) {
  const router = useRouter()

  const [name, setName] = useState(client?.name ?? '')
  const [industry, setIndustry] = useState(client?.industry ?? '')
  const [status, setStatus] = useState<Client['status']>(client?.status ?? 'active')
  const [profileData, setProfileData] = useState<ProfileFormData>({
    brand_voice: profile?.brand_voice ?? '',
    target_audience: profile?.target_audience ?? '',
    constraints: profile?.constraints ?? [''],
    tone_examples: profile?.tone_examples ?? [''],
    project_status: profile?.project_status ?? '',
    background: profile?.background ?? '',
  })

  const createClient = useCreateClient()
  const updateClient = useUpdateClient(client?.id ?? '')
  const upsertProfile = useUpsertProfile(client?.id ?? '')

  const isSaving = createClient.isPending || updateClient.isPending || upsertProfile.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Client name is required')
      return
    }

    try {
      let clientId = client?.id

      if (mode === 'create') {
        const newClient = await createClient.mutateAsync({
          name: name.trim(),
          industry: industry.trim() || null,
          status,
        })
        clientId = newClient.id
        await upsertProfile.mutateAsync({ ...profileData })
        toast.success('Client created successfully')
        router.push(`/clients/${clientId}`)
      } else if (clientId) {
        await updateClient.mutateAsync({
          name: name.trim(),
          industry: industry.trim() || null,
          status,
        })
        await upsertProfile.mutateAsync({ ...profileData })
        toast.success('Client updated successfully')
      }
    } catch {
      toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} client`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Client Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              required
              placeholder="Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="SaaS, E-commerce, Healthcare..."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Client['status'])}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Profile */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Context Profile</h2>
        <ProfileForm
          initialData={profileData}
          onChange={setProfileData}
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <Button type="submit" variant="default" isLoading={isSaving}>
          {mode === 'create' ? 'Create Client' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
