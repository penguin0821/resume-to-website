import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

function PersonalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [style, setStyle] = useState({
    primary_colors: ['#6366f1'],
    primary_color: '#6366f1',
    extra_colors: [],
    color_effect: 'solid',
    color_effects: ['solid'],
    splice_direction: 'horizontal',
    splice_repeat: false,
    accent_pattern: 'dots',
    accent_layout: 'even',
    keywords: [],
    ui_style: 'cartoon',
    bg_image: '',
  })
  const [keywordInput, setKeywordInput] = useState('')

  // Derive color mode from effects
  const effects = style.color_effects
  const needsSplit = effects.includes('shadow') || effects.includes('accent')
  const isSolidOnly = effects.length === 1 && effects[0] === 'solid'
  const maxSimpleColors = isSolidOnly ? 1 : 5
  const maxPrimary = 2
  const maxSecondary = 3

  // All colors merged (for gradient/splice preview)
  const allColors = [...style.primary_colors, ...style.extra_colors]

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setStyle(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }))
      setKeywordInput('')
    }
  }
  const removeKeyword = (i) => setStyle(prev => ({ ...prev, keywords: prev.keywords.filter((_, idx) => idx !== i) }))

  const extraFields = (
    <section>
      <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
        {t.stylePreferences}
      </h2>
      <div className="space-y-8">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.styleKeywords}</label>
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
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" placeholder={t.keywordPh} />
            <button type="button" onClick={addKeyword} className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-medium transition-colors">{t.add}</button>
          </div>
        </div>
        <div>
          {/* Step 1: Choose effects first */}
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.colorEffect}</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {(() => {
              const otherActive = effects.filter(x => x !== 'solid').length > 0
              // Fixed demo colors for each effect - varied and illustrative
              const items = [
                {
                  v: 'solid', label: t.effectSolid, desc: t.effectSolidDesc,
                  visual: (active) => (
                    <div className={`w-full rounded-md transition-all ${active ? 'h-7' : 'h-5'}`} style={{ background: '#f97316' }} />
                  ),
                  dimmed: otherActive,
                },
                {
                  v: 'gradient', label: t.effectGradient, desc: t.effectGradientDesc,
                  visual: (active) => (
                    <div className={`w-full rounded-md transition-all ${active ? 'h-7' : 'h-5'}`} style={{ background: 'linear-gradient(90deg, #6366f1, #ec4899, #10b981)' }} />
                  ),
                },
                {
                  v: 'shadow', label: t.effectShadow, desc: t.effectShadowDesc,
                  visual: (active) => (
                    <div className="flex items-center justify-center" style={{ height: active ? 28 : 20 }}>
                      <div className={`rounded-md transition-all ${active ? 'w-10 h-5' : 'w-8 h-4'}`} style={{ background: '#1e293b', boxShadow: '3px 4px 10px #8b5cf680, -2px 3px 8px #ec489960' }} />
                    </div>
                  ),
                },
                {
                  v: 'accent', label: t.effectAccent, desc: t.effectAccentDesc,
                  visual: (active) => (
                    <div className={`w-full rounded-md relative overflow-hidden transition-all ${active ? 'h-7' : 'h-5'}`} style={{ background: '#fef3c7' }}>
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="mcoins" width="14" height="14" patternUnits="userSpaceOnUse">
                          <circle cx="0" cy="0" r="7" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
                          <circle cx="14" cy="0" r="7" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
                          <circle cx="7" cy="7" r="7" fill="none" stroke="#ea580c" strokeWidth="0.8" opacity="0.4" />
                          <circle cx="0" cy="14" r="7" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
                          <circle cx="14" cy="14" r="7" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#mcoins)" />
                      </svg>
                    </div>
                  ),
                },
                {
                  v: 'splice', label: t.effectSplice, desc: t.effectSpliceDesc,
                  visual: (active) => (
                    <div className={`w-full rounded-md flex overflow-hidden transition-all ${active ? 'h-7' : 'h-5'}`}>
                      <div className="flex-1" style={{ background: '#ef4444' }} />
                      <div className="flex-1" style={{ background: '#f59e0b' }} />
                      <div className="flex-1" style={{ background: '#10b981' }} />
                    </div>
                  ),
                },
              ]
              return items.map(e => {
                const active = effects.includes(e.v)
                const isDimmed = e.dimmed && !active
                return (
                  <button key={e.v} type="button"
                    onClick={() => {
                      setStyle(prev => {
                        let newEffects = active
                          ? prev.color_effects.filter(x => x !== e.v)
                          : [...prev.color_effects.filter(x => x !== 'solid' || e.v === 'solid'), e.v]
                        if (newEffects.length === 0) newEffects = ['solid']
                        if (newEffects.length > 1 && newEffects.includes('solid')) {
                          newEffects = newEffects.filter(x => x !== 'solid')
                        }
                        return { ...prev, color_effects: newEffects, color_effect: newEffects[0] }
                      })
                    }}
                    className={`relative flex-1 min-w-[70px] py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white text-gray-800 ring-2 ring-indigo-500 ring-offset-2 shadow-lg shadow-indigo-100 scale-[1.03]'
                        : isDimmed
                        ? 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.01]'
                    }`}>
                    <div className={`mb-1.5 px-2 ${isDimmed ? 'grayscale opacity-40' : ''}`}>{e.visual(active)}</div>
                    <div className="font-bold">{e.label}</div>
                    <div className={`text-[9px] mt-0.5 ${active ? 'text-indigo-500' : 'text-gray-400'}`}>{e.desc}</div>
                    {active && <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{'\u2713'}</span>}
                  </button>
                )
              })
            })()}
          </div>

          {/* Splice sub-options */}
          {effects.includes('splice') && (
            <div className="bg-white/60 rounded-xl p-3 border border-gray-200 mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.spliceOptions}</span>
              <div className="flex items-center gap-3 mt-2">
                <button type="button"
                  onClick={() => setStyle(prev => ({ ...prev, splice_direction: 'horizontal' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${style.splice_direction === 'horizontal' ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                  {'\u2194'} {t.spliceHorizontal}
                </button>
                <button type="button"
                  onClick={() => setStyle(prev => ({ ...prev, splice_direction: 'diagonal' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${style.splice_direction === 'diagonal' ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                  {'\u2199'} {t.spliceDiagonal}
                </button>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer ml-auto">
                  <input type="checkbox" checked={style.splice_repeat}
                    onChange={e => setStyle(prev => ({ ...prev, splice_repeat: e.target.checked }))}
                    className="rounded" />
                  {t.spliceRepeat}
                </label>
              </div>
            </div>
          )}

          {/* Accent sub-options: Pattern + Layout */}
          {effects.includes('accent') && (
            <div className="bg-white/60 rounded-xl p-3 border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.accentPattern}</span>
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => setStyle(prev => ({ ...prev, accent_layout: 'even' }))}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${style.accent_layout === 'even' ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                    {'\u25A6'} {t.layoutEven}
                  </button>
                  <button type="button"
                    onClick={() => setStyle(prev => ({ ...prev, accent_layout: 'random' }))}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${style.accent_layout === 'random' ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                    {'\u2736'} {t.layoutRandom}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: 'dots', icon: '\u25CF', label: t.patternDots },
                  { v: 'clover', icon: '\u273F', label: t.patternClover },
                  { v: 'hollow', icon: '\u25CB', label: t.patternHollow },
                  { v: 'coin', icon: '\u25C9', label: t.patternCoin },
                  { v: 'star', icon: '\u2605', label: t.patternStar },
                  { v: 'star4', icon: '\u2726', label: t.patternStar4 },
                  { v: 'diamond', icon: '\u25C6', label: t.patternDiamond },
                  { v: 'cross', icon: '\u271A', label: t.patternCross },
                  { v: 'heart', icon: '\u2665', label: t.patternHeart },
                  { v: 'wave', icon: '\u2248', label: t.patternWave },
                ].map(p => (
                  <button key={p.v} type="button"
                    onClick={() => setStyle(prev => ({ ...prev, accent_pattern: p.v }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      style.accent_pattern === p.v
                        ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    <span className="text-base">{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Color selection - mode depends on effects */}
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.themeColor}</label>

          {needsSplit ? (
            /* Split mode: Primary + Secondary (for shadow/accent) */
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-gray-400 italic">{t.splitModeHint}</span>
                <div className="flex-1" />
                <button type="button" onClick={() => setStyle(prev => ({ ...prev, primary_colors: [], primary_color: '', extra_colors: [] }))}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all">
                  {t.clearAllColors}
                </button>
              </div>
              {/* Primary colors */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.primaryColors} ({style.primary_colors.length}/{maxPrimary})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316','#14b8a6','#e11d48'].map(c => {
                    const isSel = style.primary_colors.includes(c)
                    return (
                      <button key={'p'+c} type="button"
                        onClick={() => {
                          if (isSel) {
                            const n = style.primary_colors.filter(x => x !== c)
                            setStyle(prev => ({ ...prev, primary_colors: n, primary_color: n[0] || '' }))
                          } else if (style.primary_colors.length < maxPrimary) {
                            const n = [...style.primary_colors, c]
                            setStyle(prev => ({ ...prev, primary_colors: n, primary_color: n[0], extra_colors: prev.extra_colors.filter(x => x !== c) }))
                          }
                        }}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all ${isSel ? 'border-gray-800 scale-110 ring-2 ring-offset-1 ring-gray-300' : 'border-gray-200 hover:scale-110'}`}
                        style={{ background: c }}>
                        {isSel && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-gray-800 text-white rounded-full w-4 h-4 flex items-center justify-center">{style.primary_colors.indexOf(c)+1}</span>}
                      </button>
                    )
                  })}
                  <input type="color" value={style.primary_colors[0] || '#6366f1'}
                    onChange={e => {
                      const c = e.target.value
                      if (!style.primary_colors.includes(c) && style.primary_colors.length < maxPrimary) {
                        const n = [...style.primary_colors, c]
                        setStyle(prev => ({ ...prev, primary_colors: n, primary_color: n[0] }))
                      }
                    }}
                    className="w-9 h-9 rounded-full cursor-pointer border-2 border-dashed border-gray-300" />
                </div>
              </div>
              {/* Secondary colors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">{t.secondaryColors} ({style.extra_colors.length}/{maxSecondary})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316','#14b8a6','#e11d48'].map(c => {
                    const isSel = style.extra_colors.includes(c)
                    return (
                      <button key={'s'+c} type="button"
                        onClick={() => {
                          if (isSel) {
                            setStyle(prev => ({ ...prev, extra_colors: prev.extra_colors.filter(x => x !== c) }))
                          } else if (style.extra_colors.length < maxSecondary) {
                            setStyle(prev => ({ ...prev, extra_colors: [...prev.extra_colors, c], primary_colors: prev.primary_colors.filter(x => x !== c) }))
                          }
                        }}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all ${isSel ? 'border-purple-400 scale-105 ring-2 ring-offset-1 ring-purple-200' : 'border-gray-200 hover:scale-110'}`}
                        style={{ background: c }}>
                        {isSel && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center">+</span>}
                      </button>
                    )
                  })}
                  <input type="color" value={style.extra_colors[0] || '#6366f1'}
                    onChange={e => {
                      const c = e.target.value
                      if (!style.extra_colors.includes(c) && style.extra_colors.length < maxSecondary) {
                        setStyle(prev => ({ ...prev, extra_colors: [...prev.extra_colors, c] }))
                      }
                    }}
                    className="w-9 h-9 rounded-full cursor-pointer border-2 border-dashed border-purple-300" />
                </div>
              </div>
            </>
          ) : (
            /* Simple mode: flat color list (for solid/gradient/splice, no primary/secondary) */
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-gray-400 italic">{isSolidOnly ? t.solidModeHint : t.multiModeHint}</span>
                <div className="flex-1" />
                <button type="button" onClick={() => setStyle(prev => ({ ...prev, primary_colors: [], primary_color: '', extra_colors: [] }))}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all">
                  {t.clearAllColors}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316','#14b8a6','#e11d48'].map(c => {
                  const isSel = allColors.includes(c)
                  return (
                    <button key={c} type="button"
                      onClick={() => {
                        if (isSel) {
                          const n = allColors.filter(x => x !== c)
                          setStyle(prev => ({ ...prev, primary_colors: n.slice(0, 1) || [], primary_color: n[0] || '', extra_colors: n.slice(1) }))
                        } else if (allColors.length < maxSimpleColors) {
                          const n = [...allColors, c]
                          setStyle(prev => ({ ...prev, primary_colors: n.slice(0, 1) || [], primary_color: n[0], extra_colors: n.slice(1) }))
                        }
                      }}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${isSel ? 'border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-300' : 'border-gray-200 hover:scale-110'}`}
                      style={{ background: c }}>
                      {isSel && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-gray-800 text-white rounded-full w-4 h-4 flex items-center justify-center">{allColors.indexOf(c)+1}</span>}
                    </button>
                  )
                })}
                <input type="color" value={allColors[0] || '#6366f1'}
                  onChange={e => {
                    const c = e.target.value
                    if (!allColors.includes(c) && allColors.length < maxSimpleColors) {
                      const n = [...allColors, c]
                      setStyle(prev => ({ ...prev, primary_colors: n.slice(0, 1) || [], primary_color: n[0], extra_colors: n.slice(1) }))
                    }
                  }}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors" />
              </div>
            </>
          )}

          {/* Preview */}
          <div className="bg-white/60 rounded-xl p-4 border border-gray-200 mt-4">
            <span className="text-[10px] text-gray-400 mb-2 block">{t.previewEffect}</span>
            {(() => {
              const pc = style.primary_colors
              const sc = style.extra_colors
              const ac = [...pc, ...sc]
              const base = pc[0] || ac[0] || '#6366f1'
              const previews = []

              if (effects.includes('gradient') && ac.length > 1) {
                previews.push(<div key="grad" className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${ac.join(', ')})` }} title="Gradient" />)
              }
              if (effects.includes('splice') && ac.length > 1) {
                const cols = style.splice_repeat ? [...ac, ...ac, ...ac] : ac
                const dir = style.splice_direction === 'diagonal' ? '135deg' : '90deg'
                const stops = []
                const step = 100 / cols.length
                cols.forEach((c, i) => { stops.push(`${c} ${i*step}%`, `${c} ${(i+1)*step}%`) })
                previews.push(<div key="splice" className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(${dir}, ${stops.join(', ')})` }} title="Splice" />)
              }
              if (effects.includes('shadow')) {
                const shadows = sc.length > 0
                  ? sc.map((c, i) => `${(i+1)*4}px ${(i+1)*6}px ${16+i*8}px ${c}50`).join(', ')
                  : `0 8px 24px ${base}40`
                previews.push(<div key="shadow" className="h-10 rounded-lg mx-6 mb-2" style={{ background: base, boxShadow: shadows }} title="Shadow" />)
              }
              if (effects.includes('accent') && sc.length > 0) {
                previews.push(
                  <div key="accent" className="h-8 rounded-lg relative overflow-hidden mb-2" style={{ background: base }}>
                    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="pdots" width="24" height="24" patternUnits="userSpaceOnUse">
                        {sc.map((dc, idx) => <circle key={idx} cx={5+(idx*7)%15} cy={5+(idx*5)%12} r="3" fill={dc} />)}
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#pdots)" />
                    </svg>
                    {sc[1] && <div className="absolute top-0 right-0 w-6 h-6" style={{ background: sc[1], clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />}
                    {sc[1] && <div className="absolute bottom-0 left-0 w-6 h-6" style={{ background: sc[1], clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />}
                  </div>
                )
              }
              if (previews.length === 0) {
                previews.push(<div key="solid" className="h-8 rounded-lg" style={{ background: base }} />)
              }
              return previews
            })()}
            {allColors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {allColors.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} /> {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.backgroundImage}</label>
          <p className="text-xs text-gray-400 mb-3">{t.bgImageDesc}</p>
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
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.uiStyle}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'cartoon', emoji: '\u{1F9F8}', desc: '\u6d3b\u6cfc\u53ef\u7231' },
              { value: 'minimal', emoji: '\u{1F33F}', desc: '\u5e72\u51c0\u7b80\u6d01' },
              { value: 'artistic', emoji: '\u{1F3A8}', desc: '\u521b\u610f\u4f18\u96c5' },
              { value: 'retro', emoji: '\u{1F4E0}', desc: '\u590d\u53e4\u6000\u65e7' },
            ].map(s => (
              <button key={s.value} type="button"
                onClick={() => setStyle(prev => ({ ...prev, ui_style: s.value }))}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  style.ui_style === s.value
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-1'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                }`}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{t[s.value]}</div>
                <div className="text-[10px] text-gray-400 mt-1">{s.desc}</div>
                {style.ui_style === s.value && (
                  <div className="mt-2 text-[10px] font-medium text-indigo-500">{'\u2713'} Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const handleSubmit = async (resumeData, aiEffects) => {
    const stylePayload = {
      ...style,
      primary_color: style.primary_colors[0] || '#6366f1',
    }
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'personal',
        resume: resumeData,
        style: stylePayload,
        lang,
        ai_effects: aiEffects || [],
      }),
    })
    if (!response.ok) throw new Error('Generation failed')
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'personal' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-200">{'\u{1F3A8}'}</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.personalFormTitle}</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">{t.personalFormDesc}</p>
        </div>
        <ResumeForm mode="personal" onSubmit={handleSubmit} extraFields={extraFields} />
      </main>
    </div>
  )
}

export default PersonalForm
