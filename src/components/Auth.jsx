import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../lib/i18n'
import PasswordInput from './PasswordInput'

export default function Auth() {
  const { t } = useLanguage()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          setMessage(t.auth.signupSuccess)
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setMessage(t.auth.resetSent)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    signin: t.auth.signInTitle,
    signup: t.auth.signUpTitle,
    forgot: t.auth.forgotTitle,
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="w-full max-w-sm bg-white border border-[var(--pink-soft)]/40 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-[var(--navy)] text-center mb-1">{t.appName}</h1>
        <p className="text-sm text-[var(--navy)]/50 text-center mb-6">{titles[mode]}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.email}
            className="rounded-lg bg-white border border-[var(--pink-soft)]/50 px-4 py-2.5 text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
          />
          {mode !== 'forgot' && (
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.password}
            />
          )}

          {error && <p className="text-sm text-rose-500">{error}</p>}
          {message && <p className="text-sm text-[var(--pink)]">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] disabled:opacity-60 text-white py-2.5 font-medium transition-colors"
          >
            {loading
              ? t.auth.wait
              : mode === 'signin'
                ? t.auth.signIn
                : mode === 'signup'
                  ? t.auth.signUp
                  : t.auth.sendReset}
          </button>
        </form>

        {mode === 'signin' && (
          <button
            onClick={() => {
              setMode('forgot')
              setError(null)
              setMessage(null)
            }}
            className="mt-4 text-sm text-[var(--navy)]/60 hover:text-[var(--navy)] w-full text-center"
          >
            {t.auth.forgotLink}
          </button>
        )}

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setMessage(null)
          }}
          className="mt-2 text-sm text-[var(--pink)] hover:text-[var(--navy)] w-full text-center"
        >
          {mode === 'signup' ? t.auth.toSignIn : t.auth.toSignUp}
        </button>
      </div>
    </div>
  )
}
