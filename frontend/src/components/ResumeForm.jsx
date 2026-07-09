import { useState } from 'react'
import { useLang } from '../LanguageContext'
import SectionOrder from './SectionOrder'
import AIChatPanel from './AIChatPanel'

function ResumeForm({ mode, onSubmit, extraFields, currentStyle, onStyleUpdateFromAI }) {
  const { t, lang } = useLang()
  const [showBilingual, setShowBilingual] = useState(false)
  const [resume, setResume] = useState({
    name: '', title: '', email: '', phone: '', bio: '', avatar_url: '',
    work_experiences: [{ company: '', position: '', duration: '', description: '', company_cn: '', position_cn: '', duration_cn: '', description_cn: '' }],
    educations: [{ school: '', major: '', duration: '', school_cn: '', major_cn: '', duration_cn: '', school_logo: '' }],
    skills: [], hobbies: [],
    name_cn: '', title_cn: '', bio_cn: '', skills_cn: [], hobbies_cn: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [skillCnInput, setSkillCnInput] = useState('')
  const [hobbyInput, setHobbyInput] = useState('')
  const [hobbyCnInput, setHobbyCnInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // AI Effects state
  const [aiEffects, setAiEffects] = useState([])
  const [sectionOrder, setSectionOrder] = useState([])

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
  const addEdu = () => setResume(prev => ({ ...prev, educations: [...prev.educations, { school: '', major: '', duration: '', school_cn: '', major_cn: '', duration_cn: '', school_logo: '' }] }))
  const removeEdu = (index) => setResume(prev => ({ ...prev, educations: prev.educations.filter((_, i) => i !== index) }))

  const addSkill = () => { if (skillInput.trim()) { setResume(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] })); setSkillInput('') } }
  const addSkillCn = () => { if (skillCnInput.trim()) { setResume(prev => ({ ...prev, skills_cn: [...prev.skills_cn, skillCnInput.trim()] })); setSkillCnInput('') } }
  const removeSkill = (index) => setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  const removeSkillCn = (index) => setResume(prev => ({ ...prev, skills_cn: prev.skills_cn.filter((_, i) => i !== index) }))

  const addHobby = () => { if (hobbyInput.trim()) { setResume(prev => ({ ...prev, hobbies: [...prev.hobbies, hobbyInput.trim()] })); setHobbyInput('') } }
  const addHobbyCn = () => { if (hobbyCnInput.trim()) { setResume(prev => ({ ...prev, hobbies_cn: [...prev.hobbies_cn, hobbyCnInput.trim()] })); setHobbyCnInput('') } }
  const removeHobby = (index) => setResume(prev => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }))
  const removeHobbyCn = (index) => setResume(prev => ({ ...prev, hobbies_cn: prev.hobbies_cn.filter((_, i) => i !== index) }))

  const handleAIStyleUpdate = (updates) => {
    onStyleUpdateFromAI?.(updates)
  }

  const handleAIEffectAdd = (effect) => {
    setAiEffects(prev => [...prev, effect])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    try {
      await onSubmit(resume, aiEffects, sectionOrder)
    } catch (err) {
      setSubmitError(err.message || 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isPersonal = mode === 'personal'

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Bilingual Toggle */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-amber-800">{t.bilingualTitle}</p>
          <p className="text-xs text-amber-600 mt-1">{t.bilingualDesc}</p>
        </div>
        <button type="button" onClick={() => setShowBilingual(!showBilingual)}
          className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ml-4 ${showBilingual ? 'bg-amber-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${showBilingual ? 'translate-x-7' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Basic Info */}
      <section>
        <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
          {t.basicInfo}
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.name} {t.required}</label>
            <input type="text" required value={resume.name} onChange={e => updateField('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" placeholder={t.namePh} />
          </div>
          {showBilingual && (
          <div>
            <label className="block text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">{t.nameCn}</label>
            <input type="text" value={resume.name_cn} onChange={e => updateField('name_cn', e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50/50 focus:bg-white transition-all" placeholder={t.nameCnPh} />
          </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.titlePosition} {t.required}</label>
            <input type="text" required value={resume.title} onChange={e => updateField('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" placeholder={t.titlePh} />
          </div>
          {showBilingual && (
          <div>
            <label className="block text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">{t.titleCn}</label>
            <input type="text" value={resume.title_cn} onChange={e => updateField('title_cn', e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50/50 focus:bg-white transition-all" placeholder={t.titleCnPh} />
          </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.email}</label>
            <input type="email" value={resume.email} onChange={e => updateField('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" placeholder={t.emailPh} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.phone}</label>
            <input type="text" value={resume.phone} onChange={e => updateField('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" placeholder={t.phonePh} />
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{t.avatarUrl}</label>
          <p className="text-[10px] text-gray-400 italic mb-2">{isPersonal ? t.avatarHintPersonal : t.avatarHintProfessional}</p>
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
                className="inline-block w-48 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="https://..." />
              {resume.avatar_url && (
                <button type="button" onClick={() => updateField('avatar_url', '')} className="ml-2 text-red-400 hover:text-red-600 text-xs">{t.clearImage}</button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.aboutMe}</label>
          <textarea value={resume.bio} rows={3} onChange={e => updateField('bio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none" placeholder={t.bioPh} />
        </div>
        {showBilingual && (
        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">{t.bioCn}</label>
          <textarea value={resume.bio_cn} rows={3} onChange={e => updateField('bio_cn', e.target.value)}
            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50/50 focus:bg-white resize-none transition-all" placeholder={t.bioCnPh} />
        </div>
        )}
      </section>

      {extraFields}

      {/* Section Order */}
      <SectionOrder value={sectionOrder} onChange={setSectionOrder} />

      {/* Work Experience */}
      <section>
        <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
          {t.workExperience}
        </h2>
        {resume.work_experiences.map((exp, i) => (
          <div key={i} className="bg-gray-50/80 rounded-2xl p-6 mb-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">#{i + 1}</span>
              {resume.work_experiences.length > 1 && (
                <button type="button" onClick={() => removeWork(i)} className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">{t.remove}</button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.company}</label>
                <input type="text" placeholder={t.company} value={exp.company} onChange={e => updateWork(i, 'company', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.position}</label>
                <input type="text" placeholder={t.position} value={exp.position} onChange={e => updateWork(i, 'position', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.duration}</label>
                <input type="text" placeholder={t.durationPh} value={exp.duration} onChange={e => updateWork(i, 'duration', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.description}</label>
                <textarea placeholder={t.descPh} value={exp.description} rows={2} onChange={e => updateWork(i, 'description', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white resize-none" />
              </div>
            </div>
            {showBilingual && (
            <div className="mt-5 pt-4 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-600 mb-3">{lang === 'zh' ? '中文翻译' : 'Chinese Translation'}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.companyCn}</label>
                  <input type="text" placeholder={t.companyCn} value={exp.company_cn} onChange={e => updateWork(i, 'company_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.positionCn}</label>
                  <input type="text" placeholder={t.positionCn} value={exp.position_cn} onChange={e => updateWork(i, 'position_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.durationCn}</label>
                  <input type="text" placeholder={t.durationCn} value={exp.duration_cn} onChange={e => updateWork(i, 'duration_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.descCn}</label>
                  <textarea placeholder={t.descCn} value={exp.description_cn} rows={2} onChange={e => updateWork(i, 'description_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-amber-50/50 transition-all" />
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
        <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
          {t.education}
        </h2>
        {resume.educations.map((edu, i) => (
          <div key={i} className="bg-gray-50/80 rounded-2xl p-6 mb-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">#{i + 1}</span>
              {resume.educations.length > 1 && (
                <button type="button" onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">{t.remove}</button>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.school}</label>
                <input type="text" placeholder={t.school} value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.major}</label>
                <input type="text" placeholder={t.major} value={edu.major} onChange={e => updateEdu(i, 'major', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t.duration}</label>
                <input type="text" placeholder={t.eduDurationPh} value={edu.duration} onChange={e => updateEdu(i, 'duration', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white" />
              </div>
            </div>
            {/* School Logo Upload */}
            <div className="mt-3 flex items-center gap-3">
              {edu.school_logo && (
                <img src={edu.school_logo} alt="school logo" className="w-10 h-10 object-contain rounded-lg border border-gray-200" />
              )}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-xs font-medium">
                {'\u{1F393}'} {t.schoolLogo || 'School Logo'}
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = ev => updateEdu(i, 'school_logo', ev.target.result)
                    reader.readAsDataURL(file)
                  }
                }} />
              </label>
              {edu.school_logo && (
                <button type="button" onClick={() => updateEdu(i, 'school_logo', '')} className="text-red-400 hover:text-red-600 text-xs">{t.clearImage || 'Clear'}</button>
              )}
              <span className="text-[10px] text-gray-400">{t.schoolLogoHint || '(Optional)'}</span>
            </div>
            {showBilingual && (
            <div className="mt-5 pt-4 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-600 mb-3">{lang === 'zh' ? '中文翻译' : 'Chinese Translation'}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.schoolCn}</label>
                  <input type="text" placeholder={t.schoolCn} value={edu.school_cn} onChange={e => updateEdu(i, 'school_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.majorCn}</label>
                  <input type="text" placeholder={t.majorCn} value={edu.major_cn} onChange={e => updateEdu(i, 'major_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">{t.eduDurationCn}</label>
                  <input type="text" placeholder={t.eduDurationCn} value={edu.duration_cn} onChange={e => updateEdu(i, 'duration_cn', e.target.value)} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 transition-all" />
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
        <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
          {t.skills}
        </h2>
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
        <h2 className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
          {t.hobbies}
        </h2>
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

      {/* AI Design Assistant */}
      <AIChatPanel
        mode={mode}
        currentStyle={currentStyle}
        onStyleUpdate={handleAIStyleUpdate}
        onEffectAdd={handleAIEffectAdd}
      />

      {/* Active effects list */}
      {aiEffects.length > 0 && (
        <div className="space-y-2">
          {aiEffects.map((effect, i) => (
            <div key={effect.id || i} className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
              <span className="text-sm text-purple-700">{'\u2728'} {effect.description}</span>
              <button type="button" onClick={() => setAiEffects(prev => prev.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-600 text-xs ml-2">{t.removeEffect || 'Remove'}</button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {'\u26A0\uFE0F'} {submitError}
          <button type="button" onClick={() => setSubmitError('')} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}

      {/* Submit */}
      <div className="pt-8">
        <button type="submit" disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : isPersonal ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-[0.99]' : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black hover:shadow-lg active:scale-[0.99]'}`}>
          {loading ? t.generating : isPersonal ? t.generatePersonal : t.generateProfessional}
        </button>
      </div>
    </form>
  )
}

export default ResumeForm
