import { useEffect, useState } from 'react'
import SearchTab from './components/SearchTab'
import MyShowsTab from './components/MyShowsTab'
import StatsTab from './components/StatsTab'
import ShowDetail from './components/ShowDetail'
import Auth from './components/Auth'
import ResetPassword from './components/ResetPassword'
import ProfileTab from './components/ProfileTab'
import PeopleTab from './components/PeopleTab'
import WelcomeModal from './components/WelcomeModal'
import { supabase } from './lib/supabaseClient'
import {
  fetchShowsForUser,
  insertShow,
  deleteShow,
  updateWatched,
  updateWatchedAndRewatch,
  updateFavorite,
} from './lib/showsApi'
import { toggleEpisode, setSeasonWatched } from './lib/storage'
import { useLanguage } from './lib/i18n'

function App() {
  const { t } = useLanguage()
  const [session, setSession] = useState(undefined)
  const [shows, setShows] = useState({})
  const [tab, setTab] = useState('shows')
  const [selectedId, setSelectedId] = useState(null)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchShowsForUser(session.user.id).then(setShows).catch(console.error)
      if (!localStorage.getItem('zzslog:welcomeSeen')) {
        setShowWelcome(true)
      }
    } else {
      setShows({})
    }
  }, [session])

  function handleCloseWelcome() {
    localStorage.setItem('zzslog:welcomeSeen', '1')
    setShowWelcome(false)
  }

  if (session === undefined) {
    return <div className="min-h-svh bg-[var(--cream)]" />
  }

  if (passwordRecovery) {
    return <ResetPassword onDone={() => setPasswordRecovery(false)} />
  }

  if (!session) {
    return <Auth />
  }

  async function handleAdd(show) {
    const saved = await insertShow(session.user.id, show)
    setShows((prev) => ({ ...prev, [saved.id]: saved }))
    return saved
  }

  async function handleAddFromSearch(show) {
    const saved = await handleAdd(show)
    setSelectedId(saved.id)
  }

  async function handleRemove(showId) {
    await deleteShow(showId)
    setShows((prev) => {
      const next = { ...prev }
      delete next[showId]
      return next
    })
    setSelectedId(null)
  }

  async function handleToggleEpisode(showId, seasonNumber, episodeNumber) {
    const next = toggleEpisode(shows, showId, seasonNumber, episodeNumber)
    setShows(next)
    await updateWatched(showId, next[showId].watched)
  }

  async function handleSetSeasonWatched(showId, seasonNumber, episodeNumbers, watched) {
    const next = setSeasonWatched(shows, showId, seasonNumber, episodeNumbers, watched)
    setShows(next)
    await updateWatched(showId, next[showId].watched)
  }

  async function handleMarkAllWatched(showId, watchedMap, rewatchCount) {
    setShows((prev) => ({
      ...prev,
      [showId]: { ...prev[showId], watched: watchedMap, rewatchCount },
    }))
    await updateWatchedAndRewatch(showId, watchedMap, rewatchCount)
  }

  async function handleToggleFavorite(showId, isFavorite) {
    setShows((prev) => ({
      ...prev,
      [showId]: { ...prev[showId], isFavorite },
    }))
    await updateFavorite(showId, isFavorite)
  }

  const selectedShow = selectedId ? shows[selectedId] : null

  const TABS = [
    { id: 'shows', label: t.tabs.shows },
    { id: 'search', label: t.tabs.search },
    { id: 'stats', label: t.tabs.stats },
    { id: 'people', label: t.tabs.people },
    { id: 'profile', label: t.tabs.profile },
  ]

  return (
    <div className="min-h-svh flex flex-col bg-[var(--sky)]">
      <header className="px-4 py-4 sticky top-0 bg-[var(--navy)] z-10 flex items-baseline justify-center gap-2">
        <h1 className="text-xl font-semibold text-white">{t.appName}</h1>
        <span className="text-sm text-[var(--blue-pastel)]">{t.greeting}</span>
      </header>

      <main className="flex-1 pb-20">
        {tab === 'search' && <SearchTab shows={shows} onAdd={handleAddFromSearch} />}
        {tab === 'shows' && (
          <MyShowsTab shows={shows} onSelect={(show) => setSelectedId(show.id)} />
        )}
        {tab === 'stats' && <StatsTab shows={shows} />}
        {tab === 'people' && (
          <PeopleTab myId={session.user.id} myShows={shows} onAdd={handleAdd} />
        )}
        {tab === 'profile' && <ProfileTab email={session.user.email} myId={session.user.id} />}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-[var(--navy)] flex">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
              tab === tabItem.id ? 'text-[var(--pink-soft)]' : 'text-[var(--blue-pastel)]/60'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </nav>

      {selectedShow && (
        <ShowDetail
          show={selectedShow}
          onClose={() => setSelectedId(null)}
          onRemove={handleRemove}
          onToggleEpisode={handleToggleEpisode}
          onSetSeasonWatched={handleSetSeasonWatched}
          onMarkAllWatched={handleMarkAllWatched}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
    </div>
  )
}

export default App
