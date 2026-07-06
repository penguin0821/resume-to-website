import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

function PersonalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [style, setStyle] = useState({
    primary_color: '#6366f1',
    keywords: [],
    ui_style: 'cartoon',
    bg_image: '',
  })
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setStyle(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }))
      setKeywordInput('')
    }
  }
  const removeKeyword = (i) => setStyle(prev => ({ ...prev, keywords: prev.keywords.filter((_, idx) => idx !== i) }))

  const extraFields = (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.stylePreferences}</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.styleKeywords}</label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[8px]">
            {style.keywords.map((kw, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {kw}<button type="button" onClick={() => removeKeyword(i)} className="ml-2 text-indigo-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.keywordPh} />
            <button type="button" onClick={addKeyword} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">{t.add}</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.themeColor}</label>
          <div className="flex items-center gap-3">
            {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
              <button key={c} type="button" onClick={() => setStyle(prev => ({ ...prev, primary_color: c }))}
                className={`w-9 h-9 rounded-full border-2 transition-transform ${style.primary_color === c ? 'border-gray-800 scale-125' : 'border-gray-300'}`}
                style={{ background: c }} />
            ))}
            <input type="color" value={style.primary_color} onChange={e => setStyle(prev => ({ ...prev, primary_color: e.target.value }))}
              className="w-9 h-9 rounded-full cursor-pointer border-0" title={t.custom} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.backgroundImage}</label>
          <p className="text-xs text-gray-500 mb-2">{t.bgImageDesc}</p>
          <div className="flex items-center gap-3">
            {style.bg_image && (
              <img src={style.bg_image} alt="bg" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors text-sm font-medium">
              {'\u{1F5BC}'} {t.uploadImage}
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = ev => setStyle(prev => ({ ...prev, bg_image: ev.target.result }))
                  reader.readAsDataURL(file)
                }
              }} />
            </label>
            {style.bg_image && (
              <button type="button" onClick={() => setStyle(prev => ({ ...prev, bg_image: '' }))} className="text-red-400 hover:text-red-600 text-xs">{t.clearImage}</button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.uiStyle}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'cartoon', emoji: '\u{1F9F8}' },
              { value: 'minimal', emoji: '\u{1F33F}' },
              { value: 'artistic', emoji: '\u{1F3A8}' },
              { value: 'retro', emoji: '\u{1F4E0}' },
            ].map(s => (
              <button key={s.value} type="button"
                onClick={() => setStyle(prev => ({ ...prev, ui_style: s.value }))}
                className={`p-3 rounded-xl border-2 text-center transition-all ${style.ui_style === s.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-sm font-medium">{t[s.value]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const handleSubmit = async (resumeData) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'personal',
        resume: resumeData,
        style,
        lang,
      }),
    })
    if (!response.ok) throw new Error('Generation failed')
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'personal' } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.personalFormTitle}</h1>
          <p className="text-gray-500">{t.personalFormDesc}</p>
        </div>
        <ResumeForm mode="personal" onSubmit={handleSubmit} extraFields={extraFields} />
      </main>
    </div>
  )
}

export default PersonalForm
