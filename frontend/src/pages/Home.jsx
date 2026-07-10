import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import Orb from '../components/reactbits/OrbLazy'
import MagicRings from '../components/reactbits/MagicRingsLazy'

function Home() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [burstKey, setBurstKey] = useState(0)
  const [bursting, setBursting] = useState(false)
  const triggerBurst = useCallback((e) => {
    setBurstKey(k => k + 1)
    setBursting(true)
    setTimeout(() => setBursting(false), 800)
  }, [])

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

      {/* Cyber Energy Core v3 — WebGL Orb + MagicRings */}
      <div className="hidden lg:block absolute left-4 bottom-8 w-[260px] h-[260px] z-[15]">
        {/* MagicRings - expanding concentric rings (pointer-events-none so clicks pass through) */}
        <div className="absolute inset-0 pointer-events-none">
          <MagicRings
            color="#a855f7"
            colorTwo="#ec4899"
            speed={0.8}
            ringCount={5}
            attenuation={8}
            lineThickness={2.5}
            baseRadius={0.25}
            radiusStep={0.07}
            scaleRate={0.15}
            opacity={0.9}
            noiseAmount={0.06}
            clickBurst={false}
            hoverScale={1.2}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Orb - noise-distorted glowing sphere */}
        <div className="absolute inset-[50px] pointer-events-none">
          <Orb
            hue={0}
            hoverIntensity={0.3}
            rotateOnHover={true}
            backgroundColor="#0a0118"
            className="w-[160px] h-[160px]"
          />
        </div>
        {/* Data labels */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-purple-500/20 text-[8px] font-mono text-purple-400/80 whitespace-nowrap animate-[flicker_3s_steps(1)_infinite] pointer-events-none">
          CORE ENERGY
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-white/10 text-[9px] font-mono text-gray-400/80 whitespace-nowrap pointer-events-none">
          click to burst ✨
        </div>
        {/* Transparent click capture layer - on top of all WebGL elements */}
        <div
          className="absolute inset-0 cursor-pointer rounded-full"
          onPointerDown={triggerBurst}
        />
      </div>

      {/* Full-screen burst overlay - outside core container to avoid WebGL compositing */}
      {bursting && (
        <div key={`burst-${burstKey}`} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
          {/* Bright central flash */}
          <div className="absolute inset-0 animate-[burstFlash_0.6s_ease-out_forwards]" style={{
            background: 'radial-gradient(circle at 10% 85%, rgba(255,255,255,0.95) 0%, rgba(236,72,153,0.7) 10%, rgba(168,85,247,0.4) 25%, transparent 45%)',
          }} />
          {/* Expanding shockwave rings from energy core position */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="absolute" style={{ left: '130px', bottom: '130px', transform: 'translate(-50%, 50%)' }}>
              <div
                className="rounded-full animate-[burstRing_0.8s_ease-out_forwards]"
                style={{
                  border: `${4 - i}px solid ${i === 0 ? 'rgba(255,255,255,0.95)' : i === 1 ? 'rgba(236,72,153,0.9)' : i === 2 ? 'rgba(168,85,247,0.8)' : i === 3 ? 'rgba(99,102,241,0.7)' : 'rgba(59,130,246,0.6)'}`,
                  animationDelay: `${i * 0.08}s`,
                  width: '10px',
                  height: '10px',
                  boxShadow: `0 0 ${20 - i * 3}px ${i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(168,85,247,0.5)'}`,
                }}
              />
            </div>
          ))}
        </div>
      )}

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
        @keyframes coreSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* 8s cycle: 0-25% quiet, 25-45% build-up, 45-55% PEAK, 55-80% recede, 80-100% quiet */
        @keyframes coreRingBurst {
          0%, 20% { transform: scale(0.55) rotate(0deg); opacity: 0.25; }
          40% { transform: scale(0.85) rotate(5deg); opacity: 0.6; }
          50% { transform: scale(1.15) rotate(8deg); opacity: 0.95; }
          55% { transform: scale(1.2) rotate(6deg); opacity: 0.9; }
          75% { transform: scale(0.7) rotate(-3deg); opacity: 0.35; }
          100% { transform: scale(0.55) rotate(0deg); opacity: 0.25; }
        }
        @keyframes spikeGrow {
          0%, 20% { transform: scaleY(0.3) scaleX(0.8); opacity: 0.15; }
          42% { transform: scaleY(0.9) scaleX(1); opacity: 0.5; }
          50% { transform: scaleY(1.6) scaleX(1.1); opacity: 0.8; }
          58% { transform: scaleY(1.3) scaleX(1.05); opacity: 0.65; }
          78% { transform: scaleY(0.4) scaleX(0.85); opacity: 0.2; }
          100% { transform: scaleY(0.3) scaleX(0.8); opacity: 0.15; }
        }
        @keyframes coreFlash {
          0%, 30% { transform: scale(0.3); opacity: 0; }
          44% { transform: scale(0.6); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0.9; }
          56% { transform: scale(1.4); opacity: 0.5; }
          70% { transform: scale(0.4); opacity: 0.05; }
          100% { transform: scale(0.3); opacity: 0; }
        }
        @keyframes coreBreathe {
          0%, 25% { transform: scale(0.9); box-shadow: 0 0 15px 2px rgba(168,85,247,0.3), 0 0 30px 4px rgba(236,72,153,0.15); }
          48% { transform: scale(1); box-shadow: 0 0 25px 6px rgba(168,85,247,0.5), 0 0 60px 12px rgba(236,72,153,0.3); }
          52% { transform: scale(1.08); box-shadow: 0 0 35px 10px rgba(168,85,247,0.7), 0 0 80px 20px rgba(236,72,153,0.4); }
          75% { transform: scale(0.92); box-shadow: 0 0 15px 3px rgba(168,85,247,0.35), 0 0 35px 6px rgba(236,72,153,0.18); }
          100% { transform: scale(0.9); box-shadow: 0 0 15px 2px rgba(168,85,247,0.3), 0 0 30px 4px rgba(236,72,153,0.15); }
        }
        /* Core sphere morphs from circle → irregular spiky star → circle */
        @keyframes coreShapeShift {
          0%, 22% {
            clip-path: circle(42% at 50% 50%);
            transform: scale(0.85) rotate(0deg);
            box-shadow: 0 0 15px 2px rgba(168,85,247,0.3), 0 0 30px 4px rgba(236,72,153,0.15);
          }
          35% {
            clip-path: polygon(50% 8%, 62% 22%, 82% 15%, 76% 36%, 98% 44%, 80% 56%, 88% 78%, 66% 72%, 54% 92%, 46% 76%, 28% 86%, 32% 64%, 8% 68%, 22% 48%, 4% 32%, 26% 32%, 20% 12%, 40% 22%);
            transform: scale(0.95) rotate(10deg);
            box-shadow: 0 0 25px 8px rgba(168,85,247,0.5), 0 0 50px 12px rgba(236,72,153,0.3);
          }
          50% {
            clip-path: polygon(50% 2%, 60% 18%, 78% 5%, 74% 28%, 100% 35%, 82% 50%, 95% 72%, 70% 68%, 58% 98%, 48% 72%, 22% 92%, 30% 62%, 0% 65%, 20% 42%, 2% 25%, 24% 28%, 18% 5%, 38% 18%);
            transform: scale(1.15) rotate(-5deg);
            box-shadow: 0 0 40px 15px rgba(168,85,247,0.7), 0 0 80px 25px rgba(236,72,153,0.5), 0 0 120px 40px rgba(249,115,22,0.2);
          }
          58% {
            clip-path: polygon(50% 5%, 58% 20%, 75% 10%, 72% 32%, 95% 40%, 78% 54%, 90% 75%, 65% 70%, 55% 95%, 45% 70%, 20% 88%, 28% 60%, 5% 60%, 22% 40%, 8% 22%, 28% 30%, 22% 8%, 42% 20%);
            transform: scale(1.05) rotate(3deg);
            box-shadow: 0 0 30px 10px rgba(168,85,247,0.5), 0 0 60px 15px rgba(236,72,153,0.35);
          }
          78% {
            clip-path: circle(42% at 50% 50%);
            transform: scale(0.88) rotate(-2deg);
            box-shadow: 0 0 15px 3px rgba(168,85,247,0.3), 0 0 30px 5px rgba(236,72,153,0.15);
          }
          100% {
            clip-path: circle(42% at 50% 50%);
            transform: scale(0.85) rotate(0deg);
            box-shadow: 0 0 15px 2px rgba(168,85,247,0.3), 0 0 30px 4px rgba(236,72,153,0.15);
          }
        }
        @keyframes coreScanTex {
          0%, 25% { opacity: 0.3; }
          50% { opacity: 1; }
          75% { opacity: 0.4; }
          100% { opacity: 0.3; }
        }
        @keyframes coreNumJump {
          0%, 40% { transform: translateY(0); color: rgba(244,114,182,0.7); }
          48% { transform: translateY(-3px); color: rgba(251,191,36,1); }
          52% { transform: translateY(-1px); color: rgba(251,191,36,0.9); }
          60% { transform: translateY(0); color: rgba(244,114,182,0.7); }
          100% { transform: translateY(0); color: rgba(244,114,182,0.7); }
        }
        @keyframes burstFlash {
          0% { opacity: 1; transform: scale(0.3); }
          30% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2); }
        }
        @keyframes burstRing {
          0% { width: 10px; height: 10px; opacity: 1; }
          100% { width: 500px; height: 500px; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default Home
