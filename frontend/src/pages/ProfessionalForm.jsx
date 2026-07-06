import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import ResumeForm from '../components/ResumeForm'

function ProfessionalForm() {
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const handleSubmit = async (resumeData) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'professional', resume: resumeData, lang }),
    })
    if (!response.ok) throw new Error('Generation failed')
    const { html } = await response.json()
    navigate('/preview', { state: { html, mode: 'professional' } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.professionalFormTitle}</h1>
          <p className="text-gray-500">{t.professionalFormDesc}</p>
        </div>
        <ResumeForm mode="professional" onSubmit={handleSubmit} extraFields={null} />
      </main>
    </div>
  )
}

export default ProfessionalForm
