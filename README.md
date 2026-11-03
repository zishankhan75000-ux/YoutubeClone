# YouTube Clone

An authentic, modern, and responsive YouTube-inspired web application frontend built with **React 19**, **Vite 8**, **TanStack Router**, and **Tailwind CSS v4**.

Designed and refined to closely replicate the visual appearance, interaction patterns, and user experience of [YouTube.com](https://www.youtube.com/).

---

## 🚀 Live Demo & Repository

- **GitHub Repository:** [https://github.com/zishankhan75000-ux/YoutubeClone](https://github.com/zishankhan75000-ux/YoutubeClone)
- **Deployment Platform:** Vercel

---

## ✨ Features

### 1. Header & Global Navigation
- **Authentic Branding:** Official YouTube-styled red play button SVG logo and clean typography with subtle "Clone" badge.
- **Search Experience:** Responsive search bar with auto-clear, query validation, and interactive **Voice Search Modal** simulating speech queries with quick topic suggestions.
- **Create Menu:** Upload video, Go Live, and Create post modals with interactive demo feedback.
- **Notifications Tray:** Bell icon with unread badge count, dropdown list of recent uploads, and "Mark all read" action.
- **Account Dropdown:** Profile menu featuring channel links, YouTube Studio demo link, Switch Account demo action, and an **instant Dark / Light theme toggle**.

### 2. Collapsible Navigation Sidebar
- **Full Sidebar:** Home, Shorts, Subscriptions, Library (Your channel, History, Playlists, Your videos, Watch later, Liked videos), and Explore (Trending, Music, Gaming, News, Sports, Podcasts).
- **Mini Sidebar:** Streamlined 72px icon sidebar for medium desktop viewports.
- **Mobile Bottom Navigation:** Fixed bottom bar on mobile screens (Home, Shorts, Create (+), Subscriptions, You).

### 3. Homepage
- **Category Filter Pills:** Horizontal scrollable chips ("All", "Music", "Gaming", "Live", "News", "Podcasts", "Technology", etc.) with smooth scrolling buttons and active filtering.
- **Responsive Video Grid:** Automatically adapts from 1 column on mobile to 2, 3, and 4 columns on large screens with duration badges, channel avatars, view counts, and 3-dot action menus.

### 4. Video Watch Page
- **16:9 Embedded Player:** Embedded playback using privacy-enhanced YouTube player (`youtube-nocookie.com`).
- **Creator Details & Actions:** Channel avatar, subscriber count, Subscribe/Subscribed toggle with state persistence.
- **Like / Dislike Controls:** Seamlessly joined pill with dynamic like count increments.
- **Modals:** Share video with one-click copy URL, and Save to Playlist modal.
- **Collapsible Description Box:** Metadata, tags, views, upload date, and expandable "...more / Show less" toggle.
- **Interactive Comments:** Add new comments, like existing comments, reply to comments, and toggle sort order (Top comments / Newest first). Stored in `localStorage`.
- **Recommended Column:** Related video recommendations tailored to the current category.

### 5. YouTube Shorts
- **Vertical 9:16 Frame:** Centered viewport with custom overlay information.
- **Creator & Sound Attribution:** Channel handle, subscribe button, and animated original audio tag.
- **Action Buttons:** Like, Dislike, Comments modal, and Share.
- **Keyboard & Touch Navigation:** Up/Down arrow navigation, mobile touch swipe detection, and desktop next/previous buttons.

### 6. Channel & Library Pages
- **Channel Profile:** Custom gradient channel banner, channel avatar, handle, subscriber count, and tabs (Home, Videos, Shorts, Playlists, Community, About).
- **History:** List of watched videos with one-click individual removal and "Clear all watch history".
- **Playlists:** Create custom playlists, rename playlists, add/remove videos, and delete playlists.
- **Watch Later & Liked Videos:** Dedicated library collections dynamically updated on user actions.
- **Search Results (`/results`):** Keyword search with filter drawer (Upload date, Type, Duration, Sort by).

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19.2.0 |
| **Language** | TypeScript 5.9.3 |
| **Build Tool** | Vite 8.1.5 |
| **Routing** | TanStack React Router 1.170.41 |
| **SSR / Server Engine** | TanStack Start + Nitro 3.0 |
| **Styling** | Tailwind CSS v4, custom OKLCH design tokens |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Testing** | Vitest 4.1.12, Playwright (Edge/Chromium) |
| **Data Persistence** | Browser `localStorage` |
| **Deployment Target** | Vercel |

---

## 📁 Folder Structure

```
YoutubeClone/
├── public/                 # Static assets (favicon.svg, robots.txt)
├── src/
│   ├── components/
│   │   ├── ui/             # Radix UI and shadcn primitives
│   │   └── yt/             # YouTube-specific components (Header, Sidebar, VideoCard, AppShell, etc.)
│   ├── context/
│   │   └── app-store.tsx   # Global state & localStorage persistence store
│   ├── data/
│   │   ├── channels.ts     # Channel metadata & current user profile
│   │   ├── comments.ts     # Sample video comments
│   │   └── videos.ts       # Curated video catalog and Shorts
│   ├── lib/
│   │   ├── format.ts       # View count & date formatting utilities
│   │   ├── seo.ts          # Page title & OpenGraph metadata helpers
│   │   └── utils.ts        # Class merging utilities
│   ├── routes/             # TanStack file-based routes
│   │   ├── __root.tsx      # Root HTML shell & provider layout
│   │   ├── index.tsx       # Homepage
│   │   ├── watch.tsx       # Video watch page
│   │   ├── shorts.tsx      # YouTube Shorts
│   │   ├── results.tsx     # Search results
│   │   ├── channel.$id.tsx # Channel profile page
│   │   ├── subscriptions.tsx
│   │   ├── history.tsx
│   │   ├── playlists.tsx
│   │   ├── watch-later.tsx
│   │   ├── liked.tsx
│   │   ├── settings.tsx
│   │   ├── help.tsx
│   │   └── explore.$category.tsx
│   ├── test/               # Vitest unit & routing tests
│   ├── router.tsx          # Router instantiation
│   └── styles.css          # Tailwind CSS v4 & theme tokens
├── CODEBASE_AUDIT.md       # Initial architectural audit & findings
├── BUG_FIX_REPORT.md       # Complete inventory of fixed bugs
├── DEPLOYMENT_GUIDE.md     # Step-by-step Vercel deployment instructions
├── vercel.json             # Vercel deployment configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Scripts & dependencies
```

---

## 💻 Installation & Local Development

### Prerequisites
- Node.js 18.x or newer (Node 20+ recommended)
- `npm`, `pnpm`, or `bun`

### Setup Steps
```bash
# Clone the repository
git clone https://github.com/zishankhan75000-ux/YoutubeClone.git
cd YoutubeClone

# Install dependencies
npm install
# or
pnpm install

# Start local development server
npm run dev
# or
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

```bash
# Run unit tests
npm test

# Run ESLint check
npm run lint

# Format code with Prettier
npm run format

# Production build
npm run build
```

---

## 🚢 Vercel Deployment

This project is fully configured for deployment on **Vercel**:

1. Push code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `YoutubeClone` repository.
4. Vercel automatically detects the Vite build command (`npm run build`) and framework configuration from `vercel.json`.
5. Click **Deploy**.

For detailed setup instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## ⚠️ Educational Disclaimer

This project is created strictly for **educational and portfolio demonstration purposes**. It is an independent clone and is **not affiliated with, sponsored by, or endorsed by Google LLC or YouTube**. All trademarks belong to their respective owners.
