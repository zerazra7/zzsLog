import { useState } from 'react'
import SearchTab from './components/SearchTab'
import MyShowsTab from './components/MyShowsTab'
import StatsTab from './components/StatsTab'
import ShowDetail from './components/ShowDetail'
import { loadShows, saveShows, addShow, removeShow, toggleEpisode, setSeasonWatched } from './lib/storage'

const TABS = [
  { id: 'shows', label: 'Dizilerim' },
  { id: 'search', label: 'Ara' },
  { id: 'stats', label: 'İstatistik' },
]

function App() {
  const [shows, setShows] = useState(loadShows)
  const [tab, setTab] = useState('shows')
  const [selectedId, setSelectedId] = useState(null)

  function update(updater) {
    setShows((prev) => {
      const next = updater(prev)
      saveShows(next)
      return next
    })
  }

  const selectedShow = selectedId ? shows[selectedId] : null

  return (
    <div className="min-h-svh flex flex-col bg-pink-50">
      <header className="px-4 py-4 sticky top-0 bg-blue-950 z-10">
        <h1 className="text-xl font-semibold text-center text-white">📺 TV Log</h1>
      </header>

      <main className="flex-1 pb-20">
        {tab === 'search' && (
          <SearchTab shows={shows} onAdd={(show) => update((prev) => addShow(prev, show))} />
        )}
        {tab === 'shows' && (
          <MyShowsTab shows={shows} onSelect={(show) => setSelectedId(show.id)} />
        )}
        {tab === 'stats' && <StatsTab shows={shows} />}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-blue-950 flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'text-pink-300' : 'text-blue-300/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {selectedShow && (
        <ShowDetail
          show={selectedShow}
          onClose={() => setSelectedId(null)}
          onRemove={(id) => {
            update((prev) => removeShow(prev, id))
            setSelectedId(null)
          }}
          onToggleEpisode={(showId, seasonNumber, episodeNumber) =>
            update((prev) => toggleEpisode(prev, showId, seasonNumber, episodeNumber))
          }
          onSetSeasonWatched={(showId, seasonNumber, episodeNumbers, watched) =>
            update((prev) => setSeasonWatched(prev, showId, seasonNumber, episodeNumbers, watched))
          }
        />
      )}
    </div>
  )
}

export default App
