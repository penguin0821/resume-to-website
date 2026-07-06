import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../LanguageContext'

function Navbar() {
  const location = useLocation()
  const { t, lang, toggleLang } = useLang()
  const isHome = location.pathname === '/'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          {t.brand}
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="px-4 py-1.5 text-sm font-semibold rounded-full border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors"
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
