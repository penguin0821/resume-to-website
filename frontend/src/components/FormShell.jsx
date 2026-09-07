import { useState, useEffect, useRef } from 'react'
import { useLang } from '../LanguageContext'

/**
 * FormShell — product-grade wrapper shared by both form pages.
 *
 * Provides:
 *  - a sticky top bar with completion progress + quick section navigation
 *  - a desktop live-preview panel (sticky iframe) that can be toggled
 *
 * The actual form fields are passed as `children`.
 */
const SECTIONS = [
  { id: 'sec-basic', zh: '基本信息', en: 'Basics' },
  { id: 'sec-style', zh: '风格设计', en: 'Style' },
  { id: 'sec-work', zh: '工作经历', en: 'Work' },
  { id: 'sec-edu', zh: '教育背景', en: 'Education' },
  { id: 'sec-skills', zh: '技能', en: 'Skills' },
  { id: 'sec-hobbies', zh: '爱好', en: 'Hobbies' },
]

export default function FormShell({
  children,
  previewHtml,
  previewLoading,
  progress = 0,
  theme = 'personal',
  generatePreview,
}) {
  const { lang } = useLang()
  const isPersonal = theme === 'personal'
  const [previewOn, setPreviewOn] = useState(true)
  const [device, setDevice] = useState('desktop')
  const [activeSec, setActiveSec] = useState('sec-basic')
  const rafRef = useRef(null)

  // Scrollspy: highlight the section currently in view
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        let current = SECTIONS[0].id
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id)
          if (el && el.getBoundingClientRect().top <= 140) current = s.id
        }
        setActiveSec(current)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const jump = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const accentText = isPersonal ? 'text-orange-600' : 'text-slate-800'
  const accentBar = isPersonal
    ? 'bg-gradient-to-r from-orange-500 to-pink-500'
    : 'bg-gradient-to-r from-slate-700 to-slate-900'
  const chipActive = isPersonal
    ? 'bg-orange-500 text-white border-orange-500'
    : 'bg-slate-800 text-white border-slate-800'
  const chipIdle = 'bg-white/70 text-stone-500 border-stone-200 hover:border-stone-300'

  return (
    <div className="relative">
      {/* Sticky command bar */}
      <div className="sticky top-0 z-30 -mx-2 mb-8">
        <div className="backdrop-blur-xl bg-white/75 border border-stone-200/70 rounded-2xl shadow-sm px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* progress */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${accentBar}`} style={{ width: `${Math.round(progress)}%` }} />
              </div>
              <span className={`text-[11px] font-bold tabular-nums ${accentText}`}>{Math.round(progress)}%</span>
            </div>

            {/* section quick-nav */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto flex-1 min-w-0 scrollbar-none">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jump(s.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap transition-all ${activeSec === s.id ? chipActive : chipIdle}`}
                >
                  {lang === 'zh' ? s.zh : s.en}
                </button>
              ))}
            </nav>

            {/* preview toggle (desktop only) */}
            {generatePreview && (
              <button
                type="button"
                onClick={() => setPreviewOn(v => !v)}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex-shrink-0 ${previewOn ? chipActive : chipIdle}`}
                title={lang === 'zh' ? '实时预览' : 'Live preview'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${previewOn ? 'bg-white' : 'bg-stone-400'}`} />
                {lang === 'zh' ? '实时预览' : 'Live Preview'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two-column: form + sticky live preview */}
      <div className={`grid gap-8 items-start ${previewOn && generatePreview ? 'lg:grid-cols-[minmax(0,1fr)_minmax(360px,40%)]' : 'grid-cols-1'}`}>
        <div className="min-w-0">{children}</div>

        {generatePreview && (
          <div className={`hidden lg:block sticky top-20 ${previewOn ? '' : 'lg:hidden'}`}>
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
                  {lang === 'zh' ? '实时预览' : 'Live Preview'}
                  {previewLoading && <span className="ml-2 normal-case tracking-normal text-stone-400">{lang === 'zh' ? '生成中…' : 'rendering…'}</span>}
                </span>
                <div className="flex items-center gap-1">
                  {['desktop', 'mobile'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDevice(d)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${device === d ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      {d === 'desktop' ? (lang === 'zh' ? '桌面' : 'Desktop') : (lang === 'zh' ? '移动' : 'Mobile')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-stone-100/70 flex justify-center" style={{ height: '70vh' }}>
                <div
                  className="bg-white rounded-lg shadow-inner overflow-hidden transition-all duration-300"
                  style={{ width: device === 'mobile' ? '375px' : '100%', height: '100%' }}
                >
                  {previewHtml ? (
                    <iframe
                      title="live-preview"
                      srcDoc={previewHtml}
                      sandbox="allow-scripts"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
                      {lang === 'zh' ? '填写姓名后开始预览' : 'Type a name to preview'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
