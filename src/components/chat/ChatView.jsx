import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ActionTypes } from '../../store/reducer'
import { useOllama } from '../../hooks/useOllama'
import { formatCurrency } from '../../utils/format'
import Button from '../shared/Button'
import ChatMessage from './ChatMessage'
import QuickPrompts from './QuickPrompts'

function buildSystemPrompt(state) {
  const { settings, finances, requirements, timeline, locations } = state
  const homeEquity = settings.homeValue - settings.mortgageBalance
  const totalAvailable = homeEquity + finances.savings
  const estimatedTotal = finances.categories.reduce((s, c) => s + c.estimate, 0)
  const mustHaves = requirements.filter((r) => r.priority === 'must-have')
  const completedMilestones = timeline.filter((m) => m.status === 'complete').length

  return `You are HomeForge AI, a helpful assistant for planning a custom home build. Here is the current project context:

FINANCIAL SNAPSHOT:
- Home Equity: ${formatCurrency(homeEquity)}
- Cash Savings: ${formatCurrency(finances.savings)}
- Total Available: ${formatCurrency(totalAvailable)}
- Monthly Contribution: ${formatCurrency(finances.monthlyContribution)}/mo
- Budget Range: ${formatCurrency(settings.budgetMin)} - ${formatCurrency(settings.budgetMax)}
- Estimated Total Cost: ${formatCurrency(estimatedTotal)}
- Target Year: ${settings.targetYear}

REQUIREMENTS (${requirements.length} total):
Must-Haves: ${mustHaves.map((r) => r.item).join(', ') || 'None set'}
Nice-to-Haves: ${requirements.filter((r) => r.priority === 'nice-to-have').map((r) => r.item).join(', ') || 'None'}

TIMELINE:
- Progress: ${completedMilestones}/${timeline.length} milestones complete
- Next: ${timeline.find((m) => m.status !== 'complete')?.milestone || 'All complete'}

LOCATIONS (${locations.length}):
${locations.map((l) => `- ${l.name} (${l.region}): ${formatCurrency(l.estLandCost)}, ${l.acreage} acres, rating ${l.rating}/5`).join('\n') || 'No locations saved yet'}

PREFERENCES:
- Acreage: ${settings.acreageMin}-${settings.acreageMax} acres
- Location preference: Rural, 1-2 hours from Houston, TX

Please provide helpful, specific advice based on this context. Be concise but thorough.`
}

export default function ChatView() {
  const { state, dispatch } = useAppContext()
  const { chatHistory } = state
  const { sendMessage, isConnected, isLoading, error, model } = useOllama()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isLoading])

  const handleSend = async (text) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage = { role: 'user', content: messageText, timestamp: new Date().toISOString() }
    dispatch({ type: ActionTypes.ADD_CHAT_MESSAGE, payload: userMessage })
    setInput('')

    try {
      const systemPrompt = buildSystemPrompt(state)
      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: messageText },
      ]

      const response = await sendMessage(messages)
      dispatch({
        type: ActionTypes.ADD_CHAT_MESSAGE,
        payload: { role: 'assistant', content: response.content, timestamp: new Date().toISOString() },
      })
    } catch {
      dispatch({
        type: ActionTypes.ADD_CHAT_MESSAGE,
        payload: {
          role: 'assistant',
          content: isConnected
            ? 'Sorry, I encountered an error processing your request. Please try again.'
            : 'Unable to connect to Ollama. Please make sure Ollama is running and check your settings.',
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    dispatch({ type: ActionTypes.CLEAR_CHAT })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Connection status */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-[var(--text-muted)]">
            {isConnected ? `Connected — ${model}` : 'Disconnected'}
          </span>
        </div>
        {chatHistory.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear Chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chatHistory.length === 0 && !isLoading ? (
          <QuickPrompts onSelect={handleSend} />
        ) : (
          <>
            {chatHistory.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isConnected ? 'Ask about your home build...' : 'Ollama is not connected...'}
          disabled={!isConnected}
          rows={1}
          className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color-strong)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none max-h-32 disabled:opacity-50"
          style={{ minHeight: '48px' }}
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading || !isConnected}
          loading={isLoading}
          className="h-12"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
