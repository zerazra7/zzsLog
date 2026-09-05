import { useEffect, useState } from 'react'
import { fetchShowsForUser } from '../lib/showsApi'
import { fetchWallMessages, postWallMessage } from '../lib/socialApi'
import { countWatchedEpisodes, totalMinutesWatched } from '../lib/storage'
import { IMG_BASE } from '../lib/tmdb'
import { useLanguage } from '../lib/i18n'

export default function UserProfileModal({ profile, myId, profiles, onClose }) {
  const { t } = useLanguage()
  const [shows, setShows] = useState({})
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchShowsForUser(profile.id), fetchWallMessages(profile.id)]).then(
      ([showsMap, msgs]) => {
        if (cancelled) return
        setShows(showsMap)
        setMessages(msgs)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [profile.id])

  const list = Object.values(shows)
  const totalEpisodes = list.reduce((sum, s) => sum + countWatchedEpisodes(s), 0)
  const totalMinutes = totalMinutesWatched(shows)

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    const msg = await postWallMessage(profile.id, myId, text.trim())
    setMessages((prev) => [msg, ...prev])
    setText('')
  }

  function authorEmail(authorId) {
    return profiles.find((p) => p.id === authorId)?.email ?? '???'
  }

  return (
    <div className="fixed inset-0 bg-[var(--navy)]/60 flex items-start justify-center overflow-y-auto z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 border border-[var(--pink-soft)]/75">
        <div className="flex items-center justify-between p-4 border-b border-[var(--pink-soft)]/55">
          <h2 className="text-lg font-semibold text-[var(--navy)]">{profile.email}</h2>
          <button
            onClick={onClose}
            className="text-[var(--navy)]/60 hover:text-[var(--navy)] px-3 py-1.5 rounded-md border border-[var(--pink-soft)]/75"
          >
            {t.detail.close}
          </button>
        </div>

        <div className="p-4">
          {loading && <p className="text-[var(--navy)]/50 text-sm mb-4">{t.detail.loading}</p>}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard label={t.stats.showsLabel} value={list.length} />
            <StatCard label={t.stats.episodesLabel} value={totalEpisodes} />
            <StatCard label={t.stats.hoursLabel} value={(totalMinutes / 60).toFixed(1)} />
          </div>

          {list.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-6">
              {list.map((show) => (
                <div
                  key={show.id}
                  className="aspect-[2/3] rounded-md overflow-hidden bg-[var(--blue-pastel)]/30 border border-[var(--pink-soft)]/40"
                  title={show.name}
                >
                  {show.poster_path && (
                    <img
                      src={IMG_BASE + show.poster_path}
                      alt={show.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <h3 className="text-sm font-semibold text-[var(--navy)]/60 mb-1">{t.people.wallTitle}</h3>
          <p className="text-xs text-[var(--navy)]/40 mb-3">⚠️ {t.people.wallWarning}</p>

          <form onSubmit={handleSend} className="flex gap-2 mb-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.people.messagePlaceholder}
              className="flex-1 rounded-lg bg-white border border-[var(--pink-soft)]/75 px-3 py-2 text-sm text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--pink)] hover:bg-[var(--pink)]/85 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              {t.people.send}
            </button>
          </form>

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
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-[var(--pink-soft)]/55 rounded-lg p-3 text-center">
      <p className="text-xl font-semibold text-[var(--navy)]">{value}</p>
      <p className="text-xs text-[var(--navy)]/50 mt-1">{label}</p>
    </div>
  )
}
