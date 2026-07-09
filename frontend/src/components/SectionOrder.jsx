import { useState, useRef } from 'react'
import { useLang } from '../LanguageContext'

const SECTIONS = [
  { key: 'bio', icon: '\u{1F4DD}' },
  { key: 'education', icon: '\u{1F393}' },
  { key: 'work', icon: '\u{1F4BC}' },
  { key: 'skills', icon: '\u{1F6E0}' },
  { key: 'hobbies', icon: '\u{2764}' },
]

function SectionOrder({ value, onChange }) {
  const { t } = useLang()
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const order = value && value.length > 0 ? value : SECTIONS.map(s => s.key)

  const sectionLabels = {
    bio: t.sectionBio || 'About Me',
    education: t.sectionEducation || 'Education',
    work: t.sectionWork || 'Work Experience',
    skills: t.sectionSkills || 'Skills',
    hobbies: t.sectionHobbies || 'Hobbies',
  }

  const handleDragStart = (index) => {
    setDragIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const newOrder = [...order]
    const [moved] = newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, moved)
    onChange(newOrder)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const moveUp = (index) => {
    if (index === 0) return
    const newOrder = [...order]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    onChange(newOrder)
  }

  const moveDown = (index) => {
    if (index === order.length - 1) return
    const newOrder = [...order]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    onChange(newOrder)
  }

  return (
    <section>
      <h2 className="text-lg font-extrabold text-gray-800 mb-2 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500 inline-block" />
        {'\u{1F504}'} {t.sectionOrder || 'Section Order'}
      </h2>
      <p className="text-xs text-gray-400 mb-4 ml-3">{t.sectionOrderHint || 'Drag sections to reorder how they appear on your website'}</p>
      <div className="space-y-2">
        {order.map((key, index) => {
          const section = SECTIONS.find(s => s.key === key) || { key, icon: '\u{25A0}' }
          const isDragging = dragIndex === index
          const isDragOver = dragOverIndex === index && dragIndex !== index
          return (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                isDragging ? 'opacity-50 border-dashed border-indigo-300 bg-indigo-50 scale-[0.98]' :
                isDragOver ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' :
                'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <span className="text-gray-300 text-lg">{'\u2630'}</span>
              <span className="text-lg">{section.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-700">{sectionLabels[key] || key}</span>
              <span className="text-xs text-gray-400 w-5 text-center">{index + 1}</span>
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={`w-5 h-5 flex items-center justify-center text-xs rounded ${index === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>&#9650;</button>
                <button type="button" onClick={() => moveDown(index)}
                  disabled={index === order.length - 1}
                  className={`w-5 h-5 flex items-center justify-center text-xs rounded ${index === order.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>&#9660;</button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SectionOrder
