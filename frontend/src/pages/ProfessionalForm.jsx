import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'
import ElectricBorder from '../components/reactbits/ElectricBorder'

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

        {/* Content Layout */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.contentLayout || 'Content Layout'}</label>
          <p className="text-[10px] text-gray-400 italic mb-3">{t.contentLayoutHint || 'Choose how your resume content is organized'}</p>
          <div className="grid grid-cols-3 gap-4">
            {/* Classic */}
            <button type="button"
              onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'classic' }))}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                proStyle.content_layout === 'classic'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              {/* Visual preview */}
              <div className="h-16 mb-3 flex flex-col items-center justify-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-400" />
                <div className="w-16 h-1 bg-gray-300 rounded" />
                <div className="w-12 h-1 bg-gray-200 rounded" />
                <div className="w-14 h-1 bg-gray-200 rounded" />
              </div>
              <div className="text-sm font-semibold text-gray-800">{t.layoutClassic || 'Classic'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.layoutClassicDesc || 'Avatar on top, single column'}</div>
              {proStyle.content_layout === 'classic' && (
                <div className="mt-2 text-[10px] font-medium text-gray-600">{'\u2713'} Selected</div>
              )}
            </button>
            {/* Poster */}
            <button type="button"
              onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'poster' }))}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                proStyle.content_layout === 'poster'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              {/* Visual preview */}
              <div className="h-16 mb-3 relative">
                <div className="w-full h-10 bg-gradient-to-r from-gray-300 to-gray-200 rounded-t" />
                <div className="absolute bottom-1 left-3 w-6 h-6 rounded-full bg-gray-400 border-2 border-white shadow" />
                <div className="mt-1 ml-1">
                  <div className="w-12 h-1 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800">{t.layoutPoster || 'Poster'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.layoutPosterDesc || 'Banner + avatar overlay'}</div>
              {proStyle.content_layout === 'poster' && (
                <div className="mt-2 text-[10px] font-medium text-gray-600">{'\u2713'} Selected</div>
              )}
            </button>
            {/* Sidebar */}
            <button type="button"
              onClick={() => setProStyle(prev => ({ ...prev, content_layout: 'sidebar' }))}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                proStyle.content_layout === 'sidebar'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              {/* Visual preview */}
              <div className="h-16 mb-3 flex gap-1">
                <div className="w-6 bg-gray-300 rounded-l flex flex-col items-center pt-2 gap-1">
                  <div className="w-4 h-4 rounded-full bg-gray-400" />
                  <div className="w-3 h-0.5 bg-gray-400 rounded" />
                  <div className="w-4 h-0.5 bg-gray-400 rounded" />
                  <div className="w-3 h-0.5 bg-gray-400 rounded" />
                </div>
                <div className="flex-1 py-1 pr-1 flex flex-col gap-1">
                  <div className="w-full h-1.5 bg-gray-200 rounded" />
                  <div className="w-full h-1.5 bg-gray-200 rounded" />
                  <div className="w-3/4 h-1 bg-gray-100 rounded" />
                  <div className="w-full h-1.5 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800">{t.layoutSidebar || 'Sidebar'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.layoutSidebarDesc || 'Left sidebar + right content'}</div>
              {proStyle.content_layout === 'sidebar' && (
                <div className="mt-2 text-[10px] font-medium text-gray-600">{'\u2713'} Selected</div>
              )}
            </button>
          </div>
          {/* Poster-specific options */}
          {proStyle.content_layout === 'poster' && (
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[10px] text-amber-700">{t.posterTip}</p>
              </div>
              {/* Banner Image Upload */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{t.bannerImage || 'Banner Image'}</label>
                <p className="text-[10px] text-gray-400 italic mb-2">{t.bannerImageHint || 'Upload a landscape photo for the hero banner background'}</p>
                <div className="flex items-center gap-3">
                  {proStyle.header_image && (
                    <img src={proStyle.header_image} alt="banner" className="w-24 h-14 object-cover rounded-lg border border-gray-200" />
                  )}
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-xs font-medium">
                    {'\u{1F5BC}'} {t.uploadBanner || 'Upload Banner'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = ev => setProStyle(prev => ({ ...prev, header_image: ev.target.result }))
                        reader.readAsDataURL(file)
                      }
                    }} />
                  </label>
                  {proStyle.header_image && (
                    <button type="button" onClick={() => setProStyle(prev => ({ ...prev, header_image: '' }))} className="text-red-400 hover:text-red-600 text-xs">{t.clearImage || 'Clear'}</button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Sidebar-specific hint */}
          {proStyle.content_layout === 'sidebar' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-[10px] text-blue-700">{t.sidebarHint || 'Sidebar layout places your avatar, contact info and skills on the left, with work experience and education on the right.'}</p>
            </div>
          )}
        </div>

        {/* Timeline Style */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.timelineStyle || 'Timeline Style'}</label>
          <p className="text-[10px] text-gray-400 italic mb-3">{t.timelineStyleHint || 'Choose how work experience is displayed'}</p>
          <div className="flex gap-4">
            <button type="button"
              onClick={() => setProStyle(prev => ({ ...prev, timeline_style: 'alternate' }))}
              className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all ${
                proStyle.timeline_style === 'alternate'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              {/* Visual preview: alternating */}
              <div className="h-10 mb-2 flex items-center justify-center gap-1">
                <div className="w-5 h-1.5 bg-gray-300 rounded" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <div className="w-5" />
              </div>
              <div className="h-4 mb-2 flex items-center justify-center gap-1">
                <div className="w-5" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <div className="w-5 h-1.5 bg-gray-300 rounded" />
              </div>
              <div className="text-xs font-semibold text-gray-800">{t.timelineAlternate || 'Alternating'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.timelineAlternateDesc || 'Left-right zigzag'}</div>
              {proStyle.timeline_style === 'alternate' && (
                <div className="mt-1 text-[10px] font-medium text-gray-600">{'\u2713'}</div>
              )}
            </button>
            <button type="button"
              onClick={() => setProStyle(prev => ({ ...prev, timeline_style: 'linear' }))}
              className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all ${
                proStyle.timeline_style === 'linear'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              {/* Visual preview: linear */}
              <div className="h-10 mb-2 flex items-center justify-center gap-1">
                <div className="w-1 h-8 bg-gray-300 rounded" />
                <div className="flex flex-col gap-1 items-start">
                  <div className="w-8 h-1.5 bg-gray-300 rounded" />
                  <div className="w-6 h-1 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-800">{t.timelineLinear || 'Linear'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.timelineLinearDesc || 'Top to bottom'}</div>
              {proStyle.timeline_style === 'linear' && (
                <div className="mt-1 text-[10px] font-medium text-gray-600">{'\u2713'}</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )

  const handleAIStyleUpdate = (updates) => {
    setProStyle(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (resumeData, aiEffects, sectionOrder) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'professional',
        resume: resumeData,
        pro_style: { ...proStyle, section_order: sectionOrder || [] },
        lang,
        ai_effects: aiEffects || [],
        section_order: sectionOrder || [],
      }),
    })
    if (!response.ok) throw new Error('Generation failed')
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'professional' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-gray-100/70 relative overflow-hidden">
      {/* Animated background - elegant corporate style */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-10 -right-20 w-[350px] h-[350px] bg-blue-200/25 rounded-full blur-[80px] animate-[proBreathe_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 -left-16 w-[300px] h-[300px] bg-slate-300/20 rounded-full blur-[70px] animate-[proBreathe_12s_ease-in-out_infinite_4s]" />
        <div className="absolute top-2/3 right-1/4 w-[250px] h-[250px] bg-amber-200/10 rounded-full blur-[60px] animate-[proBreathe_9s_ease-in-out_infinite_2s]" />
        {/* Fine grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(30,41,59,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Diagonal accent lines */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(30,64,175,0.3) 40px, rgba(30,64,175,0.3) 41px)',
        }} />
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-[proFloat_14s_ease-in-out_infinite]"
            style={{
              width: 2 + (i % 2) * 2,
              height: 2 + (i % 2) * 2,
              left: `${15 + (i * 14) % 70}%`,
              top: `${10 + (i * 17) % 70}%`,
              background: i % 2 === 0 ? 'rgba(30,64,175,0.15)' : 'rgba(201,169,110,0.2)',
              animationDelay: `${i * 2}s`,
              animationDuration: `${12 + (i % 3) * 3}s`,
            }} />
        ))}

        {/* 3D Wireframe geometric composition (cube + sphere rotating) */}
        <div className="hidden lg:block absolute top-28 right-6 w-[180px] h-[180px]" style={{ perspective: '600px' }}>
          <div className="w-full h-full animate-[geoSpin_20s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Wireframe cube faces */}
            {[
              { t: 'rotateY(0deg) translateZ(60px)', border: 'rgba(30,64,175,0.12)' },
              { t: 'rotateY(90deg) translateZ(60px)', border: 'rgba(30,64,175,0.10)' },
              { t: 'rotateY(180deg) translateZ(60px)', border: 'rgba(30,64,175,0.08)' },
              { t: 'rotateY(270deg) translateZ(60px)', border: 'rgba(30,64,175,0.10)' },
              { t: 'rotateX(90deg) translateZ(60px)', border: 'rgba(201,169,110,0.12)' },
              { t: 'rotateX(-90deg) translateZ(60px)', border: 'rgba(201,169,110,0.10)' },
            ].map((face, i) => (
              <div key={i} className="absolute inset-[30px] border-2 rounded-sm"
                style={{
                  transform: face.t,
                  backfaceVisibility: 'visible',
                  borderColor: face.border,
                  transformStyle: 'preserve-3d',
                }} />
            ))}
            {/* Inner sphere (circle outline) */}
            <div className="absolute inset-[45px] rounded-full border-2 animate-[geoSpinReverse_12s_linear_infinite]"
              style={{ borderColor: 'rgba(201,169,110,0.15)', transformStyle: 'preserve-3d' }} />
            <div className="absolute inset-[55px] rounded-full border"
              style={{ borderColor: 'rgba(30,64,175,0.08)', transform: 'rotateX(60deg)' }} />
            <div className="absolute inset-[55px] rounded-full border"
              style={{ borderColor: 'rgba(30,64,175,0.08)', transform: 'rotateY(60deg)' }} />
          </div>
        </div>
        {/* Second smaller geometric - wireframe triangle */}
        <div className="hidden lg:block absolute bottom-40 right-20 w-[100px] h-[100px] opacity-[0.06]">
          <div className="w-full h-full animate-[geoSpin_15s_linear_infinite_reverse]" style={{ perspective: '400px' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 95,90 5,90" fill="none" stroke="rgba(30,64,175,0.6)" strokeWidth="1.5" />
              <polygon points="50,20 80,80 20,80" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1" />
              <circle cx="50" cy="55" r="20" fill="none" stroke="rgba(30,64,175,0.4)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes proBreathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.06); }
        }
        @keyframes proFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          33% { transform: translate(8px, -20px); opacity: 0.4; }
          66% { transform: translate(-6px, -35px); opacity: 0.15; }
        }
        @keyframes geoSpin {
          from { transform: rotateX(15deg) rotateY(0deg); }
          to { transform: rotateX(15deg) rotateY(360deg); }
        }
        @keyframes geoSpinReverse {
          from { transform: rotateX(-10deg) rotateY(360deg) rotateZ(0deg); }
          to { transform: rotateX(-10deg) rotateY(0deg) rotateZ(360deg); }
        }
      `}</style>
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* ElectricBorder - floating status card with lightning border */}
        <div className="hidden lg:block fixed top-[35%] right-[15%] w-[160px] z-0 opacity-[0.6]">
          <ElectricBorder color="#1e40af" speed={0.8} chaos={0.08} borderRadius={12}>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Status</span>
              </div>
              <div className="text-xl font-bold text-gray-800">Ready</div>
              <div className="text-[10px] text-gray-500 mt-1">Professional mode</div>
            </div>
          </ElectricBorder>
        </div>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-lg shadow-lg shadow-gray-300">{'\u{1F4BC}'}</div>
            <h1 className="text-3xl font-extrabold text-gray-800">{t.professionalFormTitle}</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">{t.professionalFormDesc}</p>
        </div>
        <ResumeForm mode="professional" onSubmit={handleSubmit} extraFields={extraFields} currentStyle={proStyle} onStyleUpdateFromAI={handleAIStyleUpdate} />
      </main>
    </div>
  )
}

export default ProfessionalForm
