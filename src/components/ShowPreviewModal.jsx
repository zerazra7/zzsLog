import { useEffect, useState } from 'react'
import { getShowDetails, IMG_BASE } from '../lib/tmdb'
import { useLanguage } from '../lib/i18n'

export default function ShowPreviewModal({ show, alreadyAdded, onAdd, onClose }) {
  const { lang, t } = useLanguage()
  const [details, setDetails] = useState(null)

  useEffect(() => {
    let cancelled = false
    getShowDetails(show.id, lang).then((d) => {
      if (!cancelled) setDetails(d)
    })
    return () => {
      cancelled = true
    }
  }, [show.id, lang])

  return (
    <div className="fixed inset-0 bg-[var(--navy)]/60 flex items-start justify-center overflow-y-auto z-[60] p-4">
      <div className="bg-white rounded-xl max-w-md w-full my-8 border border-[var(--pink-soft)]/75">
        <div className="flex items-center justify-between p-4 border-b border-[var(--pink-soft)]/55">
          <h2 className="text-lg font-semibold text-[var(--navy)]">{show.name}</h2>
          <button
            onClick={onClose}
            className="text-[var(--navy)]/60 hover:text-[var(--navy)] px-3 py-1.5 rounded-md border border-[var(--pink-soft)]/75"
          >
            {t.detail.close}
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="w-28 shrink-0 aspect-[2/3] rounded-md overflow-hidden bg-[var(--blue-pastel)]/30 border border-[var(--pink-soft)]/40">
              {show.poster_path && (
                <img
                  src={IMG_BASE + show.poster_path}
                  alt={show.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {details ? (
                <p className="text-sm text-[var(--navy)]/70 leading-relaxed">
                  {details.overview || '—'}
                </p>
              ) : (
                <p className="text-sm text-[var(--navy)]/40">{t.detail.loading}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onAdd(show)}
            disabled={alreadyAdded}
            className="w-full rounded-md bg-[var(--pink)] hover:bg-[var(--pink)]/85 disabled:bg-[var(--pink-soft)]/40 disabled:text-[var(--navy)]/50 text-white text-sm py-2 transition-colors"
          >
            {alreadyAdded ? t.search.inList : t.search.add}
          </button>
        </div>
      </div>
    </div>
  )
}
