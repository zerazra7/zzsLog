import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../lib/i18n'

export default function ProfileTab({ email }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="bg-white border border-[var(--pink-soft)]/55 rounded-lg p-4 mb-4">
        <p className="text-xs text-[var(--navy)]/50 mb-1">{t.profile.emailLabel}</p>
        <p className="text-sm font-medium text-[var(--navy)]">{email}</p>
      </div>

      <div className="bg-white border border-[var(--pink-soft)]/55 rounded-lg p-4 mb-4">
        <p className="text-xs text-[var(--navy)]/50 mb-2">{t.profile.language}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setLang('tr')}
            className={`flex-1 py-2 rounded-md text-sm border transition-colors ${
              lang === 'tr'
                ? 'bg-[var(--navy)] border-[var(--navy)] text-white'
                : 'border-[var(--pink-soft)]/75 text-[var(--navy)] hover:border-[var(--pink)]'
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-2 rounded-md text-sm border transition-colors ${
              lang === 'en'
                ? 'bg-[var(--navy)] border-[var(--navy)] text-white'
                : 'border-[var(--pink-soft)]/75 text-[var(--navy)] hover:border-[var(--pink)]'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <button
        onClick={() => supabase.auth.signOut()}
        className="w-full rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 py-2.5 font-medium transition-colors"
      >
        {t.profile.signOut}
      </button>
    </div>
  )
}
