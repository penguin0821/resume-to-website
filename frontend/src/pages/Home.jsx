import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-[#0a0118] relative overflow-hidden">
      {/* === CYBER BACKGROUND LAYERS === */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0f0a2e] to-[#0a0118]" />

        {/* Grid overlay (Bauhaus-inspired) */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Animated glow orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-[breathe_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] animate-[breathe_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px] animate-[breathe_7s_ease-in-out_infinite_4s]" />

        {/* Light beams */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-purple-500/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-blue-500/15 via-transparent to-transparent" />

        {/* Scanning line */}
        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-[scanLine_8s_linear_infinite]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-[particleUp_10s_linear_infinite]"
            style={{
              width: 2 + (i % 3) * 1.5,
              height: 2 + (i % 3) * 1.5,
              left: `${8 + (i * 7.5) % 85}%`,
              bottom: '-5%',
              background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#ec4899' : '#3b82f6',
              opacity: 0.3 + (i % 4) * 0.1,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 5) * 2}s`,
            }} />
        ))}
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300">AI-Powered Website Builder</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  {t.heroTitle.split(' ').slice(0, 2).join(' ')}
                </span>
                <br />
                <span className="text-white">
                  {t.heroTitle.split(' ').slice(2).join(' ')}
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mb-10">
                <div>
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">UI Styles</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">AI</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Effects</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">EN/CN</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Bilingual</div>
                </div>
              </div>
            </div>

            {/* Right: Penguin mascot with cyber effects */}
            <div className="flex-shrink-0 relative">
              {/* Ripple rings (energy field effect from Image 1) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="absolute rounded-full border animate-[ripple_6s_ease-out_infinite]"
                    style={{
                      width: 180 + i * 50,
                      height: 180 + i * 50,
                      borderColor: i % 2 === 0 ? 'rgba(168,85,247,0.15)' : 'rgba(236,72,153,0.1)',
                      animationDelay: `${i * 1.2}s`,
                    }} />
                ))}
              </div>

              {/* Glow behind penguin */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/20 rounded-full blur-[60px] scale-110 animate-[breathe_5s_ease-in-out_infinite]" />

              {/* Penguin image */}
              <img
                src="/images/penguin-logo.png"
                alt="Penguin Mascot"
                className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-[float_6s_ease-in-out_infinite]"
              />

              {/* Floating tech badges (cyberpunk data labels) */}
              <div className="absolute top-4 -right-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-purple-400/30 text-[10px] font-mono text-purple-300 animate-[float_4s_ease-in-out_infinite_0.5s]">
                <span className="text-purple-500">SYS</span> React + Vite
              </div>
              <div className="absolute bottom-12 -left-4 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-pink-400/30 text-[10px] font-mono text-pink-300 animate-[float_5s_ease-in-out_infinite_1s]">
                <span className="text-pink-500">AI</span> Gemini 2.0
              </div>
              <div className="absolute top-1/2 -right-8 px-3 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-lg border border-purple-400/30 text-[10px] font-mono text-purple-300 animate-[float_4.5s_ease-in-out_infinite_0.3s]">
                {'\u2728'} Tailwind CSS
              </div>
              {/* Flickering data readout (bottom-right) */}
              <div className="absolute -bottom-2 right-2 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded border border-green-500/30 text-[9px] font-mono text-green-400/80 animate-[flicker_4s_steps(1)_infinite]">
                STATUS: ONLINE {'\u25CF'}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Cards Section */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal & Creative Card */}
            <button
              onClick={() => navigate('/form/personal')}
              className="group relative text-left cursor-pointer"
            >
              {/* Card glow on hover */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-purple-500/50 via-pink-500/30 to-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] group-hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-purple-500/20">
                  {'\u{1F3A8}'}
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                  {t.personalTitle}
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  {t.personalDesc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium">{t.customColors}</span>
                  <span className="px-3 py-1.5 bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded-full text-xs font-medium">{t.artistic}</span>
                  <span className="px-3 py-1.5 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-full text-xs font-medium">{t.cartoon}</span>
                  <span className="px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-medium">{t.retro}</span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{t.getStarted}</span>
                  <span className="text-lg">{'\u2192'}</span>
                </div>
              </div>
            </button>

            {/* Professional & Elite Card */}
            <button
              onClick={() => navigate('/form/professional')}
              className="group relative text-left cursor-pointer"
            >
              {/* Card glow on hover */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500/50 via-cyan-500/30 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] group-hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-500/20">
                  {'\u{1F4BC}'}
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                  {t.professionalTitle}
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  {t.professionalDesc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-xs font-medium">{t.minimal}</span>
                  <span className="px-3 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full text-xs font-medium">{t.elegant}</span>
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-medium">{t.corporate}</span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{t.getStarted}</span>
                  <span className="text-lg">{'\u2192'}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Feature strip */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '\u{26A1}', label: 'Fast', desc: 'Seconds to generate' },
              { icon: '\u{1F30D}', label: 'Bilingual', desc: 'EN & CN support' },
              { icon: '\u{2728}', label: 'AI Effects', desc: 'Gemini powered' },
              { icon: '\u{1F680}', label: 'Deploy', desc: 'Netlify & GitHub' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{f.label}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes scanLine {
          0% { top: -2%; }
          100% { top: 102%; }
        }
        @keyframes particleUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          30% { opacity: 0.4; }
          50% { opacity: 1; }
          70% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

export default Home
