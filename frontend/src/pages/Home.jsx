import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t.heroTitle}</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t.heroSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/form/personal')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-400 text-left cursor-pointer"
          >
            <div className="text-5xl mb-4">{'\u{1F3A8}'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{t.personalTitle}</h2>
            <p className="text-gray-500 mb-4">{t.personalDesc}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">{t.customColors}</span>
              <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium">{t.artistic}</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">{t.cartoon}</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">{t.retro}</span>
            </div>
            <div className="mt-6 text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">{t.getStarted}</div>
          </button>

          <button
            onClick={() => navigate('/form/professional')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-800 text-left cursor-pointer"
          >
            <div className="text-5xl mb-4">{'\u{1F4BC}'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">{t.professionalTitle}</h2>
            <p className="text-gray-500 mb-4">{t.professionalDesc}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{t.minimal}</span>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">{t.elegant}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{t.corporate}</span>
            </div>
            <div className="mt-6 text-gray-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">{t.getStarted}</div>
          </button>
        </div>
      </main>
    </div>
  )
}

export default Home
