import { useLanguage } from '../lib/i18n'

export default function WelcomeModal({ onClose }) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 bg-[var(--navy)]/60 flex items-center justify-center overflow-y-auto z-[70] p-4">
      <div className="bg-white rounded-xl max-w-sm w-full my-8 border border-[var(--pink-soft)]/75 p-6">
        <h2 className="text-lg font-semibold text-[var(--navy)] text-center mb-4">
          {t.welcome.title}
        </h2>

        <div className="bg-[var(--pink-soft)]/10 border border-[var(--pink-soft)]/40 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-[var(--navy)] mb-2">{t.welcome.installTitle}</p>
          <p className="text-xs text-[var(--navy)]/70 mb-1">{t.welcome.iosStep}</p>
          <p className="text-xs text-[var(--navy)]/70">{t.welcome.androidStep}</p>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-[var(--navy)] mb-2">{t.welcome.featuresTitle}</p>
          <ul className="flex flex-col gap-1.5">
            {[t.welcome.feature1, t.welcome.feature2, t.welcome.feature3, t.welcome.feature4, t.welcome.feature5].map(
              (feature, i) => (
                <li key={i} className="text-xs text-[var(--navy)]/70 flex gap-2">
                  <span className="text-[var(--pink)]">•</span>
                  <span>{feature}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] text-white py-2.5 font-medium transition-colors"
        >
          {t.welcome.cta}
        </button>
      </div>
    </div>
  )
}
