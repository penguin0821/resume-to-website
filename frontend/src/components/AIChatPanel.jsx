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
  const [selectedModel, setSelectedModel] = useState('gemini/gemini-2.5-flash')
  const [customModelId, setCustomModelId] = useState('')
  const [useCustom, setUseCustom] = useState(true)
  const [availableModels, setAvailableModels] = useState([])
  const [providers, setProviders] = useState([])
  const chatEndRef = useRef(null)

  // The effective model ID
  const effectiveModel = useCustom && customModelId.trim() ? customModelId.trim() : selectedModel

  // Fetch available models + providers on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/ai-models`)
      .then(r => r.json())
      .then(data => {
        if (data.models) setAvailableModels(data.models)
        if (data.providers) setProviders(data.providers)
      })
      .catch(() => {
        setAvailableModels([
          { id: 'gemini/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', free: true },
          { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', free: false },
          { id: 'dashscope/qwen-turbo', name: 'Qwen Turbo', provider: 'DashScope', free: true },
          { id: 'zai/glm-4.5-flash', name: 'GLM-4.5 Flash', provider: 'Zhipu', free: true },
        ])
        setProviders([
          { name: 'Google', keyUrl: 'https://aistudio.google.com/apikey', prefix: 'gemini/' },
          { name: 'DeepSeek', keyUrl: 'https://platform.deepseek.com/api_keys', prefix: 'deepseek/' },
          { name: 'DashScope', keyUrl: 'https://dashscope.console.aliyun.com/apiKey', prefix: 'dashscope/' },
          { name: 'Zhipu', keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys', prefix: 'zai/' },
        ])
      })
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Detect current provider from model ID
  const currentProvider = (() => {
    const prefix = effectiveModel.split('/')[0]
    return providers.find(p => p.prefix === prefix || p.name.toLowerCase() === prefix)
  })()

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
          model: effectiveModel,
        }),
      })
      const data = await resp.json()
      if (resp.ok) {
        const aiMsg = { role: 'ai', content: data.reply || 'Done!' }
        setMessages([...newMessages, aiMsg])

        if (data.style_updates && Object.keys(data.style_updates).length > 0) {
          onStyleUpdate?.(data.style_updates)
        }
        if (data.effect && (data.effect.css || data.effect.js)) {
          onEffectAdd?.({ ...data.effect, id: Date.now() })
        }
      } else {
        setMessages([...newMessages, { role: 'ai', content: `⚠️ ${data.detail || 'Failed'}` }])
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: '⚠️ Connection error' }])
    } finally {
      setLoading(false)
    }
  }

  // Group models by provider for display
  const providerGroups = availableModels.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = []
    acc[m.provider].push(m)
    return acc
  }, {})

  return (
    <section>
      <h2 className="text-lg font-extrabold text-gray-800 mb-2 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
        ✨ {t.aiAssistant || 'AI Design Assistant'} <span className="text-sm font-normal text-gray-400">{t.aiOptional || '(Optional)'}</span>
      </h2>
      <p className="text-xs text-gray-400 mb-4 ml-3">{t.aiAssistantDesc || 'Describe the style you want in natural language, AI will adjust your design'}</p>

      {/* Model Selector */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{lang === 'zh' ? 'AI模型' : 'AI Model'}</label>
          <button type="button" onClick={() => setShowGuide(!showGuide)}
            className="text-[10px] text-purple-500 hover:text-purple-700 underline ml-auto">
            {showGuide ? '▲' : '▼'} {lang === 'zh' ? '如何获取API Key？' : 'How to get API Key?'}
          </button>
        </div>

        {/* Preset model buttons grouped by provider */}
        <div className="space-y-2 mb-3">
          {Object.entries(providerGroups).map(([provider, models]) => (
            <div key={provider} className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] text-gray-400 font-medium w-16 shrink-0">{provider}</span>
              {models.map(m => (
                <button key={m.id} type="button"
                  onClick={() => { setSelectedModel(m.id); setUseCustom(false) }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    !useCustom && selectedModel === m.id
                      ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {m.name}
                  {m.free && <span className="ml-1 px-1 py-0.5 bg-green-100 text-green-600 rounded text-[8px] font-bold">FREE</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Custom model ID input — always visible */}
        <div className="mb-3 p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              ✏️ {lang === 'zh' ? '自定义模型' : 'Custom Model'}
            </span>
            <span className="text-[9px] text-purple-400">
              {lang === 'zh' ? '支持任意 LiteLLM 兼容模型' : 'Any LiteLLM compatible model'}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <input type="text" value={customModelId} onChange={e => setCustomModelId(e.target.value)}
              placeholder={lang === 'zh' ? '输入模型ID，如 deepseek/deepseek-chat' : 'e.g. deepseek/deepseek-chat'}
              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
            <span className="text-[9px] text-purple-400 whitespace-nowrap font-mono">provider/model</span>
          </div>
          {customModelId.trim() && (
            <p className="text-[10px] text-purple-600 mt-1.5 font-medium">
              ✓ {lang === 'zh' ? '当前使用' : 'Using'}: <span className="font-mono">{customModelId.trim()}</span>
              {currentProvider && <span className="text-gray-400 ml-1">({currentProvider.name})</span>}
            </p>
          )}
        </div>

        {/* API Key input */}
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {currentProvider ? `${currentProvider.name} API Key` : 'API Key'}
        </label>
        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
          placeholder={currentProvider
            ? (lang === 'zh' ? `粘贴你的 ${currentProvider.name} API Key` : `Paste your ${currentProvider.name} API Key`)
            : (t.apiKeyPh || 'Paste your API key...')}
          className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${
            apiKey ? 'border-green-400 focus:ring-green-300 bg-green-50' : 'border-purple-300 focus:ring-purple-300'
          }`} />
        {apiKey ? (
          <p className="text-xs text-green-600 mt-1">✓ Key set — {lang === 'zh' ? '模型' : 'Model'}: <span className="font-mono text-[10px]">{effectiveModel}</span></p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">{t.apiKeyRequired || 'Required for AI features'}</p>
        )}

        {/* Dynamic guide based on current provider */}
        {showGuide && (
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <p className="text-[10px] text-gray-500 mb-2">{lang === 'zh' ? '支持的所有厂商：' : 'All supported providers:'}</p>
            <div className="space-y-1.5">
              {providers.map(p => {
                const isActive = currentProvider?.name === p.name
                return (
                  <div key={p.name} className={`flex items-center gap-2 text-xs ${isActive ? 'text-purple-700 font-semibold' : 'text-gray-500'}`}>
                    {isActive && <span className="text-purple-500">→</span>}
                    <span className="w-20 shrink-0">{p.name}</span>
                    <a href={p.keyUrl} target="_blank" rel="noreferrer" className="underline hover:text-purple-600 truncate text-[10px]">
                      {p.keyUrl.replace('https://', '')}
                    </a>
                    <span className="text-[9px] text-gray-400 font-mono ml-auto shrink-0">{p.prefix}*</span>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 border-t border-purple-100 pt-2">
              {lang === 'zh'
                ? '💡 点击上方链接前往对应厂商申请Key，粘贴到上方输入框即可。Google Gemini 和 Qwen Turbo 有免费额度。'
                : '💡 Click links above to get API keys. Google Gemini and Qwen Turbo have free tiers.'}
            </p>
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
                {msg.role === 'ai' && <span className="text-purple-500 mr-1">✨</span>}
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
