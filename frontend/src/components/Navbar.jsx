import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../LanguageContext'

function Navbar() {
  const location = useLocation()
  const { t, lang, toggleLang } = useLang()
  const isHome = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all ${
      isHome
        ? 'bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06]'
        : 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/images/penguin-logo.png" alt="logo" className="w-9 h-9 rounded-xl object-cover" />
          <span className={`text-lg font-bold transition-colors ${
            isHome ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-indigo-600'
          }`}>
            {t.brand}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              isHome
                ? 'border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {lang === 'zh' ? 'EN' : '\u4e2d\u6587'}
          </button>
          {!isHome && (
            <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              {t.backToHome}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
