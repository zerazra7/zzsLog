const HEART_EMOJIS = ['❤️', '💗', '💕', '🩷', '💖', '💓']

export default function HeartsOverlay() {
  const hearts = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2.2,
    duration: 3 + Math.random() * 3.5,
    size: 16 + Math.random() * 30,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
  }))

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            bottom: '-48px',
            fontSize: `${h.size}px`,
            animation: `heartFloatUp ${h.duration}s ease-in ${h.delay}s forwards`,
          }}
        >
          {h.emoji}
        </span>
      ))}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
        style={{ animation: 'heartPulse 2.2s ease-out 0.3s forwards' }}
      >
        {'🫶'}
      </span>
    </div>
  )
}
