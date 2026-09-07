import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { API_BASE_URL } from '../config'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

function PersonalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [style, setStyle] = useState({
    effect_colors: { solid: [], gradient: [], splice: [], shadow: [], accent: [] },
    color_effect: 'solid',
    color_effects: ['solid'],
    splice_direction: 'horizontal',
    splice_repeat: false,
    accent_pattern: 'dots',
    accent_layout: 'even',
    keywords: [],
    ui_style: 'editorial',
    bg_image: '',
    timeline_style: 'alternate',
    dark_mode: false,
  })
  const [keywordInput, setKeywordInput] = useState('')
  const styleKey = 'resume-style-personal'
  const styleTimer = useRef(null)
  const isRestoring = useRef(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(styleKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.effect_colors) {
          setStyle(prev => ({ ...prev, ...parsed }))
          isRestoring.current = true
        }
      }
    } catch {}
  }, [styleKey])

  useEffect(() => {
    if (isRestoring.current) { isRestoring.current = false; return }
    if (styleTimer.current) clearTimeout(styleTimer.current)
    styleTimer.current = setTimeout(() => {
      try { localStorage.setItem(styleKey, JSON.stringify(style)) } catch {}
    }, 500)
    return () => { if (styleTimer.current) clearTimeout(styleTimer.current) }
  }, [style, styleKey])

  const effects = style.color_effects
  const ec = style.effect_colors

  const maxFor = (effect) => {
    if (effect === 'solid') return 1
    if (effect === 'shadow' || effect === 'accent') return 3
    return 5
  }

  const toggleEffectColor = (effect, color) => {
    setStyle(prev => {
      const current = prev.effect_colors[effect] || []
      const isSel = current.includes(color)
      const max = maxFor(effect)
      let next
      if (isSel) next = current.filter(c => c !== color)
      else if (current.length < max) next = [...current, color]
      else return prev
      return { ...prev, effect_colors: { ...prev.effect_colors, [effect]: next } }
    })
  }

  const clearEffectColors = (effect) => {
    setStyle(prev => ({ ...prev, effect_colors: { ...prev.effect_colors, [effect]: [] } }))
  }

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setStyle(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }))
      setKeywordInput('')
    }
  }
  const removeKeyword = (i) => setStyle(prev => ({ ...prev, keywords: prev.keywords.filter((_, idx) => idx !== i) }))

  const isPersonalTheme = true

  const extraFields = (
    <section className="space-y-8">
      {/* Keywords */}
      <div className={`rounded-3xl p-7 border ${isPersonalTheme ? 'bg-white/70 backdrop-blur-sm border-orange-100/60' : 'bg-white border-slate-200'}`}>
        <label className="font-geo block text-[11px] font-bold text-orange-600 mb-5 uppercase tracking-[0.15em]">{t.styleKeywords}</label>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[8px]">
          {style.keywords.map((kw, i) => (
            <span key={i} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-semibold shadow-sm">
              {kw}<button type="button" onClick={() => removeKeyword(i)} className="ml-2 text-orange-400 hover:text-red-500 font-bold">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <input type="text" value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            className="flex-1 px-5 py-3.5 border-2 border-orange-200/60 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-300 transition-all bg-white/60 backdrop-blur-sm" placeholder={t.keywordPh} />
          <button type="button" onClick={addKeyword} className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:shadow-lg hover:shadow-orange-200/50 text-sm font-bold transition-all active:scale-[0.97]">{t.add}</button>
        </div>
      </div>

      {/* Color Effects */}
      <div className={`rounded-3xl p-7 border ${isPersonalTheme ? 'bg-white/70 backdrop-blur-sm border-orange-100/60' : 'bg-white border-slate-200'}`}>
        <label className="font-geo block text-[11px] font-bold text-orange-600 mb-5 uppercase tracking-[0.15em]">{t.colorEffect}</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { v: 'solid', label: t.effectSolid, color: '#f97316' },
            { v: 'gradient', label: t.effectGradient, color: 'linear-gradient(90deg, #6366f1, #ec4899)' },
            { v: 'shadow', label: t.effectShadow, color: '#1e293b' },
            { v: 'accent', label: t.effectAccent, color: '#f59e0b' },
            { v: 'splice', label: t.effectSplice, color: 'linear-gradient(90deg, #ef4444, #10b981)' },
          ].map(e => {
            const active = effects.includes(e.v)
            return (
              <button key={e.v} type="button" onClick={() => {
                setStyle(prev => {
                  let newEffects = active ? prev.color_effects.filter(x => x !== e.v) : [...new Set([...prev.color_effects.filter(x => x !== 'solid' || e.v === 'solid'), e.v])]
                  if (newEffects.length === 0) newEffects = ['solid']
                  if (newEffects.length > 1 && newEffects.includes('solid')) newEffects = newEffects.filter(x => x !== 'solid')
                  return { ...prev, color_effects: newEffects, color_effect: newEffects[0] }
                })
              }} className={`relative p-4 rounded-2xl border-2 transition-all active:scale-[0.96] ${active ? 'border-orange-400 bg-gradient-to-br from-orange-50/80 to-pink-50/80 shadow-lg shadow-orange-100/50' : 'border-stone-200/60 bg-white/60 hover:border-orange-300 hover:shadow-md backdrop-blur-sm'}`}>
                <div className="w-full h-8 rounded-xl mb-2" style={{ background: e.color }} />
                <div className="text-xs font-bold text-stone-800">{e.label}</div>
                {active && <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs shadow-md">✓</span>}
              </button>
            )
          })}
        </div>

        {effects.map(eff => {
          const colors = ec[eff] || []
          const max = maxFor(eff)
          const presetColors = ['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316','#14b8a6','#e11d48']
          return (
            <div key={eff} className="bg-gradient-to-r from-orange-50/40 to-pink-50/40 rounded-2xl p-5 border border-orange-100/50 mb-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-geo text-sm font-bold text-orange-600">{colors.length}/{max} colors</span>
                <button type="button" onClick={() => clearEffectColors(eff)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {presetColors.map(c => {
                  const isSel = colors.includes(c)
                  const idx = colors.indexOf(c)
                  return (
                    <button key={eff+c} type="button" onClick={() => toggleEffectColor(eff, c)}
                      className={`relative w-10 h-10 rounded-xl border-2 transition-all active:scale-[0.88] ${isSel ? 'border-stone-800 scale-110 ring-2 ring-offset-2 ring-orange-400 shadow-md' : 'border-stone-200/60 hover:scale-110 hover:shadow-sm'}`}
                      style={{ background: c }}>
                      {isSel && <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center bg-stone-800">{idx+1}</span>}
                    </button>
                  )
                })}
                <input type="color" value={colors[0] || '#6366f1'} onChange={e => {
                  const c = e.target.value
                  setStyle(prev => {
                    const current = prev.effect_colors[eff] || []
                    if (current.includes(c)) return prev
                    let next = current.length > 0 ? [c, ...current.slice(1)] : current.length < maxFor(eff) ? [c] : null
                    if (!next) return prev
                    return { ...prev, effect_colors: { ...prev.effect_colors, [eff]: next } }
                  })
                }} className="w-10 h-10 rounded-xl cursor-pointer border-2 border-dashed border-orange-300/60 hover:border-orange-500 transition-colors" />
              </div>
            </div>
          )
        })}
      </div>

      {/* UI Style */}
      <div className={`rounded-3xl p-7 border ${isPersonalTheme ? 'bg-white/70 backdrop-blur-sm border-orange-100/60' : 'bg-white border-slate-200'}`}>
        <label className="font-geo block text-[11px] font-bold text-orange-600 mb-5 uppercase tracking-[0.15em]">{t.uiStyle}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 'editorial', bg: '#FAF7F2', ink: '#1C1917', fg: '#C4552D', zh: '暖纸编辑 · 衬线优雅', en: 'Warm editorial · serif' },
            { value: 'studio', bg: '#F2F2F0', ink: '#111111', fg: '#FF4D00', zh: '粗野主义 · 国际橙', en: 'Brutalist · intl orange' },
            { value: 'aurora', bg: 'linear-gradient(135deg,#5EEAD4,#A5B4FC,#FDBA74)', ink: '#141824', fg: '#0D9488', zh: '柔光玻璃 · 极光渐变', en: 'Glass · aurora mesh' },
          ].map(s => (
            <button key={s.value} type="button" onClick={() => setStyle(prev => ({ ...prev, ui_style: s.value }))}
              className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.97] ${style.ui_style === s.value ? 'border-orange-400 bg-white shadow-lg shadow-orange-100/60' : 'border-stone-200/70 bg-white/60 hover:border-orange-300 hover:shadow-md backdrop-blur-sm'}`}>
              <div className="w-full h-24 rounded-xl mb-3 overflow-hidden relative border border-black/5" style={{ background: s.bg }}>
                <div className="absolute inset-0 p-3 flex flex-col gap-1.5">
                  <div className="h-2.5 w-3/5 rounded-full" style={{ background: s.ink, opacity: 0.9 }} />
                  <div className="h-1.5 w-2/5 rounded-full" style={{ background: s.fg }} />
                  <div className="mt-auto flex gap-1.5">
                    <div className="h-7 flex-1 rounded-md" style={{ background: s.ink, opacity: 0.16 }} />
                    <div className="h-7 flex-1 rounded-md" style={{ background: s.ink, opacity: 0.1 }} />
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-stone-800">{t[s.value]}</div>
              <div className="text-xs text-stone-500 mt-0.5">{lang === 'zh' ? s.zh : s.en}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={`rounded-3xl p-7 border ${isPersonalTheme ? 'bg-white/70 backdrop-blur-sm border-orange-100/60' : 'bg-white border-slate-200'}`}>
        <label className="font-geo block text-[11px] font-bold text-orange-600 mb-5 uppercase tracking-[0.15em]">{t.timelineStyle}</label>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setStyle(prev => ({ ...prev, timeline_style: 'alternate' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${style.timeline_style === 'alternate' ? 'border-orange-400 bg-gradient-to-br from-orange-50/80 to-pink-50/80 shadow-md' : 'border-stone-200/60 bg-white/60 hover:border-orange-300 backdrop-blur-sm'}`}>
            <div className="text-2xl mb-2"></div>
            <div className="text-sm font-bold">{t.timelineAlternate}</div>
          </button>
          <button type="button" onClick={() => setStyle(prev => ({ ...prev, timeline_style: 'linear' }))}
            className={`p-5 rounded-2xl border-2 text-center transition-all active:scale-[0.96] ${style.timeline_style === 'linear' ? 'border-orange-400 bg-gradient-to-br from-orange-50/80 to-pink-50/80 shadow-md' : 'border-stone-200/60 bg-white/60 hover:border-orange-300 backdrop-blur-sm'}`}>
            <div className="text-2xl mb-2"></div>
            <div className="text-sm font-bold">{t.timelineLinear}</div>
          </button>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between bg-gradient-to-r from-stone-800 to-stone-900 rounded-3xl px-7 py-5 shadow-lg">
        <div>
          <p className="text-sm font-bold text-white">🌙 {lang === 'zh' ? '暗色模式' : 'Dark Mode'}</p>
          <p className="text-xs text-stone-400 mt-1">{lang === 'zh' ? '访客系统为暗色模式时自动切换' : 'Auto-switch when visitor uses dark mode'}</p>
        </div>
        <button type="button" onClick={() => setStyle(prev => ({ ...prev, dark_mode: !prev.dark_mode }))}
          className={`relative w-14 h-7 rounded-full transition-colors ${style.dark_mode ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-stone-600'}`}>
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${style.dark_mode ? 'translate-x-7' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </section>
  )

  const handleAIStyleUpdate = (updates) => { setStyle(prev => ({ ...prev, ...updates })) }

  const generate = useCallback(async (resumeData, aiEffects, sectionOrder) => {
    const ec = style.effect_colors
    const stylePayload = {
      ...style,
      primary_color: ec.solid[0] || ec.gradient[0] || ec.splice[0] || '#1e40af',
      primary_colors: ec.solid || [],
      extra_colors: ec.accent || ec.shadow || [],
      section_order: sectionOrder || [],
      dark_mode: style.dark_mode || false,
    }
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'personal', resume: resumeData, style: stylePayload, lang, ai_effects: aiEffects || [], section_order: sectionOrder || [] }),
    })
    if (!response.ok) {
      let errMsg = 'Generation failed'
      try { const errData = await response.json(); if (errData.detail) errMsg = errData.detail } catch {}
      throw new Error(errMsg)
    }
    const { html } = await response.json()
    return html
  }, [style, lang])

  const handleSubmit = async (resumeData, aiEffects, sectionOrder) => {
    const html = await generate(resumeData, aiEffects, sectionOrder)
    navigate('/preview', { state: { html, mode: 'personal' } })
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden grain" style={{ background: 'linear-gradient(160deg, #FFFBF5 0%, #FFF5EE 25%, #FFF0F5 50%, #FAF0FF 75%, #FFF8F0 100%)' }}>
      {/* ===== Background Decorative Elements ===== */}
      {/* Large organic blob - top right */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(circle, #F97316 0%, #EC4899 50%, transparent 70%)' }} />
      {/* Medium blob - bottom left */}
      <div className="fixed -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, #EC4899 0%, #8B5CF6 50%, transparent 70%)' }} />
      {/* Small accent blob - middle right */}
      <div className="fixed top-1/2 right-10 w-[200px] h-[200px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
      {/* Tiny accent - top left area */}
      <div className="fixed top-32 left-1/4 w-[120px] h-[120px] rounded-full opacity-[0.03] pointer-events-none" style={{ background: '#10B981' }} />

      {/* Decorative thin lines */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/20 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300/20 to-transparent pointer-events-none" />

      {/* ===== Photographic Decorative Elements ===== */}
      {/* Art supplies flowing in from top-right corner */}
      <img
        src="/images/decor-creative-tr.png"
        alt=""
        draggable={false}
        className="fixed -top-8 -right-8 w-[440px] h-[440px] object-contain pointer-events-none select-none mix-blend-multiply opacity-90"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%, black 52%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 52%, transparent 76%)',
        }}
      />
      {/* Creative stationery flowing in from bottom-left corner */}
      <img
        src="/images/decor-creative-bl.png"
        alt=""
        draggable={false}
        className="fixed -bottom-10 -left-10 w-[380px] h-[380px] object-contain pointer-events-none select-none mix-blend-multiply opacity-80"
        style={{
          maskImage: 'radial-gradient(circle at 0% 100%, black 52%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 52%, transparent 76%)',
        }}
      />

      <Navbar />
      
      {/* ===== Main Content ===== */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-14 relative max-w-3xl">
          {/* Decorative corner element */}
          <div className="absolute -top-6 -left-3 w-20 h-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-0.5 bg-gradient-to-r from-orange-400 to-transparent" />
            <div className="absolute top-0 left-0 w-0.5 h-8 bg-gradient-to-b from-orange-400 to-transparent" />
          </div>
          
          <div className="font-geo text-[11px] font-bold text-orange-500/70 uppercase tracking-[0.3em] mb-4">Creative Studio</div>
          
          <h1 className="font-display text-6xl md:text-7xl font-black text-stone-900 leading-[0.9] tracking-tight">
            {lang === 'zh' ? (
              <>
                <span>个性</span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent ml-2">创意</span>
              </>
            ) : (
              <>
                <span>Creative </span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Style</span>
              </>
            )}
          </h1>
          
          <p className="text-base text-stone-500 mt-5 max-w-md leading-relaxed">
            {lang === 'zh' ? '打破常规，用色彩和创意表达真实的自己' : 'Break the rules, express yourself with colors and creativity'}
          </p>
          
          {/* Decorative color dots */}
          <div className="flex gap-2 mt-6">
            {['#F97316','#EC4899','#8B5CF6','#10B981','#F59E0B'].map((c, i) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        </div>
        
        <ResumeForm mode="personal" onSubmit={handleSubmit} extraFields={extraFields} currentStyle={style} onStyleUpdateFromAI={handleAIStyleUpdate} theme="personal" generatePreview={generate} />
      </main>
    </div>
  )
}

export default PersonalForm
