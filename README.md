# GeoGuess

GeoGuess is a location-guessing streak game. Sign in with Google, inspect a randomly selected city image, choose one of four city and country options, and keep answering correctly to extend the streak.

## Features

- Google authentication with NextAuth
- Protected game routes for signed-in users
- Welcome screen with a short game briefing
- Random city selection from `app/public/data/cities.json`
- Wikipedia REST API integration for city images and descriptions
- Four shuffled answer choices per round
- The correct city is always included in the four choices
- Correct-answer feedback highlights the selected choice in green
- Wrong-answer feedback highlights the selected choice in red and the correct choice in green
- Automatic next-round loading after a correct answer
- Journey-end screen after the first incorrect answer
- Current streak and personal best stored in browser `localStorage`
- Responsive editorial atlas-inspired interface
- TanStack Query for client-side location fetching, caching, retry, and loading states

## Game Flow

1. Visit `/` and sign in with Google.
2. Open `/start-journey` and select **Start journey**.
3. A round loads a random city from the local city dataset.
4. The server requests the city summary from Wikipedia and returns its image and four choices.
5. Select the city and country that match the image.
6. A correct answer increases the streak, updates the personal best when needed, and loads another round.
7. An incorrect answer ends the journey after the feedback animation and redirects to `/journey-end`.

Feedback remains visible for approximately 2.5 seconds: one second for the highlighted result and another 1.5 seconds before the next round or redirect.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Public landing page and Google sign-in entry point | Public |
| `/start-journey` | Signed-in welcome and game instructions | Protected |
| `/guess` | Image round, streak display, and answer choices | Protected |
| `/journey-end` | Result, score, personal best, and replay controls | Protected |
| `/api/auth/*` | NextAuth authentication endpoints | Internal |
| `/api/location` | Server endpoint that creates a random round | Internal |

Unauthenticated access to the three game routes is redirected to `/` by `middleware.ts`.

## Data Sources

### City dataset

The available city pool is stored in:

```text
app/public/data/cities.json
```

Each item contains a city, country, and continent. The server randomly selects one target and samples three different distractors from the same dataset before shuffling all four choices.

### Wikipedia

Each round calls the Wikipedia REST summary endpoint:

```text
https://en.wikipedia.org/api/rest_v1/page/summary/{city}
```

The response supplies the city image and fallback description. No Google Maps, Nominatim, or Unsplash API is required for gameplay.

## Local Storage

The guess page stores streak values in the browser under these keys:

| Key | Meaning |
| --- | --- |
| `geo-streak-current` | Current correct-answer streak |
| `geo-streak-best` | Highest streak achieved in the browser |

Clearing site data resets both values.

## Requirements

- Node.js 20 or newer
- npm
- Google OAuth credentials for NextAuth

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret
```

Register this callback URL in the Google Cloud OAuth client:

```text
http://localhost:3000/api/auth/callback/google
```

Generate a strong `NEXTAUTH_SECRET` for anything beyond local development. Never commit `.env` or expose the Google client secret.

For the complete Google Cloud setup, callback URL configuration, production guidance, and troubleshooting, see [GOOGLE-OAUTH.md](./GOOGLE-OAUTH.md).

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server after building |
| `npm run lint` | Run ESLint |

## Project Structure

```text
app/
  api/
    auth/[...nextauth]/route.ts  # NextAuth Google provider
    location/route.ts             # Wikipedia-backed round API
  components/
    AtlasHeader.tsx               # Shared signed-in header
    GoogleButtons.tsx             # Sign-in and sign-out controls
    HomeAction.tsx                # Session-aware homepage CTA
    QueryProvider.tsx             # TanStack Query provider
    SessionProvider.tsx           # NextAuth session provider
  guess/page.tsx                  # Main game round
  hooks/useLocation.ts            # TanStack Query location hook
  journey-end/page.tsx            # End-of-journey result
  start-journey/page.tsx          # Game introduction
  page.tsx                        # Public homepage
  globals.css                     # Shared visual system
  public/data/cities.json         # City and country dataset
middleware.ts                     # Protects game routes
```

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- NextAuth 4
- TanStack Query 5
- Tailwind CSS 4
- Wikipedia REST API
