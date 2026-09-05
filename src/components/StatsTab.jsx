import { countWatchedEpisodes, totalMinutesWatched } from '../lib/storage'

function formatHours(minutes) {
  const hours = minutes / 60
  return hours.toFixed(1)
}

export default function StatsTab({ shows }) {
  const list = Object.values(shows)
  const totalShows = list.length
  const totalEpisodes = list.reduce((sum, s) => sum + countWatchedEpisodes(s), 0)
  const totalMinutes = totalMinutesWatched(shows)

  const topShows = [...list]
    .sort((a, b) => countWatchedEpisodes(b) - countWatchedEpisodes(a))
    .slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Dizi" value={totalShows} />
        <StatCard label="Bölüm" value={totalEpisodes} />
        <StatCard label="Saat" value={formatHours(totalMinutes)} />
      </div>

      <h3 className="text-sm font-semibold text-[var(--navy)]/60 mb-3">En çok izlenenler</h3>
      <div className="flex flex-col gap-2">
        {topShows.length === 0 && (
          <p className="text-[var(--navy)]/40 text-sm">Henüz veri yok.</p>
        )}
        {topShows.map((show) => (
          <div
            key={show.id}
            className="flex items-center justify-between bg-white border border-[var(--pink-soft)]/30 rounded-lg px-4 py-3"
          >
            <span className="text-sm font-medium text-[var(--navy)]">{show.name}</span>
            <span className="text-xs text-[var(--navy)]/50">
              {countWatchedEpisodes(show)} bölüm
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-[var(--pink-soft)]/30 rounded-lg p-4 text-center">
      <p className="text-2xl font-semibold text-[var(--navy)]">{value}</p>
      <p className="text-xs text-[var(--navy)]/50 mt-1">{label}</p>
    </div>
  )
}
