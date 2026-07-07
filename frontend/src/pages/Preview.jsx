import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import Navbar from '../components/Navbar'

function Preview() {
  const { t } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const { html, mode } = location.state || {}

  const title = mode === 'personal' ? t.previewPersonal : t.previewProfessional

  // Deploy state
  const [deployTab, setDeployTab] = useState('netlify') // 'netlify' | 'github'
  const [deploying, setDeploying] = useState(false)
  const [deployUrl, setDeployUrl] = useState('')
  const [deployError, setDeployError] = useState('')
  const [copied, setCopied] = useState(false)
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
            <button onClick={downloadHtml} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-medium transition-colors">{t.downloadHtml}</button>
          </div>
        </div>

        {/* Preview iframe */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <iframe srcDoc={html} className="w-full h-[70vh] border-0" title="Preview" sandbox="allow-scripts" />
        </div>

        {/* Deploy Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[3px] text-gray-400 mb-1">{t.deployToWeb}</h2>
          <p className="text-sm text-gray-500 mb-8">{t.deployDesc}</p>

          {/* Tab switcher */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => { setDeployTab('netlify'); setDeployUrl(''); setDeployError('') }}
              className={`flex-1 py-4 px-4 rounded-2xl text-sm font-medium transition-all ${
                deployTab === 'netlify'
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              Netlify
              <span className="block text-xs mt-0.5 opacity-80">{t.deployNetlifyDesc}</span>
            </button>
            <button
              onClick={() => { setDeployTab('github'); setDeployUrl(''); setDeployError('') }}
              className={`flex-1 py-4 px-4 rounded-2xl text-sm font-medium transition-all ${
                deployTab === 'github'
                  ? 'bg-gray-900 text-white ring-2 ring-gray-400 ring-offset-2'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              GitHub Pages
              <span className="block text-xs mt-0.5 opacity-80">{t.deployGitHubDesc}</span>
            </button>
          </div>

          {/* GitHub fields */}
          {deployTab === 'github' && (
            <div className="space-y-3 mb-5">
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
        </div>
      </main>
    </div>
  )
}

export default Preview
