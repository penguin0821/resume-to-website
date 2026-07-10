import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'
import * as htmlToImage from 'html-to-image'

const PREVIEW_STORAGE_KEY = 'resume-preview-data'

function Preview() {
  const { t } = useLang()
  const location = useLocation()
  const navigate = useNavigate()

  // Get data from location.state OR sessionStorage fallback
  const getStateData = () => {
    if (location.state?.html) return location.state
    try {
      const saved = sessionStorage.getItem(PREVIEW_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return {}
  }
  const { html, mode } = getStateData()

  // Persist to sessionStorage when data arrives via navigation
  useEffect(() => {
    if (html && mode) {
      try {
        sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify({ html, mode }))
      } catch { /* quota exceeded - ignore */ }
    }
  }, [html, mode])

  const title = mode === 'personal' ? t.previewPersonal : t.previewProfessional

  // Deploy state
  const [deployTab, setDeployTab] = useState('netlify') // 'netlify' | 'github'
  const [deploying, setDeploying] = useState(false)
  const [deployUrl, setDeployUrl] = useState('')
  const [deployError, setDeployError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [screenshotting, setScreenshotting] = useState(false)
  const iframeRef = useRef(null)
  // GitHub Pages fields
  const [ghToken, setGhToken] = useState('')
  const [repoName, setRepoName] = useState('my-resume-site')

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-site-${mode || 'personal'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deployNetlify = async () => {
    setDeploying(true)
    setDeployError('')
    setDeployUrl('')
    try {
      const resp = await fetch('/api/deploy/netlify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      })
      const data = await resp.json()
      if (resp.ok && data.url) {
        setDeployUrl(data.url)
      } else {
        setDeployError(data.detail || t.deployFailed)
      }
    } catch (err) {
      setDeployError(t.deployFailed + ': ' + err.message)
    } finally {
      setDeploying(false)
    }
  }

  const deployGitHub = async () => {
    if (!ghToken.trim()) {
      setDeployError('GitHub Token is required')
      return
    }
    setDeploying(true)
    setDeployError('')
    setDeployUrl('')
    try {
      const resp = await fetch('/api/deploy/github-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          github_token: ghToken.trim(),
          repo_name: repoName.trim() || 'my-resume-site',
        }),
      })
      const data = await resp.json()
      if (resp.ok && data.url) {
        setDeployUrl(data.url)
      } else {
        setDeployError(data.detail || t.deployFailed)
      }
    } catch (err) {
      setDeployError(t.deployFailed + ': ' + err.message)
    } finally {
      setDeploying(false)
    }
  }

  const takeScreenshot = useCallback(async () => {
    if (!iframeRef.current) return
    setScreenshotting(true)
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!iframeDoc || !iframeDoc.body) {
        // Fallback: screenshot the iframe container
        const dataUrl = await htmlToImage.toPng(iframeRef.current.parentElement, {
          quality: 0.95,
          pixelRatio: 2,
          cacheBust: true,
        })
        const link = document.createElement('a')
        link.download = `resume-site-preview-${mode || 'personal'}.png`
        link.href = dataUrl
        link.click()
        return
      }
      const dataUrl = await htmlToImage.toPng(iframeDoc.body, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        width: iframeDoc.body.scrollWidth,
        height: Math.min(iframeDoc.body.scrollHeight, 1200),
      })
      const link = document.createElement('a')
      link.download = `resume-site-preview-${mode || 'personal'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Screenshot failed:', err)
    } finally {
      setScreenshotting(false)
    }
  }, [mode])

  const handleDeploy = () => {
    if (deployTab === 'netlify') deployNetlify()
    else deployGitHub()
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(deployUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm transition-colors">{t.edit}</button>
            <button onClick={() => { navigator.clipboard.writeText(html); setCopiedHtml(true); setTimeout(() => setCopiedHtml(false), 2000) }}
              className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 text-sm font-medium transition-colors">
              {copiedHtml ? (t.copied || 'Copied!') : (t.copyHtml || 'Copy HTML')}
            </button>
            <button onClick={downloadHtml} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-medium transition-colors">{t.downloadHtml}</button>
            <button
              onClick={takeScreenshot}
              disabled={screenshotting}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {screenshotting ? `📸 ${t.screenshotting || '...'}` : `📸 ${t.screenshot || 'Screenshot'}`}
            </button>
          </div>
        </div>

        {/* Preview iframe */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <iframe ref={iframeRef} srcDoc={html} className="w-full h-[70vh] border-0" title="Preview" sandbox="allow-scripts" />
        </div>

        {/* Deploy Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[3px] text-gray-400 mb-1">{t.deployToWeb}</h2>
          <p className="text-sm text-gray-500 mb-8">{t.deployDesc}</p>

          {/* Tab switcher */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setDeployTab('netlify'); setDeployUrl(''); setDeployError('') }}
              className={`relative flex-1 py-4 px-4 rounded-2xl text-sm font-medium transition-all ${
                deployTab === 'netlify'
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <span className={`absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                deployTab === 'netlify' ? 'bg-green-400 text-white' : 'bg-green-500 text-white'
              }`}>{t.free || 'FREE'}</span>
              Netlify
              <span className="block text-xs mt-0.5 opacity-80">{t.deployNetlifyDesc}</span>
            </button>
            <button
              onClick={() => { setDeployTab('github'); setDeployUrl(''); setDeployError('') }}
              className={`relative flex-1 py-4 px-4 rounded-2xl text-sm font-medium transition-all ${
                deployTab === 'github'
                  ? 'bg-gray-900 text-white ring-2 ring-gray-400 ring-offset-2'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <span className={`absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                deployTab === 'github' ? 'bg-green-400 text-white' : 'bg-green-500 text-white'
              }`}>{t.free || 'FREE'}</span>
              GitHub Pages
              <span className="block text-xs mt-0.5 opacity-80">{t.deployGitHubDesc}</span>
            </button>
          </div>

          {/* Netlify tutorial tip */}
          {deployTab === 'netlify' && (
            <>
              <div className="mb-5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-xs font-semibold text-indigo-700 mb-1">{t.netlifyTipTitle || 'How it works:'}</p>
                <ol className="text-xs text-indigo-600 space-y-1 list-decimal list-inside">
                  <li>{t.netlifyTip1 || 'Click "Deploy" — your site will be live in seconds'}</li>
                  <li>{t.netlifyTip2 || 'You\'ll get a URL like xxx.netlify.app'}</li>
                  <li>{t.netlifyTip3 || 'To keep it permanently: sign up at netlify.com and "claim" the site (free)'}</li>
                  <li>{t.netlifyTip4 || 'Optional: connect a custom domain like yourname.com'}</li>
                </ol>
              </div>
              <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">{'\u26A0\uFE0F'} {t.netlifyExpiryWarning || 'Note: Anonymous Netlify sites expire after 24 hours.'}</p>
              </div>
            </>
          )}

          {/* GitHub fields */}
          {deployTab === 'github' && (
            <div className="space-y-3 mb-5">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-1">{t.githubTipTitle || 'How it works:'}</p>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>{t.githubTip1 || 'Create a token at github.com/settings/tokens (with "repo" scope)'}</li>
                  <li>{t.githubTip2 || 'We\'ll create a repo and enable GitHub Pages automatically'}</li>
                  <li>{t.githubTip3 || 'Your site will be at username.github.io/repo-name'}</li>
                  <li>{t.githubTip4 || 'Update anytime by re-deploying with the same repo name'}</li>
                </ol>
              </div>
              <input
                type="password"
                value={ghToken}
                onChange={e => setGhToken(e.target.value)}
                placeholder={t.githubTokenPh}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm transition-all bg-gray-50 focus:bg-white"
              />
              <input
                type="text"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder={t.repoNamePh}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm transition-all bg-gray-50 focus:bg-white"
              />
              <p className="text-xs text-gray-400">
                Token needs <code className="bg-gray-100 px-1 rounded">repo</code> and <code className="bg-gray-100 px-1 rounded">admin:repo_hook</code> permissions.
                Get one at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-indigo-500 underline">github.com/settings/tokens</a>
              </p>
            </div>
          )}

          {/* Deploy button */}
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              deployTab === 'netlify'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-300 hover:shadow-lg active:scale-[0.99]'
                : 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400 hover:shadow-lg active:scale-[0.99]'
            }`}>
            {deploying ? t.deploying : t.deploy}
          </button>

          {/* Error */}
          {deployError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {deployError}
            </div>
          )}

          {/* Success */}
          {deployUrl && (
            <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-medium text-green-800 mb-2">{t.deploySuccess}</p>
              <div className="flex items-center gap-2">
                <a href={deployUrl} target="_blank" rel="noreferrer"
                  className="flex-1 text-indigo-600 underline text-sm truncate">{deployUrl}</a>
                <button onClick={copyUrl}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 flex-shrink-0">
                  {copied ? t.copied : t.copyUrl}
                </button>
              </div>
            </div>
          )}

          {/* Other platforms hint */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {t.otherPlatforms || 'You can also deploy to'}{' '}
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Vercel</a> ·{' '}
              <a href="https://pages.cloudflare.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Cloudflare Pages</a> ·{' '}
              <a href="https://surge.sh" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Surge.sh</a> ·{' '}
              <a href="https://tiiny.host" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Tiiny.host</a>
              {' '}— {t.otherPlatformsNote || 'all free. Just download the HTML and upload.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Preview
