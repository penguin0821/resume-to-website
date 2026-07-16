import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { API_BASE_URL } from '../config'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'
import MetaBalls from '../components/reactbits/MetaBallsLazy'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB

function PersonalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [style, setStyle] = useState({
    effect_colors: {
      solid: ['#6366f1'],
      gradient: [],
      splice: [],
      shadow: [],
      accent: [],
    },
    color_effect: 'solid',
    color_effects: ['solid'],
    splice_direction: 'horizontal',
    splice_repeat: false,
    accent_pattern: 'dots',
    accent_layout: 'even',
    keywords: [],
    ui_style: 'cartoon',
    bg_image: '',
    timeline_style: 'alternate',
    dark_mode: false,
  })
  const [keywordInput, setKeywordInput] = useState('')

  // Derive from effects
  const effects = style.color_effects
  const ec = style.effect_colors  // shorthand
  const isSolidOnly = effects.length === 1 && effects[0] === 'solid'

  // Base color for previews
  const baseColor = ec.solid[0] || ec.gradient[0] || ec.splice[0] || '#6366f1'

  // Max colors per effect
  const maxFor = (effect) => {
    if (effect === 'solid') return 1
    if (effect === 'shadow' || effect === 'accent') return 3
    return 5  // gradient, splice
  }

  // Helper: toggle color for a specific effect
  const toggleEffectColor = (effect, color) => {
    setStyle(prev => {
      const current = prev.effect_colors[effect] || []
      const isSel = current.includes(color)
      const max = maxFor(effect)
      let next
      if (isSel) {
        next = current.filter(c => c !== color)
      } else if (current.length < max) {
        next = [...current, color]
      } else {
        return prev
      }
      return { ...prev, effect_colors: { ...prev.effect_colors, [effect]: next } }
    })
  }

  // Helper: clear colors for a specific effect
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
                          : [...new Set([...prev.color_effects.filter(x => x !== 'solid' || e.v === 'solid'), e.v])]
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

          {/* Per-effect color pickers */}
          {(() => {
            // Warning: check if any active effect has no colors
            const emptyEffects = effects.filter(eff => {
              const cols = ec[eff] || []
              if (eff === 'gradient' || eff === 'splice') return cols.length < 2
              return cols.length === 0
            })
            return emptyEffects.length > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                <p className="text-xs text-amber-700">{'\u26A0\uFE0F'} {t.emptyColorWarning || 'Some effects have no colors selected.'}</p>
              </div>
            ) : null
          })()}
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.themeColor}</label>
          <p className="text-[10px] text-gray-400 italic mb-3">{t.perEffectColorHint}</p>

          {/* Render color picker for each active effect */}
          {(() => {
            const presetColors = ['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316','#14b8a6','#e11d48']
            const effectMeta = {
              solid: { label: t.effectSolid, hint: t.solidColorHint || 'Select 1 color', ringColor: 'ring-gray-400', bgColor: 'bg-gray-800' },
              gradient: { label: t.effectGradient, hint: t.gradientColorHint || 'Select up to 5 colors', ringColor: 'ring-indigo-400', bgColor: 'bg-indigo-600' },
              shadow: { label: t.effectShadow, hint: t.shadowColorHint || 'Shadow layer colors (up to 3)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-600' },
              accent: { label: t.effectAccent, hint: t.accentColorHint || 'Pattern colors (up to 3)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-600' },
              splice: { label: t.effectSplice, hint: t.spliceColorHint || 'Select up to 5 colors', ringColor: 'ring-rose-400', bgColor: 'bg-rose-600' },
            }
            return effects.map(eff => {
              const meta = effectMeta[eff] || effectMeta.solid
              const colors = ec[eff] || []
              const max = maxFor(eff)
              return (
                <div key={eff} className="bg-white/60 rounded-xl p-3 border border-gray-200 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${meta.bgColor}`}>{meta.label}</span>
                      <span className="text-[10px] text-gray-500">({colors.length}/{max})</span>
                    </div>
                    <button type="button" onClick={() => clearEffectColors(eff)}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium text-red-500 hover:bg-red-50 border border-red-200 transition-all">
                      {t.clearEffectColors || 'Clear'}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {presetColors.map(c => {
                      const isSel = colors.includes(c)
                      const idx = colors.indexOf(c)
                      return (
                        <button key={eff+c} type="button"
                          onClick={() => toggleEffectColor(eff, c)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all ${isSel ? `border-gray-700 scale-110 ring-2 ring-offset-1 ${meta.ringColor}` : 'border-gray-200 hover:scale-110'}`}
                          style={{ background: c }}>
                          {isSel && <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center ${meta.bgColor}`}>{idx+1}</span>}
                        </button>
                      )
                    })}
                    <input type="color" value={colors[0] || '#6366f1'}
                      onChange={e => {
                        const c = e.target.value
                        setStyle(prev => {
                          const current = prev.effect_colors[eff] || []
                          if (current.includes(c)) return prev
                          let next
                          if (current.length > 0) {
                            next = [c, ...current.slice(1)]
                          } else if (current.length < maxFor(eff)) {
                            next = [c]
                          } else {
                            return prev
                          }
                          return { ...prev, effect_colors: { ...prev.effect_colors, [eff]: next } }
                        })
                      }}
                      className="w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors" />
                  </div>
                </div>
              )
            })
          })()}

          {/* Preview */}
          <div className="bg-white/60 rounded-xl p-4 border border-gray-200 mt-4">
            <span className="text-[10px] text-gray-400 mb-2 block">{t.previewEffect}</span>
            {(() => {
              const gradColors = ec.gradient || []
              const spliceColors = ec.splice || []
              const shadowColors = ec.shadow || []
              const accentColors = ec.accent || []
              const solidColor = ec.solid[0] || '#6366f1'
              const base = solidColor
              const previews = []

              // Solid preview
              if (effects.includes('solid')) {
                previews.push(<div key="solid" className="h-8 rounded-lg mb-2" style={{ background: solidColor }} title="Solid" />)
              }

              // Gradient preview
              if (effects.includes('gradient') && gradColors.length > 1) {
                previews.push(<div key="grad" className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${gradColors.join(', ')})` }} title="Gradient" />)
              } else if (effects.includes('gradient') && gradColors.length === 1) {
                previews.push(<div key="grad" className="h-8 rounded-lg mb-2" style={{ background: gradColors[0] }} title="Gradient" />)
              }

              // Splice preview
              if (effects.includes('splice') && spliceColors.length > 1) {
                const cols = style.splice_repeat ? [...spliceColors, ...spliceColors, ...spliceColors] : spliceColors
                const dir = style.splice_direction === 'diagonal' ? '135deg' : '90deg'
                const stops = []
                const step = 100 / cols.length
                cols.forEach((c, i) => { stops.push(`${c} ${i*step}%`, `${c} ${(i+1)*step}%`) })
                previews.push(<div key="splice" className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(${dir}, ${stops.join(', ')})` }} title="Splice" />)
              }

              // Shadow preview - multi-color layered shadows
              if (effects.includes('shadow')) {
                let shadows
                if (shadowColors.length > 1) {
                  const layers = [`0 4px 8px ${shadowColors[0]}30`]
                  shadowColors.forEach((c, i) => {
                    layers.push(`${(i+1)*3}px ${(i+1)*5}px ${12+i*10}px ${c}60`)
                  })
                  shadows = layers.join(', ')
                } else if (shadowColors.length === 1) {
                  shadows = `0 8px 24px ${shadowColors[0]}40`
                } else {
                  shadows = `0 8px 24px ${base}40`
                }
                previews.push(<div key="shadow" className="h-10 rounded-lg mx-6 mb-2" style={{ background: base, boxShadow: shadows }} title="Shadow" />)
              }

              // Accent preview with pattern
              if (effects.includes('accent') && accentColors.length > 0) {
                const pat = style.accent_pattern || 'dots'
                const s = 12
                const patId = 'prev-accent'
                const shapeFor = (pattern, color, sz) => {
                  const hr = sz / 2
                  switch (pattern) {
                    case 'clover': {
                      const cr = sz * 0.3
                      return <>
                        <ellipse cx={hr - cr*0.3} cy={hr} rx={cr} ry={cr*0.6} fill={color} opacity={0.4}/>
                        <ellipse cx={hr + cr*0.3} cy={hr} rx={cr} ry={cr*0.6} fill={color} opacity={0.4}/>
                        <ellipse cx={hr} cy={hr - cr*0.3} rx={cr*0.6} ry={cr} fill={color} opacity={0.4}/>
                        <ellipse cx={hr} cy={hr + cr*0.3} rx={cr*0.6} ry={cr} fill={color} opacity={0.4}/>
                      </>
                    }
                    case 'hollow': return <circle cx={hr} cy={hr} r={hr-1} fill="none" stroke={color} strokeWidth="1" opacity={0.5}/>
                    case 'coin': {
                      const cr = sz * 0.5
                      return <>
                        <circle cx="0" cy="0" r={cr} fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}/>
                        <circle cx={sz} cy="0" r={cr} fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}/>
                        <circle cx={hr} cy={hr} r={cr} fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}/>
                        <circle cx="0" cy={sz} r={cr} fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}/>
                        <circle cx={sz} cy={sz} r={cr} fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}/>
                      </>
                    }
                    case 'star': {
                      const pts = Array.from({length: 10}, (_, i) => {
                        const a = Math.PI/2 + i * Math.PI/5
                        const rad = i%2===0 ? hr-1 : hr*0.4
                        return `${hr + rad*Math.cos(a)},${hr - rad*Math.sin(a)}`
                      }).join(' ')
                      return <polygon points={pts} fill={color} opacity={0.4}/>
                    }
                    case 'star4': return <polygon points={`${hr},0 ${hr+1.5},${hr-1.5} ${sz},${hr} ${hr+1.5},${hr+1.5} ${hr},${sz} ${hr-1.5},${hr+1.5} 0,${hr} ${hr-1.5},${hr-1.5}`} fill={color} opacity={0.4}/>
                    case 'diamond': return <polygon points={`${hr},0 ${sz},${hr} ${hr},${sz} 0,${hr}`} fill={color} opacity={0.4}/>
                    case 'cross': {
                      const w = Math.max(1, sz/4)
                      return <>
                        <rect x={hr-w} y={1} width={w*2} height={sz-2} fill={color} opacity={0.4}/>
                        <rect x={1} y={hr-w} width={sz-2} height={w*2} fill={color} opacity={0.4}/>
                      </>
                    }
                    case 'heart': {
                      const hhr = sz * 0.25
                      return <>
                        <circle cx={hr-hhr} cy={hr-hhr*0.5} r={hhr} fill={color} opacity={0.4}/>
                        <circle cx={hr+hhr} cy={hr-hhr*0.5} r={hhr} fill={color} opacity={0.4}/>
                        <polygon points={`${hr-hhr*2},${hr} ${hr},${sz} ${hr+hhr*2},${hr}`} fill={color} opacity={0.4}/>
                      </>
                    }
                    case 'wave': return <path d={`M0,${hr} Q${sz/4},${hr-3} ${sz/2},${hr} T${sz},${hr}`} fill="none" stroke={color} strokeWidth="1.5" opacity={0.5}/>
                    default: return <circle cx={hr} cy={hr} r={hr*0.4} fill={color} opacity={0.5}/>
                  }
                }
                // Multi-color accent: wider pattern tile with shapes in different colors
                const patternWidth = s * accentColors.length
                previews.push(
                  <div key="accent" className="h-8 rounded-lg relative overflow-hidden mb-2" style={{ background: base }}>
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <pattern id={patId} width={patternWidth} height={s} patternUnits="userSpaceOnUse">
                        {accentColors.map((col, idx) => (
                          <g key={idx} transform={`translate(${idx * s}, 0)`}>
                            {shapeFor(pat, col, s)}
                          </g>
                        ))}
                      </pattern>
                      <rect width="100%" height="100%" fill={`url(#${patId})`} />
                    </svg>
                  </div>
                )
              }

              if (previews.length === 0) {
                previews.push(<div key="empty" className="h-8 rounded-lg bg-gray-100" />)
              }
              return previews
            })()}
            {/* Color chips summary */}
            {(() => {
              const allEffectColors = Object.entries(ec).flatMap(([eff, cols]) => (cols || []).map(c => ({ eff, c })))
              if (allEffectColors.length === 0) return null
              return (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {allEffectColors.map(({ eff, c }, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} /> {c}
                    </span>
                  ))}
                </div>
              )
            })()}
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
                  if (file.size > MAX_IMAGE_SIZE) {
                    alert(t.imageTooLarge)
                    return
                  }
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
              { value: 'cartoon', emoji: '\u{1F9F8}', desc: '\u6d3b\u6cfc\u53ef\u7231',
                preview: (
                  <div className="w-full h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-50 border-2 border-orange-300 relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-orange-400 border-2 border-white" />
                    <div className="absolute bottom-1 left-2 right-2 space-y-0.5">
                      <div className="h-1 bg-orange-300 rounded-full w-3/4" />
                      <div className="h-1 bg-orange-200 rounded-full w-1/2" />
                    </div>
                    <div className="absolute top-1 right-1 text-[6px]">{'\u2728'}</div>
                  </div>
                ) },
              { value: 'minimal', emoji: '\u{1F33F}', desc: '\u5e72\u51c0\u7b80\u6d01',
                preview: (
                  <div className="w-full h-16 rounded-lg overflow-hidden bg-white border border-gray-200 relative">
                    <div className="absolute top-2 left-2 right-2">
                      <div className="h-0.5 bg-gray-300 w-1/3 mb-1" />
                      <div className="h-0.5 bg-gray-200 w-1/2" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                      <div className="h-0.5 bg-gray-100 rounded w-full" />
                      <div className="h-0.5 bg-gray-100 rounded w-2/3" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
                  </div>
                ) },
              { value: 'artistic', emoji: '\u{1F3A8}', desc: '\u521b\u610f\u4f18\u96c5',
                preview: (
                  <div className="w-full h-16 rounded-lg overflow-hidden relative" style={{ background: 'linear-gradient(160deg, #1a1a2e, #16213e, #0f3460)' }}>
                    <div className="absolute top-2 left-2 right-2">
                      <div className="h-0.5 bg-rose-400 w-1/3 mb-1 opacity-70" />
                      <div className="h-0.5 bg-white w-1/2 opacity-40" />
                    </div>
                    <div className="absolute bottom-1 left-2 right-2">
                      <div className="h-3 rounded bg-white/10" />
                    </div>
                    <div className="absolute top-1 right-1 text-[6px]">{'\u{1F3A8}'}</div>
                  </div>
                ) },
              { value: 'retro', emoji: '\u{1F4E0}', desc: '\u590d\u53e4\u6000\u65e7',
                preview: (
                  <div className="w-full h-16 rounded-none overflow-hidden relative" style={{ background: '#f5f0e0', border: '2px solid #2d2d2d' }}>
                    <div className="h-3 bg-[#2d2d2d] flex items-center px-1">
                      <div className="h-0.5 bg-yellow-400 w-1/3" />
                    </div>
                    <div className="px-1.5 py-1 space-y-0.5">
                      <div className="h-0.5 bg-[#2d2d2d] w-2/3" />
                      <div className="h-0.5 bg-[#2d2d2d]/60 w-1/2" />
                      <div className="h-1.5 mt-1 bg-yellow-400 w-4" style={{ border: '1px solid #2d2d2d' }} />
                    </div>
                  </div>
                ) },
            ].map(s => (
              <button key={s.value} type="button"
                onClick={() => setStyle(prev => ({ ...prev, ui_style: s.value }))}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  style.ui_style === s.value
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-1'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                }`}>
                <div className="mb-2">{s.preview}</div>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{t[s.value]}</div>
                <div className="text-[10px] text-gray-400 mt-1">{s.desc}</div>
                {style.ui_style === s.value && (
                  <div className="mt-2 text-[10px] font-medium text-indigo-500">{'\u2713'} Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Style */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.timelineStyle || 'Timeline Style'}</label>
          <p className="text-[10px] text-gray-400 italic mb-3">{t.timelineStyleHint || 'Choose how work experience is displayed'}</p>
          <div className="flex gap-4">
            <button type="button"
              onClick={() => setStyle(prev => ({ ...prev, timeline_style: 'alternate' }))}
              className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all ${
                style.timeline_style === 'alternate'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
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
              {style.timeline_style === 'alternate' && (
                <div className="mt-1 text-[10px] font-medium text-gray-600">{'\u2713'}</div>
              )}
            </button>
            <button type="button"
              onClick={() => setStyle(prev => ({ ...prev, timeline_style: 'linear' }))}
              className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all ${
                style.timeline_style === 'linear'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-300 ring-offset-1'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}>
              <div className="h-10 mb-2 flex items-center justify-center gap-1">
                <div className="w-1 h-8 bg-gray-300 rounded" />
                <div className="flex flex-col gap-1 items-start">
                  <div className="w-8 h-1.5 bg-gray-300 rounded" />
                  <div className="w-6 h-1 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-800">{t.timelineLinear || 'Linear'}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.timelineLinearDesc || 'Top to bottom'}</div>
              {style.timeline_style === 'linear' && (
                <div className="mt-1 text-[10px] font-medium text-gray-600">{'\u2713'}</div>
              )}
            </button>
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <div>
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-white">{lang === 'zh' ? '\u{1F319} \u6697\u8272\u6a21\u5f0f' : '\u{1F319} Dark Mode'}</p>
              <p className="text-xs text-gray-400 mt-1">{lang === 'zh' ? '\u8bbf\u5ba2\u7cfb\u7edf\u4e3a\u6697\u8272\u6a21\u5f0f\u65f6\u81ea\u52a8\u5207\u6362' : 'Auto-switch when visitor uses dark mode'}</p>
            </div>
            <button type="button" onClick={() => setStyle(prev => ({ ...prev, dark_mode: !prev.dark_mode }))}
              className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ml-4 ${style.dark_mode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${style.dark_mode ? 'translate-x-7' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )

  const handleAIStyleUpdate = (updates) => {
    setStyle(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (resumeData, aiEffects, sectionOrder) => {
    const ec = style.effect_colors
    const stylePayload = {
      ...style,
      primary_color: ec.solid[0] || ec.gradient[0] || ec.splice[0] || '#6366f1',
      primary_colors: ec.solid || [],
      extra_colors: ec.accent || ec.shadow || [],
      section_order: sectionOrder || [],
      dark_mode: style.dark_mode || false,
    }
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'personal',
        resume: resumeData,
        style: stylePayload,
        lang,
        ai_effects: aiEffects || [],
        section_order: sectionOrder || [],
      }),
    })
    if (!response.ok) {
      let errMsg = 'Generation failed'
      try {
        const errData = await response.json()
        if (errData.detail) errMsg = errData.detail
      } catch { /* ignore parse error */ }
      throw new Error(errMsg)
    }
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'personal' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[80px] animate-[pfBreathe_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-40 -right-24 w-[350px] h-[350px] bg-pink-300/20 rounded-full blur-[70px] animate-[pfBreathe_10s_ease-in-out_infinite_3s]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-indigo-300/15 rounded-full blur-[60px] animate-[pfBreathe_7s_ease-in-out_infinite_5s]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-[pfFloat_12s_linear_infinite]"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${10 + (i * 11) % 80}%`,
              top: `${20 + (i * 13) % 60}%`,
              background: i % 2 === 0 ? 'rgba(139,92,246,0.25)' : 'rgba(236,72,153,0.2)',
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + (i % 4) * 3}s`,
            }} />
        ))}

        {/* Morphing abstract blob (graffiti shape-shifting every 5s) */}
        <div className="hidden lg:block absolute top-32 right-8 w-[200px] h-[200px] opacity-[0.12]">
          <div className="w-full h-full animate-[blobMorph_15s_ease-in-out_infinite]" style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899, #f97316)',
            filter: 'blur(1px)',
          }} />
        </div>
        {/* Second smaller blob */}
        <div className="hidden lg:block absolute bottom-48 right-24 w-[120px] h-[120px] opacity-[0.08]">
          <div className="w-full h-full animate-[blobMorph2_12s_ease-in-out_infinite_3s]" style={{
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #d946ef)',
            filter: 'blur(1px)',
          }} />
        </div>
      </div>
      <style>{`
        @keyframes pfBreathe {
          0%, 100% { opacity: 0.6; transform: scale(1) translate(0, 0); }
          33% { opacity: 1; transform: scale(1.1) translate(10px, -10px); }
          66% { opacity: 0.4; transform: scale(0.95) translate(-5px, 8px); }
        }
        @keyframes pfFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -30px) scale(1.2); opacity: 0.5; }
          50% { transform: translate(-10px, -60px) scale(0.8); opacity: 0.2; }
          75% { transform: translate(20px, -40px) scale(1.1); opacity: 0.4; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        }
        @keyframes blobMorph {
          0%, 100% { clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%); transform: rotate(0deg) scale(1); }
          20% { clip-path: polygon(30% 5%, 80% 10%, 100% 45%, 85% 85%, 50% 100%, 15% 80%, 5% 35%); transform: rotate(20deg) scale(1.05); }
          40% { clip-path: polygon(50% 5%, 95% 25%, 90% 70%, 65% 95%, 35% 95%, 5% 70%, 10% 25%); transform: rotate(-15deg) scale(0.95); }
          60% { clip-path: polygon(40% 0%, 85% 15%, 100% 55%, 80% 90%, 45% 100%, 10% 85%, 0% 40%); transform: rotate(10deg) scale(1.08); }
          80% { clip-path: polygon(55% 2%, 92% 30%, 95% 65%, 70% 95%, 30% 98%, 5% 65%, 8% 28%); transform: rotate(-25deg) scale(0.92); }
        }
        @keyframes blobMorph2 {
          0%, 100% { clip-path: circle(40% at 50% 50%); transform: rotate(0deg); }
          25% { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); transform: rotate(90deg); }
          50% { clip-path: polygon(50% 5%, 93% 25%, 93% 75%, 50% 95%, 7% 75%, 7% 25%); transform: rotate(180deg); }
          75% { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); transform: rotate(270deg); }
        }
      `}</style>
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* MetaBalls - organic liquid blobs on right side */}
        <div className="hidden lg:block fixed top-1/4 right-0 w-[300px] h-[400px] pointer-events-none opacity-[0.12] z-0">
          <MetaBalls
            color="#a855f7"
            cursorBallColor="#ec4899"
            speed={0.2}
            ballCount={10}
            animationSize={25}
            clumpFactor={0.8}
            enableMouseInteraction={false}
            enableTransparency={true}
            className="w-full h-full"
          />
        </div>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-200">{'\u{1F3A8}'}</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.personalFormTitle}</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">{t.personalFormDesc}</p>
        </div>
        <ResumeForm mode="personal" onSubmit={handleSubmit} extraFields={extraFields} currentStyle={style} onStyleUpdateFromAI={handleAIStyleUpdate} />
      </main>
    </div>
  )
}

export default PersonalForm
