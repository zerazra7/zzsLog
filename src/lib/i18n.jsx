import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'zzslog:lang'

const translations = {
  tr: {
    appName: 'zzsLog',
    greeting: 'Selam tatlım',
    tabs: { shows: 'Dizilerim', search: 'Ara', stats: 'İstatistik', profile: 'Profilim' },
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
      loading: 'Yükleniyor...',
      watched: 'bölüm izlendi',
    },
    profile: {
      title: 'Profilim',
      emailLabel: 'Email',
      language: 'Dil',
      signOut: 'Çıkış yap',
    },
  },
  en: {
    appName: 'zzsLog',
    greeting: 'ello sweeetie',
    tabs: { shows: 'My Shows', search: 'Search', stats: 'Stats', profile: 'Profile' },
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
      loading: 'Loading...',
      watched: 'episodes watched',
    },
    profile: {
      title: 'Profile',
      emailLabel: 'Email',
      language: 'Language',
      signOut: 'Sign out',
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
