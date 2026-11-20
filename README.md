# zzsLog

A TV show tracker for me and my friends, inspired by TV Time. You add the shows you watch, mark episodes as you go, and see what your friends are watching.

**Live: [zzslog.vercel.app](https://zzslog.vercel.app)** (can be added to the phone home screen like an app)

## Features

- **Search** any TV show through the TMDB API and add it to your list
- **Episode tracking:** mark single episodes or whole seasons as watched
- **My Shows:** shows grouped by status (watching, not started, completed) with the next episode to watch and a quick "mark watched" button
- **Rewatches and favorites:** count how many times you've watched a show and pin favorites to your profile
- **Stats:** number of shows, episodes and total hours watched
- **People:** see what your friends are watching, add a show straight from their list, and leave messages on their wall (messages disappear after 24 hours)
- **Accounts:** sign up, log in and reset your password with Supabase Auth, plus an optional nickname
- **Turkish and English** interface with a language toggle
- **Installable:** works as a home screen app on phones (web app manifest and icons)

## Built with

React 19 · Vite · Tailwind CSS · Supabase (database, auth, row level security) · TMDB API · Vercel

## Running it locally

1. Install the packages: `npm install`
2. Copy `.env.example` to `.env` and fill in your own TMDB API key and Supabase project URL and key
3. Run the SQL files in your Supabase project's SQL editor
4. Start the dev server: `npm run dev`

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
