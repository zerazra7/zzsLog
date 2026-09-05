import { useLanguage } from '../lib/i18n'

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`inline-flex rounded-md border border-[var(--pink-soft)]/75 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setLang('tr')}
        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
          lang === 'tr' ? 'bg-[var(--navy)] text-white' : 'text-[var(--navy)] hover:bg-[var(--pink-soft)]/15'
        }`}
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
          lang === 'en' ? 'bg-[var(--navy)] text-white' : 'text-[var(--navy)] hover:bg-[var(--pink-soft)]/15'
        }`}
      >
        EN
      </button>
    </div>
  )
}
