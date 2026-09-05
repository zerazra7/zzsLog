import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../lib/i18n'
import PasswordInput from './PasswordInput'

export default function ResetPassword({ onDone }) {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="w-full max-w-sm bg-white border border-[var(--pink-soft)]/40 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-[var(--navy)] text-center mb-1">{t.appName}</h1>
        <p className="text-sm text-[var(--navy)]/50 text-center mb-6">{t.reset.title}</p>

        {done ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--pink)] text-center">{t.reset.done}</p>
            <button
              onClick={onDone}
              className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] text-white py-2.5 font-medium transition-colors"
            >
              {t.reset.continue}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.reset.newPassword}
            />

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] disabled:opacity-60 text-white py-2.5 font-medium transition-colors"
            >
              {loading ? t.auth.wait : t.reset.update}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
