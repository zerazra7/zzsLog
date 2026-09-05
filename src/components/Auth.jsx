import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
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
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          setMessage('Kayıt oldun! Şimdi email adresine gelen linke tıklayıp hesabını onayla.')
        }
      }
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
        <p className="text-sm text-[var(--navy)]/50 text-center mb-6">
          {mode === 'signin' ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg bg-white border border-[var(--pink-soft)]/50 px-4 py-2.5 text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="rounded-lg bg-white border border-[var(--pink-soft)]/50 px-4 py-2.5 text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
          />

          {error && <p className="text-sm text-rose-500">{error}</p>}
          {message && <p className="text-sm text-[var(--pink)]">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] disabled:opacity-60 text-white py-2.5 font-medium transition-colors"
          >
            {loading ? 'Bekle...' : mode === 'signin' ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setMessage(null)
          }}
          className="mt-4 text-sm text-[var(--pink)] hover:text-[var(--navy)] w-full text-center"
        >
          {mode === 'signin' ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
        </button>
      </div>
    </div>
  )
}
