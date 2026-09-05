import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../lib/i18n'
import { listProfiles, fetchWallMessages } from '../lib/socialApi'

export default function ProfileTab({ email, myId }) {
  const { lang, setLang, t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    Promise.all([fetchWallMessages(myId), listProfiles()]).then(([msgs, profs]) => {
      setMessages(msgs)
      setProfiles(profs)
    })
  }, [myId])

  function authorEmail(authorId) {
    return profiles.find((p) => p.id === authorId)?.email ?? '???'
  }

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
        className="w-full rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 py-2.5 font-medium transition-colors mb-6"
      >
        {t.profile.signOut}
      </button>

      <h3 className="text-sm font-semibold text-[var(--navy)]/60 mb-1">{t.people.wallTitle}</h3>
      <p className="text-xs text-[var(--navy)]/40 mb-3">⚠️ {t.people.wallWarning}</p>
      <div className="flex flex-col gap-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-[var(--pink-soft)]/10 border border-[var(--pink-soft)]/40 rounded-lg px-3 py-2"
          >
            <p className="text-xs text-[var(--navy)]/50 mb-0.5">{authorEmail(m.author_id)}</p>
            <p className="text-sm text-[var(--navy)]">{m.text}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-[var(--navy)]/40 text-sm">{t.people.noMessages}</p>
        )}
      </div>
    </div>
  )
}
