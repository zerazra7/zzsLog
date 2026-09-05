import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'zzslog:lang'

const translations = {
  tr: {
    appName: 'zzsLog',
    greeting: 'Selam tatlım :>',
    tabs: { shows: 'Dizilerim', search: 'Ara', stats: 'İstatistik', people: 'Kişiler', profile: 'Profilim' },
    auth: {
      signInTitle: 'Hesabına giriş yap',
      signUpTitle: 'Yeni hesap oluştur',
      forgotTitle: 'Şifreni sıfırla',
      email: 'Email',
      password: 'Şifre',
      signIn: 'Giriş yap',
      signUp: 'Kayıt ol',
      sendReset: 'Sıfırlama linki gönder',
      forgotLink: 'Şifremi unuttum',
      toSignUp: 'Hesabın yok mu? Kayıt ol',
      toSignIn: 'Zaten hesabın var mı? Giriş yap',
      wait: 'Bekle...',
      signupSuccess: 'Kayıt oldun! Şimdi email adresine gelen linke tıklayıp hesabını onayla.',
      resetSent: 'Email adresine bir şifre sıfırlama linki gönderdik. Gelen kutunu kontrol et.',
    },
    reset: {
      title: 'Yeni şifreni belirle',
      newPassword: 'Yeni şifre',
      done: 'Şifren güncellendi!',
      continue: 'Uygulamaya devam et',
      update: 'Şifreyi güncelle',
    },
    search: {
      placeholder: 'Dizi ara... (ör. Breaking Bad)',
      button: 'Ara',
      searching: 'Aranıyor...',
      inList: 'Listede ✓',
      add: 'Listeye ekle',
    },
    shows: {
      empty1: 'Henüz listende dizi yok.',
      empty2: '"Ara" sekmesinden dizi ekleyebilirsin.',
      watched: 'bölüm izlendi',
    },
    stats: {
      showsLabel: 'Dizi',
      episodesLabel: 'Bölüm',
      hoursLabel: 'Saat',
      topWatched: 'En çok izlenenler',
      noData: 'Henüz veri yok.',
      episodes: 'bölüm',
    },
    detail: {
      remove: 'Listeden çıkar',
      close: 'Kapat',
      markSeason: 'Tüm sezonu izledim işaretle',
      unmarkSeason: 'Sezonun işaretini kaldır',
      markAllWatched: 'Hepsini izledim',
      markWatchedTwice: '2 kere izledim',
      loading: 'Yükleniyor...',
      watched: 'bölüm izlendi',
      favoriteAdd: 'Favorilere ekle',
      favoriteRemove: 'Favorilerden çıkar',
    },
    profile: {
      title: 'Profilim',
      emailLabel: 'Email',
      nicknameLabel: 'Rumuz',
      nicknamePlaceholder: 'Bir rumuz belirle (opsiyonel)',
      nicknameSave: 'Kaydet',
      nicknameSaved: 'Kaydedildi!',
      language: 'Dil',
      signOut: 'Çıkış yap',
      tmdbAttribution: 'Bu ürün TMDB API’sini kullanır ancak TMDB tarafından onaylanmamış veya sertifikalandırılmamıştır.',
      favoritesTitle: 'Favori Dizilerim',
      favoritesEmpty: 'Henüz favori dizin yok.',
    },
    people: {
      empty: 'Henüz kimse yok.',
      wallTitle: 'Profil duvarı',
      wallWarning: 'Buraya bırakılan mesajları uygulamadaki herkes görebilir.',
      messagePlaceholder: 'Bir mesaj bırak... (ör. hey vay be!)',
      send: 'Gönder',
      noMessages: 'Henüz mesaj yok.',
    },
    welcome: {
      title: 'zzsLog\'a Hoş Geldin! 🎉',
      installTitle: '📲 Ana ekranına ekle, gerçek bir app gibi kullan!',
      iosStep: 'iPhone: Paylaş ikonuna dokun → "Ana Ekrana Ekle"',
      androidStep: 'Android: sağ üstteki ⋮ menüsüne dokun → "Ana ekrana ekle"',
      featuresTitle: '✨ Neler yapabilirsin:',
      feature1: 'Dizi ara, listene ekle, bölüm bölüm işaretle',
      feature2: 'İzleme istatistiklerini gör (kaç bölüm, kaç saat izledin)',
      feature3: 'Favori dizilerini yıldızla',
      feature4: 'Bir diziyi tekrar izlediysen "2 kere izledim" de',
      feature5: 'Arkadaşlarının ne izlediğini gör, profillerine mesaj bırak',
      cta: 'Anladım, başlayalım!',
    },
  },
  en: {
    appName: 'zzsLog',
    greeting: 'Hello sweeetie :>',
    tabs: { shows: 'My Shows', search: 'Search', stats: 'Stats', people: 'People', profile: 'Profile' },
    auth: {
      signInTitle: 'Sign in to your account',
      signUpTitle: 'Create a new account',
      forgotTitle: 'Reset your password',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign in',
      signUp: 'Sign up',
      sendReset: 'Send reset link',
      forgotLink: 'Forgot my password',
      toSignUp: "Don't have an account? Sign up",
      toSignIn: 'Already have an account? Sign in',
      wait: 'Please wait...',
      signupSuccess: "You're signed up! Check your email and click the link to confirm your account.",
      resetSent: "We've sent a password reset link to your email. Check your inbox.",
    },
    reset: {
      title: 'Set your new password',
      newPassword: 'New password',
      done: 'Your password has been updated!',
      continue: 'Continue to the app',
      update: 'Update password',
    },
    search: {
      placeholder: 'Search shows... (e.g. Breaking Bad)',
      button: 'Search',
      searching: 'Searching...',
      inList: 'In list ✓',
      add: 'Add to list',
    },
    shows: {
      empty1: "You don't have any shows yet.",
      empty2: 'Add one from the "Search" tab.',
      watched: 'episodes watched',
    },
    stats: {
      showsLabel: 'Shows',
      episodesLabel: 'Episodes',
      hoursLabel: 'Hours',
      topWatched: 'Most watched',
      noData: 'No data yet.',
      episodes: 'episodes',
    },
    detail: {
      remove: 'Remove from list',
      close: 'Close',
      markSeason: 'Mark whole season watched',
      unmarkSeason: 'Unmark season',
      markAllWatched: 'Watched it all',
      markWatchedTwice: 'Watched it twice',
      loading: 'Loading...',
      watched: 'episodes watched',
      favoriteAdd: 'Add to favorites',
      favoriteRemove: 'Remove from favorites',
    },
    profile: {
      title: 'Profile',
      emailLabel: 'Email',
      nicknameLabel: 'Nickname',
      nicknamePlaceholder: 'Set a nickname (optional)',
      nicknameSave: 'Save',
      nicknameSaved: 'Saved!',
      language: 'Language',
      signOut: 'Sign out',
      tmdbAttribution: 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
      favoritesTitle: 'My Favorite Shows',
      favoritesEmpty: "You don't have any favorites yet.",
    },
    people: {
      empty: 'No one here yet.',
      wallTitle: 'Profile wall',
      wallWarning: 'Anyone using the app can see messages left here.',
      messagePlaceholder: 'Leave a message... (e.g. hey wow!)',
      send: 'Send',
      noMessages: 'No messages yet.',
    },
    welcome: {
      title: 'Welcome to zzsLog! 🎉',
      installTitle: '📲 Add it to your home screen, use it like a real app!',
      iosStep: 'iPhone: tap the Share icon → "Add to Home Screen"',
      androidStep: 'Android: tap the ⋮ menu → "Add to Home screen"',
      featuresTitle: '✨ What you can do:',
      feature1: 'Search for shows, add them, track episode by episode',
      feature2: 'See your watch stats (episodes, hours)',
      feature3: 'Star your favorite shows',
      feature4: 'Mark a show "watched twice" if you rewatched it',
      feature5: "See what your friends are watching, leave them a message",
      cta: "Got it, let's go!",
    },
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'tr')

  function setLang(next) {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
