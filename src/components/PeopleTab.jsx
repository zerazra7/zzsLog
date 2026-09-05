import { useEffect, useState } from 'react'
import { listProfiles, displayName } from '../lib/socialApi'
import { useLanguage } from '../lib/i18n'
import UserProfileModal from './UserProfileModal'

export default function PeopleTab({ myId }) {
  const { t } = useLanguage()
  const [profiles, setProfiles] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    listProfiles().then(setProfiles).catch(console.error)
  }, [])

  const others = profiles.filter((p) => p.id !== myId)

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-2">
        {others.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="text-left bg-white border border-[var(--pink-soft)]/55 rounded-lg px-4 py-3 hover:ring-2 hover:ring-[var(--pink)] transition-all"
          >
            <p className="text-sm font-medium text-[var(--navy)]">{displayName(p)}</p>
          </button>
        ))}
        {others.length === 0 && (
          <p className="text-[var(--navy)]/50 text-sm text-center py-8">{t.people.empty}</p>
        )}
      </div>

      {selected && (
        <UserProfileModal
          profile={selected}
          myId={myId}
          profiles={profiles}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
