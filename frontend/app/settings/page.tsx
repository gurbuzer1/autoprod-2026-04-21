'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settingsStore'
import { TokenManager } from '@/components/settings/TokenManager'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const { apiBaseURL, setApiBaseURL } = useSettingsStore()
  const [urlInput, setUrlInput] = useState(apiBaseURL)

  function handleSaveUrl(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = urlInput.trim().replace(/\/$/, '')
    if (!trimmed) {
      toast.error('API base URL cannot be empty')
      return
    }
    setApiBaseURL(trimmed)
    toast.success('API base URL saved')
  }

  const mcpSnippet = `{
  "mcpServers": {
    "contextvault": {
      "command": "npx",
      "args": ["-y", "contextvault-mcp"],
      "env": {
        "CONTEXTVAULT_API_URL": "${apiBaseURL}",
        "CONTEXTVAULT_API_TOKEN": "<your-token>"
      }
    }
  }
}`

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure your API connection and manage access tokens</p>
      </div>

      {/* API Config */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">API Configuration</h2>
        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div>
            <Label htmlFor="api_url">API Base URL</Label>
            <div className="flex gap-2">
              <Input
                id="api_url"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://localhost:3001/api/v1"
                className="flex-1"
              />
              <Button type="submit" variant="default">Save</Button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Current: <code className="font-mono">{apiBaseURL}</code>
            </p>
          </div>
        </form>
      </section>

      {/* API Tokens */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">API Tokens</h2>
        <p className="text-sm text-gray-500 mb-5">
          Use tokens to authenticate external tools and MCP servers with the ContextVault API.
        </p>
        <TokenManager />
      </section>

      {/* MCP Setup */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">MCP Server Setup</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add this to your Claude Desktop or Cursor <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">mcp_config.json</code> to give AI tools access to your client context.
        </p>

        <div className="relative">
          <pre className="rounded-md bg-gray-900 p-4 text-xs text-gray-100 overflow-x-auto leading-relaxed">
            <code>{mcpSnippet}</code>
          </pre>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(mcpSnippet)
              toast.success('MCP config copied to clipboard')
            }}
            className="absolute top-2 right-2 rounded bg-white/10 px-2 py-1 text-xs text-gray-300 hover:bg-white/20 transition-colors"
          >
            Copy
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-800">Setup steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Generate an API token above</li>
            <li>Copy the config snippet and paste into your MCP config file</li>
            <li>Replace <code className="font-mono text-xs bg-gray-100 px-1 rounded">&lt;your-token&gt;</code> with your generated token</li>
            <li>Restart your AI tool to load the MCP server</li>
            <li>Use the <code className="font-mono text-xs bg-gray-100 px-1 rounded">get_client_context</code> tool with a client slug to inject context</li>
          </ol>
        </div>
      </section>
    </div>
  )
}
