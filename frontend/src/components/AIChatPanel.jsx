import { useState, useRef, useEffect } from 'react'
import { useLang } from '../LanguageContext'
import { API_BASE_URL } from '../config'

function AIChatPanel({ mode, currentStyle, onStyleUpdate, onEffectAdd }) {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gemini/gemini-1.5-flash')
  const [availableModels, setAvailableModels] = useState([])
  const chatEndRef = useRef(null)

  // Fetch available models on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/ai-models`)
      .then(r => r.json())
      .then(data => { if (data.models) setAvailableModels(data.models) })
      .catch(() => {
        // Fallback if API not reachable
        setAvailableModels([
          { id: 'gemini/gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
          { id: 'gemini/gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
          { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
          { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' },
        ])
      })
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const resp = await fetch(`${API_BASE_URL}/api/ai-style-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          api_key: apiKey,
          mode,
          current_style: currentStyle || {},
          conversation: messages.slice(-6),
          model: selectedModel,
        }),
      })
      const data = await resp.json()
      if (resp.ok) {
        const aiMsg = { role: 'ai', content: data.reply || 'Done!' }
        setMessages([...newMessages, aiMsg])

        // Apply style updates
        if (data.style_updates && Object.keys(data.style_updates).length > 0) {
          onStyleUpdate?.(data.style_updates)
        }
        // Add effect if present
        if (data.effect && (data.effect.css || data.effect.js)) {
          onEffectAdd?.({ ...data.effect, id: Date.now() })
        }
      } else {
        setMessages([...newMessages, { role: 'ai', content: `\u26A0\uFE0F ${data.detail || 'Failed'}` }])
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: '\u26A0\uFE0F Connection error' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-extrabold text-gray-800 mb-2 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
        {'\u2728'} {t.aiAssistant || 'AI Design Assistant'} <span className="text-sm font-normal text-gray-400">{t.aiOptional || '(Optional)'}</span>
      </h2>
      <p className="text-xs text-gray-400 mb-4 ml-3">{t.aiAssistantDesc || 'Describe the style you want in natural language, AI will adjust your design'}</p>

      {/* API Key + Model Selector */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{lang === 'zh' ? 'AI\u6a21\u578b' : 'AI Model'}</label>
          <button type="button" onClick={() => setShowGuide(!showGuide)}
            className="text-[10px] text-purple-500 hover:text-purple-700 underline ml-auto">
            {showGuide ? '\u25B2' : '\u25BC'} {t.apiKeyGuideTitle || 'How to get?'}
          </button>
        </div>
        {/* Model selector */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {availableModels.map(m => (
            <button key={m.id} type="button"
              onClick={() => setSelectedModel(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                selectedModel === m.id
                  ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              <span className="text-[9px] text-gray-400">{m.provider}</span> {m.name}
            </button>
          ))}
        </div>
        {/* API Key input */}
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {(() => {
            const m = availableModels.find(x => x.id === selectedModel)
            return m ? `${m.provider} API Key` : 'API Key'
          })()}
        </label>
        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
          placeholder={t.apiKeyPh || 'Paste your Gemini API key...'}
          className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${
            apiKey ? 'border-green-400 focus:ring-green-300 bg-green-50' : 'border-purple-300 focus:ring-purple-300'
          }`} />
        {apiKey ? (
          <p className="text-xs text-green-600 mt-1">{'\u2713'} Key set</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">{t.apiKeyRequired || 'Required for AI features'}</p>
        )}

        {showGuide && (
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <ol className="text-xs text-purple-700 space-y-1">
              {selectedModel.startsWith('gemini') ? (
                <>
                  <li>{t.apiKeyStep1 || '1. Visit'} <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="font-semibold underline">Google AI Studio</a></li>
                  <li>{t.apiKeyStep2 || '2. Click "Create API Key"'}</li>
                  <li>{t.apiKeyStep3 || '3. Copy and paste here'}</li>
                  <li>{t.apiKeyStep4 || '4. Free tier available'}</li>
                </>
              ) : selectedModel.startsWith('openai') ? (
                <>
                  <li>{lang === 'zh' ? '1. \u8bbf\u95ee' : '1. Visit'} <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="font-semibold underline">OpenAI Platform</a></li>
                  <li>{lang === 'zh' ? '2. \u521b\u5efaAPI Key' : '2. Create API Key'}</li>
                  <li>{lang === 'zh' ? '3. \u590d\u5236\u7c98\u8d34\u5230\u4e0a\u65b9' : '3. Copy and paste above'}</li>
                </>
              ) : (
                <>
                  <li>{lang === 'zh' ? '1. \u8bbf\u95ee' : '1. Visit'} <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="font-semibold underline">Anthropic Console</a></li>
                  <li>{lang === 'zh' ? '2. \u521b\u5efaAPI Key' : '2. Create API Key'}</li>
                  <li>{lang === 'zh' ? '3. \u590d\u5236\u7c98\u8d34\u5230\u4e0a\u65b9' : '3. Copy and paste above'}</li>
                </>
              )}
            </ol>
          </div>
        )}
      </div>

      {/* Chat area */}
      {messages.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
              }`}>
                {msg.role === 'ai' && <span className="text-purple-500 mr-1">{'\u2728'}</span>}
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sendMessage())}
          placeholder={apiKey ? (t.aiChatPh || 'e.g. "I want a Harry Potter themed page..."') : (t.apiKeyRequired || 'Enter API key first')}
          disabled={!apiKey}
          className={`flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 ${
            apiKey
              ? 'border-purple-300 focus:ring-purple-400'
              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
          }`} />
        <button type="button" onClick={sendMessage}
          disabled={loading || !input.trim() || !apiKey}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0 transition-all ${
            loading || !input.trim() || !apiKey
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm'
          }`}>
          {loading ? (t.aiThinking || '...') : (t.aiSend || 'Send')}
        </button>
      </div>

      {/* Quick suggestions */}
      {messages.length === 0 && apiKey && (
        <div className="mt-3">
          <p className="text-[10px] text-gray-400 mb-2">{t.aiSuggestHint || 'You can type anything above — here are some ideas to get started:'}</p>
          <div className="flex flex-wrap gap-2">
          {[
            t.aiSuggest1 || 'Cyberpunk neon style',
            t.aiSuggest2 || 'Harry Potter theme',
            t.aiSuggest3 || 'Minimalist clean',
            t.aiSuggest4 || 'Add falling particles',
          ].map((s, i) => (
            <button key={i} type="button" onClick={() => { setInput(s) }}
              className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-600 hover:bg-purple-100 transition-colors">
              {s}
            </button>
          ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default AIChatPanel
