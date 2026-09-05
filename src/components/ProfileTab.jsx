import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../lib/i18n'
import { listProfiles, fetchWallMessages, updateNickname, displayName } from '../lib/socialApi'

export default function ProfileTab({ email, myId }) {
  const { lang, setLang, t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [profiles, setProfiles] = useState([])
  const [nickname, setNickname] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    Promise.all([fetchWallMessages(myId), listProfiles()]).then(([msgs, profs]) => {
      setMessages(msgs)
      setProfiles(profs)
      setNickname(profs.find((p) => p.id === myId)?.nickname ?? '')
    })
  }, [myId])

  function authorLabel(authorId) {
    return displayName(profiles.find((p) => p.id === authorId))
  }

  async function handleSaveNickname(e) {
    e.preventDefault()
    const updated = await updateNickname(myId, nickname)
    setProfiles((prev) => prev.map((p) => (p.id === myId ? updated : p)))
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="bg-white border border-[var(--pink-soft)]/55 rounded-lg p-4 mb-4">
        <p className="text-xs text-[var(--navy)]/50 mb-1">{t.profile.emailLabel}</p>
        <p className="text-sm font-medium text-[var(--navy)]">{email}</p>
      </div>

      <form
        onSubmit={handleSaveNickname}
        className="bg-white border border-[var(--pink-soft)]/55 rounded-lg p-4 mb-4"
      >
        <p className="text-xs text-[var(--navy)]/50 mb-2">{t.profile.nicknameLabel}</p>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t.profile.nicknamePlaceholder}
            className="flex-1 rounded-lg bg-white border border-[var(--pink-soft)]/75 px-3 py-2 text-sm text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--pink)] hover:bg-[var(--pink)]/85 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {savedFlash ? t.profile.nicknameSaved : t.profile.nicknameSave}
          </button>
        </div>
      </form>

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
            <p className="text-[10px] text-[var(--navy)]/40 mb-0.5">{authorLabel(m.author_id)}</p>
            <p className="text-sm text-[var(--navy)]">{m.text}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-[var(--navy)]/40 text-sm">{t.people.noMessages}</p>
        )}
      </div>

      <p className="text-[10px] text-[var(--navy)]/35 text-center mt-8">
        {t.profile.tmdbAttribution}
      </p>
    </div>
  )
}
