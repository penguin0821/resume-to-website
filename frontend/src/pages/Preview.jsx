import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'

function Preview() {
  const { t } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const { html, mode } = location.state || {}

  const title = mode === 'personal' ? t.previewPersonal : t.previewProfessional

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-site-${mode || 'personal'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!html) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500 mb-4">{t.noPreview}</p>
          <Link to="/" className="text-indigo-600 hover:underline">{t.goBackHome}</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">{t.edit}</button>
            <button onClick={downloadHtml} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">{t.downloadHtml}</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe srcDoc={html} className="w-full h-[80vh] border-0" title="Preview" sandbox="allow-scripts" />
        </div>
      </main>
    </div>
  )
}

export default Preview
