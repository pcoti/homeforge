import { useState, useRef } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { useTheme } from '../../theme/ThemeProvider'
import { useOllama } from '../../hooks/useOllama'
import { clearState } from '../../store/persistence'
import { defaultState } from '../../store/defaults'
import Card from '../shared/Card'
import Input from '../shared/Input'
import Button from '../shared/Button'

export default function SettingsView() {
  const { state, dispatch } = useAppContext()
  const { settings } = state
  const { theme, toggleTheme } = useTheme()
  const { checkConnection, isConnected } = useOllama()
  const [testResult, setTestResult] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const fileInputRef = useRef(null)

  const updateSetting = (field, value) => {
    dispatch({
      type: ActionTypes.UPDATE_SETTINGS,
      payload: { [field]: typeof settings[field] === 'number' ? Number(value) || 0 : value },
    })
  }

  const handleTestConnection = async () => {
    setTestResult('testing')
    const ok = await checkConnection()
    setTestResult(ok ? 'success' : 'failed')
    setTimeout(() => setTestResult(null), 3000)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `homeforge-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.settings && data.finances) {
          dispatch({ type: ActionTypes.IMPORT_STATE, payload: data })
        } else {
          alert('Invalid HomeForge backup file.')
        }
      } catch {
        alert('Failed to parse JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true)
      return
    }
    clearState()
    dispatch({ type: ActionTypes.RESET_STATE })
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Project Settings */}
      <Card title="Project Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Budget Minimum"
            type="number"
            prefix="$"
            value={settings.budgetMin}
            onChange={(e) => updateSetting('budgetMin', e.target.value)}
          />
          <Input
            label="Budget Maximum"
            type="number"
            prefix="$"
            value={settings.budgetMax}
            onChange={(e) => updateSetting('budgetMax', e.target.value)}
          />
          <Input
            label="Target Year"
            type="number"
            value={settings.targetYear}
            onChange={(e) => updateSetting('targetYear', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min Acreage"
              type="number"
              value={settings.acreageMin}
              onChange={(e) => updateSetting('acreageMin', e.target.value)}
            />
            <Input
              label="Max Acreage"
              type="number"
              value={settings.acreageMax}
              onChange={(e) => updateSetting('acreageMax', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* AI Settings */}
      <Card title="AI Settings">
        <div className="space-y-4">
          <Input
            label="Ollama URL"
            value={settings.ollamaUrl}
            onChange={(e) => updateSetting('ollamaUrl', e.target.value)}
            placeholder="http://localhost:11434"
          />
          <Input
            label="Model"
            value={settings.ollamaModel}
            onChange={(e) => updateSetting('ollamaModel', e.target.value)}
            placeholder="llama3.2"
          />
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleTestConnection}
              loading={testResult === 'testing'}
            >
              Test Connection
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-[var(--text-muted)]">
                {testResult === 'success'
                  ? 'Connected!'
                  : testResult === 'failed'
                    ? 'Connection failed'
                    : isConnected
                      ? 'Connected'
                      : 'Not connected'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-[var(--text-muted)]">
              Currently using {theme} mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${
              theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-[var(--border-color-strong)]'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Data Management">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExport}>
              Export Data (JSON)
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Import Data
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <div className="pt-4 border-t border-[var(--border-color)]">
            <Button
              variant="danger"
              onClick={handleReset}
            >
              {showResetConfirm ? 'Click again to confirm reset' : 'Reset All Data'}
            </Button>
            {showResetConfirm && (
              <p className="text-xs text-red-400 mt-2">
                This will permanently delete all your data and restore defaults. This cannot be undone.
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="ml-2 underline cursor-pointer"
                >
                  Cancel
                </button>
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
