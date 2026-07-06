import { useState } from 'react'
import { useLang } from '../LanguageContext'

function ResumeForm({ mode, onSubmit, extraFields }) {
  const { t, lang } = useLang()
  const [showBilingual, setShowBilingual] = useState(false)
  const [resume, setResume] = useState({
    name: '', title: '', email: '', phone: '', bio: '', avatar_url: '',
    work_experiences: [{ company: '', position: '', duration: '', description: '', company_cn: '', position_cn: '', duration_cn: '', description_cn: '' }],
    educations: [{ school: '', major: '', duration: '', school_cn: '', major_cn: '', duration_cn: '' }],
    skills: [], hobbies: [],
    name_cn: '', title_cn: '', bio_cn: '', skills_cn: [], hobbies_cn: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [skillCnInput, setSkillCnInput] = useState('')
  const [hobbyInput, setHobbyInput] = useState('')
  const [hobbyCnInput, setHobbyCnInput] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => setResume(prev => ({ ...prev, [field]: value }))

  const updateWork = (index, field, value) => {
    const updated = [...resume.work_experiences]
    updated[index] = { ...updated[index], [field]: value }
    setResume(prev => ({ ...prev, work_experiences: updated }))
  }
  const addWork = () => setResume(prev => ({ ...prev, work_experiences: [...prev.work_experiences, { company: '', position: '', duration: '', description: '', company_cn: '', position_cn: '', duration_cn: '', description_cn: '' }] }))
  const removeWork = (index) => setResume(prev => ({ ...prev, work_experiences: prev.work_experiences.filter((_, i) => i !== index) }))

  const updateEdu = (index, field, value) => {
    const updated = [...resume.educations]
    updated[index] = { ...updated[index], [field]: value }
    setResume(prev => ({ ...prev, educations: updated }))
  }
  const addEdu = () => setResume(prev => ({ ...prev, educations: [...prev.educations, { school: '', major: '', duration: '', school_cn: '', major_cn: '', duration_cn: '' }] }))
  const removeEdu = (index) => setResume(prev => ({ ...prev, educations: prev.educations.filter((_, i) => i !== index) }))

  const addSkill = () => { if (skillInput.trim()) { setResume(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] })); setSkillInput('') } }
  const addSkillCn = () => { if (skillCnInput.trim()) { setResume(prev => ({ ...prev, skills_cn: [...prev.skills_cn, skillCnInput.trim()] })); setSkillCnInput('') } }
  const removeSkill = (index) => setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  const removeSkillCn = (index) => setResume(prev => ({ ...prev, skills_cn: prev.skills_cn.filter((_, i) => i !== index) }))

  const addHobby = () => { if (hobbyInput.trim()) { setResume(prev => ({ ...prev, hobbies: [...prev.hobbies, hobbyInput.trim()] })); setHobbyInput('') } }
  const addHobbyCn = () => { if (hobbyCnInput.trim()) { setResume(prev => ({ ...prev, hobbies_cn: [...prev.hobbies_cn, hobbyCnInput.trim()] })); setHobbyCnInput('') } }
  const removeHobby = (index) => setResume(prev => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }))
  const removeHobbyCn = (index) => setResume(prev => ({ ...prev, hobbies_cn: prev.hobbies_cn.filter((_, i) => i !== index) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await onSubmit(resume) }
    finally { setLoading(false) }
  }

  const isPersonal = mode === 'personal'

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Bilingual Toggle */}
      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-amber-800">{t.bilingualTitle}</p>
          <p className="text-xs text-amber-600 mt-0.5">{t.bilingualDesc}</p>
        </div>
        <button type="button" onClick={() => setShowBilingual(!showBilingual)}
          className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ml-4 ${showBilingual ? 'bg-amber-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${showBilingual ? 'translate-x-7' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Basic Info */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.basicInfo}</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name} {t.required}</label>
            <input type="text" required value={resume.name} onChange={e => updateField('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder={t.namePh} />
          </div>
          {showBilingual && (
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1.5">{t.nameCn}</label>
            <input type="text" value={resume.name_cn} onChange={e => updateField('name_cn', e.target.value)}
              className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50" placeholder={t.nameCnPh} />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.titlePosition} {t.required}</label>
            <input type="text" required value={resume.title} onChange={e => updateField('title', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder={t.titlePh} />
          </div>
          {showBilingual && (
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1.5">{t.titleCn}</label>
            <input type="text" value={resume.title_cn} onChange={e => updateField('title_cn', e.target.value)}
              className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50" placeholder={t.titleCnPh} />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
            <input type="email" value={resume.email} onChange={e => updateField('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder={t.emailPh} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.phone}</label>
            <input type="text" value={resume.phone} onChange={e => updateField('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder={t.phonePh} />
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.avatarUrl}</label>
          <div className="flex items-center gap-4">
            {resume.avatar_url && (
              <img src={resume.avatar_url} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
            )}
            <div className="flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors text-sm font-medium">
                {'\u{1F4F7}'} {t.uploadAvatar}
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = ev => updateField('avatar_url', ev.target.result)
                    reader.readAsDataURL(file)
                  }
                }} />
              </label>
              <span className="text-xs text-gray-400 mx-2">{t.orEnterUrl}</span>
              <input type="url" value={resume.avatar_url?.startsWith('data:') ? '' : resume.avatar_url}
                onChange={e => updateField('avatar_url', e.target.value)}
                className="inline-block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
              {resume.avatar_url && (
                <button type="button" onClick={() => updateField('avatar_url', '')} className="ml-2 text-red-400 hover:text-red-600 text-xs">{t.clearImage}</button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.aboutMe}</label>
          <textarea value={resume.bio} rows={3} onChange={e => updateField('bio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" placeholder={t.bioPh} />
        </div>
        {showBilingual && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-amber-700 mb-1.5">{t.bioCn}</label>
          <textarea value={resume.bio_cn} rows={3} onChange={e => updateField('bio_cn', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none bg-amber-50" placeholder={t.bioCnPh} />
        </div>
        )}
      </section>

      {extraFields}

      {/* Work Experience */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.workExperience}</h2>
        {resume.work_experiences.map((exp, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">#{i + 1}</span>
              {resume.work_experiences.length > 1 && (
                <button type="button" onClick={() => removeWork(i)} className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">{t.remove}</button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.company}</label>
                <input type="text" placeholder={t.company} value={exp.company} onChange={e => updateWork(i, 'company', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.position}</label>
                <input type="text" placeholder={t.position} value={exp.position} onChange={e => updateWork(i, 'position', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">{t.duration}</label>
                <input type="text" placeholder={t.durationPh} value={exp.duration} onChange={e => updateWork(i, 'duration', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">{t.description}</label>
                <textarea placeholder={t.descPh} value={exp.description} rows={2} onChange={e => updateWork(i, 'description', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
            {showBilingual && (
            <div className="mt-5 pt-4 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-600 mb-3">{lang === 'zh' ? '中文翻译' : 'Chinese Translation'}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-amber-500 mb-1">{t.companyCn}</label>
                  <input type="text" placeholder={t.companyCn} value={exp.company_cn} onChange={e => updateWork(i, 'company_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
                <div>
                  <label className="block text-xs text-amber-500 mb-1">{t.positionCn}</label>
                  <input type="text" placeholder={t.positionCn} value={exp.position_cn} onChange={e => updateWork(i, 'position_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-amber-500 mb-1">{t.durationCn}</label>
                  <input type="text" placeholder={t.durationCn} value={exp.duration_cn} onChange={e => updateWork(i, 'duration_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-amber-500 mb-1">{t.descCn}</label>
                  <textarea placeholder={t.descCn} value={exp.description_cn} rows={2} onChange={e => updateWork(i, 'description_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-amber-50" />
                </div>
              </div>
            </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addWork} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">{t.addWork}</button>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.education}</h2>
        {resume.educations.map((edu, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">#{i + 1}</span>
              {resume.educations.length > 1 && (
                <button type="button" onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">{t.remove}</button>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.school}</label>
                <input type="text" placeholder={t.school} value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.major}</label>
                <input type="text" placeholder={t.major} value={edu.major} onChange={e => updateEdu(i, 'major', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.duration}</label>
                <input type="text" placeholder={t.eduDurationPh} value={edu.duration} onChange={e => updateEdu(i, 'duration', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            {showBilingual && (
            <div className="mt-5 pt-4 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-600 mb-3">{lang === 'zh' ? '中文翻译' : 'Chinese Translation'}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-amber-500 mb-1">{t.schoolCn}</label>
                  <input type="text" placeholder={t.schoolCn} value={edu.school_cn} onChange={e => updateEdu(i, 'school_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
                <div>
                  <label className="block text-xs text-amber-500 mb-1">{t.majorCn}</label>
                  <input type="text" placeholder={t.majorCn} value={edu.major_cn} onChange={e => updateEdu(i, 'major_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
                <div>
                  <label className="block text-xs text-amber-500 mb-1">{t.eduDurationCn}</label>
                  <input type="text" placeholder={t.eduDurationCn} value={edu.duration_cn} onChange={e => updateEdu(i, 'duration_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
                </div>
              </div>
            </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addEdu} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">{t.addEdu}</button>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.skills}</h2>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[8px]">
          {resume.skills.map((skill, i) => (
            <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${isPersonal ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
              {skill}<button type="button" onClick={() => removeSkill(i)} className="ml-2 text-gray-400 hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder={t.skillPh}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="button" onClick={addSkill} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">{t.add}</button>
        </div>
        {showBilingual && (
        <div className="mt-5 pt-4 border-t border-amber-200">
          <p className="text-xs font-semibold text-amber-600 mb-2">{t.chineseSkills}</p>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[8px]">
            {resume.skills_cn.map((skill, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-700">
                {skill}<button type="button" onClick={() => removeSkillCn(i)} className="ml-2 text-amber-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skillCnInput} onChange={e => setSkillCnInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkillCn())} placeholder={t.skillCnPh}
              className="flex-1 px-4 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
            <button type="button" onClick={addSkillCn} className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium">{t.add}</button>
          </div>
        </div>
        )}
      </section>

      {/* Hobbies */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">{t.hobbies}</h2>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[8px]">
          {resume.hobbies.map((hobby, i) => (
            <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${isPersonal ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'}`}>
              {hobby}<button type="button" onClick={() => removeHobby(i)} className="ml-2 text-gray-400 hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={hobbyInput} onChange={e => setHobbyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHobby())} placeholder={t.hobbyPh}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="button" onClick={addHobby} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">{t.add}</button>
        </div>
        {showBilingual && (
        <div className="mt-5 pt-4 border-t border-amber-200">
          <p className="text-xs font-semibold text-amber-600 mb-2">{t.chineseHobbies}</p>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[8px]">
            {resume.hobbies_cn.map((hobby, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-700">
                {hobby}<button type="button" onClick={() => removeHobbyCn(i)} className="ml-2 text-amber-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={hobbyCnInput} onChange={e => setHobbyCnInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHobbyCn())} placeholder={t.hobbyCnPh}
              className="flex-1 px-4 py-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50" />
            <button type="button" onClick={addHobbyCn} className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium">{t.add}</button>
          </div>
        </div>
        )}
      </section>

      {/* Submit */}
      <div className="pt-6">
        <button type="submit" disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : isPersonal ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black'}`}>
          {loading ? t.generating : isPersonal ? t.generatePersonal : t.generateProfessional}
        </button>
      </div>
    </form>
  )
}

export default ResumeForm
