import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

function ProfessionalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [proStyle, setProStyle] = useState({
    accent_color: '#c9a96e',
    header_bg: '#1a1a2e',
    ui_style: 'elegant',
    keywords: [],
  })

  const extraFields = (
    <section>
      <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-gray-600 to-gray-900 inline-block" />
        {t.proStylePreferences}
      </h2>
      <div className="space-y-8">
        {/* Accent Color */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.accentColor}</label>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {[
              { c: '#c9a96e', name: t.colorGold },
              { c: '#1e40af', name: t.colorNavy },
              { c: '#059669', name: t.colorEmerald },
              { c: '#333333', name: t.colorCharcoal },
              { c: '#7c3aed', name: t.colorViolet },
              { c: '#dc2626', name: t.colorRuby },
              { c: '#0891b2', name: t.colorTeal },
              { c: '#ea580c', name: t.colorCopper },
            ].map(({ c, name }) => (
              <button key={c} type="button"
                onClick={() => setProStyle(prev => ({ ...prev, accent_color: c }))}
                className={`relative group w-10 h-10 rounded-full border-2 transition-all ${
                  proStyle.accent_color === c
                    ? 'border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-300'
                    : 'border-gray-200 hover:scale-110'
                }`}
                style={{ background: c }}
                title={name}>
                {proStyle.accent_color === c && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg">{'\u2713'}</span>
                )}
              </button>
            ))}
            {/* DIY accent color */}
            <div className="flex items-center gap-2 ml-1">
              <input type="color" value={proStyle.accent_color}
                onChange={e => setProStyle(prev => ({ ...prev, accent_color: e.target.value }))}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-500 transition-colors" />
              <div className="text-[10px] text-gray-400 leading-tight">
                <div className="font-semibold">{t.custom}</div>
                <div>{t.pickColor}</div>
              </div>
            </div>
          </div>
          {/* Preview bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: proStyle.accent_color }} />
        </div>

        {/* Header Background */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.headerBg}</label>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { c: '#1a1a2e', name: t.bgDarkNavy },
              { c: '#0f172a', name: t.bgMidnight },
              { c: '#1e293b', name: t.bgSlate },
              { c: '#292524', name: t.bgEspresso },
              { c: '#ffffff', name: t.bgWhite },
              { c: '#f8fafc', name: t.bgSnow },
            ].map(({ c, name }) => (
              <button key={c} type="button"
                onClick={() => setProStyle(prev => ({ ...prev, header_bg: c }))}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  proStyle.header_bg === c
                    ? 'border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-300'
                    : 'border-gray-200 hover:scale-110'
                }`}
                style={{ background: c }}
                title={name}>
                {proStyle.header_bg === c && (
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${c === '#ffffff' || c === '#f8fafc' ? 'text-gray-800' : 'text-white'}`}>{'\u2713'}</span>
                )}
              </button>
            ))}
            <input type="color" value={proStyle.header_bg}
              onChange={e => setProStyle(prev => ({ ...prev, header_bg: e.target.value }))}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-500 transition-colors" />
          </div>
        </div>

        {/* UI Style Presets */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.proUiStyle}</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'elegant', emoji: '\u{1F451}', desc: t.proElegantDesc, accent: '#c9a96e' },
              { value: 'minimal', emoji: '\u{1F4F0}', desc: t.proMinimalDesc, accent: '#333' },
              { value: 'corporate', emoji: '\u{1F3E2}', desc: t.proCorporateDesc, accent: '#1e40af' },
            ].map(s => (
              <button key={s.value} type="button"
                onClick={() => setProStyle(prev => ({
                  ...prev,
                  ui_style: s.value,
                  accent_color: s.accent,
                }))}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  proStyle.ui_style === s.value
                    ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                    : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
                }`}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{t[s.value]}</div>
                <div className="text-[10px] text-gray-400 mt-1">{s.desc}</div>
                {proStyle.ui_style === s.value && (
                  <div className="mt-2 text-[10px] font-medium text-gray-600">{'\u2713'} Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const handleSubmit = async (resumeData, aiEffects) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'professional',
        resume: resumeData,
        pro_style: proStyle,
        lang,
        ai_effects: aiEffects || [],
      }),
    })
    if (!response.ok) throw new Error('Generation failed')
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'professional' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-gray-100/70">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-lg shadow-lg shadow-gray-300">{'\u{1F4BC}'}</div>
            <h1 className="text-3xl font-extrabold text-gray-800">{t.professionalFormTitle}</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">{t.professionalFormDesc}</p>
        </div>
        <ResumeForm mode="professional" onSubmit={handleSubmit} extraFields={extraFields} />
      </main>
    </div>
  )
}

export default ProfessionalForm
