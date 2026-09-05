import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword({ onDone }) {
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
        <h1 className="text-xl font-semibold text-[var(--navy)] text-center mb-1">📺 TV Log</h1>
        <p className="text-sm text-[var(--navy)]/50 text-center mb-6">Yeni şifreni belirle</p>

        {done ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--pink)] text-center">Şifren güncellendi!</p>
            <button
              onClick={onDone}
              className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] text-white py-2.5 font-medium transition-colors"
            >
              Uygulamaya devam et
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifre"
              className="rounded-lg bg-white border border-[var(--pink-soft)]/50 px-4 py-2.5 text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
            />

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] disabled:opacity-60 text-white py-2.5 font-medium transition-colors"
            >
              {loading ? 'Bekle...' : 'Şifreyi güncelle'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
