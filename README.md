# DhammaWave Web

Public website for the Buddha Audio catalog. Vue 3 + Vite + Tailwind CSS 4,
served as a static SPA. It reads the same Laravel API that the Flutter app
uses, so the website and the mobile app always show the same catalog.

## Stack

- **Vue 3** (`<script setup>` + TypeScript)
- **Vite 8** for dev server and build
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **Vue Router 4** for routing
- **Pinia** for catalog / player / favorites state
- **vue-i18n** for English + Burmese
- **qrcode** for the app download QR code

## Requirements

- Node.js 22.18+ or 24.12+
- The Laravel backend running locally (optional — see "API configuration")

## Getting started

```bash
npm install
cp .env.example .env      # then adjust the values
npm run dev
```

The dev server runs on <http://localhost:5173>.

### Backend proxy

In development, Vite proxies `/api` to `http://127.0.0.1:8000` so the browser
never makes a cross-origin request. Start the API first:

```bash
cd ../buddha-audio-project/backend
php artisan serve --port=8000
```

The API requires a public read-only key sent as the `X-API-Key` header. Keys
live in the `api_keys` table and must match `dw_live_[a-f0-9]{64}`.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API base URL. Empty in dev (uses the proxy). | `/api/v1` |
| `VITE_API_KEY` | Public read-only API key sent as `X-API-Key`. | — |
| `VITE_ANDROID_APK_URL` | Where the APK is hosted. | `/downloads/dhammawave.apk` |
| `VITE_APP_VERSION` | Version shown on the download page. | `1.0.0` |
| `VITE_ANDROID_APK_SIZE` | APK size shown on the download page. | — |

`.env.development` targets the local backend and `.env.production` targets
`https://api.okkarthirimm.com/api/v1`.

## Pages

| Route | Description |
| --- | --- |
| `/` | Featured, latest, teachers, categories and audio types |
| `/browse` | Search and filter by teacher, category and type (cursor pagination) |
| `/audios/:slug` | Audio detail with playback and related recordings |
| `/teachers` | Teacher directory |
| `/teachers/:slug` | Teacher bio and their recordings |
| `/download` | App download page (APK, QR code, features, install steps, FAQ) |
| `/privacy` | Privacy policy |

Add `?lang=my` or `?lang=en` to any URL to force a language. The choice is
otherwise remembered in `localStorage`.

## API surface used

All endpoints live under `/api/v1` and require the `X-API-Key` header.

| Endpoint | Usage |
| --- | --- |
| `GET /home` | Home page payload (featured, latest, teachers, categories, types) |
| `GET /audios` | Listing with `query`, `teacher`, `category`, `type`, `cursor`, `limit` |
| `GET /audios/{slug}` | Audio detail |
| `POST /audios/{slug}/playback-url` | Fresh signed stream URL (URLs expire after a short TTL) |
| `GET /teachers` · `GET /teachers/{slug}` | Teacher directory and detail |
| `GET /categories` · `GET /audio-types` | Filter taxonomy |

## Audio playback

The player uses a native `HTMLAudioElement`. Because stream URLs are signed and
expire quickly, the store requests a fresh URL from
`POST /audios/{slug}/playback-url` before playing and falls back to the URL
that came with the listing payload.

## App download

The download page (`/download`) has an **Android** and an **iOS** button. Both
are rendered as plain `<button>` elements **without a link** — the store URLs
are not published yet.

To wire them up, edit the `platforms` array in `src/views/DownloadView.vue`:

```ts
const platforms = [
  {
    id: 'android',
    label: 'downloadCtaAndroid',
    requirement: 'downloadRequirementAndroid',
    platform: 'downloadPlatformAndroid',
    icon: 'android',
  },
  {
    id: 'ios',
    label: 'downloadCtaIos',
    requirement: 'downloadRequirementIos',
    platform: 'downloadPlatformIos',
    icon: 'ios',
  },
] as const
```

Each entry can gain a `url` field; swap the `<button>` for an `<a :href>` once
the links exist. The Android QR code already points at
`VITE_ANDROID_APK_URL`, so it follows automatically once the APK is hosted.

### Building the Android APK

`public/downloads/dhammawave.apk` holds the Android build. To refresh it:

```bash
cd ../buddha-audio-project/app
flutter build apk --release --dart-define-from-file=.env.json
cp build/app/outputs/flutter-apk/app-release.apk \
   ../../buddha-audio-web/public/downloads/dhammawave.apk
```

The APK is git-ignored. In production, host it on a CDN and point
`VITE_ANDROID_APK_URL` at that URL.

## Image fallback

`MediaImage` renders the brand mark from the navbar whenever the API returns
no image, the URL is empty, or the image fails to load. Broken cover and
teacher photos fall back to the same saffron `☸` tile used in the header.

## Scripts

```bash
npm run dev         # dev server with HMR
npm run build       # type-check + production build into dist/
npm run type-check  # vue-tsc
npm run preview     # serve the production build locally
```

## Project layout

```
src/
├── api/          # typed API client and response types
├── components/   # reusable UI (cards, player, header, footer, QR, …)
├── i18n/         # vue-i18n setup with en + my locales
├── router/       # route definitions
├── stores/       # Pinia stores (catalog, player, favorites)
├── utils/        # formatting helpers
└── views/        # page components
```

## Design

Colors and typography mirror the Flutter app theme (saffron / ochre palette) so
both surfaces look like one product. Tokens are defined in
`src/assets/main.css` under `@theme`.
# DhammaWave
