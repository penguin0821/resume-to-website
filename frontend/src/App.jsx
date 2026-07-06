import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PersonalForm from './pages/PersonalForm'
import ProfessionalForm from './pages/ProfessionalForm'
import Preview from './pages/Preview'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form/personal" element={<PersonalForm />} />
      <Route path="/form/professional" element={<ProfessionalForm />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  )
}

export default App
