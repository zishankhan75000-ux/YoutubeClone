import { useCallback, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Mic,
  Moon,
  Plus,
  Radio,
  Search,
  Settings,
  Shield,
  SquarePen,
  Sun,
  Upload,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app-store";
import { videos } from "@/data/videos";
import { getChannel, ME } from "@/data/channels";
import { ChannelAvatar, Logo, Modal, Thumbnail, useDismiss } from "./primitives";

const notifications = videos.slice(0, 6).map((v, i) => ({
  v,
  ago: `${(i + 1) * 3} hours ago`,
  unread: i < 3,
}));

function VoiceSearchModal({
  onClose,
  onSearch,
}: {
  onClose: () => void;
  onSearch: (q: string) => void;
}) {
  const [query, setQuery] = useState("");
  const sampleSuggestions = [
    "React Tutorial",
    "Costa Rica 4K",
    "Python for Beginners",
    "Intro to Large Language Models",
  ];

  return (
    <Modal title="Search with your voice" onClose={onClose}>
      <div className="flex flex-col items-center py-6 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
          <button
            onClick={() => {
              const pick = sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)];
              setQuery(pick);
              setTimeout(() => {
                onSearch(pick);
                onClose();
              }, 600);
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Tap to speak"
          >
            <Mic className="h-8 w-8" />
          </button>
        </div>
        <p className="text-base font-medium">
          {query ? `"${query}"` : "Listening... (or pick a demo topic)"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Click the mic or select a quick topic below to search
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {sampleSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                onSearch(s);
                onClose();
              }}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function SearchBar({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate();
  const current = useRouterState({
    select: (s) => (s.location.search as { q?: string }).q ?? "",
  });
  const [q, setQ] = useState(current);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/results", search: { q: q.trim() } });
    onDone?.();
  };

  const handleVoiceQuery = (val: string) => {
    setQ(val);
    navigate({ to: "/results", search: { q: val } });
    onDone?.();
  };

  return (
    <>
      <form onSubmit={submit} className="flex flex-1 items-center justify-center gap-3">
        <div className="flex h-10 w-full max-w-[620px] items-center">
          <div className="relative flex flex-1 items-center rounded-l-full border border-input bg-background pl-4 pr-2 transition-all focus-within:border-link focus-within:ring-1 focus-within:ring-link">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search"
              className="h-9 w-full bg-transparent text-sm placeholder:text-muted-foreground outline-none"
            />
            {q && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQ("")}
                className="yt-icon-btn h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            aria-label="Search"
            className="flex h-10 w-16 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-input bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Search with your voice"
          className="yt-icon-btn shrink-0 bg-secondary hover:bg-accent"
          onClick={() => setVoiceOpen(true)}
        >
          <Mic className="h-5 w-5" />
        </button>
      </form>
      {voiceOpen && (
        <VoiceSearchModal onClose={() => setVoiceOpen(false)} onSearch={handleVoiceQuery} />
      )}
    </>
  );
}

function Dropdown({
  trigger,
  children,
  align = "right-0",
}: {
  trigger: (toggle: () => void) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  return (
    <div ref={ref} className="relative">
      {trigger(() => setOpen((o) => !o))}
      {open && <div className={`yt-menu top-12 ${align}`}>{children(close)}</div>}
    </div>
  );
}

export function Header({ onToggleMenu }: { onToggleMenu: () => void }) {
  const app = useApp();
  const [mobileSearch, setMobileSearch] = useState(false);
  const [read, setRead] = useState(false);
  const unread = read ? 0 : notifications.filter((n) => n.unread).length;

  if (mobileSearch)
    return (
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background px-2">
        <button className="yt-icon-btn" aria-label="Back" onClick={() => setMobileSearch(false)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <SearchBar onDone={() => setMobileSearch(false)} />
      </header>
    );

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-3 backdrop-blur sm:px-4">
      {/* Left: Hamburger + Logo */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button className="yt-icon-btn" aria-label="Guide" onClick={onToggleMenu}>
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" aria-label="YouTube Home" className="flex items-center">
          <Logo />
        </Link>
      </div>

      {/* Center: Search */}
      <div className="hidden max-w-2xl flex-1 justify-center md:flex">
        <SearchBar />
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          className="yt-icon-btn md:hidden"
          aria-label="Search"
          onClick={() => setMobileSearch(true)}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Create button */}
        <Dropdown
          trigger={(t) => (
            <button
              onClick={t}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
              aria-label="Create"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}
        >
          {(close) => (
            <>
              {[
                [Upload, "Upload video"],
                [Radio, "Go live"],
                [SquarePen, "Create post"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Upload;
                return (
                  <button
                    key={label as string}
                    className="yt-menu-item"
                    onClick={() => {
                      toast(`${label} — demo only, storage is simulated in localStorage.`);
                      close();
                    }}
                  >
                    <I className="h-4 w-4" /> {label as string}
                  </button>
                );
              })}
            </>
          )}
        </Dropdown>

        {/* Notifications */}
        <Dropdown
          trigger={(t) => (
            <button onClick={t} className="yt-icon-btn relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-brand-foreground">
                  {unread}
                </span>
              )}
            </button>
          )}
        >
          {(close) => (
            <div className="w-[min(90vw,420px)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-semibold text-foreground">Notifications</span>
                {unread > 0 && (
                  <button
                    className="text-xs font-medium text-link hover:underline"
                    onClick={() => setRead(true)}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.map(({ v, ago, unread: u }) => {
                  const ch = getChannel(v.channelId);
                  if (!ch) return null;
                  return (
                    <Link
                      key={v.id}
                      to="/watch"
                      search={{ v: v.id }}
                      onClick={close}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary"
                    >
                      <span
                        className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-full ${u && !read ? "bg-link" : ""}`}
                      />
                      <ChannelAvatar name={ch.name} tone={ch.tone} size={36} />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="line-clamp-2 font-medium text-foreground">
                          {ch.name} uploaded: {v.title}
                        </p>
                        <p className="mt-1 text-muted-foreground">{ago}</p>
                      </div>
                      <div className="aspect-video w-20 shrink-0 overflow-hidden rounded">
                        <Thumbnail id={v.id} title={v.title} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Dropdown>

        {/* Account / Profile menu */}
        <Dropdown
          trigger={(t) => (
            <button
              onClick={t}
              aria-label="Account menu"
              className="ml-1 rounded-full ring-2 ring-transparent transition-all focus:ring-link"
            >
              <ChannelAvatar name={ME.name} tone={ME.tone} size={32} />
            </button>
          )}
        >
          {(close) => (
            <div className="w-72">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <ChannelAvatar name={ME.name} tone={ME.tone} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{ME.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{ME.handle}</p>
                  <Link
                    to="/channel/$id"
                    params={{ id: "me" }}
                    onClick={close}
                    className="mt-0.5 inline-block text-xs font-medium text-link hover:underline"
                  >
                    View your channel
                  </Link>
                </div>
              </div>

              <div className="border-b border-border py-1">
                <Link
                  to="/channel/$id"
                  params={{ id: "me" }}
                  onClick={close}
                  className="yt-menu-item"
                >
                  <User className="h-4 w-4" /> Your channel
                </Link>
                <button
                  className="yt-menu-item"
                  onClick={() => {
                    toast("YouTube Studio demo mode: view uploaded statistics in channel view.");
                    close();
                  }}
                >
                  <Video className="h-4 w-4" /> YouTube Studio
                </button>
                <button
                  className="yt-menu-item"
                  onClick={() => {
                    toast(
                      "Demo accounts: you can switch or edit simulated profile in localStorage.",
                    );
                    close();
                  }}
                >
                  <Users className="h-4 w-4" /> Switch account
                </button>
                <button
                  className="yt-menu-item"
                  onClick={() => {
                    toast("This is a demo account — no session token required.");
                    close();
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>

              <div className="border-b border-border py-1">
                <button
                  className="yt-menu-item"
                  onClick={() => {
                    app.toggleTheme();
                  }}
                >
                  {app.theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>Appearance: {app.theme === "dark" ? "Dark theme" : "Light theme"}</span>
                </button>
                <Link to="/settings" onClick={close} className="yt-menu-item">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </div>

              <div className="py-1">
                <Link to="/help" onClick={close} className="yt-menu-item">
                  <HelpCircle className="h-4 w-4" /> Help & info
                </Link>
                <button
                  className="yt-menu-item"
                  onClick={() => {
                    toast("Your data is safely stored in local browser storage.");
                    close();
                  }}
                >
                  <Shield className="h-4 w-4" /> Your data in YouTube Clone
                </button>
              </div>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  );
}
