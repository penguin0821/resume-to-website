import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { API_BASE_URL } from '../config'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

function ProfessionalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [proStyle, setProStyle] = useState({
    accent_color: '#c9a96e',
    header_bg: '#1a1a2e',
    ui_style: 'elegant',
    keywords: [],
    content_layout: 'classic',
    photo_layout: '',
    header_image: '',
    timeline_style: 'alternate',
    dark_mode: false,
  })
  const styleKey = 'resume-style-professional'
  const styleTimer = useRef(null)
  const isRestoring = useRef(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(styleKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.accent_color) {
          setProStyle(prev => ({ ...prev, ...parsed }))
          isRestoring.current = true
        }
      }
    } catch {}
  }, [styleKey])

  useEffect(() => {
    if (isRestoring.current) { isRestoring.current = false; return }
    if (styleTimer.current) clearTimeout(styleTimer.current)
    styleTimer.current = setTimeout(() => {
      try { localStorage.setItem(styleKey, JSON.stringify(proStyle)) } catch {}
    }, 500)
    return () => { if (styleTimer.current) clearTimeout(styleTimer.current) }
  }, [proStyle, styleKey])

  const extraFields = (
    <section className="space-y-8">
      {/* Accent Color */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <label className="font-geo block text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">{t.accentColor}</label>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {[
            { c: '#c9a96e', name: 'Gold' },
            { c: '#1e40af', name: 'Navy' },
            { c: '#059669', name: 'Emerald' },
            { c: '#333333', name: 'Charcoal' },
            { c: '#7c3aed', name: 'Violet' },
            { c: '#dc2626', name: 'Ruby' },
            { c: '#0891b2', name: 'Teal' },
            { c: '#ea580c', name: 'Copper' },
          ].map(({ c, name }) => (
            <button key={c} type="button" onClick={() => setProStyle(prev => ({ ...prev, accent_color: c }))}
              className={`relative w-11 h-11 rounded-xl border-2 transition-all active:scale-[0.92] ${proStyle.accent_color === c ? 'border-slate-800 scale-110 ring-2 ring-offset-2 ring-slate-800/15 shadow-md' : 'border-slate-200 hover:scale-110 hover:shadow-sm'}`}
              style={{ background: c }} title={name}>
              {proStyle.accent_color === c && <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow-lg"></span>}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <input type="color" value={proStyle.accent_color} onChange={e => setProStyle(prev => ({ ...prev, accent_color: e.target.value }))}
              className="w-11 h-11 rounded-xl cursor-pointer border-2 border-dashed border-slate-300 hover:border-slate-500 transition-colors" />
            <span className="text-xs text-slate-400 font-medium">Custom</span>
          </div>
        </div>
        <div className="h-px rounded-full overflow-hidden bg-slate-100">
          <div className="h-full rounded-full transition-all" style={{ width: '100%', background: `linear-gradient(90deg, ${proStyle.accent_color}, ${proStyle.accent_color}44)` }} />
        </div>
      </div>

      {/* Header Background */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <label className="font-geo block text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">{t.headerBg}</label>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { c: '#1a1a2e', name: 'Dark Navy' },
            { c: '#0f172a', name: 'Midnight' },
            { c: '#1e293b', name: 'Slate' },
            { c: '#292524', name: 'Espresso' },
            { c: '#ffffff', name: 'White' },
            { c: '#f8fafc', name: 'Snow' },
          ].map(({ c, name }) => (
            <button key={c} type="button" onClick={() => setProStyle(prev => ({ ...prev, header_bg: c }))}
              className={`relative w-11 h-11 rounded-xl border-2 transition-all active:scale-[0.92] ${proStyle.header_bg === c ? 'border-slate-800 scale-110 ring-2 ring-offset-2 ring-slate-800/15 shadow-md' : 'border-slate-200 hover:scale-110 hover:shadow-sm'}`}
              style={{ background: c }} title={name}>
              {proStyle.header_bg === c && <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${c === '#ffffff' || c === '#f8fafc' ? 'text-slate-800' : 'text-white'}`}></span>}
            </button>
          ))}
          <input type="color" value={proStyle.header_bg} onChange={e => setProStyle(prev => ({ ...prev, header_bg: e.target.value }))}
            className="w-11 h-11 rounded-xl cursor-pointer border-2 border-dashed border-slate-300 hover:border-slate-500 transition-colors" />
        </div>
      </div>

      {/* UI Style */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <label className="font-geo block text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">{t.proUiStyle}</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'elegant', emoji: '', desc: '优雅奢华' },
            { value: 'minimal', emoji: '', desc: '极简现代' },
            { value: 'corporate', emoji: '', desc: '企业商务' },
          ].map(s => (
            <button key={s.value} type="button" onClick={() => setProStyle(prev => ({ ...prev, ui_style: s.value }))}
              className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.ui_style === s.value ? 'border-slate-800 bg-slate-50 shadow-lg shadow-slate-200/50' : 'border-slate-200/60 bg-white hover:border-slate-400 hover:shadow-md'}`}>
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className="text-sm font-bold text-slate-800">{t[s.value]}</div>
              <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Layout */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <label className="font-geo block text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">{t.contentLayout}</label>
        <div className="grid grid-cols-3 gap-4">
          <button type="button" onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'classic' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.content_layout === 'classic' ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200/60 bg-white hover:border-slate-400'}`}>
            <div className="text-3xl mb-2"></div>
            <div className="text-sm font-bold">{t.layoutClassic}</div>
          </button>
          <button type="button" onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'poster' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.content_layout === 'poster' ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200/60 bg-white hover:border-slate-400'}`}>
            <div className="text-3xl mb-2"></div>
            <div className="text-sm font-bold">{t.layoutPoster}</div>
          </button>
          <button type="button" onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'sidebar' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.content_layout === 'sidebar' ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200/60 bg-white hover:border-slate-400'}`}>
            <div className="text-3xl mb-2"></div>
            <div className="text-sm font-bold">{t.layoutSidebar}</div>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <label className="font-geo block text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">{t.timelineStyle}</label>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setProStyle(prev => ({ ...prev, timeline_style: 'alternate' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.timeline_style === 'alternate' ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200/60 bg-white hover:border-slate-400'}`}>
            <div className="text-2xl mb-2"></div>
            <div className="text-sm font-bold">{t.timelineAlternate}</div>
          </button>
          <button type="button" onClick={() => setProStyle(prev => ({ ...prev, timeline_style: 'linear' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${proStyle.timeline_style === 'linear' ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200/60 bg-white hover:border-slate-400'}`}>
            <div className="text-2xl mb-2"></div>
            <div className="text-sm font-bold">{t.timelineLinear}</div>
          </button>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-7 py-5 shadow-lg">
        <div>
          <p className="text-sm font-bold text-white"> {lang === 'zh' ? '暗色模式' : 'Dark Mode'}</p>
          <p className="text-xs text-slate-400 mt-1">{lang === 'zh' ? '访客系统为暗色模式时自动切换' : 'Auto-switch when visitor uses dark mode'}</p>
        </div>
        <button type="button" onClick={() => setProStyle(prev => ({ ...prev, dark_mode: !prev.dark_mode }))}
          className={`relative w-14 h-7 rounded-full transition-colors ${proStyle.dark_mode ? 'bg-slate-700' : 'bg-slate-600'}`}>
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${proStyle.dark_mode ? 'translate-x-7' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </section>
  )

  const handleAIStyleUpdate = (updates) => { setProStyle(prev => ({ ...prev, ...updates })) }

  const handleSubmit = async (resumeData, aiEffects, sectionOrder) => {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'professional', resume: resumeData, pro_style: { ...proStyle, section_order: sectionOrder || [] }, lang, ai_effects: aiEffects || [], section_order: sectionOrder || [] }),
    })
    if (!response.ok) {
      let errMsg = 'Generation failed'
      try { const errData = await response.json(); if (errData.detail) errMsg = errData.detail } catch {}
      throw new Error(errMsg)
    }
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'professional' } })
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] relative overflow-x-hidden">
      {/* ===== Background Design Elements ===== */}
      {/* Fine geometric grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      
      {/* Top gold accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent pointer-events-none z-50" />
      
      {/* Subtle warm vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 60%)' }} />

      {/* Decorative corner marks */}
      <div className="fixed top-20 right-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-6 h-px bg-slate-800" />
        <div className="absolute top-0 right-0 w-px h-6 bg-slate-800" />
      </div>
      <div className="fixed bottom-20 left-8 w-12 h-12 pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-0 w-6 h-px bg-slate-800" />
        <div className="absolute bottom-0 left-0 w-px h-6 bg-slate-800" />
      </div>

      {/* ===== Photographic Decorative Elements ===== */}
      {/* Executive stationery flowing in from top-right corner */}
      <img
        src="/images/decor-elite-tr.png"
        alt=""
        draggable={false}
        className="fixed -top-8 -right-8 w-[420px] h-[420px] object-contain pointer-events-none select-none mix-blend-multiply opacity-90"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%, black 52%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 52%, transparent 76%)',
        }}
      />
      {/* Refined objects flowing in from bottom-left corner */}
      <img
        src="/images/decor-elite-bl.png"
        alt=""
        draggable={false}
        className="fixed -bottom-10 -left-10 w-[360px] h-[360px] object-contain pointer-events-none select-none mix-blend-multiply opacity-80"
        style={{
          maskImage: 'radial-gradient(circle at 0% 100%, black 52%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 52%, transparent 76%)',
        }}
      />

      <Navbar />
      
      {/* ===== Main Content ===== */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-14 relative">
          {/* Decorative top rule */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-px bg-slate-800" />
            <span className="font-geo text-[10px] font-bold text-slate-400 uppercase tracking-[0.35em]">Elite Resume</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          
          <h1 className="font-elegant text-6xl md:text-7xl font-bold text-slate-900 leading-[0.9] tracking-tight">
            {lang === 'zh' ? (
              <>
                <span>职业</span>
                <span className="font-elegant italic font-normal text-slate-400 ml-2">精英</span>
              </>
            ) : (
              <>
                <span>Elite </span>
                <span className="font-elegant italic font-normal text-slate-400">Professional</span>
              </>
            )}
          </h1>
          
          <p className="text-sm text-slate-500 mt-5 max-w-md leading-relaxed">
            {lang === 'zh' ? '专业、精致、可信赖的简历设计，打造令人印象深刻的职业形象' : 'Professional, refined, trustworthy resume design for lasting impressions'}
          </p>
          
          {/* Gold accent rule */}
          <div className="flex items-center gap-3 mt-6">
            <div className="w-8 h-px bg-slate-800" />
            <div className="w-4 h-px bg-amber-600/50" />
            <div className="w-2 h-px bg-amber-600/25" />
          </div>
        </div>
        
        <ResumeForm mode="professional" onSubmit={handleSubmit} extraFields={extraFields} currentStyle={proStyle} onStyleUpdateFromAI={handleAIStyleUpdate} theme="professional" />
      </main>
    </div>
  )
}

export default ProfessionalForm
