import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
}

export interface UserComment {
  id: string;
  videoId: string;
  text: string;
}

interface State {
  theme: "dark" | "light";
  subscriptions: string[];
  liked: string[];
  disliked: string[];
  history: string[];
  watchLater: string[];
  hidden: string[];
  playlists: Playlist[];
  comments: UserComment[];
}

const DEFAULT: State = {
  theme: "dark",
  subscriptions: ["3b1b", "karpathy", "freecodecamp", "ted", "edsheeran", "mosh", "jacobsfilms"],
  liked: [],
  disliked: [],
  history: [],
  watchLater: [],
  hidden: [],
  playlists: [
    { id: "pl-focus", name: "Focus & learning", videoIds: ["aircAruvnKk", "zjkBMFhNj_g"] },
  ],
  comments: [],
};

const KEY = "youtube-clone-state-v1";
const LEGACY_KEY = "vidstream-demo-state-v1";

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [id, ...list];
}

function useStoreValue() {
  const [state, setState] = useState<State>(DEFAULT);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state, loaded]);

  const update = useCallback(
    (fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })),
    [],
  );

  return useMemo(
    () => ({
      ...state,
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen((o) => !o),
      setSidebarOpen,
      toggleTheme: () => update((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme: State["theme"]) => update(() => ({ theme })),
      toggleSubscribe: (id: string) =>
        update((s) => {
          toast(s.subscriptions.includes(id) ? "Subscription removed" : "Subscription added");
          return { subscriptions: toggle(s.subscriptions, id) };
        }),
      toggleLike: (id: string) =>
        update((s) => ({
          liked: toggle(s.liked, id),
          disliked: s.disliked.filter((x) => x !== id),
        })),
      toggleDislike: (id: string) =>
        update((s) => ({
          disliked: toggle(s.disliked, id),
          liked: s.liked.filter((x) => x !== id),
        })),
      addHistory: (id: string) =>
        update((s) => ({ history: [id, ...s.history.filter((x) => x !== id)].slice(0, 100) })),
      removeHistory: (id: string) =>
        update((s) => ({ history: s.history.filter((x) => x !== id) })),
      clearHistory: () => {
        update(() => ({ history: [] }));
        toast("Watch history cleared");
      },
      toggleWatchLater: (id: string) =>
        update((s) => {
          toast(s.watchLater.includes(id) ? "Removed from Watch later" : "Saved to Watch later");
          return { watchLater: toggle(s.watchLater, id) };
        }),
      hideVideo: (id: string) => {
        update((s) => ({ hidden: [...s.hidden, id] }));
        toast("Video removed — we'll show fewer like this");
      },
      createPlaylist: (name: string, firstVideo?: string) => {
        const id = `pl-${Date.now()}`;
        update((s) => ({
          playlists: [...s.playlists, { id, name, videoIds: firstVideo ? [firstVideo] : [] }],
        }));
        toast(`Playlist “${name}” created`);
        return id;
      },
      renamePlaylist: (id: string, name: string) =>
        update((s) => ({ playlists: s.playlists.map((p) => (p.id === id ? { ...p, name } : p)) })),
      deletePlaylist: (id: string) =>
        update((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),
      togglePlaylistVideo: (pid: string, vid: string) =>
        update((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === pid ? { ...p, videoIds: toggle(p.videoIds, vid) } : p,
          ),
        })),
      addComment: (videoId: string, text: string) =>
        update((s) => ({ comments: [{ id: `c-${Date.now()}`, videoId, text }, ...s.comments] })),
    }),
    [state, sidebarOpen, update],
  );
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppStoreProvider");
  return v;
}
